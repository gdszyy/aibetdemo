import * as Sentry from '@sentry/nextjs';
import type { ApiError, AppError, AppErrorOptions, StoreSyncError, ValidationError, WebSocketError } from './errors';
import { sanitizeForSentry, sanitizeTags } from './sanitize';

// English: This file is the single manual-reporting transport entry.
// Every explicit business-side report should end up here before it reaches
// `Sentry.captureException`.
// 中文：这个文件是唯一的手动上报发送入口。业务侧所有显式上报，
// 最终都应该先汇总到这里，再进入 `Sentry.captureException`。
export type CaptureAppErrorOptions = AppErrorOptions;
export type SentryReportLevel = AppErrorOptions['level'];
export type SentryReportOptions = CaptureAppErrorOptions;

type ErrorWithSentryOptions = Error & {
    options?: CaptureAppErrorOptions;
};

// English: The only user field we intentionally synchronize into Sentry is
// `uid`, which becomes `user.id` on the final event.
// 中文：这里刻意只同步一个用户字段 `uid`，并把它映射成 Sentry 里的
// `user.id`。
export interface SentryUserContext {
    uid?: string | null;
}

// English: A per-object symbol is enough for deduping repeated reports coming
// from the same error instance without affecting error serialization.
// 中文：这里用对象级 symbol 做去重，足够拦住“同一个错误对象被重复上报”，
// 同时不会影响错误对象的正常序列化行为。
const REPORTED_ERROR_SYMBOL = Symbol.for('match-pc.sentry.reported');

const markAsReported = (error: object) => {
    Object.defineProperty(error, REPORTED_ERROR_SYMBOL, {
        value: true,
        enumerable: false,
        writable: false,
    });
};

const hasBeenReported = (error: object) => {
    return REPORTED_ERROR_SYMBOL in error;
};

const isErrorWithSentryOptions = (error: unknown): error is ErrorWithSentryOptions => {
    return error instanceof Error && 'options' in error;
};

// English: Final manual reporting entrypoint for all business-triggered errors.
// 中文：所有业务侧显式触发上报的最终入口。
export const captureAppError = (error: unknown, options?: CaptureAppErrorOptions) => {
    if (error !== null && typeof error === 'object') {
        if (hasBeenReported(error)) {
            return;
        }

        markAsReported(error);
    }

    // English: Typed application errors carry their own `options`, so we treat
    // those as the source of truth and avoid merging another ad-hoc option bag
    // on top. That keeps the current flow simple and predictable.
    // 中文：typed application error 会自己携带 `options`，这里把它当作
    // 唯一可信来源，不再额外和调用参数做混合，避免当前链路出现“双份参数”
    // 的优先级歧义。
    if (isErrorWithSentryOptions(error)) {
        Sentry.withScope((scope) => {
            if (error.options?.level) {
                scope.setLevel(error.options.level);
            }
            if (error.options?.tags) {
                const tags = sanitizeTags(error.options.tags);
                if (tags) {
                    scope.setTags(tags);
                }
            }
            if (error.options?.extra) {
                scope.setExtras(sanitizeForSentry(error.options.extra) as Record<string, unknown>);
            }
            Sentry.captureException(error);
        });
        return;
    }

    // English: Plain `Error` instances do not carry our app-defined metadata,
    // so the only place to enrich them is the direct `options` argument.
    // 中文：普通 `Error` 不会自带应用侧约定的 metadata，因此这类错误只能
    // 通过调用参数 `options` 来补充 level / tags / extra。
    Sentry.withScope((scope) => {
        if (options?.level) {
            scope.setLevel(options.level);
        }
        if (options?.tags) {
            const tags = sanitizeTags(options.tags);
            if (tags) {
                scope.setTags(tags);
            }
        }
        if (options?.extra) {
            scope.setExtras(sanitizeForSentry(options.extra) as Record<string, unknown>);
        }
        Sentry.captureException(error);
    });
};

// English: This function writes the current auth identity into Sentry scope.
// `sanitizeErrorEvent()` can only trim an existing `event.user`; it cannot
// invent one. That is why runtime user sync is still necessary.
// 中文：这个函数负责把当前登录身份写进 Sentry scope。
// `sanitizeErrorEvent()` 只能“清洗已经存在的 `event.user`”，并不能凭空生成它，
// 所以运行时用户同步仍然是必要的。
export const syncSentryUserContext = (user?: SentryUserContext | null) => {
    const uid = user?.uid?.trim();

    if (!uid) {
        Sentry.setUser(null);
        Sentry.setTag('auth_state', 'anonymous');
        return;
    }

    Sentry.setUser({ id: uid });
    Sentry.setTag('auth_state', 'authenticated');
};

// English: Semantic wrappers keep business callsites readable while still
// converging on the same final transport entry.
// 中文：语义化包装函数让业务调用点更好读，但底层仍然会收敛到同一个发送入口。
export const captureApiError = (error: ApiError) => captureAppError(error);
export const captureValidationError = (error: ValidationError) => captureAppError(error);
export const captureWebSocketError = (error: WebSocketError) => captureAppError(error);
export const captureStoreSyncError = (error: StoreSyncError) => captureAppError(error);
export const captureRuntimeError = (error: AppError | Error, options?: CaptureAppErrorOptions) =>
    captureAppError(error, options);
export const captureUiError = (error: Error, options?: CaptureAppErrorOptions) => captureAppError(error, options);
