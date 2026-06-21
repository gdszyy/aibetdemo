import { keepPreviousData, type QueryKey, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PageResponse, ScrollPageResponse } from '@/api/lib/types';

/** Unified result — consumed by UI regardless of backend pagination mode */
export interface PaginatedResult<T> {
    list: T[];
    page: number;
    totalPages: number;
    isLoading: boolean;
    setPage: (page: number) => void;
}

/** Page-based strategy config */
interface PageConfig<T> {
    mode: 'page';
    queryKey: QueryKey;
    queryFn: (params: { page: number; page_size: number }) => Promise<PageResponse<T>>;
    pageSize?: number;
    enabled?: boolean;
}

/** Cursor-based strategy config */
interface CursorConfig<T> {
    mode: 'cursor';
    queryKey: QueryKey;
    queryFn: (params: { cursor: string; limit: number }) => Promise<ScrollPageResponse<T>>;
    pageSize?: number;
    enabled?: boolean;
}

export type PaginationConfig<T> = PageConfig<T> | CursorConfig<T>;

// ─── Page strategy ───

function usePageStrategy<T>(config: PageConfig<T>): PaginatedResult<T> {
    const [page, setPage] = useState(1);
    const pageSize = config.pageSize ?? 10;
    const queryKeySignature = JSON.stringify(config.queryKey);
    const previousQueryKeySignatureRef = useRef(queryKeySignature);

    useEffect(() => {
        if (previousQueryKeySignatureRef.current === queryKeySignature) {
            return;
        }

        previousQueryKeySignatureRef.current = queryKeySignature;
        setPage(1);
    }, [queryKeySignature]);

    const query = useQuery({
        queryKey: [...config.queryKey, 'page', page, pageSize],
        queryFn: () => config.queryFn({ page, page_size: pageSize }),
        placeholderData: keepPreviousData,
        enabled: config.enabled,
    });

    const totalPages = query.data ? Math.ceil(query.data.total / pageSize) : 0;

    return {
        list: query.data?.list ?? [],
        page,
        totalPages,
        isLoading: query.isLoading,
        setPage,
    };
}

// ─── Cursor strategy ───

function useCursorStrategy<T>(config: CursorConfig<T>): PaginatedResult<T> {
    const [page, setPageRaw] = useState(1);
    const pageSize = config.pageSize ?? 10;
    const queryKeySignature = JSON.stringify(config.queryKey);
    const previousQueryKeySignatureRef = useRef(queryKeySignature);

    // Cache: cursors[0]="" (page 1), cursors[1]=next_cursor from page 1, ...
    const cursorsRef = useRef<string[]>(['']);

    useEffect(() => {
        if (previousQueryKeySignatureRef.current === queryKeySignature) {
            return;
        }

        previousQueryKeySignatureRef.current = queryKeySignature;
        cursorsRef.current = [''];
        setPageRaw(1);
    }, [queryKeySignature]);

    const currentCursor = cursorsRef.current[page - 1] ?? '';

    const query = useQuery({
        queryKey: [...config.queryKey, 'cursor', currentCursor, pageSize],
        queryFn: () => config.queryFn({ cursor: currentCursor, limit: pageSize }),
        placeholderData: keepPreviousData,
        enabled: config.enabled,
    });

    // Store next_cursor when data arrives
    useEffect(() => {
        const nextCursor = query.data?.next_cursor;
        if (nextCursor && cursorsRef.current.length === page) {
            cursorsRef.current = [...cursorsRef.current, String(nextCursor)];
        }
    }, [query.data?.next_cursor, page]);

    const hasMore = !!query.data?.next_cursor;
    const totalPages = hasMore ? page + 1 : page;

    const setPage = useCallback((p: number) => {
        // Only allow navigation to pages with known cursors
        if (p >= 1 && p <= cursorsRef.current.length) {
            setPageRaw(p);
        }
    }, []);

    return {
        list: query.data?.list ?? [],
        page,
        totalPages,
        isLoading: query.isLoading,
        setPage,
    };
}

// ─── Factory (Strategy pattern entry point) ───

/**
 * Unified pagination hook — supports both page-based and cursor-based backends.
 * UI always gets the same `PaginatedResult<T>` shape.
 *
 * To switch backend mode: change `config.mode` + `config.queryFn`. UI stays unchanged.
 */
export function usePaginatedQuery<T>(config: PaginationConfig<T>): PaginatedResult<T> {
    // Both strategies are called unconditionally (React hooks rule).
    // Only one fires via `enabled`.
    const pageResult = usePageStrategy<T>({
        mode: 'page',
        queryKey: config.queryKey,
        queryFn:
            config.mode === 'page'
                ? config.queryFn
                : () => Promise.resolve({ list: [], total: 0, page: 1, page_size: 10 }),
        pageSize: config.pageSize,
        enabled: config.mode === 'page' && (config.enabled ?? true),
    });

    const cursorResult = useCursorStrategy<T>({
        mode: 'cursor',
        queryKey: config.queryKey,
        queryFn: config.mode === 'cursor' ? config.queryFn : () => Promise.resolve({ list: [], next_cursor: '' }),
        pageSize: config.pageSize,
        enabled: config.mode === 'cursor' && (config.enabled ?? true),
    });

    return config.mode === 'page' ? pageResult : cursorResult;
}
