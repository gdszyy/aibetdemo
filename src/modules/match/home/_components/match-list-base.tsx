'use client';

import { keepPreviousData, type QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type FC, type FunctionComponent, type ReactNode, useMemo } from 'react';
import type { MatchListPageResponse } from '@/api/models/match-game';
import { BlockTitle2 } from '@/components/block-title-2';
import { Empty } from '@/components/empty';
import { Loading } from '@/components/loading/loading';
import { StickyBlurHeader } from '@/components/sticky-blur-header';
import { useGameSubscription } from '@/hooks/use-game-subscription';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useIsDesktop } from '@/hooks/use-media-query';
import {
    filterTournamentGroupsByMarketRowCounts,
    mergeTournamentGroupPages,
    TournamentGroupsVirtualList,
} from '@/modules/match/_components/tournament-groups-virtual-list';
import { useMatchListObserver } from '@/modules/match/_hooks/use-match-list-observer';
import { useMatchRowCounts } from '@/modules/match/_hooks/use-match-row-count';
import { getSelectedSportIdFromParams, getSportIdForMatchQuery } from '@/modules/match/_utils/filter-utils';
import { createMockTournamentGroups } from '@/modules/match/_utils/mock-match-data';

interface MatchListBaseProps {
    title: string;
    icon: FunctionComponent<{ className?: string }>;
    queryKeyPrefix: string;
    fetchFn: (params: { sportId?: string; cursor?: string }) => Promise<MatchListPageResponse>;
    getQuerySportId?: (selectedSportId: string) => string | undefined;
    /** Slot for filter component (e.g. sport pills carousel) */
    filters?: ReactNode;
    /** Slot rendered on the title row's right side */
    titleRight?: ReactNode;
    /** sports-live：market count 为 0 时不渲染卡片 */
    hideZeroMarketCount?: boolean;
}

const EVENT_ID_SEPARATOR = '\n';
const FIRST_PAGE_CURSOR = '';
const EMPTY_EVENT_IDS: string[] = [];

const defaultGetQuerySportId = (selectedSportId: string) => getSportIdForMatchQuery(selectedSportId);

const hasMorePages = (pages: MatchListPageResponse[] | undefined): boolean => !!pages?.some((page) => page.next_cursor);

/**
 * MatchListBase - Generic dashboard for matches
 * Integrates API fetching, responsive market columns, and collapse management
 */
export const MatchListBase: FC<MatchListBaseProps> = ({
    title,
    icon,
    queryKeyPrefix,
    fetchFn,
    getQuerySportId = defaultGetQuerySportId,
    filters,
    titleRight,
    hideZeroMarketCount = false,
}) => {
    const t = useTranslations('matches');
    const isDesktop = useIsDesktop();
    const searchParams = useSearchParams();
    const selectedSportId = getSelectedSportIdFromParams(searchParams);
    const querySportId = getQuerySportId(selectedSportId);

    const queryKey = useMemo<QueryKey>(
        () => [queryKeyPrefix, selectedSportId, querySportId],
        [queryKeyPrefix, selectedSportId, querySportId],
    );

    // Fetch Matches Data
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isPlaceholderData } = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => fetchFn({ sportId: querySportId, cursor: pageParam || undefined }),
        initialPageParam: FIRST_PAGE_CURSOR,
        getNextPageParam: (lastPage) => lastPage.next_cursor || undefined,
        enabled: !!selectedSportId,
        placeholderData: keepPreviousData,
    });
    const rawTournamentGroups = useMemo(() => mergeTournamentGroupPages(data?.pages), [data?.pages]);
    const canShowPaginationStatus = !isPlaceholderData && (hasMorePages(data?.pages) || isFetchingNextPage);
    const { sentinelRef } = useInfiniteScroll({
        hasNextPage: isPlaceholderData ? false : hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    const rawEventIdsKey = useMemo(
        () =>
            rawTournamentGroups
                .flatMap((group) => group.events.map((event) => event.event_id))
                .join(EVENT_ID_SEPARATOR),
        [rawTournamentGroups],
    );
    const rawEventIds = useMemo(
        () => (rawEventIdsKey ? rawEventIdsKey.split(EVENT_ID_SEPARATOR) : []),
        [rawEventIdsKey],
    );
    const activeRawEventIds = isPlaceholderData ? EMPTY_EVENT_IDS : rawEventIds;
    const rowCountMap = useMatchRowCounts(activeRawEventIds, !isPlaceholderData);
    const tournamentGroups = useMemo(
        () =>
            hideZeroMarketCount
                ? filterTournamentGroupsByMarketRowCounts(rawTournamentGroups, rowCountMap)
                : rawTournamentGroups,
        [hideZeroMarketCount, rawTournamentGroups, rowCountMap],
    );
    const mockTournamentGroups = useMemo(
        () => createMockTournamentGroups(hideZeroMarketCount ? 'live' : 'upcoming', querySportId || selectedSportId),
        [hideZeroMarketCount, querySportId, selectedSportId],
    );
    const shouldShowMock = !isLoading && !isPlaceholderData && tournamentGroups.length === 0;
    const displayTournamentGroups = shouldShowMock ? mockTournamentGroups : tournamentGroups;

    // Subscribe to visible events in the list
    const eventIdsKey = useMemo(
        () => tournamentGroups.flatMap((group) => group.events.map((event) => event.event_id)).join(EVENT_ID_SEPARATOR),
        [tournamentGroups],
    );
    const activeEventIds = useMemo(
        () => (eventIdsKey && !isPlaceholderData ? eventIdsKey.split(EVENT_ID_SEPARATOR) : []),
        [eventIdsKey, isPlaceholderData],
    );
    useGameSubscription(activeEventIds);
    useMatchListObserver({ eventIds: activeEventIds, queryKey });

    return (
        <div
            data-match-list-root
            className="scroll-mt-2 md:scroll-mt-[calc(var(--desktop-nav-height)+var(--header-strip-height)+16px)]"
        >
            {/* Title - Not Sticky */}
            <BlockTitle2 icon={icon} iconClassName="text-brand-primary-0" title={title} right={titleRight} />

            {/* Operation - Sticky */}

            <StickyBlurHeader
                className="transition-[padding] duration-200 pt-4 pb-4"
                innerClassName={`${isDesktop ? 'px-4' : 'px-2'} flex flex-col transition-[gap] duration-200 gap-y-5`}
            >
                {/* Operations Bar */}
                <div className="flex flex-row items-center w-full gap-x-4">
                    <div className="flex-1 min-w-0">{filters}</div>
                </div>
            </StickyBlurHeader>

            {/* Content Area */}
            <div>
                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-filltext-ft-b animate-pulse rounded-md" />
                        ))}
                    </div>
                ) : displayTournamentGroups.length > 0 ? (
                    <>
                        <TournamentGroupsVirtualList
                            tournamentGroups={displayTournamentGroups}
                            fallbackSportId={querySportId || selectedSportId}
                            hideZeroMarketCount={hideZeroMarketCount}
                            isMock={shouldShowMock}
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
                ) : (
                    <Empty showBackButton={false} />
                )}
            </div>
        </div>
    );
};
