import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { matchRowCountLoader } from '@/api/loaders/match';

const MATCH_ROW_COUNT_STALE_TIME = 1000 * 60 * 5;
const MATCH_ROW_COUNT_GC_TIME = 1000 * 60 * 10;

const getMatchRowCountQueryKey = (eventId: string) => ['match-row-count', eventId] as const;

export type MatchRowCountMap = ReadonlyMap<string, number | undefined>;

const getUniqueEventIds = (eventIds: string[]): string[] => Array.from(new Set(eventIds));

/**
 * 获取比赛盘口行数。
 * 只使用 batch/count 接口结果，避免事件字段 live_market_total/live_market_count 影响盘口隐藏判断。
 *
 * @param eventId - 比赛事件 ID。
 * @param fetchRowCount - 是否主动请求盘口行数；关闭时仅消费已预取的 React Query 缓存。
 */
export const useMatchRowCount = (eventId: string, fetchRowCount = true) => {
    return useQuery({
        queryKey: getMatchRowCountQueryKey(eventId),
        queryFn: () => matchRowCountLoader.load(eventId),
        enabled: fetchRowCount,
        staleTime: MATCH_ROW_COUNT_STALE_TIME,
        gcTime: MATCH_ROW_COUNT_GC_TIME,
    });
};

/**
 * 批量获取比赛盘口行数。
 * 返回 event_id 到 batch/count 结果的映射，undefined 表示接口结果尚未返回。
 */
export const useMatchRowCounts = (eventIds: string[], enabled = true): MatchRowCountMap => {
    const uniqueEventIds = useMemo(() => getUniqueEventIds(eventIds), [eventIds]);
    const queries = useQueries({
        queries: uniqueEventIds.map((eventId) => ({
            queryKey: getMatchRowCountQueryKey(eventId),
            queryFn: () => matchRowCountLoader.load(eventId),
            enabled,
            staleTime: MATCH_ROW_COUNT_STALE_TIME,
            gcTime: MATCH_ROW_COUNT_GC_TIME,
        })),
    });
    const countMap = new Map<string, number | undefined>();

    uniqueEventIds.forEach((eventId, index) => {
        countMap.set(eventId, queries[index]?.data);
    });

    return countMap;
};

export const usePrefetchMatchRowCounts = (eventIds: string[]) => {
    const queryClient = useQueryClient();
    const eventIdsKey = useMemo(() => Array.from(new Set(eventIds)).sort().join('\n'), [eventIds]);

    useEffect(() => {
        if (!eventIdsKey) return;

        for (const eventId of eventIdsKey.split('\n')) {
            queryClient
                .prefetchQuery({
                    queryKey: getMatchRowCountQueryKey(eventId),
                    queryFn: () => matchRowCountLoader.load(eventId),
                    staleTime: MATCH_ROW_COUNT_STALE_TIME,
                    gcTime: MATCH_ROW_COUNT_GC_TIME,
                })
                .catch(() => {
                    // Card-level useMatchRowCount remains as the fallback fetch path.
                });
        }
    }, [eventIdsKey, queryClient]);
};
