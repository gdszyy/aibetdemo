import type { LineStatus, OutcomeActiveEnum } from '@/api/models/market';

/** Home recommend card type. */
export enum RecommendCardType {
    ParlayBoost = 1,
    SuperOdd = 2,
    FollowBet = 3,
}

/** 推荐串关加赔卡片投注腿参数。 */
export interface RecommendCardLeg {
    /** 产品 ID。 */
    product: string;
    /** 赛事 ID。 */
    event_id: string;
    /** 市场 ID。 */
    market_id: string;
    /** 投注项 ID。 */
    outcome_id: string;
    /** 盘口参数。 */
    specifiers: string;
    /** 原始产品类型。 */
    product_raw: string;
    /** 赛事 ID 类型。 */
    event_id_type: string;
}

/** 推荐串关加赔卡片中的可展示投注项详情。 */
export interface RecommendCardSelection {
    /** 赛事 ID。 */
    event_id: string;
    /** 赛事 ID 类型。 */
    event_id_type: string;
    /** 赛事阶段，1 表示赛前。 */
    match_status: number;
    /** 产品 ID。 */
    product: string;
    /** 原始产品类型。 */
    product_raw: string;
    /** 市场 ID。 */
    market_id: string;
    /** 盘口参数。 */
    specifiers: string;
    /** 盘口状态。 */
    specifiers_status: LineStatus;
    /** 数据时间戳。 */
    timestamp: number;
    /** 投注项 ID。 */
    outcome_id: string;
    /** 当前赔率。 */
    outcome_odds: string;
    /** 投注项状态。 */
    outcome_active: OutcomeActiveEnum;
    /** 投注项盘口线。 */
    outcome_line: string;
    /** 投注项名称。 */
    outcome_name: string;
    /** 投注项别名。 */
    outcome_name_alias: string;
    /** 比赛标题。 */
    title: string;
    /** 市场名称。 */
    market_name: string;
    /** 主队名称。 */
    home_competitor_name: string;
    /** 客队名称。 */
    away_competitor_name: string;
    /** 运动 ID。 */
    sport_id: string;
    /** 地区 ID，对应活动规则 region_id。 */
    category_id?: string;
    /** 联赛 ID。 */
    tournament_id: string;
}

/** 首页推荐串关加赔卡片。 */
export interface RecommendCard {
    /** 推荐卡片 ID。 */
    id: number;
    /** Card type. Missing legacy data is treated as parlay boost. */
    type?: RecommendCardType | number | string;
    /** Compatibility aliases for card type. */
    card_type?: RecommendCardType | number | string;
    recommend_type?: RecommendCardType | number | string;
    activity_type?: RecommendCardType | number | string;
    /** 推荐标题。 */
    title: string;
    /** 活动 ID。 */
    activity_id: number;
    /** 推荐投注腿参数。 */
    legs: RecommendCardLeg[];
    /** 推荐投注项展示详情。 */
    json_list: RecommendCardSelection[];
    /** 国家 ID。 */
    country_id: number;
    /** 国家码。 */
    country_code: string;
    /** 下架原因。 */
    delisted_reason: string;
    /** 状态，1 表示展示。 */
    status: number;
    /** 数据版本。 */
    version: number;
    /** 下架时间。 */
    delisted_at: number | null;
    /** 创建时间，秒级时间戳。 */
    created_at: number;
    /** 更新时间，秒级时间戳。 */
    updated_at: number;
}
