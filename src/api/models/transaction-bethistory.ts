import type { BetType } from '@/api/models/cart';
import type { ActivityParlayBoostRef } from '@/api/models/order';
import type { CreateUpdateInfo } from './common';

export interface BetSelectionItem {
    event_id: string;
    product: string;
    market_id: string;
    outcome_id: string;
    specifiers: string;
    certainty: string;
    title: string;
    home_competitor_name: string;
    away_competitor_name: string;
    outcome_name: string;
    outcome_odds: string;
    market_name: string;
    sport_name: string;
    tournament_name: string;
    sport_id: string;
    tournament_id: string;
    result: string;
    void_factor: string;
    status_text: string;
}

export interface BetHistoryListItemProps {
    id: number;
    bet_id: string;
    ticket_id: string;
    bet_type: BetType;
    status: number;
    status_text: string;
    stake_amount: string;
    settled_time: number;
    settled_amount: string;
    /** 活动加赔结算金额，仅 activity_parlay_boost 有效时计入展示派彩。 */
    activity_settled_amount?: string;
    settled_odds: string;
    profit_amount: string;
    bettime: number;
    selections: BetSelectionItem[];
    main_bet_amount?: string;
    bonus_bet_amount?: string;
    settled_main_amount?: string;
    settled_bonus_amount?: string;
    bonus_bet_item?: Record<string, unknown>;
    bonus_settled_item?: Record<string, unknown>;
    category?: 'sport' | 'casino';
}

export interface CasinoBetHistoryItemProps {
    id: number;
    user_id: number;
    oc_code: string;
    game_id: string;
    game_code: string;
    game_type: string;
    bet_id: string;
    round_id: string | null;
    transaction_id: string;
    bet_type: string;
    bet_amount: string;
    bonus_id: number;
    settled_amount: string;
    amount: string;
    is_end_round: boolean;
    currency_id: number;
    currency: string;
    wallet_type: string;
    status: number;
    error_msg: string;
    created_at: string;
    updated_at: string;
    g_created_at: string;
    g_updated_at: string;
}

///////// casino //////////////////////////////////
export interface CasinoReportItem extends CreateUpdateInfo {
    id: number;
    order_id: string;
    bet_id: string;
    user_name: string;
    user_id: string;
    platform: string;
    device: string;
    merchant_id: string | number;
    merchant_name: string;
    currency: string;
    game_type: string;
    game_play_type: string;
    bet_type: string;
    game_code: string;
    game_name: string;
    odds: number;
    total_stake: number;
    total_profit: number;
    settled_amount: number;
    status: number;
    status_text?: string;
    result: string;
    bet_time: string;
    settle_time: string;
    type: string;
}

///////// sport //////////////////////////////////
interface FinancialItem {
    name: string;
    profit: string;
    settled: string;
    stake: string;
}

interface BonusItem {
    [key: string]: {
        amount: string;
        product_name: string;
    };
}

interface Lifecycle {
    msg: string;
    time: string;
    title: string;
}

interface BetDetail {
    away_competitor_name: string;
    certainty: string;
    event_id: string;
    home_competitor_name: string;
    market_id: string;
    market_name: string;
    outcome_id: string;
    outcome_name: string;
    outcome_odds: string;
    product: string;
    result: string;
    schedule_at: string;
    score: string;
    specifiers: string;
    sport_id: string;
    sport_name: string;
    status_text: string;
    title: string;
    tournament_id: string;
    tournament_name: string;
    void_factor: string;
}

export interface SportReportItem extends CreateUpdateInfo {
    /** 串关加赔活动引用。 */
    activity_parlay_boost?: ActivityParlayBoostRef | null;
    bet_id: string;
    /**  1单关 2串关  */
    bet_type: string;
    bet_type_string: string;
    bettime: string;
    gametype?: string;
    bonus_bet_amount: string;
    bonus_bet_item: BonusItem;
    bonus_settled_item: BonusItem;
    create_time: string;
    currency: string;
    financial_init: FinancialItem[];
    id: number;
    lifecycle: Lifecycle[];
    main_bet_amount: string;
    profit_amount: string;
    selections: BetDetail[];
    /** 基础结算金额，不包含活动加赔。 */
    settled_amount: string;
    /** 活动加赔结算金额，仅 activity_parlay_boost 有效时计入展示派彩。 */
    activity_settled_amount?: string;
    settled_amount_main_bonus: string;
    settled_bonus_amount: string;
    settled_main_amount: string;
    settled_odds: string;
    settled_time: string;
    stake_amount: string;
    /** 订单状态 0-待结算, 1-赢, 2-输, 3-无结果 */
    status: number;
    status_text?: string;
    ticket_id: string;
    user_name: string;
    venue: string;
    type: string;
}

///////////  all //////////////////////////////////

export interface CasinoContent {
    game_code: string;
    game_name: string;
}

export interface SportContent {
    event_id: string;
    match: string;
    schedule_at: string;
}

export interface GamePlayType {
    bet_type?: string | number | null;
    market_name?: string | null;
}

export interface GameReportItem extends CreateUpdateInfo {
    /** 串关加赔活动引用（与 data 内字段可能重复，优先读顶层）。 */
    activity_parlay_boost?: ActivityParlayBoostRef | null;
    order_id: string;
    username: string;
    currency: string;
    content: CasinoContent | SportContent;
    gametype: string;
    game_play_type: string | GamePlayType | null;
    odds: string;
    stake: string;
    profit: string;
    settled_amount: string;
    /** 活动加赔结算金额，仅 activity_parlay_boost 有效时计入展示派彩。 */
    activity_settled_amount?: string;
    status: string | number;
    status_text?: string;
    bet_time: string;
    settled_time: string;
    type: 'casino' | 'sport';
    data: CasinoReportItem | SportReportItem;
}

export interface SportType {
    sport_id: string;
    name: string;
    sport_code: string;
}
