'use client';

import type { FC } from 'react';
import { useEffect, useMemo } from 'react';
import type { TournamentGroup } from '@/api/models/match-game';
import { Card } from '@/modules/match/_components/card';
import { getMarketColumnWidth } from '@/modules/match/_constants/constants';
import { getVisibleMarketsLayout } from '@/modules/match/_hooks/use-visible-markets';
import { shouldShowMatchInList } from '@/modules/match/_utils/match-utils';
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

    if (visibleEvents.length === 0) return null;

    return (
        <div className="flex w-full flex-col gap-3 overflow-clip rounded-sm md:gap-5">
            <TournamentGroupHeader
                tournamentId={tournamentGroup.tournament_id}
                tournamentName={tournamentGroup.tournament_name}
                subtitle={tournamentGroup.category_name}
                isCurrentTournament={currentTournamentId === tournamentGroup.tournament_id}
            />
            <CollapsePanel open={isExpanded} className="flex w-full flex-col gap-3 pb-3">
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
                        maxVisibleMarkets={maxVisibleMarkets ?? fallbackLayout.maxVisibleMarkets}
                        isMobileLayout={isMobileLayout ?? fallbackLayout.isMobileLayout}
                        columnMarkets={tournamentGroup.market_columns}
                        marketColumnWidths={marketColumnWidths}
                    />
                ))}
            </CollapsePanel>
        </div>
    );
};
