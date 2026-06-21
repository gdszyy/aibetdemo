'use client';

import { type FC, useEffect } from 'react';
import { fetcher } from '@/api/client';
import { Button } from '@/components/button/button';
import { ERROR_CODE } from '@/constants';
import {
    ApiError,
    AppError,
    ForbiddenError,
    NetworkError,
    RuntimeError,
    StoreSyncError,
    ValidationError,
    WebSocketError,
} from '@/libs/observability/sentry';
import { syncSentryUserContext } from '@/libs/observability/sentry/report';
import { useUser } from '@/stores/session-store';
import { reportError } from '@/utils/error';

const createManualError = () => new Error('Sentry manual report test');
const createUnhandledError = () => new Error('Sentry uncaught async test');
const createUnhandledRejectionError = () => new Error('Sentry unhandled rejection test');
const DEBUG_NETWORK_FAILURE_URL = 'https://debug-network-fail.invalid/test';

type DebugActionConfig = {
    label: string;
    onClick: () => void;
};

type TypedErrorActionConfig = {
    label: string;
    createError: () => Error;
};

/**
 * 统一创建调试 extra，方便在 Sentry payload 中快速识别测试来源。
 */
const createDebugExtra = (source: string, uid?: string | null) => ({
    source,
    hasUser: Boolean(uid),
    uid: uid || null,
    timestamp: new Date().toISOString(),
});

/** 统一格式化真实请求抛出的状态信息，方便在控制台快速确认 client.ts 注入结果。 */
const getDebugRequestStatusSummary = (error: unknown): string => {
    if (error instanceof NetworkError) {
        return `${error.context.status ?? 'unknown'} ${error.context.statusText ?? 'unknown'}`;
    }

    if (error instanceof ApiError) {
        return `${error.context.status ?? 'unknown'} ${error.context.statusText ?? 'unknown'}`;
    }

    return 'unknown unknown';
};

/**
 * Sentry 调试面板。
 * 这里集中覆盖手动上报、全局自动捕获、请求类错误、
 * 实时链路错误、状态同步错误等常见测试场景，方便统一验证上报效果。
 */
export const SentryDebugPanel: FC = () => {
    const user = useUser();

    useEffect(() => {
        const onError = (event: ErrorEvent) => {
            console.info('[Sentry Debug Panel] window.error observed', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
            });
        };

        const onUnhandledRejection = (event: PromiseRejectionEvent) => {
            console.info('[Sentry Debug Panel] window.unhandledrejection observed', {
                reason: event.reason,
            });
        };

        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onUnhandledRejection);

        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onUnhandledRejection);
        };
    }, []);

    // 纯手动 reportError 上报 模拟
    const triggerManualReport = () => {
        const error = createManualError();
        const extra = createDebugExtra('SentryDebugPanel.manual-report', user?.uid);

        console.info('[Sentry Debug Panel] trigger manual report', {
            error,
            extra,
        });

        reportError(error, {
            level: 'error',
            tags: {
                trigger: 'manual-report',
                feature: 'debug-panel',
            },
            extra,
        });
    };

    // 触发console error 错误上报模拟
    const triggerConsoleErrorOnly = () => {
        console.error('Sentry console.error capture test', {
            source: 'SentryDebugPanel.console-error',
            uid: user?.uid || null,
            timestamp: new Date().toISOString(),
        });
    };

    // 触发未捕获的异常 模拟
    const triggerUncaughtError = () => {
        console.info('[Sentry Debug Panel] trigger uncaught error');
        setTimeout(() => {
            throw createUnhandledError();
        }, 0);
    };

    // 未处理 Promise 拒绝的错误模拟
    const triggerUnhandledRejection = () => {
        console.info('[Sentry Debug Panel] trigger unhandled rejection');
        queueMicrotask(() => {
            void Promise.reject(createUnhandledRejectionError());
        });
    };

    // 未登录上报测试
    const triggerAnonymousRuntimeError = () => {
        const error = new RuntimeError('Sentry anonymous runtime error test', {
            level: 'error',
            tags: {
                trigger: 'anonymous-runtime-error',
                feature: 'debug-panel',
                auth_state: 'anonymous',
            },
            extra: createDebugExtra('SentryDebugPanel.anonymous-runtime-error'),
        });

        console.info('[Sentry Debug Panel] trigger anonymous runtime error', {
            error,
        });

        syncSentryUserContext(null);
        reportError(error);
        queueMicrotask(() => {
            syncSentryUserContext({
                uid: user?.uid,
            });
        });
    };

    // 上报
    const triggerTypedError = (error: Error) => {
        console.info('[Sentry Debug Panel] trigger typed error', {
            name: error.name,
            message: error.message,
            error,
        });
        reportError(error);
    };

    const triggerRealClientRequest = (status: number) => {
        void fetcher.get<null>('/api/test/http-status', { status }, { withAuth: false }).catch((error: unknown) => {
            console.info('[Sentry Debug Panel] real client request failed as expected', {
                requestedStatus: status,
                summary: getDebugRequestStatusSummary(error),
                error,
            });
        });
    };

    const triggerRealNetworkFailureCatch = () => {
        void fetcher.get(DEBUG_NETWORK_FAILURE_URL, undefined, { withAuth: false }).catch((error: unknown) => {
            console.info('[Sentry Debug Panel] real network failure reached fetch catch', {
                url: DEBUG_NETWORK_FAILURE_URL,
                error,
            });
        });
    };

    // 自动补货上报，手动调用上报测试
    const autoCaptureActions: DebugActionConfig[] = [
        {
            label: 'manual reportError',
            onClick: triggerManualReport,
        },
        {
            label: 'console.error',
            onClick: triggerConsoleErrorOnly,
        },
        {
            label: 'uncaught error',
            onClick: triggerUncaughtError,
        },
        {
            label: 'uncaught Promise rejection',
            onClick: triggerUnhandledRejection,
        },
        {
            label: 'anonymous error',
            onClick: triggerAnonymousRuntimeError,
        },
        {
            label: 'request 429',
            onClick: () => {
                triggerRealClientRequest(429);
            },
        },
        {
            label: 'request 404',
            onClick: () => {
                triggerRealClientRequest(404);
            },
        },
        {
            label: 'request network failure catch',
            onClick: triggerRealNetworkFailureCatch,
        },
    ];

    // app， runtime 错误上报
    const appErrorActions: TypedErrorActionConfig[] = [
        {
            label: 'app base（AppError）',
            createError: () =>
                new AppError('Sentry AppError test', {
                    level: 'error',
                    tags: {
                        trigger: 'app-error',
                        feature: 'debug-panel',
                    },
                    extra: createDebugExtra('SentryDebugPanel.app-error', user?.uid),
                }),
        },
        {
            label: 'runtime error（RuntimeError）',
            createError: () =>
                new RuntimeError('Sentry RuntimeError test', {
                    level: 'error',
                    tags: {
                        trigger: 'runtime-error',
                        feature: 'debug-panel',
                        module: 'runtime-flow',
                    },
                    extra: createDebugExtra('SentryDebugPanel.runtime-error', user?.uid),
                }),
        },
        {
            label: 'session-runtime-error',
            createError: () =>
                new RuntimeError('Sentry session initialization failure test', {
                    level: 'warning',
                    tags: {
                        trigger: 'session-runtime-error',
                        module: 'session-store',
                        step: 'initialize',
                    },
                    extra: {
                        ...createDebugExtra('SentryDebugPanel.session-runtime-error', user?.uid),
                        authState: user ? 'signed-in' : 'guest',
                    },
                }),
        },
        {
            label: 'store-sync-error',
            createError: () =>
                new StoreSyncError('Sentry StoreSyncError test', {
                    level: 'warning',
                    tags: {
                        trigger: 'store-sync-error',
                        feature: 'debug-panel',
                        context: 'BetSlipStore.Rehydration',
                    },
                    extra: createDebugExtra('SentryDebugPanel.store-sync-error', user?.uid),
                }),
        },
    ];

    // request 相关错误上报
    const requestErrorActions: TypedErrorActionConfig[] = [
        {
            label: 'request 500',
            createError: () =>
                new ApiError(
                    'Sentry ApiError test',
                    {
                        url: '/api/test/sentry',
                        method: 'POST',
                        status: 500,
                        statusText: 'Internal Server Error',
                        code: 9001,
                        query: { locale: 'pt', source: 'debug-panel' },
                        body: { betId: 'debug-bet-id', amount: 10, stakeType: 'single' },
                        response: { message: 'debug api failure', traceId: 'api-trace-debug-1' },
                    },
                    {
                        tags: {
                            trigger: 'api-error',
                            feature: 'debug-panel',
                        },
                        extra: createDebugExtra('SentryDebugPanel.api-error', user?.uid),
                    },
                ),
        },
        {
            label: 'request 700',
            createError: () =>
                new ApiError(
                    'Sentry business code 700 test',
                    {
                        url: '/api/test/business-code-700',
                        method: 'POST',
                        status: 200,
                        statusText: 'OK',
                        code: 700,
                        body: { ticketId: 'debug-ticket-700', amount: 25 },
                        response: {
                            code: 700,
                            message: 'server internal business failure',
                        },
                    },
                    {
                        tags: {
                            trigger: 'api-business-code-700',
                            feature: 'debug-panel',
                        },
                        extra: createDebugExtra('SentryDebugPanel.api-business-code-700', user?.uid),
                    },
                ),
        },
        {
            label: 'request 429',
            createError: () =>
                new ApiError(
                    'Sentry rate limit ApiError test',
                    {
                        url: '/api/test/rate-limit',
                        method: 'POST',
                        status: 429,
                        statusText: 'Too Many Requests',
                        code: 42900,
                        body: { amount: 50, currency: 'BRL' },
                        response: { retryAfter: 30, message: 'rate limited' },
                    },
                    {
                        tags: {
                            trigger: 'api-error-429',
                            feature: 'debug-panel',
                        },
                        extra: createDebugExtra('SentryDebugPanel.api-error-429', user?.uid),
                    },
                ),
        },
        {
            label: 'request searchParams error',
            createError: () =>
                new ApiError(
                    'Sentry search params only ApiError test',
                    {
                        url: '/api/test/search-params-only?page=2&tab=live&keyword=goals',
                        method: 'GET',
                        status: 500,
                        statusText: 'Internal Server Error',
                        code: 9002,
                        query: {
                            page: 2,
                            tab: 'live',
                            keyword: 'goals',
                        },
                        response: {
                            message: 'search params only request failed',
                        },
                    },
                    {
                        tags: {
                            trigger: 'api-search-params-only',
                            feature: 'debug-panel',
                        },
                        extra: createDebugExtra('SentryDebugPanel.api-search-params-only', user?.uid),
                    },
                ),
        },
        {
            label: 'request 503',
            createError: () =>
                new NetworkError(
                    'Sentry NetworkError test',
                    {
                        url: '/api/test/network',
                        method: 'GET',
                        status: 503,
                        statusText: 'Service Unavailable',
                        query: { matchId: '12345', marketId: 'win-draw-win' },
                        response: { retryable: true, region: 'br-east-1' },
                    },
                    {
                        tags: {
                            trigger: 'network-error',
                            feature: 'debug-panel',
                        },
                        extra: createDebugExtra('SentryDebugPanel.network-error', user?.uid),
                    },
                ),
        },
        {
            label: 'request empty response',
            createError: () =>
                new ApiError(
                    'Empty response body',
                    {
                        url: '/api/test/empty-response',
                        method: 'GET',
                        status: 200,
                        statusText: 'OK',
                        query: { page: 1, source: 'debug-panel' },
                        response: { empty: true },
                    },
                    {
                        tags: {
                            trigger: 'api-empty-response',
                            feature: 'debug-panel',
                        },
                        extra: createDebugExtra('SentryDebugPanel.api-empty-response', user?.uid),
                    },
                ),
        },
        {
            label: 'request invalid JSON',
            createError: () =>
                new ApiError(
                    'Invalid JSON response',
                    {
                        url: '/api/test/invalid-json',
                        method: 'GET',
                        status: 200,
                        statusText: 'OK',
                        query: { locale: 'pt', source: 'debug-panel' },
                        response: {
                            raw: '<html>gateway error</html>',
                            parseError: 'Unexpected token < in JSON at position 0',
                        },
                    },
                    {
                        tags: {
                            trigger: 'api-invalid-json',
                            feature: 'debug-panel',
                        },
                        extra: createDebugExtra('SentryDebugPanel.api-invalid-json', user?.uid),
                    },
                ),
        },
        {
            label: 'request invalid format',
            createError: () =>
                new ApiError(
                    'Invalid response format: missing code field',
                    {
                        url: '/api/test/missing-code',
                        method: 'GET',
                        status: 200,
                        statusText: 'OK',
                        query: { marketId: 'wdw', source: 'debug-panel' },
                        response: {
                            data: { ok: true },
                            message: 'missing code field',
                        },
                    },
                    {
                        tags: {
                            trigger: 'api-invalid-format',
                            feature: 'debug-panel',
                        },
                        extra: createDebugExtra('SentryDebugPanel.api-invalid-format', user?.uid),
                    },
                ),
        },
        {
            label: 'request validation error',
            createError: () =>
                new ValidationError(
                    'Sentry ValidationError test',
                    {
                        label: 'debug.panel.payload',
                        errors: [
                            { path: ['data', 'uid'], message: 'uid is required' },
                            { path: ['data', 'amount'], message: 'amount must be positive' },
                        ],
                        data: { uid: null, amount: -10, source: 'debug-panel' },
                    },
                    {
                        tags: {
                            trigger: 'validation-error',
                            feature: 'debug-panel',
                        },
                        extra: createDebugExtra('SentryDebugPanel.validation-error', user?.uid),
                    },
                ),
        },
        {
            label: 'request schema error',
            createError: () =>
                new ValidationError(
                    'API Validation Failed: DebugSchemaNoThrow',
                    {
                        label: 'DebugSchemaNoThrow',
                        errors: {
                            eventId: {
                                _errors: ['Expected string, received number'],
                            },
                            profile: {
                                nickname: {
                                    _errors: ['Expected string, received null'],
                                },
                            },
                        },
                        data: {
                            eventId: 10001,
                            profile: {
                                nickname: null,
                            },
                            source: 'debug-panel',
                        },
                    },
                    {
                        level: 'warning',
                        tags: {
                            trigger: 'validation-warning-no-throw',
                            feature: 'debug-panel',
                            module: 'api-validation',
                        },
                        extra: {
                            ...createDebugExtra('SentryDebugPanel.validation-warning-no-throw', user?.uid),
                            behavior: 'schema failed but business continues',
                        },
                    },
                ),
        },
    ];

    // 根据业务触发的错误，会被认定为 ForbiddenError 过滤不上报
    const filteredErrorActions: DebugActionConfig[] = [
        {
            label: 'request abort error',
            onClick: () => {
                reportError(new Error('AbortError: The operation was aborted.'));
            },
        },
        {
            label: 'request forbidden error',
            onClick: () =>
                triggerTypedError(
                    new ForbiddenError(
                        'Sentry ForbiddenError test',
                        {
                            url: '/api/test/forbidden',
                            method: 'POST',
                            status: 403,
                            statusText: 'Forbidden',
                            code: 40301,
                            body: { action: 'withdraw' },
                            response: { message: 'forbidden by policy' },
                        },
                        {
                            tags: {
                                trigger: 'forbidden-error',
                                feature: 'debug-panel',
                            },
                            extra: createDebugExtra('SentryDebugPanel.forbidden-error', user?.uid),
                        },
                    ),
                ),
        },
        {
            label: 'request auth expired silent error',
            onClick: () =>
                triggerTypedError(
                    new ForbiddenError(
                        'Sentry auth expired silent test',
                        {
                            url: '/api/test/auth-expired-silent',
                            method: 'POST',
                            status: 200,
                            statusText: 'OK',
                            code: ERROR_CODE.TOKEN_EXPIRED_SILENT,
                            body: { action: 'refresh-profile' },
                            response: { message: 'token expired silently' },
                        },
                        {
                            tags: {
                                trigger: 'auth-expired-1000',
                                feature: 'debug-panel',
                                auth_flow: 'silent-expired',
                            },
                            extra: createDebugExtra('SentryDebugPanel.auth-expired-1000', user?.uid),
                        },
                    ),
                ),
        },
        {
            label: 'request auth expired with message error',
            onClick: () =>
                triggerTypedError(
                    new ForbiddenError(
                        'Sentry auth expired with message test',
                        {
                            url: '/api/test/auth-expired-with-message',
                            method: 'POST',
                            status: 200,
                            statusText: 'OK',
                            code: ERROR_CODE.TOKEN_EXPIRED_WITH_MESSAGE,
                            body: { action: 'place-bet' },
                            response: { message: 'token expired with visible message' },
                        },
                        {
                            tags: {
                                trigger: 'auth-expired-1001',
                                feature: 'debug-panel',
                                auth_flow: 'expired-with-message',
                            },
                            extra: createDebugExtra('SentryDebugPanel.auth-expired-1001', user?.uid),
                        },
                    ),
                ),
        },
    ];

    // WebSocket | sse 错误
    const realtimeActions: TypedErrorActionConfig[] = [
        {
            label: 'request websocket parse error',
            createError: () =>
                new WebSocketError('Sentry WebSocket parse failure test', {
                    level: 'warning',
                    tags: {
                        trigger: 'websocket-error',
                        feature: 'debug-panel',
                        step: 'parse',
                        component: 'SharedWebSocket',
                    },
                    extra: {
                        ...createDebugExtra('SentryDebugPanel.websocket-parse-error', user?.uid),
                        cmd: 1001,
                        frameLength: 128,
                    },
                }),
        },
        {
            label: 'request websocket reconnect error',
            createError: () =>
                new WebSocketError('Sentry WebSocket reconnect exhausted test', {
                    level: 'warning',
                    tags: {
                        trigger: 'websocket-reconnect-error',
                        feature: 'debug-panel',
                        step: 'reconnect',
                        component: 'SharedWebSocket',
                    },
                    extra: {
                        ...createDebugExtra('SentryDebugPanel.websocket-reconnect-error', user?.uid),
                        retryCount: 10,
                        readyState: 'CLOSED',
                    },
                }),
        },
        {
            label: 'request store rehydrate error',
            createError: () =>
                new StoreSyncError('Sentry rehydration verification failure test', {
                    level: 'warning',
                    tags: {
                        trigger: 'store-rehydrate-error',
                        feature: 'debug-panel',
                        context: 'BetSlipStore.Verify',
                    },
                    extra: {
                        ...createDebugExtra('SentryDebugPanel.store-verify-error', user?.uid),
                        persistedVersion: 4,
                        currentVersion: 5,
                    },
                }),
        },
        {
            label: 'request sse stream error',
            createError: () =>
                new RuntimeError('Sentry SSE stream connection failure test', {
                    level: 'warning',
                    tags: {
                        trigger: 'sse-stream-error',
                        feature: 'debug-panel',
                        module: 'sse-client',
                        step: 'connect',
                    },
                    extra: {
                        ...createDebugExtra('SentryDebugPanel.sse-stream-error', user?.uid),
                        endpoint: '/v1/sse/subscribe',
                        transport: 'sse',
                        readyState: 'CONNECTING',
                    },
                }),
        },
    ];

    const renderActionButtons = (actions: DebugActionConfig[]) => {
        return actions.map((action) => (
            <Button key={action.label} onClick={action.onClick}>
                {action.label}
            </Button>
        ));
    };

    const renderTypedErrorButtons = (actions: TypedErrorActionConfig[]) => {
        return actions.map((action) => (
            <Button
                key={action.label}
                onClick={() => {
                    triggerTypedError(action.createError());
                }}
            >
                {action.label}
            </Button>
        ));
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-title-sm text-filltext-ft-h">Sentry test page</h1>
                <p className="text-body-sm text-filltext-ft-f">
                    This page is specifically designed to cover the common error types in the current project, verifying
                    automatic capture, manual reporting, filtering rules, and requesting abnormal links.{' '}
                </p>
                <p className="text-body-sm text-filltext-ft-f">
                    Currently, global exceptions, application errors, request errors, real-time links and state recovery
                    have been covered. The errors that would be filtered under the current strategy have been classified
                    separately to facilitate the verification of the "expected not to report" branches. Front-end render
                    errors are still recommended to be verified through real page exceptions or the 'global-error' link.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-body-lg text-filltext-ft-h">Global automatic capture and basic links</h2>
                <div className="flex flex-wrap gap-3">{renderActionButtons(autoCaptureActions)}</div>
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-body-lg text-filltext-ft-h">Application error types and business exceptions</h2>
                <div className="flex flex-wrap gap-3">{renderTypedErrorButtons(appErrorActions)}</div>
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-body-lg text-filltext-ft-h">Request errors and real-time links</h2>
                <div className="flex flex-wrap gap-3">{renderTypedErrorButtons(requestErrorActions)}</div>
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-body-lg text-filltext-ft-h">Filtered errors under current strategy</h2>
                <div className="flex flex-wrap gap-3">{renderActionButtons(filteredErrorActions)}</div>
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-body-lg text-filltext-ft-h">Real-time links and state recovery</h2>
                <div className="flex flex-wrap gap-3">{renderTypedErrorButtons(realtimeActions)}</div>
            </div>
        </div>
    );
};
