'use client';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { GetCurrentParlayBoostActivityDetailInterface } from '@/api/handlers/parlay-boost';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import { normalizeParlayBoostDetailRule } from '@/utils/parlay-boost-activity-detail';

/** 串关加赔规则缓存键。 */
export const PARLAY_BOOST_RULE_QUERY_KEY = ['parlay-boost-rule'] as const;

interface UseParlayBoostRuleOptions {
    /** 是否启用规则请求。 */
    enabled?: boolean;
}

/** 获取当前串关加赔活动规则。 */
export const useParlayBoostRule = (options: UseParlayBoostRuleOptions = {}): UseQueryResult<ParlayBoostRule | null> => {
    return useQuery<ParlayBoostRule | null>({
        queryKey: PARLAY_BOOST_RULE_QUERY_KEY,
        queryFn: async () => {
            const detail = await GetCurrentParlayBoostActivityDetailInterface();
            return detail ? normalizeParlayBoostDetailRule(detail.rule) : null;
        },
        staleTime: 0,
        refetchOnWindowFocus: true,
        retry: false,
        enabled: options.enabled ?? true,
    });
};
