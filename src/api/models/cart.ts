import type { LineStatus, OutcomeActiveEnum } from './market';

export enum BetType {
    Single = 1,
    /** Parlay */
    Parlay = 2,
}

export interface CartItemOutcome {
    /** Product ID */
    product: string;
    /** Product ID (sport_id) */
    product_raw: string;
    /** Event ID */
    event_id: string;
    event_id_type: string;
    /** Market ID */
    market_id: string;
    /** Market specifiers */
    specifiers: string;
    /** Outcome ID */
    outcome_id: string;
    /** Category ID, used for parlay boost region scope matching */
    category_id?: string;
    line?: string;
}

/** Cart item */
export interface CartItem {
    /** Product ID (sport_id) */
    product: string;
    /** Product raw */
    product_raw: string;
    /** Event ID */
    event_id: string;
    event_id_type: string;
    /** 赛事阶段，1 表示赛前。 */
    match_status: number;
    /** Market ID */
    market_id: string;
    /** Market specifiers */
    specifiers: string;
    /** Outcome ID */
    outcome_id: string;
    /** Outcome name */
    outcome_name: string;
    /** Outcome name alias */
    outcome_name_alias: string;
    /** specifiers status */
    specifiers_status: LineStatus;
    /** odds */
    outcome_odds: string;
    outcome_active: OutcomeActiveEnum;
    market_groups: string;
    /** Market name */
    market_name: string;
    /** Home competitor name */
    home_competitor_name: string;
    /** Away competitor name */
    away_competitor_name: string;
    title: string;
    /** Sport ID */
    sport_id: string;
    /** Sport name */
    sport_name: string;
    /** Tournament name */
    tournament_name: string;
    /** Tournament ID */
    tournament_id: string;
    /** Category ID, used for parlay boost region scope matching */
    category_id?: string;
    /** Whether this is an outright selection (optional until backend confirms the field) */
    is_outright?: boolean;
    timestamp: number;
    line: string;
}

/** Cart status */
export enum CartStatus {
    /** Cart is normal */
    Normal = 1,
    /** Cart is locked (order pending) */
    Locked = 0,
}

/** Cart model */
export interface Cart {
    /** Cart ID */
    id: number;
    /** Version number */
    version: number;
    /** User ID */
    user_id: string;
    /** Status */
    status: CartStatus;
    /** Cart items */
    list: CartItem[];
}

// - none: reject odds changes, ticket is rejected - default behavior
// - any: accept any odds change, considering feed odds
// - lower: (not currently supported) accept when feed odds are equal or lower
// - higher: accept when feed odds are equal or higher
export enum OddsChangePolicy {
    None = 'none',
    Any = 'any',
    Lower = 'lower',
    Higher = 'higher',
}

export type CartSettings = {
    odds_change: OddsChangePolicy;
};
