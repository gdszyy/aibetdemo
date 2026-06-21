import { keys, omit } from 'lodash-es';
import type { z } from 'zod';
import { Toast } from '@/components/toast';
import { ERROR_CODE } from '@/constants';
import { config, resolveServiceUrl } from '@/constants/config';
import { getClientLocale } from '@/i18n';
import { useI18nStore } from '@/i18nV2/store';
import { shouldReportHttpStatus } from '@/libs/observability/sentry';
import { generateTraceHeaders } from '@/libs/open-telemetry';
import { getSessionToken, useSessionStore } from '@/stores/session-store';
import { useTimezoneStore } from '@/stores/timezone-store';
import { useUIStore } from '@/stores/ui-store';
import { ApiError, ForbiddenError, NetworkError, reportError } from '@/utils/error';
import { validateResponse } from './lib/validation';

// Suppress spurious error toasts during page unload.
// Firefox throws NetworkError for in-flight fetches on navigation/reload (Chrome/Safari silently abort).
// Two-layer defense: flag set on earliest unload events + error message check as fallback.
let isPageUnloading = false;
if (typeof window !== 'undefined') {
    const markUnloading = () => {
        isPageUnloading = true;
    };
    window.addEventListener('beforeunload', markUnloading);
    window.addEventListener('pagehide', markUnloading);
}

/** Check if a fetch error is caused by page navigation/unload (Firefox-specific) */
const isNavigationAbortError = (err: unknown): boolean => {
    if (isPageUnloading) return true;
    if (err instanceof DOMException && err.name === 'AbortError') return true;
    if (err instanceof TypeError && err.message.includes('NetworkError')) return true;
    if (err instanceof TypeError && err.message.includes('Load failed')) return true;

    return false;
};

// API request definitions and methods
export interface ResponseData<T = unknown> {
    data: T;
    code: number | string;
    message: string;
}

type RequestQueryParams = Record<string, string | number | boolean | null | undefined>;

/** Service names */
type ServiceName =
    /** uof */
    | 'app/uof'
    /** app websocket */
    | 'app/ws'
    /** app user */
    | 'app/user'
    /** app payment */
    | 'app/payment'
    /** app game (casino) */
    | 'app/game'
    /** app sport */
    | 'app/sport'
    /** app activity */
    | 'app/activity';

/** Service environment variable configs（子域前缀或完整 URL） */
const ServiceEnvConfigs: Record<ServiceName, string> = {
    'app/ws': process.env.NEXT_PUBLIC_WEBSOCKET_SERVICE || '',
    'app/uof': process.env.NEXT_PUBLIC_UOF_SERVICE || '',
    'app/user': process.env.NEXT_PUBLIC_USER_SERVICE || '',
    'app/payment': process.env.NEXT_PUBLIC_PAYMENT_SERVICE || '',
    'app/game': process.env.NEXT_PUBLIC_GAME_SERVICE || '',
    'app/sport': process.env.NEXT_PUBLIC_SPORT_SERVICE || '',
    'app/activity': process.env.NEXT_PUBLIC_ACTIVITY_SERVICE || '',
};

const ServiceProxySegments: Record<ServiceName, string> = {
    'app/ws': 'ws',
    'app/uof': 'uof',
    'app/user': 'user',
    'app/payment': 'payment',
    'app/game': 'game',
    'app/sport': 'sport',
    'app/activity': 'activity',
};

const RAILWAY_HOST_PATTERN = /(?:^|\.)railway\.app$/i;

const shouldUseRailwayApiProxy = () => {
    if (typeof window === 'undefined') return false;
    if (process.env.NEXT_PUBLIC_DISABLE_RAILWAY_API_PROXY === 'true') return false;
    return RAILWAY_HOST_PATTERN.test(window.location.hostname);
};

// TODO 临时写死ls
const REQUEST_SOURCE_HEADER_VALUE = 'ls';

/** Build full API URL */
const getFullUrl = (prefix: string, api: string) => {
    return prefix + api;
};

/** Request configuration options */
export interface FetchOptions extends Omit<RequestInit, 'method' | 'body'> {
    searchParams?: RequestQueryParams;
    /** Optional Zod schema for runtime validation */
    schema?: z.ZodSchema;
    /** Optional label for validation logs (default: API URL) */
    label?: string;
    withAuth?: boolean;
}

/**
 * Handle authentication failure errors (1000, 1001)
 * Both codes trigger sign out and login prompt, but 1001 also shows error message
 */
const handleAuthenticationError = (code: number, message: string) => {
    // For code 1001: show error toast with fixed id to deduplicate rapid-fire errors
    if (code === ERROR_CODE.TOKEN_EXPIRED_WITH_MESSAGE) {
        Toast.error(message, { id: 'auth-error-1001' });
    }
};

/** Guard against truly broken responses (null, undefined, object, etc.) */
const isValidResponseCode = (code: unknown): code is number | string => {
    return typeof code === 'number' || typeof code === 'string';
};

/**
 * Clone request params and remove local-only helper fields so they do not leak
 * into real API requests or Sentry payloads.
 */
const normalizeRequestParams = (params: unknown) => {
    const normalizedParams = structuredClone(params) as Record<string, string | number | boolean | null | undefined>;

    keys(params || {}).forEach((key) => {
        if (key.startsWith('local')) {
            Reflect.deleteProperty(normalizedParams, key);
        }
    });

    return normalizedParams;
};

/** 只有鉴权过期类业务码才应视为“预期的禁止访问流程”。 */
const isAuthenticationBusinessCode = (code: number): boolean => {
    return code === ERROR_CODE.TOKEN_EXPIRED_SILENT || code === ERROR_CODE.TOKEN_EXPIRED_WITH_MESSAGE;
};

/** 把未知运行时错误整理成可序列化结构，便于挂到请求上下文里。 */
const summarizeErrorCause = (error: unknown) => {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
        };
    }

    return {
        message: String(error),
    };
};

/** Request implementation */
const baseRequest = <T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    originParams: unknown,
    options?: FetchOptions,
) => {
    const params = normalizeRequestParams(originParams);
    const searchParams = normalizeRequestParams(options?.searchParams);
    const requestQuery = {
        ...(method === 'GET' ? params : {}),
        ...searchParams,
    };
    const hasRequestQuery = Object.keys(requestQuery).length > 0;

    const withAuth = options?.withAuth ?? true;
    const sessionToken = withAuth ? getSessionToken() : '';

    const traceHeaders = generateTraceHeaders();
    const traceId = traceHeaders.traceparent?.split('-')[1];
    const requestBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) ? params : undefined;

    // Handle GET request query parameters
    let requestUrl = url;
    if (method === 'GET' && params) {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
            const value = params[key];
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            requestUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
        }
    }

    let timezone = '';
    let countryCode = '';
    let deviceId = '';

    if (typeof window !== 'undefined') {
        timezone = useTimezoneStore.getState().timezone;
        countryCode = useI18nStore.getState().regionCode || '';
        deviceId = useSessionStore.getState().deviceId;
    } else {
        timezone = '';
        countryCode = '';
    }

    // Build request configuration
    const requestInit: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Accept-Language': getClientLocale(),
            'X-Timezone': timezone,
            'X-Source': REQUEST_SOURCE_HEADER_VALUE,
            'X-CountryCode': countryCode,
            'X-DeviceId': deviceId,
            ...(sessionToken
                ? {
                      Authorization: `Bearer ${sessionToken}`,
                  }
                : {}),
            ...traceHeaders,
            ...options?.headers,
        },
        ...omit(options, 'headers', 'searchParams', 'schema', 'label', 'withAuth'),
    };

    // Body for POST/PUT/PATCH/DELETE requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && params) {
        requestInit.body = JSON.stringify(params);
    }

    const commonErrorContext = {
        url: requestUrl,
        method,
        traceId,
        query: hasRequestQuery ? requestQuery : undefined,
        body: requestBody,
    };

    return fetch(requestUrl, requestInit)
        .catch((_err) => {
            // 真正上报的错误
            const errMsg = `Network Error${` (Fetch)(${_err.name})(${_err.message})`}`;

            // 页面跳转 / 刷新导致的请求中断属于预期浏览器行为。
            // 这里保留 throw，是为了让调用链知道请求失败；但故意不手动 report，
            // 避免把 navigation abort 这类噪音打进 Sentry。
            if (isNavigationAbortError(_err)) {
                throw new NetworkError(errMsg, {
                    ...commonErrorContext,
                    response: {
                        aborted: true,
                        cause: summarizeErrorCause(_err),
                    },
                });
            }

            const error = new NetworkError(errMsg, {
                ...commonErrorContext,
                response: {
                    cause: summarizeErrorCause(_err),
                },
            });

            // 用户界面显示toast 提示的错误
            const toastErrMsg = `Network Error${config.isProd ? '' : ` (Fetch)(${_err.name})(${_err.message})`}`;
            Toast.error(toastErrMsg + (config.isProd ? '' : `(${requestUrl})`), { id: 'network-error' });
            reportError(error);
            throw error;
        })
        .then(async (response: Response) => {
            // Token rotation — silently update window.localStorage, no state change
            const token = response.headers.get('token');
            if (withAuth && token) {
                useSessionStore.getState().refreshToken(token);
            }

            const { status, statusText } = response;

            if (status < 200 || status >= 400) {
                // 上报错误信息
                const errMsgSentry = `${`Network Error ${`(status)(${requestUrl})`}`} (${status}) (${statusText})`;
                const error = new NetworkError(errMsgSentry, {
                    ...commonErrorContext,
                    status,
                    statusText,
                });

                // 前台提示错误
                const toastErrMsg = `${statusText || `Network Error${config.isProd ? '' : ` (status)(${requestUrl})`}`} (${status})`;
                if (!isPageUnloading) Toast.error(toastErrMsg, { id: 'http-error' });

                // Report only actionable HTTP failures to keep Sentry signal useful.
                if (!isPageUnloading && shouldReportHttpStatus(status)) {
                    reportError(error);
                }

                throw error;
            }

            const text = await response.text();
            if (!text) {
                const apiError = new ApiError(`[Fetcher] Empty response body: ${method} ${requestUrl}`, {
                    ...commonErrorContext,
                    status,
                    statusText,
                });
                reportError(apiError);
                return undefined as T;
            }

            let ret: ResponseData<T>;
            try {
                ret = JSON.parse(text) as ResponseData<T>;
            } catch (error) {
                const apiError = new ApiError('Invalid JSON response', {
                    ...commonErrorContext,
                    status,
                    statusText,
                    response: {
                        raw: text,
                        parseError: error instanceof Error ? error.message : String(error),
                    },
                });
                reportError(apiError);
                throw apiError;
            }

            if (!isValidResponseCode(ret.code)) {
                const apiError = new ApiError('Invalid response format: missing code field', {
                    ...commonErrorContext,
                    status,
                    statusText,
                    response: ret,
                });
                reportError(apiError);
                // Return or throw? Business logic still needs to throw here so app doesn't swallow unexpected format
                throw apiError;
            }

            // Normalize code to number if it's a numeric string
            const code = Number(ret.code);

            if (code !== 0) {
                let error: ApiError;

                if (isAuthenticationBusinessCode(code)) {
                    // 1000 / 1001 属于预期鉴权流，单独建模成 ForbiddenError，
                    // 后续 beforeSend 会统一过滤，不进入常规问题列表。
                    error = new ForbiddenError(ret.message, {
                        ...commonErrorContext,
                        status,
                        statusText,
                        code,
                        response: ret,
                    });
                } else if (code === 700) {
                    // code 700: Server internal error (equivalent to HTTP 5xx)
                    error = new ApiError(ret.message, {
                        ...commonErrorContext,
                        status,
                        statusText,
                        code: code,
                        response: ret,
                    });
                } else {
                    // // Other codes: Client validation / business error (equivalent to HTTP 4xx)
                    // error = new ForbiddenError(ret.message, {
                    //     ...commonErrorContext,
                    //     status,
                    //     statusText,
                    //     code: code,
                    //     response: ret,
                    // });
                    // 其他业务码仍然是 API 失败，但多数属于产品流中的预期结果。
                    // 这里保留 throw 给上层决定是否提示/降级，不默认自动上报。
                    error = new ApiError(
                        ret.message,
                        {
                            ...commonErrorContext,
                            status,
                            statusText,
                            code,
                            response: ret,
                        },
                        {
                            level: 'warning',
                        },
                    );
                }

                // Handle authentication failures
                if (isAuthenticationBusinessCode(code)) {
                    // Token expired — clear session without reload, then show login modal
                    useSessionStore.getState().clearSession();
                    useUIStore.getState().openLoginModal();

                    handleAuthenticationError(code, ret.message);
                } else if (code === 700) {
                    // Server internal error — report to Sentry for investigation
                    reportError(error);
                }

                throw error;
            }

            // --- RUNTIME VALIDATION INJECTED HERE ---
            if (options?.schema) {
                validateResponse(ret.data, options.schema, options.label || requestUrl);
            }

            return ret.data;
        });
};

/** Create fetcher instance */
const createFetcher = (resolveBaseUrl: () => string) => {
    return {
        get: <T>(api: string, params?: unknown, options?: FetchOptions) => {
            const url = getFullUrl(resolveBaseUrl(), api);
            return baseRequest<T>('GET', url, params, options);
        },
        post: <T>(api: string, params?: unknown, options?: FetchOptions) => {
            const url = getFullUrl(resolveBaseUrl(), api);
            return baseRequest<T>('POST', url, params, options);
        },
        put: <T>(api: string, params?: unknown, options?: FetchOptions) => {
            const url = getFullUrl(resolveBaseUrl(), api);
            return baseRequest<T>('PUT', url, params, options);
        },
        patch: <T>(api: string, params?: unknown, options?: FetchOptions) => {
            const url = getFullUrl(resolveBaseUrl(), api);
            return baseRequest<T>('PATCH', url, params, options);
        },
        delete: <T>(api: string, params?: unknown, options?: FetchOptions) => {
            const url = getFullUrl(resolveBaseUrl(), api);
            return baseRequest<T>('DELETE', url, params, options);
        },
    };
};

/** Instance for API requests */
export const fetcher = createFetcher(() => '');

/** Get service API URL */
export const getServiceUrl = (serviceName: ServiceName, host?: string) => {
    return resolveServiceUrl(ServiceEnvConfigs[serviceName], host);
};

/** Create service-specific fetcher */
const createServiceFetcher = (serviceName: ServiceName) => {
    const resolveBaseUrl = () => {
        if (shouldUseRailwayApiProxy()) {
            return `/api/proxy/${ServiceProxySegments[serviceName]}`;
        }

        return getServiceUrl(serviceName);
    };

    if (!ServiceEnvConfigs[serviceName]) {
        console.warn(`[Warning] ${serviceName} service is not configured. API calls to this service will fail.`);
    }
    return createFetcher(resolveBaseUrl);
};

/** UOF service fetcher */
export const uofFetcher = createServiceFetcher('app/uof');

/** User service fetcher */
export const userFetcher = createServiceFetcher('app/user');

/** Payment service fetcher */
export const paymentFetcher = createServiceFetcher('app/payment');

/** Game service fetcher (casino) */
export const gameFetcher = createServiceFetcher('app/game');

/** Sport service fetcher */
export const sportFetcher = createServiceFetcher('app/sport');

/** Activity service fetcher */
export const activityFetcher = createServiceFetcher('app/activity');
