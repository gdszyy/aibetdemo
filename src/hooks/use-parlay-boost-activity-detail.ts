'use client';

import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { GetParlayBoostActivityDetailInterface } from '@/api/handlers/parlay-boost';
import type { ParlayBoostActivityDetail, ParlayBoostRule } from '@/api/models/parlay-boost';
import {
    buildParlayBoostBetContextFromActivityDetail,
    normalizeParlayBoostDetailRule,
} from '@/utils/parlay-boost-activity-detail';
import type { ParlayBoostRulesBetContext } from '@/utils/parlay-boost-rules-context';

/** 订单串关加赔活动详情缓存键。 */
export const PARLAY_BOOST_ACTIVITY_DETAIL_QUERY_KEY = ['parlay-boost-activity-detail'] as const;

interface UseParlayBoostActivityDetailOptions {
    /** MTS 订单主键 id（字符串），非 bet_id。 */
    orderId: string;
    /** 串关加赔活动 ID。 */
    activityParlayBoostId?: number;
    /** 是否启用请求。 */
    enabled?: boolean;
}

interface ParlayBoostActivityDetailResult {
    /** 订单串关加赔活动原始详情。 */
    detail: ParlayBoostActivityDetail;
    /** 规则弹窗可直接消费的活动规则。 */
    rule: ParlayBoostRule;
    /** 规则弹窗可直接消费的投注上下文。 */
    betContext: ParlayBoostRulesBetContext;
}

/** 获取订单串关加赔活动详情，并转换为规则弹窗可直接消费的数据。 */
export const useParlayBoostActivityDetail = ({
    orderId,
    activityParlayBoostId,
    enabled = true,
}: UseParlayBoostActivityDetailOptions): UseQueryResult<ParlayBoostActivityDetailResult> => {
    return useQuery<ParlayBoostActivityDetailResult>({
        queryKey: [...PARLAY_BOOST_ACTIVITY_DETAIL_QUERY_KEY, orderId, activityParlayBoostId],
        queryFn: async () => {
            const detail = await GetParlayBoostActivityDetailInterface({
                order_id: orderId,
                activity_parlay_boost_id: activityParlayBoostId ?? 0,
            });

            const rule = normalizeParlayBoostDetailRule(detail.rule);

            return {
                detail,
                rule,
                betContext: buildParlayBoostBetContextFromActivityDetail(detail, rule),
            };
        },
        enabled: enabled && !!orderId && activityParlayBoostId !== undefined,
        staleTime: 0,
        refetchOnWindowFocus: true,
        retry: false,
    });
};
