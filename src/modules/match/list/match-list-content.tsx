'use client';

import { type QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { SearchMatchesInterface } from '@/api/handlers/matches';
import type { MatchListPageResponse } from '@/api/models/match-game';
import { Empty } from '@/components/empty';
import { Loading } from '@/components/loading/loading';
import { useGameSubscription } from '@/hooks/use-game-subscription';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { WORLD_CUP_LEAGUE_ID } from '@/modules/marketing/promotion/world-cup-league/constants';
import {
    mergeTournamentGroupPages,
    TournamentGroupsVirtualList,
} from '@/modules/match/_components/tournament-groups-virtual-list';
import { useMatchListObserver } from '@/modules/match/_hooks/use-match-list-observer';
import { usePrefetchMatchRowCounts } from '@/modules/match/_hooks/use-match-row-count';
import { createMockTournamentGroups } from '@/modules/match/_utils/mock-match-data';
import { WorldCupGroupHeader } from '../_components/world-cup-group-header';
import { useCollapseContext } from './collapse-context';

interface MatchListContentProps {
    sportId?: string;
    tournamentId?: string;
}

const EVENT_ID_SEPARATOR = '\n';
const FIRST_PAGE_CURSOR = '';

const hasMorePages = (pages: MatchListPageResponse[] | undefined): boolean => !!pages?.some((page) => page.next_cursor);

/**
 * Content area for MatchList (excludes Breadcrumb / Tabs shell).
 * Reads isCollapsed / setIsCollapsed from CollapseContext.
 * Used for rendering within TournamentShell on leagues pages.
 */
export const MatchListContent: FC<MatchListContentProps> = ({ sportId, tournamentId }) => {
    const t = useTranslations('matches');
    const searchParams = useSearchParams();
    const collapseCtx = useCollapseContext();
    const isCollapsed = collapseCtx?.isCollapsed ?? false;
    // 是否是世界杯
    const isWorldCup = WORLD_CUP_LEAGUE_ID === tournamentId;

    // Derive API params from URL searchParams
    const apiParams = useMemo(() => {
        const p: { status?: number; from?: number; to?: number } = {};
        const statusParam = searchParams.get('status');
        if (statusParam) p.status = Number(statusParam);
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        if (from && to) {
            p.from = Number(from);
            p.to = Number(to);
        }
        return p;
    }, [searchParams]);

    const queryKey = useMemo<QueryKey>(
        () => ['matches-list', sportId, tournamentId, apiParams],
        [sportId, tournamentId, apiParams],
    );

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) =>
            SearchMatchesInterface({
                ...apiParams,
                sport_id: sportId,
                tournament_id: tournamentId,
                cursor: pageParam || undefined,
            }),
        initialPageParam: FIRST_PAGE_CURSOR,
        getNextPageParam: (lastPage) => lastPage.next_cursor || undefined,
        enabled: !!sportId || !!tournamentId,
    });

    const tournamentGroups = useMemo(() => mergeTournamentGroupPages(data?.pages), [data?.pages]);
    const mockTournamentGroups = useMemo(() => createMockTournamentGroups('upcoming', sportId), [sportId]);
    const shouldShowMock = !isLoading && tournamentGroups.length === 0;
    const displayTournamentGroups = shouldShowMock ? mockTournamentGroups : tournamentGroups;
    const canShowPaginationStatus = hasMorePages(data?.pages) || isFetchingNextPage;
    const { sentinelRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

    // Subscribe to all matches in the list
    const eventIdsKey = useMemo(
        () => tournamentGroups.flatMap((group) => group.events.map((event) => event.event_id)).join(EVENT_ID_SEPARATOR),
        [tournamentGroups],
    );
    const eventIds = useMemo(() => (eventIdsKey ? eventIdsKey.split(EVENT_ID_SEPARATOR) : []), [eventIdsKey]);
    usePrefetchMatchRowCounts(eventIds);
    useGameSubscription(eventIds);
    useMatchListObserver({ eventIds, queryKey });

    return (
        <div>
            <AnimatePresence initial={false}>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                    className="w-full"
                >
                    {isLoading ? (
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-40 bg-filltext-ft-b animate-pulse rounded-md" />
                            ))}
                        </div>
                    ) : displayTournamentGroups.length === 0 ? (
                        <div className="flex items-center justify-center">
                            <Empty />
                        </div>
                    ) : (
                        <>
                            {isWorldCup && <WorldCupGroupHeader />}

                            <TournamentGroupsVirtualList
                                tournamentGroups={displayTournamentGroups}
                                fallbackSportId={sportId}
                                currentTournamentId={tournamentId}
                                isCollapsed={isCollapsed}
                                isMock={shouldShowMock}
                                showHeader={!isWorldCup}
                            />

                            {canShowPaginationStatus && (
                                <div ref={sentinelRef} className="flex min-h-10 items-center justify-center py-2">
                                    {isFetchingNextPage ? (
                                        <Loading className="size-5" variant="color-red" />
                                    ) : hasNextPage ? null : (
                                        <div className="text-center text-body-sm text-filltext-ft-e">
                                            {t('noMoreMatches')}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
