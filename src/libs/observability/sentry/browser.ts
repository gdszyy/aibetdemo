import type { BrowserOptions } from '@sentry/nextjs';
import * as Sentry from '@sentry/nextjs';
import { config } from '@/constants/config';
import { createBaseOptions } from './options';
import { sanitizeBreadcrumb } from './sanitize';

// English: Guard against duplicate browser initialization during dev re-evals.
// 中文：开发态下客户端入口可能被重复执行，这个标记用来防止重复初始化。
let hasInitializedSentry = false;

// English: Browser-only Sentry setup lives in this file so server/edge builds
// never statically touch browser-exclusive integrations like Replay.
// 中文：浏览器专属的 Sentry 配置放在这里，这样 server/edge 构建就不会
// 静态解析到 Replay 这类只存在于浏览器端的 integration。
export const createBrowserSentryOptions = (): BrowserOptions => ({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    ...createBaseOptions(),
    beforeBreadcrumb: sanitizeBreadcrumb as NonNullable<BrowserOptions['beforeBreadcrumb']>,
    // English: Keep default browser integrations, then append replay and
    // console-error capture. Replacing the default list would break automatic
    // global handlers such as uncaught error / unhandled rejection capture.
    // 中文：这里保留默认浏览器 integrations，再追加 replay 和
    // console-error 捕捉。如果直接替换默认列表，会把全局自动捕获能力
    // 一起替换掉，例如 uncaught error / unhandled rejection。
    integrations: (defaultIntegrations) => [
        ...defaultIntegrations,
        Sentry.replayIntegration(),
        Sentry.captureConsoleIntegration({
            levels: ['error'],
        }),
    ],
    maxBreadcrumbs: 20,
    // Disable performance tracing — only error tracking + replay
    // 中文：关闭性能链路采样。当前这套 Sentry 只关注错误监控和 Replay，
    // 不采集 transaction / span 这类性能追踪数据。
    tracesSampleRate: 0,
    // Keep normal replay traffic low; error sessions still capture full context.
    // 中文：普通会话的 Replay 采样率。这里只在 production 保留 1% 的常规录屏，
    // 用来控制录制流量和成本；development 默认不开普通录屏。
    replaysSessionSampleRate: config.isProd ? 0.01 : 0,
    // Always capture replay when an error occurs.
    // 中文：一旦本次会话里出现错误，就强制采集对应 Replay。
    // 这里设为 1，表示错误会话 100% 保留录屏上下文，方便回放问题现场。
    replaysOnErrorSampleRate: 1.0,
});

// English: Next.js may evaluate client entry modules more than once in dev, so
// we guard browser initialization to avoid duplicate `Sentry.init()` calls.
// 中文：Next.js 开发态下可能会多次执行客户端入口模块，这里用一个标记防止
// 浏览器端重复 `Sentry.init()`。
export const initializeSentry = () => {
    if (hasInitializedSentry) {
        return;
    }

    Sentry.init(createBrowserSentryOptions());
    hasInitializedSentry = true;
};

// English: Keep router-transition capture beside browser initialization
// because it is also a browser-only runtime concern.
// 中文：路由切换捕捉也放在这里，是因为它同样只属于浏览器端运行时能力。
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

// !!! old 废弃
// import * as Sentry from '@sentry/nextjs';
// import { getSharedSentryOptions } from '@/utils/sentry';

// const isProduction = config.isProd;
// const SENTRY_APPLICATION_KEY = 'match-pc-client';

// Sentry.init({
//     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

//     ...getSharedSentryOptions(),

//     integrations: [
//         Sentry.replayIntegration(),
//         Sentry.thirdPartyErrorFilterIntegration({
//             filterKeys: [SENTRY_APPLICATION_KEY],
//             behaviour: 'drop-error-if-exclusively-contains-third-party-frames',
//         }),
//     ],

//     // Disable performance tracing — only error tracking + replay
//     tracesSampleRate: 0,

//     // Keep normal replay traffic low; error sessions still capture full context.
//     replaysSessionSampleRate: isProduction ? 0.01 : 0,

//     // Always capture replay when an error occurs.
//     replaysOnErrorSampleRate: 1.0,
// });
