'use client';

import { useTranslations } from 'next-intl';
import { type FC, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/button/button';
import { DepositReward } from '@/components/DepositReward';
import { HamburgerMenu, PresentsBox, PresentsBoxOpened } from '@/components/icons';
// import { SearchOutlined } from '@/components/icons2/SearchOutlined';
// import { UserOutlined } from '@/components/icons2/UserOutlined';
import { Logo } from '@/components/Logo';
import { useBrandUiSkin } from '@/components/theme-provider/brand-ui-skin';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { useIsDesktop } from '@/hooks/use-media-query';
import { useRechargeActiveConfig } from '@/hooks/use-recharge-code';
import { Link, usePathname, useRouter } from '@/i18n';
import { checkHasSidebar, checkIsAccountRoute } from '@/libs/navigation';
import { WorldCupMenuItem } from '@/modules/marketing/promotion/world-cup-league/leagues-banner/components/WorldCupMenu';
import { Signin } from '@/modules/user/auth/signin';
import { useIsLogin, useSessionReady } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { MobileNav } from '../mobile-nav';
import { DesktopMenu } from './desktop-menu';
import { Logined } from './logined';

/** 移动端导航栏只在页面顶部显示，滚动内容时通过位移动画让出顶部空间。 */
const useMobileNavHidden = (isDesktop: boolean): boolean => {
    const [isHidden, setIsHidden] = useState(false);
    const hiddenRef = useRef(false);

    useEffect(() => {
        if (isDesktop) {
            hiddenRef.current = false;
            setIsHidden(false);
            return;
        }

        const syncHidden = (nextHidden: boolean): void => {
            if (hiddenRef.current === nextHidden) return;

            hiddenRef.current = nextHidden;
            setIsHidden(nextHidden);
        };

        const updateHiddenState = (): void => {
            syncHidden(Math.max(window.scrollY, 0) > 0);
        };

        updateHiddenState();
        window.addEventListener('scroll', handleScroll, { passive: true });

        function handleScroll(): void {
            updateHiddenState();
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDesktop]);

    return isHidden;
};

/** 移动端未登录顶部快捷入口，点击进入 H5 登录页。 */
const MobileGuestActions: FC = () => {
    const tAuth = useTranslations('auth');
    const router = useRouter();
    const rechargeReward = Number(useRechargeActiveConfig()?.max_withdraw) || 0;

    useEffect(() => {
        router.prefetch('/signin');
    }, [router]);

    const openSigninPage = (): void => {
        router.push('/signin');
    };

    return (
        <div className="flex h-10 items-center gap-1">
            {/* 世界杯 menu icon */}
            <WorldCupMenuItem />
            <div className="relative">
                <Button type="button" className="h-8 px-4 text-body-md" onClick={openSigninPage}>
                    {tAuth('login.title2')}
                </Button>
                <DepositReward
                    className="-right-1 -top-1.5 z-10 h-3.5 px-1"
                    arrowClassName="right-[7px]"
                    variant="compact"
                    reward={rechargeReward}
                />
            </div>
        </div>
    );
};

const DesktopTopStrip: FC = () => {
    return (
        <div className="fixed inset-x-0 top-0 z-40 hidden h-[var(--header-strip-height)] items-center border-b border-[color:var(--brand-topbar-border,var(--border-subtle))] bg-[var(--brand-topbar-before-bg,var(--surface-shell))] px-4 text-auxiliary-md text-content-muted md:flex">
            <div className="flex min-w-0 flex-1 items-center gap-5">
                <Link href="/sports/promotions" className="transition-colors hover:text-content-primary">
                    Fast deposits
                </Link>
                <Link href="/leagues/80462" className="transition-colors hover:text-content-primary">
                    2026 FIFA World Cup
                </Link>
                <Link href="/sports/vip" className="transition-colors hover:text-content-primary">
                    VIP Club
                </Link>
            </div>
            <div className="flex shrink-0 items-center gap-4">
                <Link href="/sports/my-bets" className="transition-colors hover:text-content-primary">
                    My Bets
                </Link>
                <span className="rounded-xs border border-[color:var(--border-strong)] px-1.5 py-px font-bold text-content-secondary">
                    Decimal
                </span>
            </div>
        </div>
    );
};

/** Top navigation bar */
export const NavigationBar: FC = () => {
    const isDesktop = useIsDesktop();
    const isLogin = useIsLogin();
    const isLoginReady = useSessionReady();
    const toggleSidebar = useUIStore((s) => s.toggleSidebar);
    const pathname = usePathname();
    const routeHasSidebar = checkHasSidebar(pathname);
    const isHidden = useMobileNavHidden(isDesktop);
    const brandUiSkin = useBrandUiSkin();
    const componentProfile = useThemeComponentProfile();

    if (pathname === '/signin' || pathname === '/account' || (!isDesktop && checkIsAccountRoute(pathname))) {
        return null;
    }

    return (
        <>
            <DesktopTopStrip />
            <div
                className={cn(
                    'shrink-0 flex items-center justify-between',
                    'h-14 md:h-[var(--desktop-nav-height)] px-2 md:pl-3 md:pr-4',
                    '[background:var(--brand-topbar-bg,var(--surface-shell))] md:[background:var(--brand-topbar-bg,var(--surface-shell-gradient))]',
                    'border-b border-[color:var(--brand-topbar-border,var(--brand-primary-0))]',
                    'sticky top-[var(--header-strip-height)] z-40',
                    'transform-gpu transition-transform will-change-transform motion-reduce:transition-none',
                    isHidden ? '-translate-y-full duration-150 ease-in' : 'duration-200 ease-out',
                )}
                data-brand-ui={brandUiSkin.brand}
                data-brand-mode={brandUiSkin.mode}
                data-nav-profile={componentProfile.nav.profile}
                data-nav-active-marker={componentProfile.nav.activeMarker}
                data-nav-promo-weight={componentProfile.nav.promoWeight}
                style={{ ...brandUiSkin.style, ...componentProfile.style }}
            >
                {/* 手机版导航器 */}
                {!isDesktop && (
                    <>
                        <div className="flex items-center gap-0.5">
                            {routeHasSidebar ? (
                                <MobileNav />
                            ) : (
                                <Link href="/" prefetch className="flex w-8 items-center justify-center">
                                    <Logo className="w-25" variant="top" />
                                </Link>
                            )}
                            {/* <div className="flex size-8 items-center justify-center text-filltext-ft-h">
                            <SearchOutlined className="size-5" />
                        </div> */}
                        </div>
                        {!isLogin && (
                            <Link
                                href="/"
                                prefetch
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                            >
                                <Logo variant="top" />
                            </Link>
                        )}
                    </>
                )}

                {/* Desktop: inline logo section + nav menu */}
                {isDesktop && (
                    <div className="flex items-center flex-1 min-w-0 h-[var(--desktop-nav-height)]">
                        {/* Logo section — aligns with sidebar column */}
                        <div className="flex gap-1 h-full items-center w-[var(--sidebar-width-expand)] shrink-0">
                            {routeHasSidebar ? (
                                <button
                                    type="button"
                                    onClick={toggleSidebar}
                                    className="size-8 flex items-center justify-center text-filltext-ft-e hover:text-filltext-ft-g hover:bg-filltext-ft-b rounded-full transition-colors cursor-pointer"
                                >
                                    <HamburgerMenu className="size-4" />
                                </button>
                            ) : (
                                <div className="size-8" />
                            )}
                            <Link
                                className="px-4 py-2 hover:rounded-sm hover:bg-[var(--brand-logo-hover-bg,var(--neutral-white-b))]"
                                href="/"
                                prefetch
                            >
                                <Logo
                                    className={brandUiSkin.brand === 'betano' ? 'text-white' : undefined}
                                    variant="long"
                                />
                            </Link>
                        </div>

                        <DesktopMenu />
                    </div>
                )}

                {/* Right section */}
                <div className="flex items-center gap-1 md:gap-4">
                    {isDesktop && (
                        <Link
                            href="/sports/promotions"
                            prefetch
                            className="size-10 inline-flex items-center justify-center cursor-pointer group relative transition-transform duration-200 ease-out hover:scale-110"
                        >
                            <PresentsBox className="size-6 absolute transition-all duration-300 ease-out group-hover:scale-50 group-hover:opacity-0 animate-[gift-wobble_5s_ease-in-out_infinite]" />
                            <PresentsBoxOpened className="size-8 absolute transition-all duration-300 ease-out scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100" />
                        </Link>
                    )}

                    {isLoginReady && (isLogin ? <Logined /> : isDesktop ? <Signin /> : <MobileGuestActions />)}
                </div>
            </div>
        </>
    );
};
