'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GetBreadcrumbInterface } from '@/api/handlers/matches';
import { FavoriteOutlined } from '@/components/icons2/FavoriteOutlined';
import { HomeOutlined } from '@/components/icons2/HomeOutlined';
import { PromotionOutlined } from '@/components/icons2/PromotionOutlined';
import { VipOutlined } from '@/components/icons2/VipOutlined';
import { SidebarGroup, SidebarItem, SidebarLine, SidebarShell } from '@/components/sidebar';
import { config } from '@/constants/config';
import { useTopSports } from '@/hooks/use-sports';
import { usePathname } from '@/i18n';
import { SidebarAdPlacementItems } from '@/modules/ad-placement';
import { WorldCupSidebarBanner } from '@/modules/marketing/promotion/world-cup-league/leagues-banner/components/WorldCupBanner';
import { useUIStore } from '@/stores/ui-store';
import type { SportNode, TournamentNode } from './service/node';
import { SportNode as SportNodeClass } from './service/node';
import { useTreeStore } from './service/store';
import { SportItem } from './sport-item';

interface SidebarProps {
    className?: string;
    collapsed?: boolean;
    hideHeader?: boolean;
}

const SIDEBAR_MENUS = [
    {
        key: 'lobby',
        label: 'sidebar.lobby',
        icon: HomeOutlined,
        activeIcon: HomeOutlined,
        link: '/sports',
        comingSoon: false,
        exactMatch: true,
    },
    {
        key: 'promotions',
        label: 'sidebar.promotions',
        icon: PromotionOutlined,
        activeIcon: PromotionOutlined,
        link: '/sports/promotions',
        comingSoon: false,
    },
    {
        key: 'vip',
        label: 'sidebar.vip',
        icon: VipOutlined,
        activeIcon: VipOutlined,
        link: '/sports/vip',
        comingSoon: !config.showVipMenu,
    },
    {
        key: 'favorite',
        label: 'sidebar.favorite',
        icon: FavoriteOutlined,
        activeIcon: FavoriteOutlined,
        link: null,
        comingSoon: true,
    },
] as const;

/** 从 top 接口数据构建 SportNode，优先复用 tree store 中已加载的子树 */
const buildTopSportNodes = (topSports: { sport_id: string; name: string }[], treeNodes: SportNode[]): SportNode[] => {
    return topSports.map(({ sport_id, name }) => {
        const existingNode = treeNodes.find((node) => node.sport_id === sport_id);
        if (existingNode) {
            return existingNode;
        }

        const sportNode = new SportNodeClass(sport_id);
        sportNode.name = name;
        sportNode.id = sport_id;
        return sportNode;
    });
};

export const Sidebar: FC<SidebarProps> = ({ className, collapsed, hideHeader = false }) => {
    const t = useTranslations('common');
    const pathname = usePathname();

    const topSports = useTopSports();

    const root = useTreeStore((state) => state.root);
    const setActiveSportId = useTreeStore((state) => state.setActiveSportId);
    const setActiveTournamentId = useTreeStore((state) => state.setActiveTournamentId);
    const activeSportId = useTreeStore((state) => state.activeSportId);
    const activeTournamentId = useTreeStore((state) => state.activeTournamentId);

    const routeParams = useParams<{ tournament_id?: string; sport_id?: string; match_id?: string }>();
    useEffect(() => {
        let cancelled = false;

        if (routeParams.sport_id) {
            setActiveSportId(decodeURIComponent(routeParams.sport_id));
            setActiveTournamentId(null);
            return () => {
                cancelled = true;
            };
        }

        if (routeParams.tournament_id) {
            const tournamentId = decodeURIComponent(routeParams.tournament_id);
            setActiveTournamentId(tournamentId);
            const nodes = root.findLeafNodes(tournamentId);
            if (nodes.length > 0) {
                setActiveSportId((nodes[0] as TournamentNode).sport_id);
                return;
            }
            GetBreadcrumbInterface({ tournament_id: tournamentId })
                .then((bc) => {
                    if (cancelled) {
                        return;
                    }
                    if (bc.sport_id) {
                        setActiveSportId(bc.sport_id);
                    }
                })
                .catch((error) => {
                    if (config.isDev) {
                        console.debug('[Sidebar] Failed to fetch tournament breadcrumb', { tournamentId, error });
                    }
                });
            return () => {
                cancelled = true;
            };
        }

        if (routeParams.match_id) {
            const matchId = decodeURIComponent(routeParams.match_id);
            GetBreadcrumbInterface({ event_id: matchId })
                .then((bc) => {
                    if (cancelled) {
                        return;
                    }
                    if (bc.sport_id) {
                        setActiveSportId(bc.sport_id);
                    }
                    if (bc.tournament_id) {
                        setActiveTournamentId(bc.tournament_id);
                    }
                })
                .catch((error) => {
                    if (config.isDev) {
                        console.debug('[Sidebar] Failed to fetch match breadcrumb', { matchId, error });
                    }
                });
            return () => {
                cancelled = true;
            };
        }

        setActiveSportId(null);
        setActiveTournamentId(null);
        return () => {
            cancelled = true;
        };
    }, [
        routeParams.tournament_id,
        routeParams.sport_id,
        routeParams.match_id,
        root,
        setActiveSportId,
        setActiveTournamentId,
    ]);

    const topSportNodes = useMemo(() => buildTopSportNodes(topSports, root.children), [topSports, root.children]);

    const routeSportId = routeParams.sport_id ? decodeURIComponent(routeParams.sport_id) : null;

    const [openedKey, setOpenedKey] = useState<string | null>(null);

    const handleToggle = useCallback((key: string) => {
        setOpenedKey((prev) => (prev === key ? null : key));
    }, []);

    const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed);
    const hasActiveTournamentInSport = useCallback(
        (sportNode: SportNode) => {
            if (!activeTournamentId) {
                return false;
            }

            return (
                sportNode.tournamentList.some(
                    (tournamentNode) => tournamentNode.tournament_id === activeTournamentId,
                ) ||
                sportNode.categoryList.some((categoryNode) =>
                    categoryNode.children.some((tournamentNode) => tournamentNode.tournament_id === activeTournamentId),
                )
            );
        },
        [activeTournamentId],
    );

    return (
        <SidebarShell
            collapsed={collapsed}
            onCollapsedChange={setSidebarCollapsed}
            hideHeader={hideHeader}
            className={className}
        >
            <SidebarGroup>
                <WorldCupSidebarBanner collapsed={collapsed} />
                {SIDEBAR_MENUS.map((menu) => (
                    <SidebarItem
                        key={menu.key}
                        icon={menu.icon}
                        activeIcon={menu.activeIcon}
                        label={t(menu.label)}
                        href={menu.link ?? '#'}
                        isActive={
                            !!menu.link &&
                            (pathname === menu.link ||
                                (!('exactMatch' in menu && menu.exactMatch) && pathname.startsWith(`${menu.link}/`)))
                        }
                        comingSoon={menu.comingSoon}
                        comingSoonMessage={t('message.coming')}
                    />
                ))}
                <SidebarAdPlacementItems />
            </SidebarGroup>

            <SidebarLine />

            <SidebarGroup title={t('sidebar.topSports')} collapsedTitle={t('sidebar.top')}>
                <div className="flex flex-col gap-2">
                    {topSportNodes.map((sportNode) => {
                        const isOpen = openedKey === sportNode.key;
                        const hasActiveTournament = hasActiveTournamentInSport(sportNode);

                        return (
                            <SportItem
                                key={sportNode.key}
                                sportNode={sportNode}
                                isOpen={isOpen}
                                isActive={routeSportId === sportNode.sport_id}
                                isChildActive={
                                    (activeSportId === sportNode.sport_id && routeSportId !== sportNode.sport_id) ||
                                    (isOpen && hasActiveTournament)
                                }
                                onToggleOpen={() => handleToggle(sportNode.key)}
                            />
                        );
                    })}
                </div>
            </SidebarGroup>
        </SidebarShell>
    );
};
