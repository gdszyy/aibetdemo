'use client';

import { defaultRangeExtractor, type Range, useWindowVirtualizer } from '@tanstack/react-virtual';
import { useSize } from 'ahooks';
import { type FC, Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { MatchListPageResponse, TournamentGroup } from '@/api/models/match-game';
import { useIsDesktop } from '@/hooks/use-media-query';
import { Card } from '@/modules/match/_components/card';
import { TournamentGroupHeader } from '@/modules/match/_components/tournament-group-header';
import { getMarketColumnWidth } from '@/modules/match/_constants/constants';
import type { MatchRowCountMap } from '@/modules/match/_hooks/use-match-row-count';
import { getVisibleMarketsLayout } from '@/modules/match/_hooks/use-visible-markets';
import { shouldShowMatchInList } from '@/modules/match/_utils/match-utils';

interface GroupMarketLayout {
    maxVisibleMarkets: number;
    isMobileLayout: boolean;
}

type MatchListRow =
    | {
          type: 'header';
          key: string;
          groupIndex: number;
          group: TournamentGroup;
      }
    | {
          type: 'match';
          key: string;
          groupIndex: number;
          eventIndex: number;
          group: TournamentGroup;
      };

interface TournamentGroupsVirtualListProps {
    tournamentGroups: TournamentGroup[];
    fallbackSportId?: string;
    currentTournamentId?: string;
    isCollapsed?: boolean;
    /** sports-live：market count 为 0 时不渲染比赛卡片 */
    hideZeroMarketCount?: boolean;
    isMock?: boolean;
    showHeader?: boolean;
}

const DESKTOP_GROUP_GAP = 28;
const MOBILE_GROUP_GAP = 12;
const DESKTOP_GROUP_HEADER_HEIGHT = 42;
const MOBILE_GROUP_HEADER_HEIGHT = 20;
const DESKTOP_MATCH_CARD_HEIGHT = 118;
const MOBILE_MATCH_CARD_HEIGHT = 167;
const MOBILE_VIEWPORT_GROUP_CONTENT_GAP = 12;
const MD_LAYOUT_CONTAINER_MIN_WIDTH = 768;
const MATCH_CARD_GAP = 12;
const GROUP_BOTTOM_PADDING = 12;
const EVENT_ID_SEPARATOR = '\n';
const NO_MEASURE_FRAME = -1;
const VIRTUAL_OVERSCAN = 10;
const STICKY_FILTER_HEIGHT = 72;
const STICKY_LEAGUE_HEADER_TOP = `calc(72px + var(--header-strip-height) + ${STICKY_FILTER_HEIGHT}px)`;

export const getTournamentGroupIdentityKey = (group: TournamentGroup): string =>
    `${group.sport_id}-${group.tournament_id}`;

const shouldShowGroupEvent = (event: TournamentGroup['events'][number]): boolean => shouldShowMatchInList(event);

export const mergeTournamentGroupPages = (pages: MatchListPageResponse[] | undefined): TournamentGroup[] => {
    const allGroups = pages?.flatMap((page) => page.list) ?? [];
    const groupMap = new Map<string, TournamentGroup>();

    for (const group of allGroups) {
        const visibleEvents = group.events.filter(shouldShowGroupEvent);
        if (visibleEvents.length === 0) continue;

        const visibleGroup = visibleEvents.length === group.events.length ? group : { ...group, events: visibleEvents };
        const groupKey = getTournamentGroupIdentityKey(group);
        const existing = groupMap.get(groupKey);

        if (!existing) {
            groupMap.set(groupKey, visibleGroup);
            continue;
        }

        const existingEventIds = new Set(existing.events.map((event) => event.event_id));
        const newEvents = visibleGroup.events.filter((event) => !existingEventIds.has(event.event_id));

        if (newEvents.length > 0) {
            groupMap.set(groupKey, {
                ...existing,
                market_columns:
                    existing.market_columns.length > 0 ? existing.market_columns : visibleGroup.market_columns,
                events: [...existing.events, ...newEvents],
            });
        }
    }

    return Array.from(groupMap.values());
};

/**
 * 按 batch/count 结果过滤无盘口比赛。
 * undefined 表示接口尚未返回，此时保留比赛，避免用旧事件字段提前隐藏。
 */
export const filterTournamentGroupsByMarketRowCounts = (
    groups: TournamentGroup[],
    rowCountMap: MatchRowCountMap,
): TournamentGroup[] =>
    groups.flatMap((group) => {
        const events = group.events.filter((event) => {
            const rowCount = rowCountMap.get(event.event_id);

            return rowCount === undefined || rowCount > 0;
        });

        return events.length > 0 ? [{ ...group, events }] : [];
    });

const getElementDocumentTop = (element: HTMLElement | null): number =>
    element ? element.getBoundingClientRect().top + window.scrollY : 0;

const isGroupMobileLayout = (group: TournamentGroup | undefined, containerWidth: number | undefined): boolean => {
    if (!group || !containerWidth) return false;

    const marketColumnWidths = group.market_columns.map((columnMarket) =>
        getMarketColumnWidth({ outcomeCount: columnMarket.outcome_count ?? 3 }),
    );

    return getVisibleMarketsLayout(containerWidth, marketColumnWidths).isMobileLayout;
};

const getGroupMarketLayout = (
    group: TournamentGroup | undefined,
    containerWidth: number | undefined,
): GroupMarketLayout => {
    if (!group || !containerWidth) {
        return { maxVisibleMarkets: 0, isMobileLayout: false };
    }

    const marketColumnWidths = group.market_columns.map((columnMarket) =>
        getMarketColumnWidth({ outcomeCount: columnMarket.outcome_count ?? 3 }),
    );

    return getVisibleMarketsLayout(containerWidth, marketColumnWidths);
};

const getGroupLayoutKey = (
    group: TournamentGroup | undefined,
    containerWidth: number | undefined,
    usesDesktopGroupLayout: boolean,
): string => {
    const cardLayout = isGroupMobileLayout(group, containerWidth) ? 'mobile-card' : 'desktop-card';
    const viewportLayout = usesDesktopGroupLayout ? 'md-list' : 'base-list';

    return `${cardLayout}:${viewportLayout}`;
};

const getGroupEventIdsKey = (group: TournamentGroup): string =>
    group.events.map((event) => event.event_id).join(EVENT_ID_SEPARATOR);

const buildMatchListRows = (groups: TournamentGroup[], isCollapsed: boolean): MatchListRow[] =>
    groups.flatMap((group, groupIndex) => [
        {
            type: 'header' as const,
            key: `${getTournamentGroupIdentityKey(group)}:header`,
            groupIndex,
            group,
        },
        ...(isCollapsed
            ? []
            : group.events.map((event, eventIndex) => ({
                  type: 'match' as const,
                  key: `${getTournamentGroupIdentityKey(group)}:match:${event.event_id}`,
                  groupIndex,
                  eventIndex,
                  group,
              }))),
    ]);

const getMeasurementCacheKey = (
    groups: TournamentGroup[],
    containerWidth: number | undefined,
    isCollapsed: boolean,
    usesDesktopGroupLayout: boolean,
): string =>
    groups
        .map(
            (group) =>
                `${group.sport_id}-${group.tournament_id}-${getGroupLayoutKey(group, containerWidth, usesDesktopGroupLayout)}-${isCollapsed}-${getGroupEventIdsKey(group)}`,
        )
        .join(EVENT_ID_SEPARATOR);

const MatchCardRow: FC<{
    row: Extract<MatchListRow, { type: 'match' }>;
    sportId: string;
    maxVisibleMarkets: number;
    isMobileLayout: boolean;
    hideZeroMarketCount?: boolean;
    isMock?: boolean;
}> = ({ row, sportId, maxVisibleMarkets, isMobileLayout, hideZeroMarketCount, isMock }) => {
    const event = row.group.events[row.eventIndex];
    const marketColumnWidths = useMemo(
        () =>
            row.group.market_columns.map((columnMarket) =>
                getMarketColumnWidth({ outcomeCount: columnMarket.outcome_count ?? 3 }),
            ),
        [row.group.market_columns],
    );

    if (!event) return null;

    return (
        <Card
            match={event}
            sportId={sportId}
            sportName={row.group.sport_name}
            categoryName={row.group.category_name}
            categoryId={row.group.category_id}
            tournamentId={row.group.tournament_id}
            tournamentName={row.group.tournament_name}
            maxVisibleMarkets={maxVisibleMarkets}
            isMobileLayout={isMobileLayout}
            columnMarkets={row.group.market_columns}
            marketColumnWidths={marketColumnWidths}
            fetchRowCount={false}
            hideZeroMarketCount={hideZeroMarketCount}
            isMock={isMock}
        />
    );
};

export const TournamentGroupsVirtualList: FC<TournamentGroupsVirtualListProps> = ({
    tournamentGroups,
    fallbackSportId,
    currentTournamentId,
    isCollapsed = false,
    hideZeroMarketCount = false,
    isMock = false,
    showHeader = true,
}) => {
    const isDesktop = useIsDesktop();
    const containerRef = useRef<HTMLDivElement>(null);
    const containerSize = useSize(containerRef);
    const containerWidth = containerSize?.width;
    const listRef = useRef<HTMLDivElement>(null);
    const [listTop, setListTop] = useState(0);

    const estimatedContainerWidth = containerWidth ?? (isDesktop ? MD_LAYOUT_CONTAINER_MIN_WIDTH : 1);
    const usesDesktopGroupLayout = isDesktop;
    const viewportGroupGap = usesDesktopGroupLayout ? DESKTOP_GROUP_GAP : MOBILE_GROUP_GAP;
    const contentGap = MOBILE_VIEWPORT_GROUP_CONTENT_GAP;
    const virtualRows = useMemo(
        () => buildMatchListRows(tournamentGroups, isCollapsed),
        [isCollapsed, tournamentGroups],
    );
    const stickyHeaderIndexes = useMemo(
        () => virtualRows.flatMap((row, index) => (row.type === 'header' ? [index] : [])),
        [virtualRows],
    );
    const activeStickyIndexRef = useRef(0);
    const rangeExtractor = useCallback(
        (range: Range): number[] => {
            const activeHeaderIndex =
                [...stickyHeaderIndexes].reverse().find((headerIndex) => range.startIndex >= headerIndex) ?? 0;
            activeStickyIndexRef.current = activeHeaderIndex;

            return [...new Set([activeHeaderIndex, ...defaultRangeExtractor(range)])].sort((a, b) => a - b);
        },
        [stickyHeaderIndexes],
    );

    const virtualizer = useWindowVirtualizer<HTMLDivElement>({
        count: virtualRows.length,
        estimateSize: (index) => {
            const row = virtualRows[index];
            if (!row) return DESKTOP_MATCH_CARD_HEIGHT + MATCH_CARD_GAP;

            if (row.type === 'header') {
                if (showHeader === false) {
                    return 0;
                }
                const headerHeight = usesDesktopGroupLayout ? DESKTOP_GROUP_HEADER_HEIGHT : MOBILE_GROUP_HEADER_HEIGHT;
                if (!isCollapsed) return headerHeight + contentGap;

                const groupGap = row.groupIndex === tournamentGroups.length - 1 ? 0 : viewportGroupGap;
                return headerHeight + GROUP_BOTTOM_PADDING + groupGap;
            }

            const { isMobileLayout } = getGroupMarketLayout(row.group, estimatedContainerWidth);
            const cardHeight = isMobileLayout ? MOBILE_MATCH_CARD_HEIGHT : DESKTOP_MATCH_CARD_HEIGHT;
            const isLastEventInGroup = row.eventIndex === row.group.events.length - 1;
            const groupGap = row.groupIndex === tournamentGroups.length - 1 ? 0 : viewportGroupGap;
            const bottomSpace = isLastEventInGroup ? GROUP_BOTTOM_PADDING + groupGap : MATCH_CARD_GAP;

            return cardHeight + bottomSpace;
        },
        getItemKey: (index) => {
            const row = virtualRows[index];
            if (!row) return index;

            return row.key;
        },
        overscan: VIRTUAL_OVERSCAN,
        rangeExtractor,
        scrollMargin: listTop,
    });

    const measureCurrentLayout = useCallback(() => {
        const nextListTop = getElementDocumentTop(listRef.current);

        setListTop((currentListTop) => (currentListTop === nextListTop ? currentListTop : nextListTop));
    }, []);

    useLayoutEffect(() => {
        measureCurrentLayout();
    }, [measureCurrentLayout]);

    const measurementCacheKey = useMemo(
        () => getMeasurementCacheKey(tournamentGroups, estimatedContainerWidth, isCollapsed, usesDesktopGroupLayout),
        [estimatedContainerWidth, isCollapsed, tournamentGroups, usesDesktopGroupLayout],
    );

    useLayoutEffect(() => {
        if (!measurementCacheKey) return;
        virtualizer.measure();
    }, [measurementCacheKey, virtualizer]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationFrameId = NO_MEASURE_FRAME;

        const measureList = () => {
            animationFrameId = NO_MEASURE_FRAME;
            measureCurrentLayout();
        };

        const scheduleMeasure = () => {
            if (animationFrameId !== NO_MEASURE_FRAME) return;
            animationFrameId = window.requestAnimationFrame(measureList);
        };

        const resizeObserver = new ResizeObserver(scheduleMeasure);
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            if (animationFrameId !== NO_MEASURE_FRAME) {
                window.cancelAnimationFrame(animationFrameId);
            }
        };
    }, [measureCurrentLayout]);

    return (
        <div ref={containerRef}>
            <div ref={listRef} className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
                {virtualizer.getVirtualItems().map((virtualItem) => {
                    const row = virtualRows[virtualItem.index];
                    if (!row) return null;

                    if (showHeader === false && row.type === 'header') {
                        return null;
                    }

                    const isStickyHeader = row.type === 'header' && activeStickyIndexRef.current === virtualItem.index;

                    return (
                        <Fragment key={virtualItem.key}>
                            {isStickyHeader && (
                                <div
                                    aria-hidden="true"
                                    className="invisible pointer-events-none sticky z-10 w-full"
                                    style={{ top: STICKY_LEAGUE_HEADER_TOP }}
                                >
                                    <TournamentGroupHeader
                                        tournamentId={row.group.tournament_id}
                                        tournamentName={row.group.tournament_name}
                                        subtitle={row.group.category_name}
                                        isCurrentTournament={currentTournamentId === row.group.tournament_id}
                                    />
                                </div>
                            )}
                            <div
                                data-index={virtualItem.index}
                                ref={virtualizer.measureElement}
                                className={
                                    row.type === 'match'
                                        ? 'absolute left-0 top-0 z-0 w-full hover:z-[1]'
                                        : 'absolute left-0 top-0 w-full'
                                }
                                style={{
                                    transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
                                }}
                            >
                                {row.type === 'header' ? (
                                    <div
                                        className="flex w-full flex-col"
                                        style={{
                                            paddingBottom: isCollapsed
                                                ? GROUP_BOTTOM_PADDING +
                                                  (row.groupIndex === tournamentGroups.length - 1
                                                      ? 0
                                                      : viewportGroupGap)
                                                : contentGap,
                                        }}
                                    >
                                        <TournamentGroupHeader
                                            tournamentId={row.group.tournament_id}
                                            tournamentName={row.group.tournament_name}
                                            subtitle={row.group.category_name}
                                            isCurrentTournament={currentTournamentId === row.group.tournament_id}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="flex w-full flex-col overflow-visible rounded-sm"
                                        style={{
                                            paddingBottom:
                                                row.eventIndex === row.group.events.length - 1
                                                    ? GROUP_BOTTOM_PADDING +
                                                      (row.groupIndex === tournamentGroups.length - 1
                                                          ? 0
                                                          : viewportGroupGap)
                                                    : MATCH_CARD_GAP,
                                        }}
                                    >
                                        <MatchCardRow
                                            row={row}
                                            sportId={row.group.sport_id || fallbackSportId || ''}
                                            hideZeroMarketCount={hideZeroMarketCount}
                                            isMock={isMock}
                                            {...getGroupMarketLayout(row.group, estimatedContainerWidth)}
                                        />
                                    </div>
                                )}
                            </div>
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};
