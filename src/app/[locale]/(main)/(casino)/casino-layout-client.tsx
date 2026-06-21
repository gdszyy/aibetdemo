'use client';

import { useEffect } from 'react';
import { FirebaseAnalyticsEventName } from '@/api/models/analytics';
import { Footer } from '@/components/footer';
import { StorageEnum } from '@/constants';
import { useBusinessFirebaseAnalytics } from '@/hooks/use-business-firebase-analytics';
import { useIsDesktop } from '@/hooks/use-media-query';
import { CasinoSidebar } from '@/modules/casino/_components/casino-sidebar';
import { RightAside } from '@/modules/home/_components/right-aside';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';

export function CasinoLayoutClient({ children }: Readonly<{ children: React.ReactNode }>) {
    const isDesktop = useIsDesktop();
    const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
    const { trackFirst } = useBusinessFirebaseAnalytics();

    useEffect(() => {
        const clickTime = Date.now();
        trackFirst(FirebaseAnalyticsEventName.FirstCasinoPageClick, StorageEnum.AnalyticsFirstCasinoPageClick, {
            first_casino_click_time: clickTime,
        });
    }, [trackFirst]);

    return (
        <div className="flex flex-1 w-full relative">
            {/* Desktop casino sidebar - pinned to top (Fixed top-0) */}
            {isDesktop && (
                <div
                    className={cn(
                        'shrink-0 transition-[width] duration-200 ease-in-out fixed top-[calc(72px+var(--header-strip-height))] left-0 h-[calc(100vh-72px-var(--header-strip-height))] z-50 overflow-y-auto overscroll-y-contain',
                        sidebarCollapsed ? 'w-[var(--sidebar-width-collapse)]' : 'w-[var(--sidebar-width-expand)]',
                    )}
                >
                    <CasinoSidebar collapsed={sidebarCollapsed} hideHeader />
                </div>
            )}

            {/* Content area */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex flex-1">
                    <div className="@container flex min-w-0 flex-1 flex-col relative">
                        <div className="max-w-[var(--main-content-max-width)] w-full mx-auto flex-auto">{children}</div>
                        <Footer />
                    </div>

                    {/* Right column - toolbar */}
                    {isDesktop && (
                        <div className="flex flex-col sticky top-[calc(72px+var(--header-strip-height))] h-[calc(100vh-72px-var(--header-strip-height))] shrink-0 z-20">
                            <aside className="flex flex-1 min-h-0 shrink-0 border-l-[0.5px] border-filltext-ft-c bg-surface-1">
                                <RightAside />
                            </aside>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
