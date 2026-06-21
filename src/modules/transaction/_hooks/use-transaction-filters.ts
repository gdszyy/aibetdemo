import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export type SelectOption = {
    label: string;
    value: string;
};

/**
 * Hook to provide all transaction filter options with translations
 */
export const useTransactionFilters = () => {
    const t = useTranslations('transaction');

    // Balance list sort options
    const balanceSortOptions = useMemo<SelectOption[]>(
        () => [
            {
                label: t('sortSystemDefault'),
                value: 'default',
            },
            {
                label: t('sortByDeadline'),
                value: 'valid_to',
            },
            {
                label: t('sortByProgress'),
                value: 'progress',
            },
        ],
        [t],
    );

    // Time range filter options (filter1)
    const timeRangeOptions = useMemo<SelectOption[]>(
        () => [
            {
                label: t('timeRangeToday'),
                value: '-1',
            },
            {
                label: t('timeRangeYesterday'),
                value: '-2',
            },
            {
                label: t('timeRangeLast3Days'),
                value: '-3',
            },
            {
                label: t('timeRangeLast7Days'),
                value: '-7',
            },
            {
                label: t('timeRangeLast15Days'),
                value: '-15',
            },
            {
                label: t('timeRangeLast30Days'),
                value: '-30',
            },
        ],
        [t],
    );

    // Transaction type filter options (filter2)
    const transactionTypeOptions = useMemo<SelectOption[]>(
        () => [
            {
                label: t('filtersAll'),
                value: 'all',
            },
            {
                label: t('typesDeposit'),
                value: 'deposit',
            },
            {
                label: t('typesWithdraw'),
                value: 'withdraw',
            },
            {
                label: t('typesSportBonus'),
                value: 'bonus',
            },
            {
                label: t('typesCasinoBonus'),
                value: 'casino',
            },
        ],
        [t],
    );

    return {
        balanceSortOptions,
        timeRangeOptions,
        transactionTypeOptions,
    };
};
