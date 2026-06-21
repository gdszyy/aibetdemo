'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { ArrowLeft } from '@/components/icons';
import { useIsDesktop } from '@/hooks/use-media-query';
import { useRouter } from '@/i18n';
import type { TranslationKey } from '@/i18nV2/types';
import { cn } from '@/utils/common';

interface AccountPageShellProps {
    /** i18n key within the 'user' namespace */
    titleKey: TranslationKey<'user'>;
    children: ReactNode;
    /** Optional right panel content (renders as a second column on desktop) */
    rightPanel?: ReactNode;
}

/**
 * Shared page shell for all account pages.
 * Desktop: pink gradient header background + red page title.
 * Mobile: compact header with back button + centered title.
 */
export function AccountPageShell({ titleKey, children, rightPanel }: AccountPageShellProps) {
    const t = useTranslations('user');
    const isDesktop = useIsDesktop();
    const router = useRouter();
    const title = t(titleKey);

    return (
        <div
            className={cn(
                'flex flex-col',
                !isDesktop && 'relative h-[calc(100dvh-var(--bottom-bar-safe-height))] overflow-hidden',
            )}
        >
            {/* Mobile: pink gradient background (matches Figma 170px header) */}
            {!isDesktop && (
                <div
                    className="absolute inset-x-0 top-0 h-[170px] backdrop-blur-[25px] pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(180deg, var(--brand-primary-2) 0%, var(--filltext-ft-a) 84%)',
                    }}
                />
            )}

            {/* Mobile: compact header with back arrow + centered title */}
            {!isDesktop && (
                <div className="flex items-center h-11 px-2 relative z-10">
                    <button
                        type="button"
                        onClick={() => router.push('/account')}
                        className="size-6 shrink-0 flex items-center justify-center cursor-pointer"
                    >
                        <ArrowLeft className="size-4 text-filltext-ft-g" />
                    </button>
                    <span className="flex-1 min-w-0 text-center text-title-md text-filltext-ft-h truncate">
                        {title}
                    </span>
                    <div className="size-6 shrink-0" />
                </div>
            )}

            {/* Desktop: red page title */}
            {isDesktop && <h1 className="text-headline-md text-brand-primary-0 px-6 pt-6">{title}</h1>}

            {/* Content area */}
            <div
                className={cn(
                    'px-2 pt-3 pb-6 md:px-6 md:pt-4 relative',
                    isDesktop ? 'min-h-[calc(100dvh-180px)]' : 'flex-1 min-h-0 flex flex-col overflow-auto',
                )}
            >
                {rightPanel && isDesktop ? (
                    <div className="flex gap-4">
                        <div className="flex-1 min-w-0">{children}</div>
                        <div className="w-[280px] shrink-0">{rightPanel}</div>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}
