'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useDeepCompareEffect, useEventListener } from 'ahooks';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { Footer } from '@/components/footer';
import { useBrandUiSkin } from '@/components/theme-provider/brand-ui-skin';
import { StorageEnum } from '@/constants';
import { useIsDesktop } from '@/hooks/use-media-query';
import { PARLAY_BOOST_RULE_QUERY_KEY } from '@/hooks/use-parlay-boost-rule';
import { useTopSports } from '@/hooks/use-sports';
import { usePathname } from '@/i18n';
import { useBetSlipSubscription } from '@/modules/bet-slip/_hooks/use-bet-slip-subscription';
import { useOrderResultHandler } from '@/modules/bet-slip/_hooks/use-order-result-handler';
import { useBetSlipStore } from '@/modules/bet-slip/stores/bet-slip-store';
import { Sidebar } from '@/modules/match/sidebar';
import { useTreeStore } from '@/modules/match/sidebar/service/store';
import { useIsLogin } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';

/**
 * 投注单浮层（桌面浮窗 / 移动购物车条 / 移动底部抽屉）整体是一套交互很重的子系统，
 * 但初始进入 (sports) 布局时它要么不可见（移动端选中数为 0）、要么是收起态。
 * 静态引入会把整套投注单代码压进 (sports) 布局首包，跨路由组切入时拖慢首屏。
 * 改为 next/dynamic 按需加载（ssr: false，纯客户端交互、初始无内容，无需骨架），
 * 把这套子系统从布局关键包里拆出，加快导航切入。
 */
const DesktopFloatingBetSlip = dynamic(
    () =>
        import('@/modules/bet-slip/_components/desktop-floating-bet-slip').then((m) => m.DesktopFloatingBetSlip),
    { ssr: false },
);
const MobileCartSummaryBar = dynamic(
    () => import('@/modules/bet-slip/_components/mobile-cart-summary-bar').then((m) => m.MobileCartSummaryBar),
    { ssr: false },
);
const BetSlipBottomSheet = dynamic(
    () => import('@/modules/bet-slip/_components/bet-slip-bottom-sheet').then((m) => m.BetSlipBottomSheet),
    { ssr: false },
);

export function SportsLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const queryClient = useQueryClient();
    const topSports = useTopSports();

    const isDesktop = useIsDesktop();
    const isLogin = useIsLogin();
    const pathname = usePathname();
    const betSlipDrawerOpen = useUIStore((s) => s.betSlipDrawerOpen);
    const openBetSlipDrawer = useUIStore((s) => s.openBetSlipDrawer);
    const closeBetSlipDrawer = useUIStore((s) => s.closeBetSlipDrawer);
    const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
    const fetchLatest = useBetSlipStore((state) => state.fetchLatest);
    const selectionCount = useBetSlipStore((state) => state.selections.length);
    const cartVersion = useBetSlipStore((state) => state.version);
    const isMatchDetailRoute = pathname.includes('/matches/');
    const brandUiSkin = useBrandUiSkin();

    useEffect(() => {
        fetchLatest();
    }, [fetchLatest]);

    useEffect(() => {
        if (!betSlipDrawerOpen) {
            return;
        }

        queryClient.refetchQueries({ queryKey: PARLAY_BOOST_RULE_QUERY_KEY }).catch(() => undefined);
    }, [betSlipDrawerOpen, queryClient]);

    useEffect(() => {
        if (!isLogin) {
            return;
        }

        const shouldAutoOpen = window.localStorage.getItem(StorageEnum.PostLoginAutoOpenBetSlip);
        if (!shouldAutoOpen) {
            return;
        }

        if (selectionCount > 0) {
            openBetSlipDrawer();
            window.localStorage.removeItem(StorageEnum.PostLoginAutoOpenBetSlip);
            return;
        }

        if (cartVersion !== null) {
            window.localStorage.removeItem(StorageEnum.PostLoginAutoOpenBetSlip);
        }
    }, [cartVersion, isLogin, openBetSlipDrawer, selectionCount]);

    useEffect(() => {
        if (!isLogin) {
            return;
        }

        const shouldAutoOpen = window.localStorage.getItem(StorageEnum.PostDepositAutoOpenBetSlip);
        if (!shouldAutoOpen) {
            return;
        }

        if (selectionCount > 0) {
            openBetSlipDrawer();
            window.localStorage.removeItem(StorageEnum.PostDepositAutoOpenBetSlip);
            return;
        }

        if (cartVersion !== null) {
            window.localStorage.removeItem(StorageEnum.PostDepositAutoOpenBetSlip);
        }
    }, [cartVersion, isLogin, openBetSlipDrawer, selectionCount]);

    useEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            fetchLatest();
        }
    });

    useOrderResultHandler();
    useBetSlipSubscription();

    const setSportsData = useTreeStore((s) => s.setSportsData);
    useDeepCompareEffect(() => {
        if (topSports.length > 0) {
            setSportsData(topSports);
        }
    }, [topSports, setSportsData]);

    return (
        <div
            className="relative flex min-w-0 flex-1"
            data-brand-ui={brandUiSkin.brand}
            data-brand-mode={brandUiSkin.mode}
            style={brandUiSkin.style}
        >
            {/* Desktop sidebar - pinned to top (Fixed top-0) */}
            {isDesktop && (
                <div
                    className={cn(
                        'shrink-0 transition-[width] duration-200 ease-in-out fixed top-[calc(var(--desktop-nav-height)+var(--header-strip-height))] left-0 h-[calc(100vh-var(--desktop-nav-height)-var(--header-strip-height))] z-50 overflow-y-auto overscroll-y-contain',
                        isMatchDetailRoute || sidebarCollapsed
                            ? 'w-[var(--sidebar-width-collapse)]'
                            : 'w-[var(--sidebar-width-expand)]',
                    )}
                >
                    <Sidebar collapsed={isMatchDetailRoute || sidebarCollapsed} hideHeader />
                </div>
            )}

            {/* Main content column */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex flex-1">
                    <div className="@container flex min-w-0 flex-1 flex-col relative">
                        <div className="max-w-(--main-content-max-width) w-full mx-auto flex-auto">{children}</div>
                        <Footer />
                    </div>
                </div>
            </div>

            {isDesktop && <DesktopFloatingBetSlip />}

            {!isDesktop && !betSlipDrawerOpen && selectionCount > 0 && <MobileCartSummaryBar />}

            {/* Mobile bet slip bottom sheet */}
            {!isDesktop && (
                <BetSlipBottomSheet
                    open={betSlipDrawerOpen}
                    onOpenChange={(open) => {
                        if (open) {
                            openBetSlipDrawer();
                        } else {
                            closeBetSlipDrawer();
                        }
                    }}
                />
            )}
        </div>
    );
}
