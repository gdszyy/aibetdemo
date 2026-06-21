import '@/assets/css/tailwind.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import localFont from 'next/font/local';
import { cookies, headers } from 'next/headers';
import Script from 'next/script';
import { userAgent } from 'next/server';
import { Loading } from '@/components/loading/loading';
import { RootProviders } from '@/components/providers/root-providers';
import { ToastProvider } from '@/components/toast/toast-provider';
import { DomIdEnum } from '@/constants';
import { CacheKey } from '@/constants/cache';
import { config } from '@/constants/config';
import { I18nEffect } from '@/i18nV2';
import { cn } from '@/utils/common';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

// Global font - Poppins (local)
const poppins = localFont({
    src: [
        { path: '../assets/fonts/Poppins-Light.woff2', weight: '300' },
        { path: '../assets/fonts/Poppins-Regular.woff2', weight: '400' },
        { path: '../assets/fonts/Poppins-Medium.woff2', weight: '500' },
        { path: '../assets/fonts/Poppins-SemiBold.woff2', weight: '600' },
        { path: '../assets/fonts/Poppins-Bold.woff2', weight: '700' },
        { path: '../assets/fonts/Poppins-Black.ttf', weight: '900' },
    ],
    variable: '--font-poppins',
    display: 'swap',
});

const barlow = localFont({
    src: [
        { path: '../assets/fonts/Barlow-Light.ttf', weight: '300' },
        { path: '../assets/fonts/Barlow-Regular.ttf', weight: '400' },
        { path: '../assets/fonts/Barlow-Medium.ttf', weight: '500' },
        { path: '../assets/fonts/Barlow-SemiBold.ttf', weight: '600' },
        { path: '../assets/fonts/Barlow-Bold.ttf', weight: '700' },
        { path: '../assets/fonts/Barlow-Black.ttf', weight: '900' },
    ],
    variable: '--font-barlow',
    display: 'swap',
});

// Headline font - Roboto Flex (local variable font, full axes: wght/wdth/GRAD/XOPQ/XTRA/...)
const robotoFlex = localFont({
    src: [
        {
            path: '../assets/fonts/RobotoFlex-Variable.woff2',
            style: 'normal',
        },
        {
            path: '../assets/fonts/RobotoFlex-Variable-ext.woff2',
            style: 'normal',
        },
    ],
    variable: '--font-roboto-flex',
    display: 'swap',
});

const rowdies = localFont({
    src: [
        { path: '../assets/fonts/Rowdies-Light.ttf', weight: '300' },
        { path: '../assets/fonts/Rowdies-Regular.ttf', weight: '400' },
        { path: '../assets/fonts/Rowdies-Bold.ttf', weight: '700' },
    ],
    variable: '--font-rowdies',
    display: 'swap',
});

const racingSansOne = localFont({
    src: [{ path: '../assets/fonts/RacingSansOne-Regular.ttf', weight: '400' }],
    variable: '--font-racing-sans-one',
    display: 'swap',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const h = await headers();
    const c = await cookies();
    const shouldUseDevI18nFallback = config.isDev || config.isTest;
    /**
     * 用浏览器的user agent判断是否是移动端。
     * 不能延迟到客户端再判断。
     * 因为要ssr和csr保持一致的渲染布局，防止抖动。
     */
    const isMobile = userAgent({ headers: h }).ua.toLowerCase().includes('mobile');
    const isDesktop = !isMobile;

    /** 地区 */
    const region = c.get(CacheKey.I18nRegion)?.value ?? (shouldUseDevI18nFallback ? 'BR' : undefined);
    /** 语言 */
    const language = c.get(CacheKey.I18nLanguage)?.value ?? (shouldUseDevI18nFallback ? 'en' : undefined);
    /** 时区 */
    const timezone =
        c.get(CacheKey.I18nTimezone)?.value ?? (shouldUseDevI18nFallback ? 'America/Sao_Paulo' : undefined);

    // 服务端渲染的必要条件，是否满足
    const isSsrReady = Boolean(region) && Boolean(language) && Boolean(timezone);

    return (
        <html
            lang={language || 'en'}
            suppressHydrationWarning
            className={`${poppins.variable} ${robotoFlex.variable} ${rowdies.variable} ${barlow.variable} ${racingSansOne.variable}`}
        >
            <head>
                {config.liveChatEnabled && (
                    <>
                        <link rel="preconnect" href="https://cdn.livechatinc.com" crossOrigin="anonymous" />
                        <link rel="dns-prefetch" href="https://cdn.livechatinc.com" />
                        <link rel="dns-prefetch" href="https://api.livechatinc.com" />
                    </>
                )}
                {process.env.NEXT_PUBLIC_DEV_REACT_GRAB_ENABLE === 'true' && (
                    <Script
                        src="https://unpkg.com/react-grab/dist/index.global.js"
                        crossOrigin="anonymous"
                        strategy="beforeInteractive"
                    />
                )}
                {process.env.NEXT_PUBLIC_DEV_SPACINGJS_ENABLE === 'true' && (
                    <Script src="https://unpkg.com/spacingjs" strategy="afterInteractive" />
                )}
                <Script
                    id="anj-seal-script"
                    src="https://1937741b-6c2d-47a6-9071-765607c10029.snippet.anjcdn.org/anj-seal.js"
                    strategy="beforeInteractive"
                    type="text/javascript"
                />
                {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                            `}
                        </Script>
                    </>
                )}
            </head>
            <body
                className={cn('bg-filltext-ft-b', config.isDev || config.isTest ? '' : 'select-none')}
                suppressHydrationWarning
            >
                <RootProviders isMobile={isMobile} isDesktop={isDesktop}>
                    {isSsrReady ? (
                        <>
                            <I18nEffect />
                            <section className="relative z-10 min-h-screen w-full" id={DomIdEnum.AppContainer}>
                                {children}
                            </section>
                        </>
                    ) : (
                        <>
                            <I18nEffect />
                            <div className="w-screen h-screen flex flex-col items-center justify-center">
                                <Loading className="size-6" />
                            </div>
                        </>
                    )}
                    {/** Modal container - z-60 ensures it's above MobileNav/BottomSheet (z-50) */}
                    <div id={DomIdEnum.ModalContainer} className="relative z-60" />
                    {/** Toast container - z-70 ensures it's above Modal */}
                    <div id={DomIdEnum.ToastContainer} className="relative z-70" />
                    <ToastProvider />
                </RootProviders>
            </body>
        </html>
    );
}
