import { readFileSync } from 'node:fs';
import { withSentryConfig } from '@sentry/nextjs';
import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const SENTRY_APPLICATION_KEY = 'match-pc-client';

// /**
//  * Resolve Sentry environment from (in priority order):
//  * 1. NEXT_PUBLIC_SENTRY_ENVIRONMENT env var (explicit override)
//  * 2. Current git branch name (read from .git/HEAD at build time)
//  */
// function getSentryEnvironment(): string | undefined {
//     if (process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT) {
//         return process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;
//     }
//     try {
//         const head = readFileSync('.git/HEAD', 'utf-8').trim();
//         // Normal branch: "ref: refs/heads/branch-name"
//         if (head.startsWith('ref: refs/heads/')) {
//             return head.replace('ref: refs/heads/', '');
//         }
//         // Detached HEAD (commit hash) — unlikely to be useful, fall through
//     } catch {
//         // .git/HEAD not available (e.g. CI without .git)
//     }
//     return undefined;
// }

/**
 * Resolve git commit ID from (in priority order):
 * 1. NEXT_PUBLIC_GIT_COMMIT_ID env var (explicit override)
 * 2. Current git commit hash (read from .git at build time, short 7 chars)
 */
function getGitCommitId(): string | undefined {
    if (process.env.NEXT_PUBLIC_GIT_COMMIT_ID) {
        return process.env.NEXT_PUBLIC_GIT_COMMIT_ID;
    }
    try {
        const head = readFileSync('.git/HEAD', 'utf-8').trim();
        if (head.startsWith('ref: ')) {
            // Resolve ref to commit hash
            const refPath = `.git/${head.slice(5)}`;
            return readFileSync(refPath, 'utf-8').trim().slice(0, 7);
        }
        // Detached HEAD — head is already a commit hash
        return head.slice(0, 7);
    } catch {
        // .git not available
    }
    return undefined;
}

const withSerwist = withSerwistInit({
    swSrc: 'src/sw.ts',
    swDest: 'public/sw.js',
    disable: process.env.NODE_ENV === 'development',
});

const withNextIntl = createNextIntlPlugin('./src/i18n/locale/request.ts');
// Security headers to prevent common vulnerabilities like XSS, Clickjacking, and Sniffing.
// Some headers are also recommended by security scanners (e.g. AWVS, OWASP ZAP).
const isProduction = process.env.NODE_ENV === 'production';
const isRailway = Boolean(
    process.env.RAILWAY_PROJECT_ID || process.env.RAILWAY_SERVICE_ID || process.env.RAILWAY_ENVIRONMENT_NAME,
);
const shouldUseStandaloneOutput = Boolean(process.env.CI) || isRailway;

const SECURITY_HEADERS = [
    {
        key: 'Content-Security-Policy',
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.googletagmanager.com https://1937741b-6c2d-47a6-9071-765607c10029.snippet.anjcdn.org https://wgt-s3-cdn.statscore.com https://cdn.livechatinc.com https://*.livechatinc.com",
            "worker-src 'self' blob:",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://wgt-s3-cdn.statscore.com https://*.livechatinc.com",
            "img-src 'self' data: blob: https: https://www.googletagmanager.com https://www.google-analytics.com",
            "font-src 'self' data: https://fonts.gstatic.com https://wgt-s3-cdn.statscore.com https://*.livechat-static.com",
            "connect-src 'self' wss: https: https://www.google-analytics.com https://www.googletagmanager.com",
            "object-src 'none'",
            "base-uri 'self'",
            "frame-src 'self' https:",
            "frame-ancestors 'none'",
            isProduction && 'upgrade-insecure-requests',
        ]
            .filter(Boolean)
            .join('; '),
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY',
    },
    {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    },
];

const STATIC_CACHE_TIME = 86400 * 365 * 10;

/**
 * public/static 下静态文件允许浏览器和 CDN 缓存以减少重复请求。
 */
const STATIC_PUBLIC_CACHE_HEADERS = [
    {
        key: 'Cache-Control',
        value: `public, max-age=${STATIC_CACHE_TIME}, stale-while-revalidate=${STATIC_CACHE_TIME}`,
    },
];

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: process.env.NEXT_PUBLIC_STRICT_MODE !== 'false',
    basePath: '',
    output: shouldUseStandaloneOutput ? 'standalone' : undefined,
    turbopack: {
        root: __dirname,
    },
    async headers() {
        return [
            {
                // Apply security headers to all paths
                source: '/:path*',
                headers: SECURITY_HEADERS,
            },
            {
                source: '/static/:path*',
                headers: STATIC_PUBLIC_CACHE_HEADERS,
            },
        ];
    },
    reactCompiler: true,
    experimental: {
        /**
         * 客户端路由缓存（Client Router Cache）保鲜时长。
         * 复用已访问 / 已预加载的页面段，使前进后退与重复访问几乎瞬时。
         * - dynamic：动态页（读 cookie/header、带 searchParams）缓存 30s
         * - static：静态 / 已 prefetch 的页缓存 300s
         * 注：会延长页面内容的“可见过期窗口”，演示场景可接受；如需实时数据请调小。
         */
        staleTimes: {
            dynamic: 30,
            static: 300,
        },
    },
    env: {
        // NEXT_PUBLIC_SENTRY_ENVIRONMENT: getSentryEnvironment(),
        NEXT_PUBLIC_GIT_COMMIT_ID: getGitCommitId(),
    },
    async redirects() {
        return [
            {
                source: '/:locale(pt|es|en)',
                destination: '/:locale/sports',
                permanent: false,
            },
        ];
    },
    images: {
        qualities: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.helix.city',
                pathname: '/materials/**',
            },
            {
                protocol: 'https',
                hostname: '**',
                pathname: '/**',
            },
        ],
    },
};

const nextIntlConfig = withNextIntl(nextConfig);

// English: Enable the Sentry webpack/plugin pipeline in production by default.
// Allow the same pipeline in local development only when explicitly requested,
// so we can test source-map uploads and tunnel behavior without affecting normal dev.
// 中文：默认只在 production，test 构建启用 Sentry 的 webpack / 上传链路。
// 如果本地显式打开 `NEXT_PUBLIC_ENABLE_SENTRY_IN_DEV=true`，也允许在开发场景
// 接入同一套插件链路，方便调试 source map 上传和 tunnel 行为。
// const shouldEnableSentry =
//     isProduction || process.env.NEXT_PUBLIC_ENABLE_SENTRY_IN_DEV === 'true';

const shouldEnableSentry = process.env.NEXT_PUBLIC_SENTRY_ENABLE === 'true';

// Only enable Sentry when the runtime/build flag says so.
// 本地调试需要 添加环境变量 SENTRY_AUTH_TOKEN，SENTRY_ORG，SENTRY_PROJECT，NEXT_PUBLIC_SENTRY_DSN
// 注意：如果要启用 source map 必须添加 SENTRY_AUTH_TOKEN
const finalConfig = shouldEnableSentry
    ? withSentryConfig(nextIntlConfig, {
          // Sentry organization and project (read from env or .sentryclirc)
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,

          // Auth token for source map uploads (CI/CD only)
          authToken: process.env.SENTRY_AUTH_TOKEN,

          // Suppress CLI logs in local dev
          silent: !process.env.CI,

          // Required for standalone output mode
          widenClientFileUpload: true,

          // Route browser requests through the app to reduce ad-blocker interference.
          tunnelRoute: '/monitoring',

          unstable_sentryWebpackPluginOptions: {
              applicationKey: SENTRY_APPLICATION_KEY,
          },

          webpack: {
              treeshake: {
                  removeDebugLogging: true,
              },
          },

          // Source maps config 开启，上传成功之后删除
          sourcemaps: {
              // Delete source maps from build output after uploading
              deleteSourcemapsAfterUpload: true,
          },
      })
    : nextIntlConfig;

export default withSerwist(finalConfig);
