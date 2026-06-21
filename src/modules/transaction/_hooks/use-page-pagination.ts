import { keepPreviousData, type QueryKey, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { PageResponse } from '@/api/lib/types';

interface UsePagePaginationOptions<TData> {
    queryKey: QueryKey;
    queryFn: (params: { page: number; page_size: number }) => Promise<PageResponse<TData>>;
    pageSize?: number;
    enabled?: boolean;
    /** External page state (URL-driven). When provided, internal state is bypassed. */
    page?: number;
    /** Called when page changes. Use to sync external state (e.g. URL params). */
    onPageChange?: (page: number) => void;
}

export function usePagePagination<TData>(options: UsePagePaginationOptions<TData>) {
    const [internalPage, setInternalPage] = useState(1);
    const pageSize = options.pageSize ?? 10;

    // External page (URL) takes precedence over internal state
    const page = options.page ?? internalPage;
    const setPage = options.onPageChange ?? setInternalPage;

    const query = useQuery({
        queryKey: [...options.queryKey, page, pageSize],
        queryFn: () => options.queryFn({ page, page_size: pageSize }),
        placeholderData: keepPreviousData,
        enabled: options.enabled,
    });

    const totalPages = query.data ? Math.ceil(query.data.total / pageSize) : 0;

    return {
        list: query.data?.list ?? [],
        currentPage: page,
        totalPages,
        setPage,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isPlaceholderData: query.isPlaceholderData,
        error: query.error,
        refetch: query.refetch,
    };
}
