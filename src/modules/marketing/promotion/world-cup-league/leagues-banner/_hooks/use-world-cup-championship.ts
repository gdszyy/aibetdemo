'use client';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { GetWorldCupChampionshipInterface } from '@/api/handlers/promotion-world-cup-league';
import type { WorldCupChampionship } from '@/api/models/promotion-world-cup-league';

/** 世界杯冠军盘查询缓存键。 */
const WORLD_CUP_CHAMPIONSHIP_QUERY_KEY = ['world-cup', 'championship'] as const;

/** 查询世界杯冠军盘数据。 */
export const useWorldCupChampionship = (): UseQueryResult<WorldCupChampionship> => {
    // TODO: 后续复用 Outright WebSocket 订阅能力，接入冠军盘实时赔率变化。
    return useQuery({
        queryKey: WORLD_CUP_CHAMPIONSHIP_QUERY_KEY,
        queryFn: GetWorldCupChampionshipInterface,
    });
};
