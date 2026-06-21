import { type FetchOptions, uofFetcher } from '@/api/client';
import type { ParlayBoostActivityDetail, ParlayBoostRule } from '@/api/models/parlay-boost';

export interface ParlayBoostActivityDetailQueryParams {
    /** MTS 订单主键 id，非 bet_id。 */
    order_id?: string;
    /** 串关加赔活动 ID。 */
    activity_parlay_boost_id: number;
}

/** 获取当前生效的串关加赔活动规则，未登录也可访问。 */
export const GetParlayBoostRuleInterface = (): Promise<ParlayBoostRule | null> => {
    return uofFetcher.get<ParlayBoostRule | null>('/v1/activity/parlay-boost/rule', undefined, {
        withAuth: false,
    });
};

/** 获取当前生效串关加赔活动的 detail 快照，用于消费 detail.rule。 */
export const GetCurrentParlayBoostActivityDetailInterface = async (): Promise<ParlayBoostActivityDetail | null> => {
    const rule = await GetParlayBoostRuleInterface();
    if (!rule) return null;

    return GetParlayBoostActivityDetailInterface(
        {
            activity_parlay_boost_id: rule.id,
        },
        {
            withAuth: false,
        },
    );
};

/** 获取订单串关加赔活动详情。 */
export const GetParlayBoostActivityDetailInterface = (
    params: ParlayBoostActivityDetailQueryParams,
    options?: FetchOptions,
): Promise<ParlayBoostActivityDetail> => {
    return uofFetcher.get<ParlayBoostActivityDetail>('/v1/activity/parlay-boost/detail', params, options);
};
