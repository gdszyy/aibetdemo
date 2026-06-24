'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type FC, memo, useEffect, useMemo, useState } from 'react';
import { GetCasinoGameLobbiesV2Interface } from '@/api/handlers/casino';
import { CasinoOutlined } from '@/components/icons2/CasinoOutlined';
import { HomeOutlined } from '@/components/icons2/HomeOutlined';
import { Live2Outlined } from '@/components/icons2/Live2Outlined';
import { SlipOutlined } from '@/components/icons2/SlipOutlined';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { useLiveMatchTotalData } from '@/hooks/use-live-match-total';
import { recordNavIntent, useResolvedNavLocation } from '@/hooks/use-nav-intent';
import { Link } from '@/i18n';
import { checkIsCasinoActive, checkIsSportsActive, checkIsSportsLiveActive } from '@/libs/navigation';
import { SelectionBadge } from '@/modules/bet-slip/slip/selection-badge';
import { useSelectionCount } from '@/modules/bet-slip/stores/bet-slip-store';
import { cn } from '@/utils/common';
import { getCasinoNavItem } from '../_constants/nav-menus';

interface TabDef {
    key: string;
    label: string;
    icon: FC<{ className?: string }>;
    href?: string;
    onClick?: () => void;
    isActive: (path: string) => boolean;
    hidden?: boolean;
    badge?: number;
}

const checkIsTransmisionActive = (path: string) => path.startsWith('/sports/transmision');
const checkIsMyBetsActive = (path: string) => path.startsWith('/sports/my-bets');
const checkIsSportsHomeTabActive = (path: string) =>
    checkIsSportsActive(path) && !checkIsTransmisionActive(path) && !checkIsMyBetsActive(path);

/** Memoized individual tab — only re-renders when its own props change */
const TabItem = memo<{
    tab: TabDef;
    active: boolean;
    badge?: number;
}>(({ tab, active, badge }) => {
    const Icon = tab.icon;
    const isBetSlipTab = tab.key === 'betslip';

    const content = (
        <div
            className="flex h-full w-14.5 flex-col items-center justify-center gap-0.5"
            data-energy-ball-target={isBetSlipTab ? 'mobile-betslip-tab' : undefined}
        >
            <div className="relative inline-flex items-center justify-center">
                <span
                    className={cn(
                        'flex size-8 items-center justify-center rounded transition-colors',
                        active
                            ? 'bg-[var(--mobile-nav-active-icon-bg)] text-[var(--mobile-nav-active-icon)]'
                            : 'bg-transparent text-[var(--mobile-nav-icon)]',
                    )}
                >
                    <Icon className="size-5" />
                </span>
                {badge !== undefined && badge > 0 && (
                    <span
                        data-energy-ball-target={isBetSlipTab ? 'mobile-betslip-badge' : undefined}
                        className="absolute -top-1 -right-2"
                    >
                        <SelectionBadge
                            count={badge}
                            className="rounded-full border border-surface-shell bg-accent-warm text-surface-shell"
                        />
                    </span>
                )}
            </div>
            <span
                className={cn(
                    'text-auxiliary-xxs transition-colors',
                    active ? 'font-bold text-[var(--mobile-nav-active-text)]' : 'text-[var(--mobile-nav-text)]',
                )}
            >
                {tab.label}
            </span>
        </div>
    );

    if (tab.onClick) {
        return (
            <button
                type="button"
                onClick={tab.onClick}
                className="flex h-full flex-1 cursor-pointer items-center justify-center transition-[opacity,transform] active:scale-95 active:[opacity:var(--mobile-touch-active-opacity)]"
            >
                {content}
            </button>
        );
    }

    return (
        <Link
            href={tab.href || '#'}
            prefetch
            onClick={() => tab.href && recordNavIntent(tab.href)}
            className="flex h-full flex-1 items-center justify-center transition-[opacity,transform] active:scale-95 active:[opacity:var(--mobile-touch-active-opacity)]"
        >
            {content}
        </Link>
    );
});

export const BottomTabBar: FC = () => {
    const t = useTranslations('common');
    const componentProfile = useThemeComponentProfile();
    const selectionCount = useSelectionCount();
    // Optimistic location: lets the tapped tab light up before the route commits.
    const { path: activePath } = useResolvedNavLocation();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: lobbiesData = [] } = useQuery({
        queryKey: ['casino', 'lobbies'],
        queryFn: GetCasinoGameLobbiesV2Interface,
        placeholderData: [],
    });

    // Prevent hydration mismatch by using an empty array on the first render (which matches the server),
    // and then using the actual fetched lobbies data after the component has mounted on the client.
    const lobbies = isMounted ? lobbiesData : [];

    const casinoNav = useMemo(() => getCasinoNavItem(lobbies), [lobbies]);

    // live matches count
    const { data: liveCount = 0 } = useLiveMatchTotalData();

    // Tabs definition — selectionCount excluded, badge rendered separately per-tab
    const tabs = useMemo((): TabDef[] => {
        const res: TabDef[] = [
            {
                key: 'home',
                label: t('mainMenu.home'),
                icon: HomeOutlined,
                href: '/sports',
                isActive: checkIsSportsHomeTabActive,
            },
            {
                key: 'live',
                label: t('mainMenu.live'),
                icon: Live2Outlined,
                href: '/sports-live',
                isActive: (path: string) => checkIsSportsLiveActive(path),
                badge: liveCount,
            },
            {
                key: 'transmision',
                label: t('mainMenu.transmision'),
                icon: Live2Outlined,
                href: '/sports/transmision',
                isActive: checkIsTransmisionActive,
            },
            {
                key: 'mybets',
                label: t('mainMenu.myBets'),
                icon: SlipOutlined,
                href: '/sports/my-bets',
                isActive: checkIsMyBetsActive,
            },
            {
                key: casinoNav.key,
                label: casinoNav.labelKey ? t(casinoNav.labelKey) : '',
                icon: CasinoOutlined,
                href: casinoNav.link,
                isActive: casinoNav.isActive ?? checkIsCasinoActive,
                hidden: lobbies.length === 0,
            },
        ].filter((tab) => !tab.hidden);
        return res;
    }, [t, casinoNav, liveCount, lobbies.length]);

    if (componentProfile.betSlip.mobilePlacement === 'cta-drawer' && selectionCount > 0) {
        return null;
    }

    return (
        <div
            className="fixed right-0 bottom-0 left-0 z-50 border-t border-[color:var(--mobile-nav-border)] bg-[var(--mobile-nav-bg)] pb-[var(--bottom-bar-safe-padding)] shadow-floating backdrop-blur-[12px]"
            data-nav-profile={componentProfile.nav.profile}
            data-mobile-bet-flow={componentProfile.betSlip.mobileFlow}
            style={componentProfile.style}
        >
            <div className="flex h-[var(--bottom-bar-height)] items-center justify-around px-3">
                {tabs.map((tab) => (
                    <TabItem key={tab.key} tab={tab} active={tab.isActive(activePath)} badge={tab.badge || undefined} />
                ))}
            </div>
        </div>
    );
};
