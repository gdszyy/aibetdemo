import type { MarketGroup } from './market';
import type { Competitor } from './match-game';

/** 比赛计时状态：0 停止，1 运行。 */
export enum MatchClockStatus {
    /** 停止计时 */
    Stopped = 0,
    /** 正在计时 */
    Running = 1,
}

export interface MatchClock {
    /** 后端计时状态：0 停止，1 运行。 */
    status: MatchClockStatus;
    /** 后端比赛已进行秒数。 */
    seconds: number;
    /** 后端计时时间戳，毫秒。 */
    timestamp: number;
}

export interface PeriodScore {
    period_id: number;
    description: string;
    short_name: string;
    home_score: number;
    away_score: number;
}

export interface MatchResult {
    /** Match status code (100 = match ended) */
    match_status_code: string;
    /** Home team score */
    home_score: string;
    /** Away team score */
    away_score: string;
}

export interface TeamStatistics {
    home: number;
    away: number;
}

export interface MatchStatistics {
    yellow_cards: TeamStatistics;
    red_cards: TeamStatistics;
    yellow_red_cards: TeamStatistics;
    corners: TeamStatistics;
}

export interface SportEventStatus {
    /** Match status */
    status: string;
    /** Data reporting status code */
    reporting: string;
    /** In-play status */
    match_status: string;
    /** Home team score */
    home_score: number;
    /** Away team score */
    away_score: number;
    /** Match clock */
    clock: MatchClock;
    /** Period scores */
    period_score: PeriodScore[];
    /** Final results */
    results: MatchResult[];
    /** Match statistics */
    statistics: MatchStatistics;
}

export interface OddsGenerationProperties {
    /** Expected totals */
    expected_totals: string;
    /** Expected supremacy */
    expected_supremacy: string;
}

export interface OddsEventEntity {
    eventId: string;
    eventIdType: string;
    tournamentId: string;
    /** 地区 ID，用于活动规则 region_id 匹配。 */
    categoryId?: string;
    isOutright?: boolean;
    title: string;
    sportId?: string;
}

/** Match status */
export enum MatchStatus {
    /** Not started */
    NotStarted = 1,
    /** Live */
    Live = 2,
    /** Suspended */
    // !sr有这个状态，ls没有
    // Suspended = 2,
    /** Ended */
    Ended = 3,
}

/** 比赛类型 */
export enum SportCode {
    /** 足球 */
    Football = '1',
    /** 篮球 */
    Basketball = '2',
    /** 棒球 */
    Baseball = '3',
    /** 冰球 */
    IceHockey = '4',
    /** 网球 */
    Tennis = '5',
    /** 橄榄球 */
    Rugby = '12',
    /** 乒乓球 */
    PingPong = '20',
    /** 板球 */
    Badminton = '21',
    /** 排球 */
    Volleyball = '23',
    /** 羽毛球 */
    Yachting = '31',
    /** 电竞-CS */
    EsportsCS = '109',
    /** 电竞-Dota */
    EsportsDota = '111',
}

/** Match info */
export interface Match {
    /** Sport event ID */
    event_id: string;
    event_id_type: string;
    /** Sport ID */
    sport_id: string;
    /** 比赛类型 */
    sport_code: SportCode;
    /** Category ID */
    category_id?: string;
    /** Tournament ID */
    tournament_id: string;
    /** Start time (timestamp) */
    start_time: number;
    /** Match status */
    status: MatchStatus;
    /** Detailed match status code */
    match_status: number;
    /** Home competitor info */
    home_competitor: Competitor;
    /** Away competitor info */
    away_competitor: Competitor;
    /** Sync timestamp */
    timestamp: number;
    /** Last LiveScore WS timestamp — isolated from OddsChange timestamp for staleness guard */
    live_score_timestamp?: number;
    match_clock: MatchClock | null;
    /** Period scores by match period. */
    period_score?: PeriodScore[];
    /** Server current time */
    curr_time: number;
    /** Match clock offset */
    match_clock_offset: number;
}

export type MatchWithMarkets = Match & { markets?: MarketGroup[] };
