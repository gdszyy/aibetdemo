'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useRouter } from '@/i18n';
import { useIsLogin, useSessionReady } from '@/stores/session-store';
import { cn } from '@/utils/common';

/** 移动端未登录操作栏，固定在底部导航上方。 */
export const MobileAuthActionBar: FC = () => {
    const t = useTranslations('auth');
    const router = useRouter();
    const isLogin = useIsLogin();
    const isLoginReady = useSessionReady();

    if (!isLoginReady) {
        return null;
    }

    if (isLogin) return null;

    const openSigninPage = (): void => {
        router.push('/signin');
    };

    return (
        <div
            className={cn(
                'fixed left-0 right-0 z-40 md:hidden',
                'bottom-[var(--bottom-bar-safe-height)]',
                'flex h-(--mobile-auth-action-bar-height) items-center gap-2 border-y-[0.5px] border-filltext-ft-c bg-surface-1 px-4 py-2',
            )}
        >
            <button
                type="button"
                onClick={openSigninPage}
                className="flex h-8 min-w-0 flex-1 items-center justify-center rounded-full bg-filltext-ft-b px-2 text-auxiliary-md text-filltext-ft-g transition-colors active:bg-filltext-ft-c"
            >
                {t('login.signUp')}
            </button>
            <button
                type="button"
                onClick={openSigninPage}
                className="flex h-8 min-w-0 flex-1 items-center justify-center rounded-full bg-brand-primary-0 px-2 text-auxiliary-md text-on-brand transition-colors active:bg-brand-primary-4"
            >
                {t('login.title2')}
            </button>
        </div>
    );
};
