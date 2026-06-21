'use client';

import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { PostLiveMatchCountInterface } from '@/api/handlers/matches';
import type { LiveMatchCountResponse } from '@/api/models/match-game';

const LIVE_MATCH_TOTAL_REFETCH_INTERVAL = 60_000;
const ALL_SPORT_LIVE_TOTAL_ID = '0';

export const LIVE_MATCH_TOTAL_QUERY_KEY = ['live-match-total'] as const;

const getLiveMatchTotalQueryKey = (sportId?: string) =>
    sportId ? [...LIVE_MATCH_TOTAL_QUERY_KEY, sportId] : LIVE_MATCH_TOTAL_QUERY_KEY;

const getUniqueSportIds = (sportIds: string[]): string[] => Array.from(new Set(sportIds.filter(Boolean)));

const setSingleLiveMatchTotalCache = (
    queryClient: QueryClient,
    sportId: string,
    totals: LiveMatchCountResponse,
): number => {
    const total = totals[sportId] ?? 0;

    queryClient.setQueryData(getLiveMatchTotalQueryKey(sportId), total);
    if (ALL_SPORT_LIVE_TOTAL_ID in totals) {
        queryClient.setQueryData(getLiveMatchTotalQueryKey(), totals[ALL_SPORT_LIVE_TOTAL_ID]);
    }
    queryClient.setQueriesData<LiveMatchCountResponse>(
        { queryKey: [...LIVE_MATCH_TOTAL_QUERY_KEY, 'batch'] },
        (currentTotals) => (currentTotals ? { ...currentTotals, ...totals } : currentTotals),
    );

    return total;
};

const setLiveMatchTotalCache = (queryClient: QueryClient, sportIds: string[], totals: LiveMatchCountResponse): void => {
    sportIds.forEach((sportId) => {
        queryClient.setQueryData(getLiveMatchTotalQueryKey(sportId), totals[sportId] ?? 0);
    });
    if (ALL_SPORT_LIVE_TOTAL_ID in totals) {
        queryClient.setQueryData(getLiveMatchTotalQueryKey(), totals[ALL_SPORT_LIVE_TOTAL_ID]);
    }
};

const fetchLiveMatchTotals = async (sportIds: string[]): Promise<LiveMatchCountResponse> => {
    return PostLiveMatchCountInterface({ sport_id: sportIds });
};

export const useLiveMatchTotalData = (sportId?: string) => {
    return useQuery({
        queryKey: getLiveMatchTotalQueryKey(sportId),
        queryFn: () => Promise.resolve(0),
        enabled: false,
    });
};

/**
 * 刷新指定体育类型直播数量，并同步到全量轮询缓存中的对应 sport_id。
 */
export const useLiveMatchTotalRefresh = (): ((sportId: string) => void) => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (sportId: string) => fetchLiveMatchTotals([sportId]),
        onSuccess: (totals, sportId) => {
            setSingleLiveMatchTotalCache(queryClient, sportId, totals);
        },
    });

    return (sportId: string): void => {
        mutation.mutate(sportId);
    };
};

export const useLiveMatchTotalsPolling = (sportIds: string[]) => {
    const queryClient = useQueryClient();
    const querySportIds = useMemo(() => getUniqueSportIds(sportIds), [sportIds]);

    const query = useQuery({
        queryKey: [...LIVE_MATCH_TOTAL_QUERY_KEY, 'batch', querySportIds],
        queryFn: () => fetchLiveMatchTotals(querySportIds),
        enabled: querySportIds.length > 0,
        refetchInterval: LIVE_MATCH_TOTAL_REFETCH_INTERVAL,
    });

    useEffect(() => {
        if (!query.data) return;

        setLiveMatchTotalCache(queryClient, querySportIds, query.data);
    }, [query.data, queryClient, querySportIds]);

    return query.data;
};
