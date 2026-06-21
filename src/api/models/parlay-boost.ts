import type { Order } from './order';

/** 串关加赔阶梯配置。 */
export interface ParlayBoostLadderTier {
    /** 命中该档所需合规串关数。 */
    legs: number;
    /** 加赔比例，例如 "0.50" 表示 +50%。 */
    boost: string;
    /** UI 展示倍数，例如 "1.50"。 */
    multiplier: string;
}

/** 串关加赔活动适用范围。 */
export interface ParlayBoostScopeRule {
    /** 范围模式，当前前台只消费 include。 */
    mode: 'include' | string;
    /** LSports sport_code 或 sport_id，后端当前返回 number。 */
    sport_id: number | string;
    /** 运动名称，detail 快照可能直接返回本地化名称。 */
    sport_name?: string;
    /** 地区 ID，detail 快照字段；等价于 rule 接口的 region_id。 */
    category_id?: string;
    /** 地区名称，detail 快照可能直接返回本地化名称。 */
    category_name?: string;
    /** 联赛 ID，空字符串表示不限。 */
    league_id: string;
    /** 联赛 ID，detail 快照字段；等价于 rule 接口的 league_id。 */
    tournament_id?: string;
    /** 联赛名称，detail 快照可能直接返回本地化名称。 */
    tournament_name?: string;
    /** 赛事 ID，detail 快照可按单场赛事限定。 */
    event_id?: string;
    /** 赛事名称，detail 快照可能直接返回本地化名称。 */
    event_name?: string;
    /** 区域 ID，空字符串表示不限。 */
    region_id: string;
    /** 数据源 ID，例如 ls。 */
    source: string;
    /** 后端同步时间戳。 */
    last_synced_at: number;
}

/** 订单串关加赔活动绑定快照。 */
export interface ParlayBoostOrderActivityRef {
    /** 活动 ID。 */
    activity_id: number;
    /** 活动类型。 */
    activity_type: string;
    /** 下单时计入加赔的合规腿数。 */
    order_boost_legs: number;
    /** 下单时命中加赔比例。 */
    order_boost_rate: string;
    /** 结算后计入加赔的腿数。 */
    settled_boost_legs: number;
    /** 结算后加赔比例。 */
    settled_boost_rate: string;
    /** 结算后加赔金额。 */
    settled_boost_amount: string;
    /** 绑定状态。 */
    status: number;
    /** 结算时间。 */
    settled_at: number;
}

/** detail 接口返回的活动规则（字段可能比 rule 接口少）。 */
export type ParlayBoostActivityDetailRule = Pick<
    ParlayBoostRule,
    | 'id'
    | 'name'
    | 'version'
    | 'start_time'
    | 'end_time'
    | 'legs'
    | 'min_odds_per_leg'
    | 'boost_cap_per_bet'
    | 'pre_match_only'
    | 'status'
    | 'ladder'
> &
    Partial<
        Pick<
            ParlayBoostRule,
            'country_id' | 'country_code' | 'scope_include' | 'allow_tags' | 'deny_tags' | 'created_at' | 'updated_at'
        >
    >;

/** 订单串关加赔活动详情。 */
export interface ParlayBoostActivityDetail {
    /** 订单快照；仅规则详情场景可能为空。 */
    order: Order | null;
    /** 活动规则快照。 */
    rule: ParlayBoostActivityDetailRule;
    /** 订单活动绑定快照；仅规则详情场景可能为空。 */
    order_activity_ref: ParlayBoostOrderActivityRef | null;
}

/** 串关加赔活动规则。 */
export interface ParlayBoostRule {
    /** 活动 ID。 */
    id: number;
    /** 国家 ID。 */
    country_id: number;
    /** 国家码。 */
    country_code: string;
    /** 活动名称。 */
    name: string;
    /** 活动配置版本。 */
    version: number;
    /** 活动开始时间，秒级时间戳。 */
    start_time: number;
    /** 活动结束时间，秒级时间戳。 */
    end_time: number;
    /** 串关上限，0 表示按最高阶梯封顶。 */
    legs: number;
    /** 单腿最低赔率，0 表示不限。 */
    min_odds_per_leg: string;
    /** 单注加赔金额上限，0 表示不限。 */
    boost_cap_per_bet: string;
    /** 加赔阶梯。 */
    ladder: ParlayBoostLadderTier[];
    /** 活动适用范围。 */
    scope_include: ParlayBoostScopeRule[];
    /** 是否仅赛前盘参与统计。 */
    pre_match_only: 0 | 1;
    /** 准入标签。 */
    allow_tags: string[];
    /** 拒绝标签。 */
    deny_tags: string[];
    /** 活动状态，1 表示生效。 */
    status: number;
    /** 创建时间。 */
    created_at: string;
    /** 更新时间。 */
    updated_at: string;
}
