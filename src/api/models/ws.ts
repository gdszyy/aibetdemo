/**
 * WebSocket push data models
 */

import { type LineStatus, type OutcomeActiveEnum, type ProductEnum, resolveProductRaw } from './market';
import type { MatchClock, MatchStatus, PeriodScore } from './match';

export type {
    MatchClock,
    MatchResult,
    MatchStatistics,
    OddsGenerationProperties,
    PeriodScore,
    SportEventStatus,
    TeamStatistics,
} from './match';

type NumericLike = number | string | '' | null | undefined;

export interface OddsChangeOutcomePayload {
    id: string;
    name?: string;
    name_alias?: string;
    quick_name?: string;
    odds?: number;
    active?: OutcomeActiveEnum;
    line?: string;
    sorted?: number;
    /** 投注项赔率更新时间，由后端在 outcome 级别下发。 */
    last_update?: number;
}

export interface OddsChangeLinePayload {
    id?: number;
    product: string;
    product_raw: string;
    specifiers: string;
    row?: string;
    is_main_line?: boolean;
    line_status?: LineStatus;
    outcomes: OddsChangeOutcomePayload[];
}

export interface OddsChangeMarketPayload {
    id: number;
    name?: string;
    lines: OddsChangeLinePayload[];
}

interface RawOddsChangeOutcomePayload {
    id: string | number;
    name?: string;
    name_alias?: string;
    quick_name?: string;
    odds?: NumericLike;
    active?: NumericLike;
    line?: NumericLike;
    sorted?: NumericLike;
    order?: NumericLike;
    last_update?: NumericLike;
}

interface RawOddsChangeLinePayload {
    id?: NumericLike;
    product?: NumericLike;
    product_raw?: NumericLike;
    specifiers?: string;
    row?: string;
    is_main_line?: boolean | NumericLike;
    line_status?: NumericLike;
    status?: NumericLike;
    outcomes?: RawOddsChangeOutcomePayload[];
}

interface RawOddsChangeMarketPayload extends RawOddsChangeLinePayload {
    id: NumericLike;
    name?: string;
    lines?: RawOddsChangeLinePayload[];
}

export interface RawOddsChangePayload {
    source?: NumericLike;
    event_id: string;
    product?: NumericLike;
    markets?: RawOddsChangeMarketPayload[];
    odds?: {
        markets?: RawOddsChangeMarketPayload[];
    };
}

export interface OddsChangePayload {
    source: number | null;
    event_id: string;
    product: string | null;
    markets: OddsChangeMarketPayload[];
}

export interface RawLiveScorePayload {
    source?: NumericLike;
    event_id: string;
    home_score?: NumericLike;
    away_score?: NumericLike;
    status?: NumericLike;
    clock?: { Seconds: number } | null;
    raw_status?: string;
    match_status?: NumericLike;
    periods?: RawLiveScorePeriodPayload[];
    push_timestamp?: NumericLike;
}

export interface LiveScorePayload {
    source: number | null;
    event_id: string;
    home_score: number | null;
    away_score: number | null;
    status: MatchStatus | null;
    raw_status?: string;
    match_status: number | null;
    period_score?: PeriodScore[];
    timestamp: number | null;
    clock_seconds?: number | null;
}

interface RawLiveScorePeriodPayload {
    period_type?: NumericLike;
    period_type_desc?: string;
    sequence_no?: NumericLike;
    is_finished?: boolean;
    is_confirmed?: boolean;
    period_home_score?: NumericLike;
    period_away_score?: NumericLike;
}

const toNumber = (value: NumericLike): number | null => {
    if (value === '' || value === null || value === undefined) return null;

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const toText = (value: NumericLike): string | undefined => {
    if (value === '' || value === null || value === undefined) return undefined;

    return String(value);
};

const toBoolean = (value: boolean | NumericLike): boolean | undefined => {
    if (value === true || value === false) return value;
    if (value === '' || value === null || value === undefined) return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;

    const parsed = Number(value);
    if (parsed === 1) return true;
    if (parsed === 0) return false;

    return undefined;
};

const normalizeOddsChangeLine = (
    line: RawOddsChangeLinePayload,
    fallbackProduct: string | null,
): OddsChangeLinePayload => {
    const product = toText(line.product) ?? fallbackProduct ?? '';

    return {
        id: toNumber(line.id) ?? undefined,
        product,
        product_raw: resolveProductRaw(product, toText(line.product_raw)),
        specifiers: line.specifiers ?? '',
        row: line.row,
        is_main_line: toBoolean(line.is_main_line),
        line_status: (toNumber(line.line_status ?? line.status) as LineStatus | null) ?? undefined,
        outcomes: (line.outcomes ?? []).map((outcome) => ({
            id: String(outcome.id),
            name: outcome.name || undefined,
            name_alias: outcome.name_alias,
            quick_name: outcome.quick_name,
            odds: toNumber(outcome.odds) ?? undefined,
            active: (toNumber(outcome.active) as OutcomeActiveEnum | null) ?? undefined,
            line: toText(outcome.line),
            sorted: toNumber(outcome.sorted) ?? toNumber(outcome.order) ?? undefined,
            last_update: toNumber(outcome.last_update) ?? undefined,
        })),
    };
};

const getRawOddsChangeLines = (
    market: RawOddsChangeMarketPayload,
    fallbackProduct: string | null,
): OddsChangeLinePayload[] => {
    if (market.lines?.length) {
        return market.lines.map((line) => normalizeOddsChangeLine(line, fallbackProduct));
    }

    // Legacy payload shape: a market entry itself describes a single line.
    return [normalizeOddsChangeLine(market, fallbackProduct)];
};

export const normalizeOddsChangePayload = (payload: RawOddsChangePayload): OddsChangePayload => {
    const fallbackProduct = toText(payload.product) ?? null;
    const rawMarkets = payload.markets ?? payload.odds?.markets ?? [];

    const normalizedPayload: OddsChangePayload = {
        source: toNumber(payload.source),
        event_id: payload.event_id,
        product: fallbackProduct,
        markets: rawMarkets.flatMap((market) => {
            const marketId = toNumber(market.id);

            if (marketId === null) {
                return [];
            }

            return [
                {
                    id: marketId,
                    name: market.name || undefined,
                    lines: getRawOddsChangeLines(market, fallbackProduct),
                } satisfies OddsChangeMarketPayload,
            ];
        }),
    };

    return normalizedPayload;
};

export const normalizeLiveScorePayload = (payload: RawLiveScorePayload): LiveScorePayload => {
    const matchStatus = toNumber(payload.match_status);
    const rawStatus = toNumber(payload.raw_status);
    const periodScore = normalizeLiveScorePeriodScores(payload.periods);

    const normalizedPayload: LiveScorePayload = {
        source: toNumber(payload.source),
        event_id: payload.event_id,
        home_score: toNumber(payload.home_score),
        away_score: toNumber(payload.away_score),
        status: toNumber(payload.status) as MatchStatus | null,
        raw_status: payload.raw_status,
        match_status: matchStatus ?? rawStatus,
        timestamp: toNumber(payload.push_timestamp),
    };

    if (periodScore !== undefined) {
        normalizedPayload.period_score = periodScore;
    }
    if (payload.clock !== undefined) {
        normalizedPayload.clock_seconds = payload.clock?.Seconds ?? null;
    }

    return normalizedPayload;
};

const normalizeLiveScorePeriodScores = (periods: RawLiveScorePayload['periods']): PeriodScore[] | undefined => {
    if (!Array.isArray(periods)) {
        return undefined;
    }

    return periods
        .map((period) => {
            const periodId = toNumber(period.period_type);
            const homeScore = toNumber(period.period_home_score);
            const awayScore = toNumber(period.period_away_score);

            if (periodId === null || homeScore === null || awayScore === null) {
                return null;
            }

            const description = period.period_type_desc ?? '';

            return {
                period_id: periodId,
                description,
                short_name: description,
                home_score: homeScore,
                away_score: awayScore,
            } satisfies PeriodScore;
        })
        .filter((period): period is PeriodScore => period !== null);
};

export enum FixtureChangeType {
    Added = 1,
    StartTimeUpdated = 2,
    Cancelled = 3,
}

export interface RawFixtureChangePayload {
    source?: NumericLike;
    event_id: string;
    home_score?: NumericLike;
    away_score?: NumericLike;
    status?: NumericLike;
    raw_status?: string;
    match_status?: NumericLike;
    push_timestamp?: NumericLike;
    timestamp?: NumericLike;
    clock?: MatchClock | null;
    start_time?: NumericLike;
    product?: NumericLike;
    change_type?: NumericLike;
}

export interface FixtureChangePayload {
    source: number | null;
    home_score: number | null;
    away_score: number | null;
    status: MatchStatus | null;
    raw_status?: string;
    match_status: number | null;
    timestamp: number | null;
    clock?: MatchClock | null;
    /** Change type: 1 = added, 2 = start time updated, 3 = cancelled */
    change_type: FixtureChangeType | null;
    /** Match start time (ms) */
    start_time: number | null;
    /** Product type: 1 = live, 3 = pre-match */
    product: ProductEnum | string | null;
    /** Match ID */
    event_id: string;
}

export const normalizeFixtureChangePayload = (payload: RawFixtureChangePayload): FixtureChangePayload => {
    const normalizedPayload: FixtureChangePayload = {
        source: toNumber(payload.source),
        event_id: payload.event_id,
        home_score: toNumber(payload.home_score),
        away_score: toNumber(payload.away_score),
        status: toNumber(payload.status) as MatchStatus | null,
        raw_status: payload.raw_status,
        match_status: toNumber(payload.match_status),
        timestamp: toNumber(payload.push_timestamp) ?? toNumber(payload.timestamp),
        start_time: toNumber(payload.start_time),
        product: toText(payload.product) ?? null,
        change_type: (toNumber(payload.change_type) as FixtureChangeType | null) ?? null,
    };

    if (payload.clock !== undefined) {
        normalizedPayload.clock = payload.clock;
    }

    return normalizedPayload;
};

export interface MatchStatusPayload {
    /** Match ID */
    sport_event_id: string;
    status_code: MatchStatus;
    match_status_code: number;
}

export interface AlivePayload {
    alive: boolean;
    product: string;
}

export enum OrderPlacedStatus {
    Accepted = 'accepted',
    Rejected = 'rejected',
    Error = 'error',
    Timeout = 'timeout',
}

export interface OrderPlacedStatusPayload {
    /** User ID */
    user_id: string;
    /** Ticket ID */
    ticket_id: string;
    /** 业务码 */
    biz_code: string;
    /** Order status */
    status: OrderPlacedStatus;
    /** Order message */
    message: string;
}
