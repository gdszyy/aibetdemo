import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { CacheKey } from './constants/cache';
import { isValidLocale, routing } from './i18n';
import { type RegionCode, regionConfigs } from './i18nV2';

// Initialize next-intl middleware
const intlMiddleware = createMiddleware({
    ...routing,
    localeDetection: false,
});

// CSP is managed here because it is tightly coupled to frontend code (script/style sources).
// Other security headers (X-Content-Type-Options, X-XSS-Protection, Strict-Transport-Security,
// X-Frame-Options, Referrer-Policy) are configured at the CDN layer.
// ! allow unpkg.com to load React Grab script in development
const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const CSP_VALUE = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.googletagmanager.com https://apis.google.com https://www.gstatic.com${isDev ? ' https://unpkg.com' : ''} https://1937741b-6c2d-47a6-9071-765607c10029.snippet.anjcdn.org https://wgt-s3-cdn.statscore.com https://cdn.livechatinc.com https://*.livechatinc.com`,
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
    .join('; ');

/** 拼新的pathname */
const generatePathname = (pathname: string, locale: string) => {
    let newPath = '';
    if (!pathname || pathname === '/') {
        newPath = `/${locale}/sports`;
    } else {
        const paths = pathname.split('/');
        newPath = `/${locale}/${paths.slice(2).join('/')}`;
    }
    return newPath;
};

// TODO 应该放客户端处理
/**
 * Proxy — i18n routing + security headers
 */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const pathLocal = pathname.split('/')[1];

    const regionCode = request.cookies.get(CacheKey.I18nRegion)?.value as RegionCode;
    const cookieLocale = request.cookies.get(CacheKey.I18nLanguage)?.value;
    let defaultLocale = routing.defaultLocale;
    const oldLocale = pathLocal || cookieLocale;

    // 此locale是否是regionCode允许的locale，如果不是，则用默认locale
    if (regionCode) {
        const rc = regionConfigs[regionCode];
        if (rc) {
            defaultLocale = rc.defaultLanguage;
            let newLocale = oldLocale;

            // 如果没有语言cookie，或没有捕获到语言，或不支持该语言
            if (!cookieLocale || !newLocale || !rc.supportLanguages.includes(newLocale)) {
                newLocale = defaultLocale;
                const url = request.nextUrl.clone();
                url.pathname = generatePathname(pathname, newLocale);
                const res = NextResponse.redirect(url);
                res.cookies.set(CacheKey.I18nLanguage, newLocale);
                return res;
            }
        }
    }

    const hasLocalePrefix = routing.locales.some(
        (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    );

    const isRootPath = pathname === '/' || !pathname;

    // 根目录重定向到 /sports
    if (!hasLocalePrefix && isRootPath) {
        const locale = isValidLocale(cookieLocale || '') ? cookieLocale : defaultLocale;
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/sports`;
        return NextResponse.redirect(url);
    }

    const response = intlMiddleware(request);
    response.headers.set('Content-Security-Policy', CSP_VALUE);
    return response;
}

export default proxy;

export const config = {
    matcher: ['/', '/(en|pt|es)/:path*', '/sports/:path*'],
};
