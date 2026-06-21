'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useTimeZone, useTranslations } from 'next-intl';
import { type FC, useCallback, useMemo, useState } from 'react';
import {
    type BetHistoryPageParams,
    GetCasinoBetHistoryInterface,
    GetGameReportInterface,
    GetSportReportInterface,
} from '@/api/handlers/transaction-bethistory';
import type { CasinoReportItem, SportReportItem } from '@/api/models/transaction-bethistory';
import { DateRangePicker } from '@/components/date-range-picker';
import {
    type DateRangePickerValue,
    getDateRangeKey,
    getDateRangeTimestampParams,
    getDefaultDateRange,
} from '@/components/date-range-picker/types';
import { Loading } from '@/components/loading/loading';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useCurrencyId } from '@/hooks/use-wallet';
import type { TranslationKey } from '@/i18nV2/types';
import { Empty } from '../_components/empty';
import { SortChips } from '../_components/sort-chips';
import {
    BetHistoryFilterRow,
    type BetHistorySecondaryFilterKey,
    type BetHistorySecondaryFilters,
    DEFAULT_BET_HISTORY_SECONDARY_FILTERS,
} from './bet-history-filter-row';
import { ListItem } from './bet-history-list-item';
import { ListDetailModal } from './list-detail-modal';
import type { BetFilterType, BetHistoryListItem } from './types';

const PAGE_SIZE = 10;
const LIST_GRID_CLASS = 'grid min-w-[1188px] grid-cols-[220px_220px_220px_220px_220px_80px] items-center gap-2';
const LIST_HEADER_COLUMNS: ReadonlyArray<{ key: string; labelKey: TranslationKey<'transaction'> }> = [
    { key: 'gameType', labelKey: 'betHistoryV2.gameType' },
    { key: 'stake', labelKey: 'betHistoryV2.stake' },
    { key: 'profit', labelKey: 'betHistoryV2.profit' },
    { key: 'createTime', labelKey: 'betHistoryV2.createTime' },
    { key: 'updateTime', labelKey: 'betHistoryV2.updateTime' },
];

interface PageMeta {
    page?: number;
    page_num?: number;
    page_size: number;
    total: number;
}

const getAllQueryKey = (
    currencyId: number | undefined,
    dateRangeKey: string,
    provider: string,
    gameType: string,
    sportType: string,
) => ['bet-history-list', currencyId, dateRangeKey, provider, gameType, sportType] as const;

const getSportQueryKey = (currencyId: number | undefined, dateRangeKey: string, gameType: string, sportType: string) =>
    ['bet-history-list-sport', currencyId, dateRangeKey, gameType, sportType] as const;

const getCasinoQueryKey = (dateRangeKey: string, provider: string, gameType: string) =>
    ['bet-history-list-casino', dateRangeKey, provider, gameType] as const;

const getNextPageParam = (lastPage: PageMeta, _allPages: PageMeta[], lastPageParam: number) => {
    const currentPage = lastPageParam ?? lastPage.page_num ?? lastPage.page ?? 1;
    const nextPage = currentPage + 1;
    const totalPages = Math.ceil(lastPage.total / lastPage.page_size);
    return nextPage <= totalPages ? nextPage : undefined;
};

/** All 开放后的注单历史统一列表。 */
export const BetHistoryList: FC = () => {
    const t = useTranslations('transaction');
    const timeZone = useTimeZone();
    const currencyId = useCurrencyId();
    const [betType, setBetType] = useState<BetFilterType>('all');
    const [dateRange, setDateRange] = useState<DateRangePickerValue>(getDefaultDateRange(timeZone));
    const [secondaryFilters, setSecondaryFilters] = useState<BetHistorySecondaryFilters>(
        DEFAULT_BET_HISTORY_SECONDARY_FILTERS,
    );
    const [detailItem, setDetailItem] = useState<BetHistoryListItem | null>(null);
    const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
    const queryClient = useQueryClient();
    const dateRangeKey = useMemo(() => getDateRangeKey(dateRange), [dateRange]);
    const dateRangeParams = useMemo(() => getDateRangeTimestampParams({}, dateRange, timeZone), [dateRange, timeZone]);
    const { gameType, provider, sportType } = secondaryFilters;

    const allQueryFilters = useMemo(
        () => ({
            ...(provider !== 'all' ? { oc_platform: provider } : {}),
            ...(gameType !== 'all' ? { game_type: gameType } : {}),
            ...(sportType !== 'all' ? { sport_type: sportType } : {}),
        }),
        [gameType, provider, sportType],
    );
    const sportQueryFilters = useMemo(
        () => ({
            ...(gameType !== 'all' ? { game_type: gameType } : {}),
            ...(sportType !== 'all' ? { sport_type: sportType } : {}),
        }),
        [gameType, sportType],
    );
    const casinoQueryFilters = useMemo(
        () => ({
            ...(provider !== 'all' ? { oc_platform: provider } : {}),
            ...(gameType !== 'all' ? { game_type: gameType } : {}),
        }),
        [gameType, provider],
    );

    const typeChips = useMemo(
        () => [
            { label: t('filtersAll'), value: 'all' },
            { label: t('sport'), value: 'sport' },
            { label: t('casino'), value: 'casino' },
        ],
        [t],
    );

    const allQuery = useInfiniteQuery({
        queryKey: getAllQueryKey(currencyId, dateRangeKey, provider, gameType, sportType),
        queryFn: ({ pageParam }) => {
            const params: BetHistoryPageParams = {
                currency_id: currencyId ?? 0,
                page_num: pageParam ?? 1,
                page_size: PAGE_SIZE,
                ...dateRangeParams,
                ...allQueryFilters,
            };
            return GetGameReportInterface(params);
        },
        initialPageParam: 1,
        getNextPageParam,
        enabled: !!currencyId && betType === 'all',
    });

    const sportQuery = useInfiniteQuery({
        queryKey: getSportQueryKey(currencyId, dateRangeKey, gameType, sportType),
        queryFn: ({ pageParam }) => {
            const params: BetHistoryPageParams = {
                currency_id: currencyId ?? 0,
                page_num: pageParam ?? 1,
                page_size: PAGE_SIZE,
                ...dateRangeParams,
                ...sportQueryFilters,
            };
            return GetSportReportInterface(params);
        },
        initialPageParam: 1,
        getNextPageParam,
        enabled: !!currencyId && betType === 'sport',
    });

    const casinoQuery = useInfiniteQuery({
        queryKey: getCasinoQueryKey(dateRangeKey, provider, gameType),
        queryFn: ({ pageParam }) => {
            const params: BetHistoryPageParams = {
                currency_id: currencyId ?? 0,
                page_num: pageParam ?? 1,
                page_size: PAGE_SIZE,
                ...dateRangeParams,
                ...casinoQueryFilters,
            };
            return GetCasinoBetHistoryInterface(params);
        },
        initialPageParam: 1,
        getNextPageParam,
        enabled: !!currencyId && betType === 'casino',
    });

    const activeQuery = betType === 'all' ? allQuery : betType === 'casino' ? casinoQuery : sportQuery;
    const allList = useMemo(() => allQuery.data?.pages.flatMap((page) => page.list ?? []) ?? [], [allQuery.data]);
    const sportList = useMemo(() => sportQuery.data?.pages.flatMap((page) => page.list ?? []) ?? [], [sportQuery.data]);
    const casinoList = useMemo(
        () => casinoQuery.data?.pages.flatMap((page) => page.list ?? []) ?? [],
        [casinoQuery.data],
    );
    const visibleItems = useMemo<BetHistoryListItem[]>(() => {
        if (betType === 'casino') return casinoList;
        if (betType === 'all') return allList;
        return sportList;
    }, [allList, betType, casinoList, sportList]);

    const { sentinelRef } = useInfiniteScroll({
        hasNextPage: activeQuery.hasNextPage,
        isFetchingNextPage: activeQuery.isFetchingNextPage,
        fetchNextPage: activeQuery.fetchNextPage,
        root: scrollRoot,
    });

    const handleTypeChange = useCallback(
        (val: string) => {
            if (val === 'all' && currencyId) {
                queryClient.removeQueries({
                    queryKey: getAllQueryKey(currencyId, dateRangeKey, 'all', 'all', 'all'),
                    exact: true,
                });
            }

            setBetType(val as BetFilterType);
            setSecondaryFilters(DEFAULT_BET_HISTORY_SECONDARY_FILTERS);
        },
        [currencyId, dateRangeKey, queryClient],
    );

    const handleSecondaryFilterChange = useCallback(
        (key: BetHistorySecondaryFilterKey, value: string) => {
            setSecondaryFilters((prev) => {
                const nextFilters = { ...prev, [key]: value };

                if (value === 'all') {
                    if (betType === 'all' && currencyId) {
                        queryClient.removeQueries({
                            queryKey: getAllQueryKey(
                                currencyId,
                                dateRangeKey,
                                nextFilters.provider,
                                nextFilters.gameType,
                                nextFilters.sportType,
                            ),
                            exact: true,
                        });
                    }

                    if (betType === 'sport' && currencyId) {
                        queryClient.removeQueries({
                            queryKey: getSportQueryKey(
                                currencyId,
                                dateRangeKey,
                                nextFilters.gameType,
                                nextFilters.sportType,
                            ),
                            exact: true,
                        });
                    }

                    if (betType === 'casino') {
                        queryClient.removeQueries({
                            queryKey: getCasinoQueryKey(dateRangeKey, nextFilters.provider, nextFilters.gameType),
                            exact: true,
                        });
                    }
                }

                return nextFilters;
            });
        },
        [betType, currencyId, dateRangeKey, queryClient],
    );

    const handleDetail = useCallback((item: BetHistoryListItem) => {
        if ('data' in item) {
            if (item.type === 'sport') {
                setDetailItem(item.data as SportReportItem);
                return;
            }

            if (item.type === 'casino') {
                setDetailItem(item.data as CasinoReportItem);
            }
            return;
        }

        if ('financial_init' in item) {
            setDetailItem(item as SportReportItem);
            return;
        }

        setDetailItem(item as CasinoReportItem);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setDetailItem(null);
    }, []);

    return (
        <div className="flex flex-col gap-2.5 md:gap-4 min-w-0 max-md:flex-1 max-md:min-h-0">
            <div className="flex items-center justify-between">
                <SortChips options={typeChips} value={betType} onChange={handleTypeChange} />
                <DateRangePicker value={dateRange} onChange={setDateRange} ariaLabel={t('transferOrder.date')} />
            </div>

            <BetHistoryFilterRow betType={betType} filters={secondaryFilters} onChange={handleSecondaryFilterChange} />

            <div className="overflow-x-auto overflow-y-hidden max-md:flex-1 max-md:min-h-0 max-md:flex max-md:flex-col">
                <div className="min-w-fit max-md:flex-1 max-md:min-h-0 max-md:flex max-md:flex-col">
                    <div className={`${LIST_GRID_CLASS} h-14 rounded-sm bg-filltext-ft-c px-5 pr-7`}>
                        {LIST_HEADER_COLUMNS.map((col) => (
                            <div key={col.key} className="text-body-lg text-filltext-ft-h">
                                {t(col.labelKey)}
                            </div>
                        ))}
                        <div />
                    </div>

                    {activeQuery.isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loading className="size-6" variant="color-red" />
                        </div>
                    ) : visibleItems.length > 0 ? (
                        <div
                            ref={setScrollRoot}
                            className="pt-2 flex min-h-[200px] flex-col gap-2 md:max-h-[calc(100dvh-400px)] overflow-y-auto transaction-scrollbar max-md:flex-1 max-md:min-h-0"
                        >
                            {visibleItems.map((item) => (
                                <ListItem
                                    key={'order_id' in item ? item.order_id : `${betType}-${item.id}`}
                                    item={item}
                                    onDetail={() => handleDetail(item)}
                                />
                            ))}

                            {activeQuery.isFetchingNextPage && (
                                <div className="flex items-center justify-center py-4">
                                    <Loading className="size-5" variant="color-red" />
                                </div>
                            )}

                            {!activeQuery.hasNextPage && (
                                <div className="flex items-center justify-center py-2 text-body-sm text-filltext-ft-e">
                                    {t('noMoreData')}
                                </div>
                            )}

                            <div ref={sentinelRef} />
                        </div>
                    ) : (
                        <Empty />
                    )}
                </div>
            </div>

            <ListDetailModal visible={detailItem !== null} onClose={handleCloseDetail} item={detailItem} />
        </div>
    );
};
