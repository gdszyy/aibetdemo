'use client';

import { useTranslations } from 'next-intl';
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react';
import { useIsDesktop } from '@/hooks/use-media-query';
import { useCurrencyId } from '@/hooks/use-wallet';
import { Empty } from '@/modules/transaction/_components/empty';
import { EmptyV2 } from '@/modules/transaction/_components/emptyV2';
import { TransactionFilterTrigger } from '@/modules/transaction/_components/transaction-filter-trigger';
import { TransactionMobileSheet } from '@/modules/transaction/_components/transaction-mobile-sheet';
import { useTransactionFilters } from '@/modules/transaction/_hooks/use-transaction-filters';
import { useTransactionParams } from '@/modules/transaction/_hooks/use-transaction-params';
import { cn } from '@/utils/common';
import { TransactionsSelectV2 } from './transactions-select-v2';
import { ListSkeleton, TRANSACTIONS_COLUMNS } from './transactions-shared';
import { TransactionsSortChipsV2 } from './transactions-sort-chips-v2';

/** 交易列表共用筛选状态。 */
export function useTransactionsFilterState() {
    const { timeRangeOptions, transactionTypeOptions } = useTransactionFilters();
    const { type: typeFilter, period: timeFilter, page, setFilter, setPage } = useTransactionParams();
    const currencyId = useCurrencyId();

    const typeChips = useMemo(
        () => transactionTypeOptions.map((opt) => ({ label: opt.label, value: opt.value })),
        [transactionTypeOptions],
    );

    const onTypeChange = useCallback((val: string) => setFilter({ type: val === 'all' ? null : val }), [setFilter]);

    const onTimeChange = useCallback((val: string) => setFilter({ period: val === '-1' ? null : val }), [setFilter]);

    return {
        currencyId,
        typeFilter,
        timeFilter,
        page,
        setPage,
        typeChips,
        onTypeChange,
        onTimeChange,
        timeRangeOptions,
    };
}

export type TransactionsFilterState = ReturnType<typeof useTransactionsFilterState>;

interface TransactionsShellProps {
    filters: TransactionsFilterState;
    isLoading: boolean;
    isEmpty: boolean;
    children: ReactNode;
    footer?: ReactNode;
}

interface TransactionsDesktopTableProps {
    children: ReactNode;
}

const TransactionsDesktopTable: FC<TransactionsDesktopTableProps> = ({ children }) => {
    const t = useTranslations('transaction');

    return (
        <div className="overflow-x-auto rounded-md bg-surface-1 p-4">
            <div className="flex min-w-fit flex-col gap-2">
                <div className="flex h-12 w-full items-center gap-2 rounded-sm bg-filltext-ft-c px-4 pr-7">
                    {TRANSACTIONS_COLUMNS.map((col) => (
                        <div key={col.key} className={cn('flex shrink-0 items-center', col.width)}>
                            <span className="text-body-lg text-filltext-ft-h">{t(col.key)}</span>
                        </div>
                    ))}
                </div>
                {children}
            </div>
        </div>
    );
};

/**
 * 交易列表共用外壳。
 * 桌面端保持表格式筛选，移动端切换为胶囊筛选 + 卡片列表。
 */
export const TransactionsShell: FC<TransactionsShellProps> = ({ filters, isLoading, isEmpty, children, footer }) => {
    const t = useTranslations('transaction');
    const isDesktop = useIsDesktop();
    const { typeChips, typeFilter, timeFilter, onTypeChange, onTimeChange, timeRangeOptions } = filters;
    const [typeSheetVisible, setTypeSheetVisible] = useState(false);
    const [timeSheetVisible, setTimeSheetVisible] = useState(false);

    const selectedTypeLabel = useMemo(() => {
        return typeChips.find((item) => item.value === typeFilter)?.label ?? t('filtersAll');
    }, [t, typeChips, typeFilter]);

    const selectedTimeLabel = useMemo(() => {
        return timeRangeOptions.find((item) => item.value === timeFilter)?.label ?? t('timeRangeToday');
    }, [t, timeFilter, timeRangeOptions]);

    return (
        <div className="flex min-w-0 flex-col gap-3 md:gap-4">
            {isDesktop ? (
                <div className="flex items-center justify-between gap-4">
                    <TransactionsSortChipsV2 options={typeChips} value={typeFilter} onChange={onTypeChange} />
                    <TransactionsSelectV2 value={timeFilter} onValueChange={onTimeChange} options={timeRangeOptions} />
                </div>
            ) : (
                <div className="grid grid-cols-[1fr_2fr] gap-2">
                    <TransactionFilterTrigger
                        label={selectedTypeLabel}
                        onClick={() => setTypeSheetVisible(true)}
                        active={typeSheetVisible}
                    />
                    <TransactionFilterTrigger
                        label={selectedTimeLabel}
                        onClick={() => setTimeSheetVisible(true)}
                        active={timeSheetVisible}
                    />
                </div>
            )}

            <div className="min-w-0">
                {isLoading ? (
                    isDesktop ? (
                        <TransactionsDesktopTable>
                            <ListSkeleton />
                        </TransactionsDesktopTable>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <ListSkeleton />
                        </div>
                    )
                ) : isEmpty ? (
                    isDesktop ? (
                        <Empty />
                    ) : (
                        <EmptyV2 />
                    )
                ) : isDesktop ? (
                    <div className="flex flex-col gap-4 rounded-md bg-surface-1">
                        <TransactionsDesktopTable>{children}</TransactionsDesktopTable>
                        {footer}
                    </div>
                ) : (
                    children
                )}
            </div>

            {!isDesktop && footer}

            {!isDesktop && (
                <>
                    <TransactionMobileSheet
                        title={t('transactionFilterType')}
                        visible={typeSheetVisible}
                        onClose={() => setTypeSheetVisible(false)}
                        mode="single"
                        options={typeChips}
                        value={typeFilter}
                        onSelect={(value) => {
                            onTypeChange(value);
                            setTypeSheetVisible(false);
                        }}
                    />

                    <TransactionMobileSheet
                        title={t('transactionFilterType')}
                        visible={timeSheetVisible}
                        onClose={() => setTimeSheetVisible(false)}
                        mode="single"
                        options={timeRangeOptions}
                        value={timeFilter}
                        onSelect={(value) => {
                            onTimeChange(value);
                            setTimeSheetVisible(false);
                        }}
                    />
                </>
            )}
        </div>
    );
};
