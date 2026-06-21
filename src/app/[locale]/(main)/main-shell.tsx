'use client';

import { match, P } from 'ts-pattern';
import { config } from '@/constants/config';
import { useIsDesktop } from '@/hooks/use-media-query';
import { usePathname } from '@/i18n';
import { checkHasSidebar, checkIsSportsActive, checkIsSportsLiveActive } from '@/libs/navigation';
import { useSelectionCount } from '@/modules/bet-slip/stores/bet-slip-store';
import { BottomTabBar } from '@/modules/home/_components/bottom-tab-bar';
import { LanguageModal } from '@/modules/home/_components/language-modal';
import { MobileAuthActionBar } from '@/modules/home/_components/mobile-auth-action-bar';
import { ReplayControl } from '@/replay';
import { useIsUnauthenticated } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';

/**
 * 主壳层，统一处理移动端底部导航和投注摘要条的预留空间。
 */
export function MainShell({ children }: { children: React.ReactNode }) {
    const isDesktop = useIsDesktop();
    const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
    const betSlipDrawerOpen = useUIStore((s) => s.betSlipDrawerOpen);
    const selectionCount = useSelectionCount();
    const isUnauthenticated = useIsUnauthenticated();
    const pathname = usePathname();
    const hasSidebar = isDesktop && checkHasSidebar(pathname);
    const hasMobileBetSlipSummary = checkIsSportsActive(pathname) || checkIsSportsLiveActive(pathname);
    const showMobileAuthActionBar = !isDesktop && !betSlipDrawerOpen && isUnauthenticated;
    const mobileBottomPaddingClass = match({
        isDesktop,
        betSlipDrawerOpen,
        hasMobileBetSlipSummary,
        selectionCount,
        showMobileAuthActionBar,
    })
        .with(
            {
                isDesktop: false,
                betSlipDrawerOpen: false,
                hasMobileBetSlipSummary: true,
                selectionCount: P.when((count) => count > 0),
                showMobileAuthActionBar: true,
            },
            () =>
                'pb-[calc(var(--bottom-bar-safe-height)+var(--mobile-cart-summary-bar-height)+var(--mobile-auth-action-bar-height))]',
        )
        .with(
            {
                isDesktop: false,
                betSlipDrawerOpen: false,
                hasMobileBetSlipSummary: true,
                selectionCount: P.when((count) => count > 0),
            },
            () => 'pb-[calc(var(--bottom-bar-safe-height)+var(--mobile-cart-summary-bar-height))]',
        )
        .with(
            {
                isDesktop: false,
                betSlipDrawerOpen: false,
                showMobileAuthActionBar: true,
            },
            () => 'pb-[calc(var(--bottom-bar-safe-height)+var(--mobile-auth-action-bar-height))]',
        )
        .with(
            {
                isDesktop: false,
                betSlipDrawerOpen: false,
            },
            () => 'pb-[var(--bottom-bar-safe-height)]',
        )
        .otherwise(() => '');

    return (
        <div
            className={cn(
                'flex flex-col min-h-screen w-full transition-[padding] duration-200 ease-in-out pt-[var(--header-strip-height)]',
                hasSidebar &&
                    (sidebarCollapsed ? 'pl-[var(--sidebar-width-collapse)]' : 'pl-[var(--sidebar-width-expand)]'),
                mobileBottomPaddingClass,
            )}
        >
            {/* Content area (child layouts control sidebar and main content layout) */}
            <div className="flex-1 flex flex-col">{children}</div>
            {/* Mobile bottom TabBar */}
            {!isDesktop && !betSlipDrawerOpen && (
                <>
                    <MobileAuthActionBar />
                    <BottomTabBar />
                </>
            )}
            {config.isDev && isDesktop && <ReplayControl />}
            <LanguageModal />
        </div>
    );
}
