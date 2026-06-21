'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { SidebarGroup, SidebarItem, SidebarShell } from '@/components/sidebar';
import { usePathname } from '@/i18n';
import { WorldCupSidebarBanner } from '@/modules/marketing/promotion/world-cup-league/leagues-banner/components/WorldCupBanner';
import { useUIStore } from '@/stores/ui-store';
import { CASINO_SIDEBAR_ITEMS } from '../_constants/sidebar-categories';

export const CasinoSidebar: FC<{
    collapsed?: boolean;
    hideHeader?: boolean;
    className?: string;
}> = ({ collapsed = false, hideHeader = false, className }) => {
    const t = useTranslations('casino');
    const pathname = usePathname();
    const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed);

    // Split items into ungrouped (top) and grouped sections
    const topItems = CASINO_SIDEBAR_ITEMS.filter((item) => !item.group);
    const groups = CASINO_SIDEBAR_ITEMS.reduce(
        (acc, item) => {
            if (!item.group) return acc;
            if (!acc[item.group]) acc[item.group] = [];
            acc[item.group].push(item);
            return acc;
        },
        {} as Record<string, typeof CASINO_SIDEBAR_ITEMS>,
    );

    return (
        <SidebarShell
            collapsed={collapsed}
            onCollapsedChange={setSidebarCollapsed}
            hideHeader={hideHeader}
            className={className}
        >
            {/* Fixed nav */}
            <SidebarGroup>
                {/* 世界杯 banner */}
                <WorldCupSidebarBanner collapsed={collapsed} />
                {topItems.map((item) => (
                    <SidebarItem
                        key={item.key}
                        icon={item.icon}
                        label={t(item.labelKey)}
                        href={item.link}
                        isActive={pathname === item.link || pathname.startsWith(`${item.link}/`)}
                        comingSoon={item.comingSoon}
                    />
                ))}
            </SidebarGroup>

            {/* Grouped sections */}
            {false &&
                Object.entries(groups).map(([groupName, items]) => (
                    <SidebarGroup key={groupName} title={groupName}>
                        {items.map((item) => (
                            <SidebarItem
                                key={item.key}
                                icon={item.icon}
                                label={t(item.labelKey)}
                                href={item.link}
                                isActive={pathname === item.link || pathname.startsWith(`${item.link}/`)}
                                comingSoon={item.comingSoon}
                            />
                        ))}
                    </SidebarGroup>
                ))}
        </SidebarShell>
    );
};
