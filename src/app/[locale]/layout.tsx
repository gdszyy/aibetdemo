import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { DialogProvider } from '@/components/dialog/dialog-provider';
import { LiveChatProvider } from '@/components/livechat/LiveChatProvider';
import { APP_NAME } from '@/constants';
import { CacheKey } from '@/constants/cache';
import { config } from '@/constants/config';
import { isValidLocale } from '@/i18n';
import { CartCleanupListener } from '@/modules/bet-slip/_components/cart-cleanup-listener';
import { AppShell } from '@/modules/home/_components/app-shell';
import { NavigationBar } from '@/modules/home/_components/navigation-bar';
import { SupportFloatingEntry } from '@/modules/support-floating';
import { SigninModal } from '@/modules/user/auth/signin';
import { DeviceEffect } from './components/DeviceIdEffect';

/**
 * Viewport configuration for PWA
 */
export const viewport: Viewport = {
    themeColor: '#E80104',
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
};

/**
 * Dynamic Metadata based on locale
 * - title.template: page title template, e.g. "Sports - X"
 * - openGraph.locale: dynamic per locale region
 */
export async function generateMetadata(): Promise<Metadata> {
    return {
        ...(process.env.NEXT_PUBLIC_SITE_URL && {
            metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
        }),
        title: {
            template: `%s - ${APP_NAME}`,
            default: APP_NAME,
        },
        // TODO 没有多语言
        description: `${APP_NAME} Sports Events`,
        icons: {
            icon: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },
        manifest: '/manifest.webmanifest',
        appleWebApp: {
            capable: true,
            statusBarStyle: 'default',
            title: APP_NAME,
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!isValidLocale(locale)) {
        notFound();
    }

    // Providing all messages to the client
    const messages = await getMessages();
    const c = await cookies();
    const timeZone =
        c.get(CacheKey.I18nTimezone)?.value ?? (config.isDev || config.isTest ? 'America/Sao_Paulo' : undefined);

    return (
        <DeviceEffect>
            <NextIntlClientProvider locale={locale} timeZone={timeZone} messages={messages}>
                <AppShell>
                    <NavigationBar />
                    {children}
                    <SupportFloatingEntry />
                </AppShell>
                <SigninModal />
                <DialogProvider />
                <CartCleanupListener />
                <LiveChatProvider />
            </NextIntlClientProvider>
        </DeviceEffect>
    );
}
