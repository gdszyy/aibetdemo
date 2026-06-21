import {
    filterVisibleOutcomes,
    getMarketGroupId,
    isOutcomeActiveLocked,
    LineStatus,
    type MarketGroup,
    type MarketLine,
    type OutcomeActiveEnum,
    type OutcomeModel,
    ProductEnum,
    shouldShowOutcome,
} from '@/api/models/market';
import { type Match, MatchStatus, type PeriodScore } from '@/api/models/match';
import type { LiveScorePayload, MatchClock } from '@/api/models/ws';
import { getSportTypeBySportId, SportType } from '@/constants/sports';
import type { Locale, Timezone } from '@/i18n';
import { isMatchClockStopped } from '@/modules/match/_utils/match-clock-utils';
import { applyPeriodMappings, type PeriodMappingBySport } from '@/utils/period-mapping';
import { CORRECT_SCORE_MARKETS_HIDE_LOCKED, LIVE_MARKET_STALE_MS } from '../_constants/constants';

/**
 * Determine whether a line should be displayed.
 * Shown when Active(1) or Suspended(-1); hidden for other statuses.
 */
export const shouldShowLine = (status: LineStatus): boolean => {
    return status === LineStatus.Active || status === LineStatus.Suspended;
};

/**
 * Determine whether a line is locked.
 * All outcomes show as locked when Suspended(-1).
 */
export const isLineLocked = (status: LineStatus): boolean => {
    return status === LineStatus.Suspended;
};

export const isOutcomeLocked = (lineStatus: LineStatus, outcomeActive: OutcomeActiveEnum): boolean => {
    return isLineLocked(lineStatus) || isOutcomeActiveLocked(outcomeActive);
};

interface VisibleMarketLinesOptions {
    /** 市场 ID，用于判断是否需要隐藏锁盘投注项 */
    marketId?: number;
    /** Outright 盘口始终隐藏锁盘投注项 */
    isOutright?: boolean;
}

/** Outright 与指定准确比分盘口需隐藏锁盘投注项 */
export const shouldHideLockedOutcomes = (marketId: number, isOutright = false): boolean => {
    return isOutright || CORRECT_SCORE_MARKETS_HIDE_LOCKED.has(marketId);
};

const filterOutcomesForDisplay = (
    outcomes: OutcomeModel[],
    lineStatus: LineStatus,
    options: VisibleMarketLinesOptions = {},
): OutcomeModel[] => {
    const hideLocked = options.marketId !== undefined && shouldHideLockedOutcomes(options.marketId, options.isOutright);

    if (!hideLocked) {
        return filterVisibleOutcomes(outcomes);
    }

    if (isLineLocked(lineStatus)) {
        return [];
    }

    return outcomes.filter((outcome) => shouldShowOutcome(outcome.active) && !isOutcomeActiveLocked(outcome.active));
};

export const getVisibleMarketLines = (lines: MarketLine[], options: VisibleMarketLinesOptions = {}): MarketLine[] => {
    return lines
        .map((line) => ({
            ...line,
            outcomes: filterOutcomesForDisplay(line.outcomes, line.line_status, options),
        }))
        .filter((line) => shouldShowLine(line.line_status) && line.outcomes.length > 0);
};

export const formatMarketCount = (count: number): string => {
    return Math.max(Math.trunc(count), 0).toString();
};

/** 比赛列表只展示未完赛的比赛。 */
export const shouldShowMatchInList = (match: Pick<Match, 'status'>): boolean => {
    return match.status !== MatchStatus.Ended;
};

export const isBasketballSport = (sportId?: string): boolean => {
    return getSportTypeBySportId(sportId) === SportType.Basketball;
};

/** Determine whether a sport identifier belongs to rugby / American football. */
export const isRugbySport = (sportId?: string): boolean => {
    const sportType = getSportTypeBySportId(sportId);
    return sportType === SportType.Rugby || sportType === SportType.AmericanFootball;
};

/** Determine whether a sport displays set-style period columns. */
export const isSetBasedSport = (sportId?: string): boolean => {
    const sportType = getSportTypeBySportId(sportId);
    return sportType === SportType.TableTennis || sportType === SportType.Volleyball || isRugbySport(sportId);
};

/** Period score display variants used by list and detail cards. */
export enum PeriodScoreDisplayMode {
    /** H5 list: compact current period plus match score. */
    MobileList = 'mobile-list',
    /** PC list and detail: period cells only where the sport requires it. */
    FullPeriods = 'full-periods',
}

const TENNIS_GAME_PERIOD_ID = 60;
const TENNIS_GAME_LABEL = 'G';
const CURRENT_PERIOD_LABEL = 'S';
const MATCH_SCORE_LABEL = 'M';

type PeriodScoreSide = 'home' | 'away';

/** Score-table cell rendered for each period column plus the total column. */
export interface PeriodScoreCell {
    key: number | 'total';
    label: string;
    score: number | undefined;
    strong: boolean;
}

/**
 * Build period score cells for one competitor side, marking cells that lead the opposing side.
 */
export const getPeriodScoreCells = (
    periodScores: Match['period_score'],
    side: PeriodScoreSide,
    total: number,
    opponentTotal: number,
): PeriodScoreCell[] => {
    const visiblePeriodScores = periodScores ?? [];
    const periodCells = visiblePeriodScores.map((period: PeriodScore) => {
        const score = side === 'home' ? period.home_score : period.away_score;
        const opponentScore = side === 'home' ? period.away_score : period.home_score;

        return {
            key: period.period_id,
            label: period.short_name,
            score,
            strong: score > opponentScore,
        };
    });

    return [
        ...periodCells,
        {
            key: 'total',
            label: '',
            score: total,
            strong: total > opponentTotal,
        },
    ];
};

interface SportPeriodScoreCellsParams {
    periodScores: Match['period_score'];
    side: PeriodScoreSide;
    total: number;
    opponentTotal: number;
    matchStatus: MatchStatus;
    sportId?: string;
    mode: PeriodScoreDisplayMode;
    showOnlyTotal?: boolean;
}

const createPeriodScoreCell = (period: PeriodScore, side: PeriodScoreSide, label: string): PeriodScoreCell => {
    const score = side === 'home' ? period.home_score : period.away_score;
    const opponentScore = side === 'home' ? period.away_score : period.home_score;

    return {
        key: period.period_id,
        label,
        score,
        strong: score > opponentScore,
    };
};

const createTotalScoreCell = (total: number, opponentTotal: number, label: string = ''): PeriodScoreCell => ({
    key: 'total',
    label,
    score: total,
    strong: total > opponentTotal,
});

/**
 * Build score cells with sport-specific live period rules.
 *
 * 展示规则：
 * - 棒球、板球：所有场景只展示总比分，不展示 period。
 * - 完赛：所有场景都不追加 total，只展示后端 period_score。
 * - 足球：只有一个 period 时只展示该 period；超过一个 period 时追加无列名总比分。
 * - 篮球、橄榄球 / 美足 H5 列表：只展示总比分。
 * - 橄榄球 / 美足 PC 列表、详情页、PC Best Match：只展示后端 period_score，不追加 total。
 * - 乒乓球、排球 H5 列表 / H5 Best Match：展示最后一个非 G 后端 period，列名固定为 S，再展示总比分 M。
 * - 乒乓球、排球 PC 列表、详情页、PC Best Match：按后端 period.short_name 展示，不追加 total。
 * - 网球 H5 列表 / H5 Best Match：G(period_id=60，本局得分，绿色) + 最后一个非 G period(列名 S) + 总比分 M。
 * - 网球 PC 列表、详情页、PC Best Match：G(period_id=60，本局得分，绿色) + 后端每盘比分，不展示总比分 M。
 * - 其他运动：沿用默认 period_score + total。
 */
export const getSportPeriodScoreCells = ({
    periodScores,
    side,
    total,
    opponentTotal,
    matchStatus,
    sportId,
    mode,
    showOnlyTotal = false,
}: SportPeriodScoreCellsParams): PeriodScoreCell[] => {
    const visiblePeriodScores = periodScores ?? [];
    const defaultCells = getPeriodScoreCells(periodScores, side, total, opponentTotal);
    const periodOnlyCells = defaultCells.filter((cell) => cell.key !== 'total');
    const sportType = getSportTypeBySportId(sportId);
    const isTennis = sportType === SportType.Tennis;

    if (sportType === SportType.Baseball || sportType === SportType.Cricket) {
        return [createTotalScoreCell(total, opponentTotal)];
    }

    if (matchStatus === MatchStatus.Ended) {
        // 完赛后各端都不要追加 total，避免阶段比分旁边再重复一次最终比分。
        return periodOnlyCells;
    }

    if (showOnlyTotal) {
        return [createTotalScoreCell(total, opponentTotal)];
    }

    if (sportType === SportType.Football && visiblePeriodScores.length > 0) {
        // 足球只在进入下半场后展示总比分：H1 阶段只有一个 period，只展示 H1；H2 阶段已有 H1/H2，
        // 需要在阶段比分后追加一个无列名总比分，保持 H5/Web、列表/详情一致。
        const footballPeriodCells = visiblePeriodScores.map((period) =>
            createPeriodScoreCell(period, side, period.short_name),
        );

        if (visiblePeriodScores.length === 1) {
            return footballPeriodCells;
        }

        return [...footballPeriodCells, createTotalScoreCell(total, opponentTotal)];
    }

    if (isSetBasedSport(sportId)) {
        if (mode === PeriodScoreDisplayMode.MobileList) {
            const currentPeriod = visiblePeriodScores
                .filter((period) => period.period_id !== TENNIS_GAME_PERIOD_ID)
                .at(-1);

            // H5 列表压缩展示：只展示最后一个非 G 阶段分，名称统一成 S，再展示总比分 M。
            return [
                ...(currentPeriod ? [createPeriodScoreCell(currentPeriod, side, CURRENT_PERIOD_LABEL)] : []),
                createTotalScoreCell(total, opponentTotal, MATCH_SCORE_LABEL),
            ];
        }

        // PC 列表 / 详情页 / PC Best Match 直接按后端 period 展示，不追加 total。
        return periodOnlyCells;
    }

    if (!isTennis) {
        return defaultCells;
    }

    const gamePeriod = visiblePeriodScores.find((period) => period.period_id === TENNIS_GAME_PERIOD_ID);
    const setPeriods = visiblePeriodScores.filter((period) => period.period_id !== TENNIS_GAME_PERIOD_ID);

    if (mode === PeriodScoreDisplayMode.MobileList) {
        const currentSetPeriod = setPeriods.at(-1);

        // 网球 G(period_id=60) 是本局得分，要摘出来放最前面并走绿色样式。
        return [
            ...(gamePeriod ? [createPeriodScoreCell(gamePeriod, side, TENNIS_GAME_LABEL)] : []),
            ...(currentSetPeriod ? [createPeriodScoreCell(currentSetPeriod, side, CURRENT_PERIOD_LABEL)] : []),
            createTotalScoreCell(total, opponentTotal, MATCH_SCORE_LABEL),
        ];
    }

    // 网球 PC/详情展示 G + 后端每盘比分，不展示总比分 M。
    return [
        ...(gamePeriod ? [createPeriodScoreCell(gamePeriod, side, TENNIS_GAME_LABEL)] : []),
        ...setPeriods.map((period) => createPeriodScoreCell(period, side, period.short_name)),
    ];
};

/**
 * Determine the Correct Score column index for an outcome by its score-format name (e.g. "1:0", "2-1").
 * Returns 0 (home win), 1 (draw), 2 (away win), or null if the name doesn't match.
 * Index aligns with backend `market.col`, which must be ordered as [home, draw, away].
 */
export interface CorrectScoreValue {
    home: number;
    away: number;
}

export function parseCorrectScore(outcomeName: string): CorrectScoreValue | null {
    const match = /^(\d+)[:-](\d+)$/.exec(outcomeName.trim());
    if (!match) return null;
    return {
        home: Number(match[1]),
        away: Number(match[2]),
    };
}

export function resolveCorrectScoreColumn(outcomeName: string): 0 | 1 | 2 | null {
    const score = parseCorrectScore(outcomeName);
    if (!score) return null;
    const { home, away } = score;
    if (home > away) return 0;
    if (home === away) return 1;
    return 2;
}

interface MarketFilterOptions {
    /** 仅展示指定产品线的盘口；赛中详情页用于隐藏赛前 product=3 的旧盘口。 */
    visibleProduct?: ProductEnum;
    /** 当前时间戳，赛中详情页用于自动隐藏长时间未更新的滚球盘口。 */
    now?: number;
}

const hasFreshLiveOutcome = (line: MarketLine, now: number | undefined): boolean => {
    if (now === undefined || line.product !== ProductEnum.Live) {
        return true;
    }

    return line.outcomes.some((outcome) => {
        const lastUpdate = outcome.last_update;
        if (typeof lastUpdate !== 'number' || Number.isNaN(lastUpdate) || lastUpdate <= 0) return true;
        return now - lastUpdate <= LIVE_MARKET_STALE_MS;
    });
};

/**
 * 过滤并整理盘口数据，移除不可展示的盘口线、投注项和空盘口分组。
 */
export const filterMarkets = (list: MarketGroup[], options: MarketFilterOptions = {}): MarketGroup[] => {
    if (!list || list.length === 0) {
        return [];
    }

    const filtered = list.map((market) => {
        const productMatchedLines = options.visibleProduct
            ? market.lines.filter((line) => line.product === options.visibleProduct)
            : market.lines;
        const freshLines = productMatchedLines.filter((line) => hasFreshLiveOutcome(line, options.now));

        return {
            ...market,
            lines: getVisibleMarketLines(freshLines, { marketId: market.id }),
        };
    });

    const deduped = new Map<string, MarketGroup>();
    for (const market of filtered) {
        if (market.lines.length === 0) continue;
        const key = getMarketGroupId(market);
        const existing = deduped.get(key);
        if (existing) {
            const merged = [...existing.lines, ...market.lines];
            merged.sort((a, b) => {
                if (a.id > b.id) return 1;
                if (a.id < b.id) return -1;
                return 0;
            });
            deduped.set(key, { ...existing, ...market, lines: merged });
        } else {
            deduped.set(key, market);
        }
    }
    return Array.from(deduped.values());
};

/**
 * Determine whether a match is live.
 */
export const isMatchLive = (status: MatchStatus): boolean => {
    return status === MatchStatus.Live;
};

/** Whether the match is paused */
export const isMatchPaused = (matchClock?: MatchClock | null): boolean => {
    return isMatchClockStopped(matchClock);
};

export enum LSportsMatchStatusCode {
    BreakTime = 80,
}

/** Whether LSports reports the match as a break period, e.g. football halftime. */
export const isMatchBreakTime = (matchStatus: number): boolean => {
    return matchStatus === LSportsMatchStatusCode.BreakTime;
};

/**
 * Format match start date (e.g. 15.12.2025).
 * Uses Intl.DateTimeFormat.
 */
export const formatMatchDate = (date: Date, locale: Locale, timezone: Timezone): string => {
    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        timeZone: timezone,
    }).format(date);
};

/**
 * Format match start time (e.g. 19:30).
 * Uses Intl.DateTimeFormat with 24-hour format.
 */
export const formatMatchTime = (date: Date, locale: Locale, timezone: Timezone): string => {
    return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: timezone,
    }).format(date);
};

/**
 * Format match datetime (two-line display: date + newline + time).
 * Formats date and time separately using Intl.
 */
export const formatMatchDateTime = (date: Date, locale: Locale, timezone: Timezone): string => {
    const dateStr = formatMatchDate(date, locale, timezone);
    const timeStr = formatMatchTime(date, locale, timezone);
    return `${dateStr}\n${timeStr}`;
};

interface LiveScoreApplicable {
    sport_id?: string;
    status: MatchStatus;
    match_status: number;
    home_competitor: { score: number };
    away_competitor: { score: number };
    match_clock: Match['match_clock'];
    match_clock_offset: number;
    period_score?: Match['period_score'];
    timestamp: number;
    live_score_timestamp?: number;
}

// Preserve HTTP labels when the mapping query has not finished before a WS update arrives.
const preservePeriodLabels = (
    nextPeriodScores: Match['period_score'] | undefined,
    prevPeriodScores: Match['period_score'] | undefined,
): Match['period_score'] | undefined => {
    if (!nextPeriodScores) return nextPeriodScores;
    if (!prevPeriodScores || prevPeriodScores.length === 0) return nextPeriodScores;

    const prevPeriodById = new Map(prevPeriodScores.map((period) => [period.period_id, period]));

    return nextPeriodScores.map((period) => {
        const prevPeriod = prevPeriodById.get(period.period_id);
        if (!prevPeriod) return period;

        return {
            ...period,
            description: period.description || prevPeriod.description,
            short_name: period.short_name || prevPeriod.short_name,
        };
    });
};

/**
 * Apply LiveScore patch to any match-shaped object.
 * Uses `live_score_timestamp` for staleness guard so OddsChange timestamp cannot block LiveScore updates.
 */
export function applyLiveScore<T extends LiveScoreApplicable>(
    prev: T,
    payload: LiveScorePayload,
    sportId?: string,
    periodMappings?: PeriodMappingBySport, // 非必传
): T {
    if (payload.timestamp !== null && (prev.live_score_timestamp ?? 0) >= payload.timestamp) return prev;

    const mappedPeriodScore = preservePeriodLabels(
        applyPeriodMappings(payload.period_score, sportId ?? prev.sport_id, periodMappings),
        prev.period_score,
    );
    const hasClockUpdate = payload.clock_seconds !== undefined;
    const nextMatchClock = !hasClockUpdate
        ? prev.match_clock
        : prev.match_clock === null || payload.clock_seconds === null
          ? null
          : { ...prev.match_clock, seconds: payload.clock_seconds };

    return {
        ...prev,
        status: payload.status ?? prev.status,
        match_status: payload.match_status ?? prev.match_status,
        home_competitor: { ...prev.home_competitor, score: payload.home_score ?? prev.home_competitor.score },
        away_competitor: { ...prev.away_competitor, score: payload.away_score ?? prev.away_competitor.score },
        period_score: mappedPeriodScore ?? prev.period_score,
        match_clock: nextMatchClock,
        match_clock_offset: hasClockUpdate ? 0 : prev.match_clock_offset,
        timestamp: payload.timestamp ?? prev.timestamp,
        live_score_timestamp: payload.timestamp ?? prev.live_score_timestamp,
    } as T;
}

/**
 * Update match basic info (status and score) from LiveScore WS.
 */
export function updateMatchBasicInfo(
    prevData: Match,
    payload: LiveScorePayload,
    periodMappings?: PeriodMappingBySport,
): Match {
    return applyLiveScore(prevData, payload, prevData.sport_id, periodMappings);
}
