import type { BetType } from './cart';

export enum OrderType {
    Open = 1,
    Settled = 2,
}

export enum OrderStatus {
    Pending = 0,
    SettledWon = 1,
    SettledLost = 2,
    SettledVoid = 3,
}

// All possible combinations of result and void_factor:
// result="0" without void_factor: lose entire stake
// result="1" without void_factor: win entire stake
// result="0" with void_factor="1": full refund
// result="1" with void_factor="0.5": refund half the stake, win the other half
// result="0" with void_factor="0.5": refund half the stake, lose the other half

export enum OrderSelectionResultStatus {
    Lost = '0',
    Won = '1',
    /** Custom status, unsettled */
    Pending = '-1',
    /** bet cancel */
    Canceled = '3',
}

export enum OrderSelectionVoidFactor {
    NoRefund = '0',
    FullRefund = '1',
    HalfRefund = '0.5',
}

export interface OrderSelection {
    event_id: string;
    event_id_type?: string;
    product: string;
    market_id: string;
    outcome_id: string;
    specifiers: string;
    home_competitor_name: string;
    away_competitor_name: string;
    title: string;
    outcome_name: string;
    outcome_name_alias?: string;
    outcome_odds: string;
    market_name: string;
    sport_id: string;
    sport_name: string;
    tournament_name: string;
    tournament_id?: string;
    result: OrderSelectionResultStatus | '';
    void_factor: OrderSelectionVoidFactor | '';
    void_reason?: string;
}

/** 串关加赔活动引用；订单与注单历史可能返回 id 或 activity_id。 */
export interface ActivityParlayBoostRef {
    /** 串关加赔活动 ID（订单 open/settled 接口）。 */
    id?: number;
    /** 串关加赔活动 ID（注单历史 game/report 接口）。 */
    activity_id?: number;
    /** 活动加赔结算金额，注单历史新结构嵌套在 activity_parlay_boost 内。 */
    activity_settled_amount?: string;
}

/** 解析串关加赔活动 ID。 */
export const resolveActivityParlayBoostId = (ref?: ActivityParlayBoostRef | null): number | undefined => {
    if (!ref) return undefined;

    const activityId = ref.id ?? ref.activity_id;
    if (activityId === undefined || activityId === null) return undefined;

    const numericId = Number(activityId);
    return Number.isFinite(numericId) && numericId > 0 ? numericId : undefined;
};

export interface Order {
    /** MTS 订单主键，串关加赔详情等接口的 order_id 使用该字段。 */
    id: number;
    bet_id: string;
    bet_type: BetType;
    status: OrderStatus;
    /** 串关加赔活动数据；有值时订单展示闪电角标。 */
    activity_parlay_boost?: ActivityParlayBoostRef | null;
    stake_amount: string;
    /** 下注时间戳，投注单列表优先展示该时间。 */
    created_at: number;
    settled_time: number;
    /** 基础结算金额，不包含活动加赔。 */
    settled_amount: string;
    /** 结算后串关总赔率，活动详情弹窗的 Base payout 以此为准。 */
    settled_odds?: string;
    /** 活动加赔结算金额，仅 activity_parlay_boost 有效时计入展示派彩。 */
    activity_settled_amount?: string;
    selections: OrderSelection[];
}
