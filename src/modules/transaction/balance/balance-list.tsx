'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type FC, useCallback, useState } from 'react';
import { GetBalanceListPageInterface, PostBonusWithdrawInterface } from '@/api/handlers/transaction';
import type { ErrorReject } from '@/api/lib/types';
import type { BalanceListItemProps, SORT } from '@/api/models/transaction';
import { ArrowLeft, Ticket } from '@/components/icons';
import { Pagination } from '@/components/pagination';
import { Toast } from '@/components/toast';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useCurrencyId } from '@/hooks/use-wallet';
import { TransactionQueryKeys } from '@/modules/transaction/_constants/query-keys';
import { usePagePagination } from '@/modules/transaction/_hooks/use-page-pagination';
import { useTransactionFilters } from '@/modules/transaction/_hooks/use-transaction-filters';
import { useMainEfficientBalance, useTransactionData } from '@/modules/transaction/_hooks/use-transaction-queries';
import { Empty } from '../_components/empty';
import { SortChips } from '../_components/sort-chips';
import { CURRENCY_ID_TYPE_BONUS } from '../_constants';
import { BonusCard } from './_components/bonus-card';
import { BalanceTransferConfirmModal } from './balance-transfer-confirm-modal';

const PAGE_SIZE = 6;

// ─── Mock data for bonus types without API ──────────────────────────

function createMockBonusItems(bonusType: string, count: number): BalanceListItemProps[] {
    const now = Math.floor(Date.now() / 1000);
    const nameMap: Record<string, string> = {
        casinoBonus: 'Casino Bonus Reward',
        freeSport: 'Free Sport Bet',
        freeSpin: 'Free Spin Reward',
    };
    return Array.from({ length: count }, (_, i) => ({
        id: 9000 + i,
        user_id: 1,
        currency_id: 1,
        currency_type_id: bonusType === 'casinoBonus' ? 2 : bonusType === 'freeSpin' ? 4 : 3,
        currency_type_name: 'main',
        withdraw_limit: '5000',
        withdraw_max: '1000',
        balance: String(Math.floor(Math.random() * 500) + 50),
        balance_frozen: '0',
        status: 1,
        product_name: `${nameMap[bonusType] ?? bonusType} #${i + 1}`,
        reward_amount: '1000',
        valid_from: now - 86400 * 7,
        valid_to: now + 86400 * (7 + i),
        created_at: now - 86400 * 7,
        updated_at: now,
        is_withdraw: true,
        effective_amount: String(Math.floor(Math.random() * 3000)),
        main_effective_amount: String(Math.floor(Math.random() * 500)),
        progress: String(Math.floor(Math.random() * 100)),
    }));
}

// ─── Skeleton ────────────────────────────────────────────────────────

const BonusCardSkeleton: FC = () => (
    <div className="flex flex-col pt-2">
        <div className="h-[34px] w-full animate-skeleton-pulse rounded-t-sm bg-surface-raised/40" />
        <div className="flex flex-col gap-2 p-2 rounded-b-sm border border-t-0 border-filltext-ft-b bg-surface-1">
            <div className="flex justify-between">
                <div className="h-4 w-24 animate-skeleton-pulse rounded bg-surface-raised/30" />
                <div className="h-4 w-20 animate-skeleton-pulse rounded bg-surface-raised/30" />
            </div>
            <div className="h-[80px] w-full animate-skeleton-pulse rounded-sm bg-surface-raised/20" />
            <div className="flex justify-between">
                <div className="h-4 w-28 animate-skeleton-pulse rounded bg-surface-raised/30" />
                <div className="h-4 w-16 animate-skeleton-pulse rounded bg-surface-raised/30" />
            </div>
            <div className="flex gap-2">
                {Array.from({ length: 10 }, (_, i) => (
                    <div
                        key={i.toString()}
                        className="h-2 flex-1 animate-skeleton-pulse rounded-xs bg-surface-raised/20"
                    />
                ))}
            </div>
            <div className="h-6 w-full animate-skeleton-pulse rounded-xs bg-surface-raised/20" />
        </div>
    </div>
);

const GridSkeleton: FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <BonusCardSkeleton key={i} />
        ))}
    </div>
);

// ─── BalanceList ────────────────────────────────────────────────────

interface BalanceListProps {
    from: string;
    onBack: () => void;
}

export const BalanceList: FC<BalanceListProps> = ({ from, onBack }) => {
    const t = useTranslations('transaction');
    const { data: mainEfficientBalance } = useMainEfficientBalance();
    const { balanceSortOptions } = useTransactionFilters();
    const { formatCurrency } = useIntlFormatter();
    const currencyId = useCurrencyId();
    const queryClient = useQueryClient();
    const { refetchAll } = useTransactionData();

    const [sortValue, setSortValue] = useState<SORT>('default');
    const [transferTarget, setTransferTarget] = useState<BalanceListItemProps | null>(null);
    const [isTransferLoading, setIsTransferLoading] = useState(false);

    const onSortChange = useCallback((val: string) => {
        setSortValue(val as SORT);
    }, []);

    // Mock data for bonus types without backend API yet
    const mockItems = from !== 'sportBonus' ? createMockBonusItems(from, 3) : [];

    // Page-based pagination
    const { list, currentPage, totalPages, setPage, isLoading } = usePagePagination<BalanceListItemProps>({
        queryKey: TransactionQueryKeys.balance.list(currencyId, sortValue),
        pageSize: PAGE_SIZE,
        queryFn: async ({ page, page_size }) => {
            if (!currencyId) {
                throw new Error('Currency not available');
            }
            return await GetBalanceListPageInterface({
                currency_id: currencyId,
                currency_type_id: CURRENCY_ID_TYPE_BONUS,
                sort: sortValue,
                page,
                page_size,
            });
        },
        enabled: !!currencyId && from === 'sportBonus',
    });

    // ─── Transfer logic ─────────────────────────────────────────────

    const executeTransfer = useCallback(
        async (item: BalanceListItemProps) => {
            try {
                setIsTransferLoading(true);
                await PostBonusWithdrawInterface({ bonus_id: item.id });
                setTransferTarget(null);
                Toast.success(t('withDrawSuccess'), { id: 'transfer-result', duration: 3000 });
                refetchAll();
                queryClient.invalidateQueries({ queryKey: TransactionQueryKeys.balance.all });
            } catch (error) {
                Toast.error((error as ErrorReject)?.message || t('transferTip'), {
                    id: 'transfer-result',
                    duration: 3000,
                });
            } finally {
                setIsTransferLoading(false);
            }
        },
        [t, refetchAll, queryClient],
    );

    const handleTransferAttempt = useCallback(
        (item: BalanceListItemProps) => {
            const balanceAmount = Number(item.balance) || 0;
            const maxWithdrawAmount = Number(item.withdraw_max) || 0;
            if (balanceAmount > maxWithdrawAmount) {
                setTransferTarget(item);
                return;
            }
            void executeTransfer(item);
        },
        [executeTransfer],
    );

    const transferConfirmDescription = (() => {
        if (!transferTarget) return '';
        const balanceAmount = Number(transferTarget.balance) || 0;
        const maxWithdrawAmount = Number(transferTarget.withdraw_max) || 0;
        const convertibleAmount = Math.min(balanceAmount, maxWithdrawAmount);
        const removedAmount = Math.max(balanceAmount - convertibleAmount, 0);
        return removedAmount > 0
            ? t('transferConfirmBodyWithRemoval', {
                  maxAmount: formatCurrency(convertibleAmount),
                  excessAmount: formatCurrency(removedAmount),
              })
            : t('transferConfirmBodyWithoutRemoval', { amount: formatCurrency(convertibleAmount) });
    })();

    // ─── Render ──────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-4">
            {/* Header: back + sort chips + total */}
            <div className="flex items-center justify-between">
                <div className="flex flex-1 min-w-0 gap-4 items-center">
                    <button
                        type="button"
                        onClick={onBack}
                        className="group/back flex items-center justify-center size-10 rounded-[6.667px] bg-filltext-ft-a cursor-pointer shrink-0"
                    >
                        <ArrowLeft className="size-6 text-filltext-ft-e group-hover/back:text-brand-red transition-colors" />
                    </button>
                    {from === 'sportBonus' && (
                        <SortChips options={balanceSortOptions} value={sortValue} onChange={onSortChange} />
                    )}
                </div>
                {from === 'sportBonus' && (
                    <div className="flex items-center gap-1 shrink-0">
                        <Ticket className="size-10" />
                        <span className="text-headline-md text-func-bonus">
                            {formatCurrency(Number(mainEfficientBalance?.main_effective_amount))}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            {from !== 'sportBonus' && !mockItems.length ? (
                <Empty />
            ) : from !== 'sportBonus' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockItems.map((item) => (
                        <BonusCard
                            key={item.id}
                            item={item}
                            bonusType={from}
                            onTransfer={handleTransferAttempt}
                            transferLoading={isTransferLoading}
                        />
                    ))}
                </div>
            ) : isLoading ? (
                <GridSkeleton />
            ) : list.length ? (
                <>
                    {/* Card grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {list.map((item) => (
                            <BonusCard
                                key={item.id}
                                item={item}
                                bonusType={from}
                                onTransfer={handleTransferAttempt}
                                transferLoading={isTransferLoading}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        variant="subtle"
                    />
                </>
            ) : (
                <Empty />
            )}

            {/* Transfer confirm modal */}
            <BalanceTransferConfirmModal
                visible={!!transferTarget}
                loading={isTransferLoading}
                description={transferConfirmDescription}
                onClose={() => setTransferTarget(null)}
                onConfirm={() => {
                    if (transferTarget) void executeTransfer(transferTarget);
                }}
            />
        </div>
    );
};
