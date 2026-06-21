'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { GetOrderListInterface } from '@/api/handlers/order';
import type { Order, OrderType } from '@/api/models/order';
import { generateQueryKey, ModuleKeys, OrderActions } from '@/constants/query-keys';
import { useIsLogin } from '@/stores/session-store';

/** Page size */
const PAGE_SIZE = 20;

export interface UseOrdersParams {
    /** Order type: Open or Settled */
    tab: OrderType;
}

export interface UseOrdersResult {
    /** Order list */
    orders: Order[];
    /** Whether loading */
    isLoading: boolean;
    /** Whether there is a next page */
    hasNextPage: boolean;
    /** Whether fetching */
    isFetching: boolean;
    /** Whether fetching next page */
    isFetchingNextPage: boolean;
    /** Number of loaded pages */
    pageCount: number;
    /** Fetch next page */
    fetchNextPage: () => void;
}

/**
 * Order list infinite scroll hook.
 *
 * Encapsulates paginated loading logic for Open and Settled order types.
 */
export function useOrders({ tab }: UseOrdersParams): UseOrdersResult {
    const isLogin = useIsLogin();
    const { data, isLoading, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
        queryKey: generateQueryKey(ModuleKeys.ORDER, OrderActions.GET_ORDERS, { tab }),
        queryFn: async ({ pageParam }) => {
            const response = await GetOrderListInterface({
                tab,
                cursor: pageParam ? String(pageParam) : '',
                limit: PAGE_SIZE,
            });
            response.list = response.list ?? [];
            return response;
        },
        initialPageParam: undefined as string | number | null | undefined,
        getNextPageParam: (lastPage) => {
            // Empty string or null/undefined means no next page
            return lastPage.next_cursor || undefined;
        },
        enabled: isLogin,
    });

    // Merge data from all pages
    const orders = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.list);
    }, [data]);

    const pageCount = data?.pages?.length ?? 0;

    return {
        orders,
        isLoading,
        hasNextPage: hasNextPage ?? false,
        isFetching,
        isFetchingNextPage,
        pageCount,
        fetchNextPage,
    };
}
