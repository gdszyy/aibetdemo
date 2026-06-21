import type { MarketGroup } from './market';
import { type MatchClock, MatchStatus, type PeriodScore } from './match';

export { MatchStatus };

/** Competitor information */
export type Competitor = {
    /** Competitor ID, e.g., sr:competitor:28 */
    competitor_id: string;
    /** Competitor logo URL */
    logo: string;
    /** Competitor name */
    name: string;
    /** Current score */
    score: number;
};

/** Match event information */
export type MatchEvent = {
    /** Event ID, e.g., sr:match:61493553 */
    event_id: string;
    /** Event ID type, e.g., match */
    event_id_type: string;
    /** Match start time (timestamp) */
    start_time: number;
    /** Match status */
    status: MatchStatus;
    /** Match status code */
    match_status: number;
    /** Home competitor information */
    home_competitor: Competitor;
    /** Away competitor information */
    away_competitor: Competitor;
    /** Sync timestamp */
    timestamp: number;
    /** Last LiveScore WS timestamp — isolated from OddsChange timestamp for staleness guard */
    live_score_timestamp?: number;
    /** Match clock (seconds) */
    match_clock: MatchClock | null;
    /** Period scores by match period */
    period_score?: PeriodScore[];
    /** Current time from server (seconds) */
    curr_time: number;
    /** Match clock offset */
    match_clock_offset: number;
    /** List of markets (1x2, Handicap, Total) */
    markets: MarketGroup[];
    popularMarkets: MarketGroup[];
    /** Total live market count for the event */
    live_market_count: number;
    /** Total market row count from batch count API (replaces live_market_count) */
    live_market_total?: number;
    /** Market IDs list */
    market_ids: string[] | null;
};

export type MatchEventResponse = Omit<MatchEvent, 'markets' | 'popularMarkets' | 'live_market_count' | 'market_ids'> & {
    /** List of markets (1x2, Handicap, Total) */
    markets?: MarketGroup[] | null;
    popularMarkets?: MarketGroup[] | null;
    /** Total live market count for the event */
    live_market_count?: number;
    /** Market IDs list */
    market_ids?: string[] | null;
};

export type MarketColumns = {
    id: string;
    name: string;
    outcome_count?: number;
}[];

/** Match group by tournament */
export type TournamentGroup = {
    /** Sport ID, e.g., sr:sport:1 */
    sport_id: string;
    /** Sport name, e.g., Soccer */
    sport_name: string;
    /** Category ID, e.g., sr:category:1 */
    category_id: string;
    /** Category name, e.g., England */
    category_name: string;
    /** Tournament ID, e.g., sr:tournament:24 */
    tournament_id: string;
    /** Tournament name, e.g., League One */
    tournament_name: string;
    market_columns: MarketColumns;

    /** List of match events in this tournament group */
    events: MatchEvent[];
};

export type MatchEventWithGroup = MatchEvent & {
    /** Sport ID, e.g., sr:sport:1 */
    sport_id: string;
    /** Sport name, e.g., Soccer */
    sport_name: string;
    /** Category ID, e.g., sr:category:1 */
    category_id: string;
    /** Category name, e.g., International */
    category_name: string;
    /** Tournament ID, e.g., sr:tournament:1 */
    tournament_id: string;
    /** Tournament name, e.g., World Cup */
    tournament_name: string;
};

export type MatchEventWithGroupResponse = MatchEventResponse & {
    /** Sport ID, e.g., sr:sport:1 */
    sport_id: string;
    /** Sport name, e.g., Soccer */
    sport_name: string;
    /** Category ID, e.g., sr:category:1 */
    category_id: string;
    /** Category name, e.g., International */
    category_name: string;
    /** Tournament ID, e.g., sr:tournament:1 */
    tournament_id: string;
    /** Tournament name, e.g., World Cup */
    tournament_name: string;
};

/** Hot matches query parameters */
export type HotMatchesQueryParams = {
    /** Sport type ID */
    sport_id: string;
};

/** Hot matches response */
export type HotMatchesResponse = TournamentGroup[] | null;

/** Best home match query parameters */
export type HomeBestMatchesQueryParams = {
    /** Sport type ID (optional) */
    sport_id?: string;
    /** Pagination cursor (optional) */
    cursor?: string;
    /** Page size limit, default 10 (optional) */
    limit?: number;
};

/** Best home match response */
export type HomeBestMatchesResponse = {
    list: MatchEventWithGroupResponse[];
    cursor: string;
} | null;

/** 直播赛事数量查询参数 */
export type LiveMatchCountQueryParams = {
    /** 体育类型 ID 列表 */
    sport_id: string[];
};

/** 直播赛事数量响应，key 为 sport_id，"0" 表示全部直播赛事数量 */
export type LiveMatchCountResponse = Record<string, number>;

/** Popular match query parameters */
export type PopularMatchQueryParams = {
    /** Event ID (Match ID), e.g., sr:match:61493553 */
    event_id: string;
};

/** Popular match response */
export type PopularMatchResponse = {
    markets: MarketGroup[];
};

/** Search matches query parameters */
export type SearchMatchesQueryParams = {
    /** Sport type ID (optional) */
    sport_id?: string;
    /** Category ID (optional) */
    category_id?: string;
    /** Tournament ID (optional) */
    tournament_id?: string;
    /** Match status (optional) */
    status?: MatchStatus;
    /** Start time timestamp in milliseconds (optional) */
    from?: number;
    /** End time timestamp in milliseconds (optional) */
    to?: number;
    /** Pagination cursor (optional) */
    cursor?: string;
    /** Page size limit, default 20 (optional) */
    limit?: number;
};

/** Search matches response */
export type MatchListPageResponse = {
    list: TournamentGroup[];
    next_cursor: string;
    total?: number;
};

/** Search matches response */
export type SearchMatchesResponse = MatchListPageResponse;

/** Breadcrumb query parameters */
export type BreadcrumbQueryParams = {
    /** Sport type ID (optional) */
    sport_id?: string;
    /** Category ID (optional) */
    category_id?: string;
    /** Tournament ID (optional) */
    tournament_id?: string;
    /** Event ID / Match ID (optional) */
    event_id?: string;
};

/** Breadcrumb response */
export type BreadcrumbResponse = {
    sport_id: string;
    sport_name: string;
    category_id: string;
    category_name: string;
    tournament_id: string;
    tournament_name: string;
    /** Home competitor name */
    home_name: string;
    /** Away competitor name */
    away_name: string;
};

/** Single chip configuration item attached to a tab */
export type MarketChip = {
    /** Chip identifier */
    id: number;
    /** Chip display name */
    chip_name: string;
    /** Market IDs included in this chip */
    market_id: number[];
};

/** Market tab grouping information */
export type MarketTab = {
    /** Tab identifier */
    id: number;
    /** Tab semantic key, e.g. "popular" */
    tab_key: string;
    /** Tab display name, e.g., "Popular", "Corners", "Goals" */
    tab_name: string;
    /** Market IDs included in this tab */
    market_ids: number[];
    /** Market display order for match detail page */
    market_sort?: number[];
    /** Optional chip filters scoped to this tab */
    chips: MarketChip[];
    /** Sort order returned by backend */
    sorted: number;
};

/** Market category tabs query parameters */
export type MarketTabQueryParams = {
    /** Sport ID (optional) */
    sport_id?: string;
};

/** Market category tabs response */
export type MarketTabResponse = MarketTab[];

// TODO 删除？
/** Market chip (period filter) — same query shape as {@link MarketTabQueryParams} */
export type MarketChipQueryParams = MarketTabQueryParams;

// TODO 删除？
/** Single chip configuration item */
export type MarketChipItem = {
    /** Chip config ID */
    id: number;
    /** Chip display names, may contain template placeholders, e.g., "${period} Half" */
    chip_name: string[];
    /** Template placeholder key used in chip_name, e.g., "period" */
    placeholder: string;
};

// TODO 删除？
/** Market chip configuration — array of chip dimensions per sport */
export type MarketChipResponse = MarketChipItem[];

/** Market list query parameters for match detail */
export type MarketListQueryParams = {
    /** Event ID (required) */
    event_id: string;
    /** Tab ID (required) */
    tab_id: number;
};

/** Market list response for match detail */
export type MarketListResponse = MarketGroup[];

/** Batch match row count query parameters */
export type MatchRowBatchCountQueryParams = {
    /** List of event IDs to query */
    event_ids: string[];
};

/**
 * Batch match row count response
 * Keys are event IDs; values are arrays of market row keys
 * live_market_total = response[event_id].length
 */
export type MatchRowBatchCountResponse = Record<string, string[]>;
