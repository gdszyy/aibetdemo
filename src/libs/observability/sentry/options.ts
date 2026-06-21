import type { NodeOptions } from '@sentry/nextjs';
import { config } from '@/constants/config';
import type { AppErrorOptions } from './errors';
import {
    type SentryBeforeBreadcrumb,
    type SentryBeforeSendEvent,
    type SentryBeforeSendHint,
    sanitizeErrorEvent,
    sanitizeTags,
} from './sanitize';

// English: This file owns runtime-level Sentry behavior: enable flags,
// option builders, and the final automatic `beforeSend` policy.
// 中文：这个文件负责 runtime 层的 Sentry 行为，包括启用开关、options
// 构造，以及最终自动事件入口 `beforeSend`。
// NEXT_PUBLIC_ENABLE_SENTRY_IN_DEV 只用于本地调试使用
// const isProd = config.isProd;
// const SHOULD_ENABLE_SENTRY =
//     isProd || process.env.NEXT_PUBLIC_ENABLE_SENTRY_IN_DEV === 'true';
const DEFAULT_ENVIRONMENT = config.appEnv;
const DEFAULT_RELEASE = process.env.NEXT_PUBLIC_GIT_COMMIT_ID;
const SHOULD_ENABLE_SENTRY = process.env.NEXT_PUBLIC_SENTRY_ENABLE === 'true';

// English: The explicit application error classes enrich `Error` instances
// with sanitized options/context. `beforeSend` reads this shape back out and
// folds it into the final event right before transport.
// 中文：应用侧显式错误类会把 options/context 挂到 `Error` 对象上；
// `beforeSend` 会在真正发送前把这些信息回填到最终 event。
type SentryAppErrorShape = Error & {
    options?: AppErrorOptions;
    context?: {
        url?: string;
        method?: string;
        query?: unknown;
        body?: unknown;
        response?: unknown;
        status?: number;
        code?: number | string;
    };
};

// English: `beforeSend` is the single automatic-event choke point.
// 中文：`beforeSend` 是自动事件进入 Sentry 之前的唯一总闸口。
export const beforeSend = (event: SentryBeforeSendEvent, hint: SentryBeforeSendHint) => {
    let enhancedEvent = event;

    // English: Only our typed application errors are expected to carry the
    // `options/context` shape. Browser-native errors and third-party runtime
    // exceptions skip this backfill step and go straight to sanitization.
    // 中文：只有我们自己的 typed application error 才会带 `options/context`
    // 这套结构。浏览器原生错误和第三方运行时异常不会走这段回填，而是直接进入
    // 后续统一清洗逻辑。
    if (hint.originalException && hint.originalException instanceof Error && 'options' in hint.originalException) {
        const appError = hint.originalException as SentryAppErrorShape;

        // English: Expected authorization denials are modeled explicitly and
        // dropped here so they do not pollute actionable issue lists.
        // 中文：预期内的权限拒绝会单独建模，并在这里直接丢弃，避免污染真正需要
        // 排查的问题列表。
        if (hint.originalException.name === 'ForbiddenError') {
            return null;
        }

        if (appError.options) {
            enhancedEvent = {
                ...event,
                level: appError.options.level || event.level,
                tags: {
                    ...event.tags,
                    ...sanitizeTags(appError.options.tags),
                },
                extra: {
                    ...event.extra,
                    ...appError.options.extra,
                },
            };
        }

        if (appError.context) {
            enhancedEvent.contexts = {
                ...enhancedEvent.contexts,
                response: {
                    type: 'response',
                    status_code: appError.context.status,
                    data: appError.context.response,
                },
                request_payload: {
                    type: 'request_payload',
                    query: appError.context.query,
                    body: appError.context.body,
                },
            };

            enhancedEvent.request = {
                ...enhancedEvent.request,
                url: appError.context.url || enhancedEvent.request?.url,
                method: appError.context.method || enhancedEvent.request?.method,
                data: appError.context.body ?? enhancedEvent.request?.data,
            };
        }
    }

    const sanitizedEvent = sanitizeErrorEvent(enhancedEvent);

    if (!sanitizedEvent) {
        return null;
    }

    return sanitizedEvent;
};

// English: Base non-browser options are centralized here so node/edge runtime
// entries share the same enable flag, environment, release, and `beforeSend`
// behavior.
// 中文：非浏览器 runtime 的基础 options 统一从这里组装，这样 node 和 edge
// 入口就能共享相同的 enable、environment、release 和 `beforeSend` 策略。
export const createBaseOptions = (): Pick<
    NodeOptions,
    'enabled' | 'environment' | 'release' | 'sendDefaultPii' | 'beforeSend'
> => ({
    enabled: SHOULD_ENABLE_SENTRY,
    environment: DEFAULT_ENVIRONMENT,
    release: DEFAULT_RELEASE,
    sendDefaultPii: false,
    beforeSend,
});

// English: Server and edge runtimes intentionally keep tracing disabled for
// now. The current project scope is error monitoring rather than performance
// transaction analysis.
// 中文：server 和 edge runtime 目前都刻意关闭 tracing。当前这套接入的重点
// 是错误监控，而不是 transaction / span 级别的性能分析。
export const createServerSentryOptions = (): NodeOptions => ({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    ...createBaseOptions(),
    tracesSampleRate: 0,
});

export const createEdgeSentryOptions = (): NodeOptions => ({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    ...createBaseOptions(),
    tracesSampleRate: 0,
});

// Re-export these shared callback types from one place so callers do not need
// to reach into `@sentry/nextjs` internals directly.
// 统一从这里导出常用回调类型，避免调用方直接依赖 `@sentry/nextjs`
// 的内部类型位置。
export type { SentryBeforeBreadcrumb, SentryBeforeSendEvent, SentryBeforeSendHint };
