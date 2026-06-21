'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { GetTransactionsListInterface } from '@/api/handlers/transaction';
import type { TransactionsListParams } from '@/api/models/transaction';
import { Loading } from '@/components/loading/loading';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { TransactionQueryKeys } from '@/modules/transaction/_constants/query-keys';
import { handleFilterTime } from '@/modules/transaction/_utils';
import { TransactionsListItem } from './transactions-list-item';
import { TRANSACTIONS_PAGE_SIZE } from './transactions-shared';
import { TransactionsShell, useTransactionsFilterState } from './transactions-shell';

/**
 * Transactions — Scroll/cursor-based pagination mode.
 * Uses useInfiniteQuery + IntersectionObserver for bottom-loading.
 * Active when backend API uses cursor-based pagination (legacy endpoint).
 */
export const TransactionsScrollMode: FC = () => {
    const t = useTranslations('transaction');
    const filters = useTransactionsFilterState();
    const { currencyId, typeFilter, timeFilter } = filters;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: [...TransactionQueryKeys.transactions.list(currencyId, timeFilter, typeFilter), 'scroll'],
        queryFn: async ({ pageParam }) => {
            if (!currencyId) throw new Error('Currency not available');
            const baseParams: TransactionsListParams = {
                currency_id: currencyId,
                cursor: pageParam ?? '',
                limit: TRANSACTIONS_PAGE_SIZE,
                ...(typeFilter !== 'all' && { order_type: typeFilter }),
            };
            return await GetTransactionsListInterface(handleFilterTime(baseParams, timeFilter));
        },
        initialPageParam: '' as string,
        getNextPageParam: (lastPage) => lastPage.next_cursor || undefined,
        enabled: !!currencyId,
    });

    const list = useMemo(() => data?.pages.flatMap((p) => p.list ?? []) ?? [], [data]);

    const { sentinelRef } = useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage });

    return (
        <TransactionsShell filters={filters} isLoading={isLoading} isEmpty={list.length === 0}>
            <div className="flex flex-col gap-2 md:max-h-[calc(100dvh-400px)] min-h-[200px] overflow-y-auto min-w-fit transaction-scrollbar max-md:flex-1 max-md:min-h-0">
                {list.map((item) => (
                    <TransactionsListItem key={item.id} {...item} />
                ))}

                {isFetchingNextPage && (
                    <div className="flex items-center justify-center py-4">
                        <Loading className="size-5" variant="color-red" />
                    </div>
                )}

                {!hasNextPage && list.length > 0 && (
                    <div className="flex items-center justify-center py-2 text-body-sm text-filltext-ft-e">
                        {t('noMoreData')}
                    </div>
                )}

                <div ref={sentinelRef} />
            </div>
        </TransactionsShell>
    );
};
