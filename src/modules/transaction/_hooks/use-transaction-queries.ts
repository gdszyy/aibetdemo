import { useQuery } from '@tanstack/react-query';
import { GetMainEfficientBalanceInterface, GetTotalBetWinInterface } from '@/api/handlers/transaction';
import { useCurrencyId, useWalletDispatchBalance } from '@/hooks/use-wallet';

/**
 * React Query hooks for transaction-related server state
 * Replaces manual state management with automatic caching, refetching, and error handling
 */

export const useTotalBetWin = () => {
    const currencyId = useCurrencyId();

    return useQuery({
        queryKey: ['transaction', 'totalBetWin', currencyId],
        queryFn: () =>
            GetTotalBetWinInterface({
                currency_id: currencyId,
            }),
        enabled: !!currencyId,
    });
};

export const useMainEfficientBalance = () => {
    const currencyId = useCurrencyId();

    return useQuery({
        queryKey: ['transaction', 'mainEfficientBalance', currencyId],
        queryFn: () =>
            GetMainEfficientBalanceInterface({
                currency_id: currencyId,
            }),
        enabled: !!currencyId,
    });
};

/**
 * Combined hook for fetching all transaction data with wallet balance refresh
 * Use this when you need to fetch and refresh all transaction data at once
 */
export const useTransactionData = () => {
    const dispatchBalance = useWalletDispatchBalance();
    const totalBetWinQuery = useTotalBetWin();
    const mainEfficientBalanceQuery = useMainEfficientBalance();

    const refetchAll = async () => {
        await Promise.all([totalBetWinQuery.refetch(), mainEfficientBalanceQuery.refetch()]);
        dispatchBalance();
    };

    return {
        totalBetWin: totalBetWinQuery,
        mainEfficientBalance: mainEfficientBalanceQuery,
        refetchAll,
        isLoading: totalBetWinQuery.isLoading || mainEfficientBalanceQuery.isLoading,
        isError: totalBetWinQuery.isError || mainEfficientBalanceQuery.isError,
    };
};
