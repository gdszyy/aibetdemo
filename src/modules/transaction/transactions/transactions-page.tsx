'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { GetTransactionsListPageInterface } from '@/api/handlers/transaction';
import type { TransactionsListItemProps, TransactionsListPageParams } from '@/api/models/transaction';
import { Pagination } from '@/components/pagination';
import { TransactionQueryKeys } from '@/modules/transaction/_constants/query-keys';
import { usePagePagination } from '@/modules/transaction/_hooks/use-page-pagination';
import { handleFilterTime } from '@/modules/transaction/_utils';
import { TransactionsListItem } from './transactions-list-item';
import { TRANSACTIONS_PAGE_SIZE } from './transactions-shared';
import { TransactionsShell, useTransactionsFilterState } from './transactions-shell';

/**
 * Transactions — Page-based pagination mode.
 * Uses usePagePagination + Pagination component.
 * Switch to this mode when backend API supports page-based pagination with accurate total count.
 */
export const TransactionsPageMode: FC = () => {
    const t = useTranslations('transaction');
    const filters = useTransactionsFilterState();
    const { currencyId, typeFilter, timeFilter, page, setPage: setUrlPage } = filters;

    const { list, currentPage, totalPages, setPage, isLoading } = usePagePagination<TransactionsListItemProps>({
        queryKey: TransactionQueryKeys.transactions.list(currencyId, timeFilter, typeFilter),
        pageSize: TRANSACTIONS_PAGE_SIZE,
        page,
        onPageChange: setUrlPage,
        queryFn: async ({ page, page_size }) => {
            if (!currencyId) throw new Error('Currency not available');
            const baseParams: TransactionsListPageParams = {
                currency_id: currencyId,
                page,
                page_size,
                ...(typeFilter !== 'all' && { order_type: typeFilter }),
            };
            return await GetTransactionsListPageInterface(handleFilterTime(baseParams, timeFilter));
        },
        enabled: !!currencyId,
    });

    const isLastPage = currentPage >= totalPages;

    return (
        <TransactionsShell
            filters={filters}
            isLoading={isLoading}
            isEmpty={list.length === 0}
            footer={
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} variant="subtle" />
            }
        >
            <div className="flex flex-col gap-2">
                {list.map((item) => (
                    <TransactionsListItem key={item.id} {...item} />
                ))}
                {isLastPage && (
                    <div className="flex items-center justify-center py-2 text-body-sm text-filltext-ft-e">
                        {t('noMoreData')}
                    </div>
                )}
            </div>
        </TransactionsShell>
    );
};
