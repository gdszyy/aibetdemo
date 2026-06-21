import { sanitizeForSentry, sanitizeUrl } from './sanitize';

// English: Shared error severity type used by both explicit manual reporting
// and application-defined error classes.
// 中文：手动上报和应用自定义错误类共用的错误等级类型。
export type ErrorLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

// English: Shared manual-report metadata carried by all app-defined errors.
// 中文：所有应用侧自定义错误共用的上报扩展参数。
export interface AppErrorOptions {
    level?: ErrorLevel;
    extra?: Record<string, unknown>;
    tags?: Record<string, string>;
}

// English: Structured request/response context used by request-like errors.
// 中文：请求类错误使用的结构化请求/响应上下文。
export interface ApiErrorContext {
    url: string;
    method: string;
    status?: number;
    statusText?: string;
    code?: number;
    traceId?: string;
    query?: unknown;
    body?: unknown;
    response?: unknown;
}

// English: Structured schema-validation context.
// 中文：schema 校验失败时使用的结构化上下文。
export interface ValidationErrorContext {
    label: string;
    errors: unknown;
    data: unknown;
}

// English: Stable base error for all application-defined reporting errors.
// 中文：所有应用侧可上报错误的稳定基类。
export class AppError extends Error {
    constructor(
        message: string,
        public options?: AppErrorOptions,
    ) {
        super(message);
        this.name = new.target.name;
    }
}

// English: API/business error carrying request/response context.
// 中文：携带请求/响应上下文的 API/业务错误。
export class ApiError extends AppError {
    constructor(
        message: string,
        public context: ApiErrorContext,
        options?: AppErrorOptions,
    ) {
        const sanitizedContext = {
            ...context,
            url: sanitizeUrl(context.url),
            query: sanitizeForSentry(context.query),
            body: sanitizeForSentry(context.body),
            response: sanitizeForSentry(context.response),
        };

        super(message, {
            level: 'error',
            ...options,
            tags: {
                ...options?.tags,
                url: sanitizedContext.url,
                method: context.method,
                status: String(context.status || 'unknown'),
                code: String(context.code || '0'),
            },
            extra: {
                ...options?.extra,
                ...sanitizedContext,
            },
        });

        this.name = 'ApiError';
    }
}

// English: Request failed after it was classified as a transport/network-style failure.
// 中文：已经被归类成传输层/网络层失败的请求错误。
export class NetworkError extends ApiError {
    constructor(message: string, context: ApiErrorContext, options?: AppErrorOptions) {
        super(message, context, options);
        this.name = 'NetworkError';
    }
}

// English: Expected authorization failures are modeled separately so the final
// `beforeSend` policy can drop them without guessing by message text.
// 中文：把权限类失败单独建模，后面的 `beforeSend` 就能按类型稳定过滤，
// 不需要再靠 message 猜测是不是预期错误。
export class ForbiddenError extends ApiError {
    constructor(message: string, context: ApiErrorContext, options?: AppErrorOptions) {
        super(message, context, { level: 'warning', ...options });
        this.name = 'ForbiddenError';
    }
}

// English: Schema/contract validation failure. These usually indicate that the
// local code and the incoming payload disagree on structure, so we keep both a
// stable label and sanitized validation details for triage.
// 中文：schema/协议校验失败错误。它通常代表本地代码和输入 payload 的结构
// 预期不一致，所以这里会同时保留稳定的 label 和脱敏后的校验详情，方便排查。
export class ValidationError extends AppError {
    constructor(
        message: string,
        public context: ValidationErrorContext,
        options?: AppErrorOptions,
    ) {
        const sanitizedContext = {
            ...context,
            errors: sanitizeForSentry(context.errors),
            data: sanitizeForSentry(context.data),
        };

        super(message, {
            level: 'warning',
            ...options,
            tags: {
                ...options?.tags,
                validation_label: context.label,
            },
            extra: {
                ...options?.extra,
                ...sanitizedContext,
            },
        });

        this.name = 'ValidationError';
    }
}

// English: Generic runtime failure for flows that are not request-specific
// but still need explicit visibility after local fallback or graceful degrade.
// 中文：通用运行时错误，适用于非请求类但发生后仍需显式监控的降级场景。
export class RuntimeError extends AppError {
    constructor(message: string, options?: AppErrorOptions) {
        super(message, options);
        this.name = 'RuntimeError';
    }
}

// English: Realtime/WebSocket infrastructure failure.
// 中文：实时链路 / WebSocket 基础设施错误。
export class WebSocketError extends AppError {
    constructor(message: string, options?: AppErrorOptions) {
        super(message, options);
        this.name = 'WebSocketError';
    }
}

// English: State persistence / rehydration / synchronization failure.
// 中文：状态持久化、恢复、同步链路错误。
export class StoreSyncError extends AppError {
    constructor(message: string, options?: AppErrorOptions) {
        super(message, options);
        this.name = 'StoreSyncError';
    }
}

// English: Keep these factory helpers close to the error classes so business
// code can create typed errors without re-assembling tags/extra manually.
// 中文：把工厂函数和错误类放在一起，业务代码就能直接创建语义化错误，
// 不必自己重复拼 tags/extra。
export const createApiError = (message: string, context: ApiErrorContext, options?: AppErrorOptions) =>
    new ApiError(message, context, options);

export const createNetworkError = (message: string, context: ApiErrorContext, options?: AppErrorOptions) =>
    new NetworkError(message, context, options);

export const createValidationError = (message: string, context: ValidationErrorContext, options?: AppErrorOptions) =>
    new ValidationError(message, context, options);

export const createRuntimeError = (message: string, options?: AppErrorOptions) => new RuntimeError(message, options);

export const createWebSocketError = (message: string, options?: AppErrorOptions) =>
    new WebSocketError(message, options);

export const createStoreSyncError = (message: string, options?: AppErrorOptions) =>
    new StoreSyncError(message, options);

// English: Only actionable HTTP failures should enter Sentry from the fetcher.
// 中文：只有真正可操作的 HTTP 失败才应从 fetcher 进入 Sentry。
export const shouldReportHttpStatus = (status: number) => {
    return status >= 500 || status === 429;
};
