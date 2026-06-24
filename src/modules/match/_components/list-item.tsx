'use client';

import type { FC } from 'react';
import { useEffect, useMemo } from 'react';
import type { TournamentGroup } from '@/api/models/match-game';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { Card } from '@/modules/match/_components/card';
import { getMarketColumnWidth } from '@/modules/match/_constants/constants';
import { getVisibleMarketsLayout } from '@/modules/match/_hooks/use-visible-markets';
import { shouldShowMatchInList } from '@/modules/match/_utils/match-utils';
import { cn } from '@/utils/common';
import { useForceCollapse } from '../_hooks/use-force-collapse';
import { CollapsePanel } from './collapse-panel';
import { TournamentGroupHeader } from './tournament-group-header';

interface ListItemProps {
    /** Tournament group data from API */
    tournamentGroup: TournamentGroup;
    /** Current sport ID for icon mapping */
    sportId: string;
    /** Parent's sync'd collapse state */
    forceCollapsed?: boolean;
    /** Item ID for tracking */
    itemId?: number;
    /** Callback when collapse state changes locally */
    onCollapseChange?: (itemId: number, collapsed: boolean) => void;
    /** Parent list container width */
    containerWidth?: number;
    /** Number of market columns visible in match cards */
    maxVisibleMarkets?: number;
    /** Whether cards should render in compact vertical layout */
    isMobileLayout?: boolean;
    /** Current league route tournament ID; used to hide self-link affordance */
    currentTournamentId?: string;
}

/**
 * ListItem - Renders a Tournament Group with header and match cards
 */
export const ListItem: FC<ListItemProps> = ({
    sportId,
    tournamentGroup,
    forceCollapsed = false,
    itemId,
    onCollapseChange,
    containerWidth,
    maxVisibleMarkets,
    isMobileLayout,
    currentTournamentId,
}) => {
    const [isExpanded] = useForceCollapse(forceCollapsed);
    const componentProfile = useThemeComponentProfile();

    // Notify parent when collapse state changes
    useEffect(() => {
        if (itemId !== undefined && onCollapseChange) {
            onCollapseChange(itemId, !isExpanded);
        }
    }, [isExpanded, itemId, onCollapseChange]);

    const visibleEvents = useMemo(() => tournamentGroup.events.filter(shouldShowMatchInList), [tournamentGroup.events]);
    const marketColumnWidths = useMemo(() => {
        return tournamentGroup.market_columns.map((columnMarket) => {
            return getMarketColumnWidth({
                outcomeCount: columnMarket.outcome_count ?? 3,
            });
        });
    }, [tournamentGroup.market_columns]);

    const fallbackLayout = useMemo(
        () => getVisibleMarketsLayout(containerWidth, marketColumnWidths),
        [containerWidth, marketColumnWidths],
    );
    const resolvedIsMobileLayout = isMobileLayout ?? fallbackLayout.isMobileLayout;
    const resolvedMaxVisibleMarkets = maxVisibleMarkets ?? fallbackLayout.maxVisibleMarkets;
    const usesCompactBoardSpacing = componentProfile.matchCard.listLayout === 'board';
    const usesBetanoDesktopRows =
        componentProfile.matchCard.desktopListLayout === 'betano-table-row' && !resolvedIsMobileLayout;
    const usesBetanoMobileCards =
        componentProfile.matchCard.mobileListLayout === 'betano-ticket-card' && resolvedIsMobileLayout;

    if (visibleEvents.length === 0) return null;

    return (
        <div
            className={cn(
                'flex w-full flex-col overflow-clip rounded-sm',
                usesBetanoDesktopRows
                    ? 'gap-2 md:gap-2'
                    : usesBetanoMobileCards
                      ? 'gap-2.5'
                      : usesCompactBoardSpacing
                        ? 'gap-2.5 md:gap-4'
                        : 'gap-3 md:gap-5',
            )}
            data-match-card-layout={componentProfile.matchCard.listLayout}
        >
            <TournamentGroupHeader
                tournamentId={tournamentGroup.tournament_id}
                tournamentName={tournamentGroup.tournament_name}
                subtitle={tournamentGroup.category_name}
                isCurrentTournament={currentTournamentId === tournamentGroup.tournament_id}
                variant={usesBetanoDesktopRows ? 'betano-table' : 'default'}
            />
            <CollapsePanel
                open={isExpanded}
                className={cn(
                    'flex w-full flex-col pb-3',
                    usesBetanoDesktopRows
                        ? 'gap-0 [&>article+article]:rounded-t-none [&>article+article]:border-t-0 [&>article:not(:last-child)]:rounded-b-none'
                        : usesBetanoMobileCards
                          ? 'gap-2'
                          : usesCompactBoardSpacing
                            ? 'gap-2.5'
                            : 'gap-3',
                )}
            >
                {visibleEvents.map((event) => (
                    <Card
                        key={event.event_id}
                        match={event}
                        sportId={sportId}
                        sportName={tournamentGroup.sport_name}
                        categoryName={tournamentGroup.category_name}
                        categoryId={tournamentGroup.category_id}
                        tournamentId={tournamentGroup.tournament_id}
                        tournamentName={tournamentGroup.tournament_name}
                        tournamentLogo={tournamentGroup.tournament_logo}
                        maxVisibleMarkets={resolvedMaxVisibleMarkets}
                        isMobileLayout={resolvedIsMobileLayout}
                        columnMarkets={tournamentGroup.market_columns}
                        marketColumnWidths={marketColumnWidths}
                    />
                ))}
            </CollapsePanel>
        </div>
    );
};
