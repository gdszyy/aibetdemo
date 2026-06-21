import {
    isOutcomeActiveLocked,
    LineStatus,
    type OutcomeActiveEnum,
    ProductEnum,
    ProductRawEnum,
    shouldShowOutcome,
} from '@/api/models/market';
import { MatchStatus } from '@/api/models/match';
import type { ParlayBoostLadderTier, ParlayBoostRule, ParlayBoostScopeRule } from '@/api/models/parlay-boost';
import { getSportCodeBySportId } from '@/constants/sports';

/** 串关加赔判断需要的投注项最小字段集。 */
export interface ParlayBoostSelectionInput {
    /** 赛事 ID。 */
    eventId: string;
    /** 市场 ID。 */
    marketId: number;
    /** 产品 ID。 */
    productId: string;
    /** 赛事阶段，1 表示赛前。 */
    matchStatus?: number;
    /** 盘口参数。 */
    specifiers: string;
    /** 投注项。 */
    outcome: {
        /** 投注项 ID。 */
        id: string;
        /** 当前赔率。 */
        odds: number;
        /** 投注项状态。 */
        active?: OutcomeActiveEnum;
    };
    /** 联赛 ID。 */
    tournamentId: string;
    /** 地区 ID，对应活动规则的 region_id。 */
    categoryId?: string;
    /** 原始产品类型。 */
    productRaw: string;
    /** 是否冠军盘。 */
    isOutright?: boolean;
    /** 运动 ID。 */
    sportId?: string;
    /** 数据源 ID，当前前台默认使用 lsports。 */
    sourceId?: string;
    /** 盘口状态。 */
    lineStatus?: LineStatus;
}

/** 串关加赔派彩预览。 */
export interface ParlayBoostPayoutPreview {
    /** 基础派彩（stake × 总赔率）。 */
    basePayout: number;
    /** 加赔计算基数（当前为整单基础派彩）。 */
    boostBasePayout: number;
    /** 原始加赔金额（basePayout × boost），不受 cap 限制。 */
    boostAmount: number;
    /** 实际可支付加赔金额，cap 仅作用于该字段。 */
    payableBoostAmount: number;
    /** 最终预估派彩（base + payableBoostAmount）。 */
    finalPayout: number;
    /** 是否触发单注加赔金额上限截断。 */
    truncated: boolean;
    /** 单注加赔金额上限，0 表示不限。 */
    boostCap: number;
}

/** 串关加赔预览状态。 */
export interface ParlayBoostPreview {
    /** 是否存在可展示的生效规则。 */
    enabled: boolean;
    /** 合规投注项数量。 */
    qualifyingCount: number;
    /** 当前命中档位。 */
    currentTier?: ParlayBoostLadderTier;
    /** 下一档位。 */
    nextTier?: ParlayBoostLadderTier;
    /** UI 使用的封顶串数。 */
    maxLegs: number;
    /** 合规投注项 ID 集合。 */
    qualifyingSelectionIds: Set<string>;
}

const ACTIVE_STATUS = 1;
const ZERO_LIMIT = 0;
const UNKNOWN_MATCH_STATUS = 0;
const PRECISION_FACTOR = 1_000_000;
const DEFAULT_PARLAY_BOOST_SOURCE_ID = 'lsports';

/** 规范化串关加赔数据源，CMS 旧字段可能返回 ls。 */
const normalizeParlayBoostSourceId = (sourceId: string | undefined): string => {
    if (!sourceId) return '';

    const normalizedSourceId = sourceId.trim().toLowerCase();
    return normalizedSourceId === 'ls' ? DEFAULT_PARLAY_BOOST_SOURCE_ID : normalizedSourceId;
};

/** 安全乘法，避免浮点精度问题。 */
const safeMultiplyParlayBoost = (a: number, b: number): number => {
    const aInt = Math.round(a * PRECISION_FACTOR);
    const bInt = Math.round(b * PRECISION_FACTOR);
    return (aInt * bInt) / (PRECISION_FACTOR * PRECISION_FACTOR);
};

/** 安全加法，避免浮点精度问题。 */
const safeSumParlayBoost = (...values: number[]): number => {
    const sum = values.reduce((acc, value) => acc + Math.round(value * PRECISION_FACTOR), 0);
    return sum / PRECISION_FACTOR;
};

/** 获取投注项稳定唯一标识。 */
export const getParlayBoostSelectionId = (selection: ParlayBoostSelectionInput): string => {
    return `${selection.eventId}/${selection.marketId}/${selection.productId}/${selection.specifiers}/${selection.outcome.id}`;
};

/** 转换可比较数值，空值按 0 处理。 */
export const toParlayBoostNumber = (value: string | number | undefined): number => {
    if (value === undefined || value === '') return 0;

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
};

/** 获取按腿数升序排列的加赔阶梯。 */
export const getSortedParlayBoostLadder = (rule: ParlayBoostRule): ParlayBoostLadderTier[] => {
    return [...rule.ladder].sort((a, b) => a.legs - b.legs);
};

/** 最大腿数：ladder 中 legs 字段的最大值（最高档所需串关数）。 */
export const getParlayBoostMaxLegs = (rule: ParlayBoostRule): number => {
    return getSortedParlayBoostLadder(rule).at(-1)?.legs ?? 0;
};

/** 计入加赔的合规腿数上限（rule.legs 或最高档 legs）。 */
export const getParlayBoostQualifyingCap = (rule: ParlayBoostRule): number => {
    const maxLadderLegs = getParlayBoostMaxLegs(rule);
    return rule.legs > ZERO_LIMIT ? rule.legs : maxLadderLegs;
};

/** 进度条展示的格数，与最大腿数一致（一格对应一关，档位标签落在对应 leg 位置）。 */
export const getParlayBoostProgressLegs = (rule: ParlayBoostRule): number => {
    return getParlayBoostMaxLegs(rule);
};

/** 是否为当前可展示的串关加赔规则。 */
export const isActiveParlayBoostRule = (
    rule: ParlayBoostRule | null | undefined,
    now = Date.now(),
): rule is ParlayBoostRule => {
    if (!rule || rule.status !== ACTIVE_STATUS || rule.ladder.length === 0) return false;

    const nowSeconds = Math.floor(now / 1000);
    return rule.start_time <= nowSeconds && nowSeconds <= rule.end_time;
};

const isSameSport = (selection: ParlayBoostSelectionInput, scope: ParlayBoostScopeRule): boolean => {
    const scopeSportId = String(scope.sport_id);
    const selectionSportId = selection.sportId ?? '';
    const selectionSportCode = getSportCodeBySportId(selection.sportId) ?? '';

    return scopeSportId === selectionSportId || scopeSportId === selectionSportCode;
};

const isSameSource = (selection: ParlayBoostSelectionInput, scope: ParlayBoostScopeRule): boolean => {
    const scopeSourceId = normalizeParlayBoostSourceId(scope.source);
    const selectionSourceId = normalizeParlayBoostSourceId(selection.sourceId ?? DEFAULT_PARLAY_BOOST_SOURCE_ID);

    return scopeSourceId === selectionSourceId;
};

const isSameRegion = (selection: ParlayBoostSelectionInput, scope: ParlayBoostScopeRule): boolean => {
    return !scope.region_id || scope.region_id === (selection.categoryId ?? '');
};

const isSameLeague = (selection: ParlayBoostSelectionInput, scope: ParlayBoostScopeRule): boolean => {
    return !scope.league_id || scope.league_id === selection.tournamentId;
};

const isSameScope = (selection: ParlayBoostSelectionInput, scope: ParlayBoostScopeRule): boolean => {
    return (
        isSameSource(selection, scope) &&
        isSameSport(selection, scope) &&
        isSameRegion(selection, scope) &&
        isSameLeague(selection, scope)
    );
};

/** 判断投注项是否是赛前产品。 */
const isPreMatchProductSelection = (selection: ParlayBoostSelectionInput): boolean => {
    return selection.productRaw === ProductRawEnum.PreMatch || selection.productId === ProductEnum.PreMatch;
};

/** 判断投注项是否仍处于赛前赛事阶段；缺字段或 0 状态时保持原产品判断口径。 */
const isPreMatchStatusSelection = (selection: ParlayBoostSelectionInput): boolean => {
    return (
        selection.matchStatus === undefined ||
        selection.matchStatus === UNKNOWN_MATCH_STATUS ||
        selection.matchStatus === MatchStatus.NotStarted
    );
};

/** 判断投注项是否符合仅赛前活动的赛事阶段要求。 */
const isPreMatchSelection = (selection: ParlayBoostSelectionInput): boolean => {
    return isPreMatchProductSelection(selection) && isPreMatchStatusSelection(selection);
};

/** 当前仅赛前活动下，已经进入非赛前阶段的赛前盘视为过期，不再符合活动规则。 */
export const isExpiredPreMatchSelectionForRule = (
    selection: ParlayBoostSelectionInput,
    rule: Pick<ParlayBoostRule, 'pre_match_only'> | null | undefined,
): boolean => {
    return (
        rule?.pre_match_only === 1 &&
        isPreMatchProductSelection(selection) &&
        selection.matchStatus !== undefined &&
        selection.matchStatus !== UNKNOWN_MATCH_STATUS &&
        selection.matchStatus !== MatchStatus.NotStarted
    );
};

const isParlayBoostSelectionLocked = (selection: ParlayBoostSelectionInput): boolean => {
    return isOutcomeActiveLocked(selection.outcome.active) || selection.lineStatus === LineStatus.Suspended;
};

/** 判断投注项是否计入当前串关加赔活动。 */
export const isParlayBoostSelectionQualified = (
    selection: ParlayBoostSelectionInput,
    rule: ParlayBoostRule,
): boolean => {
    if (selection.isOutright) return false;
    if (!shouldShowOutcome(selection.outcome.active)) return false;
    if (rule.pre_match_only === 1 && !isPreMatchSelection(selection)) return false;
    if (isParlayBoostSelectionLocked(selection)) return false;

    const minOdds = toParlayBoostNumber(rule.min_odds_per_leg);
    if (minOdds > ZERO_LIMIT && selection.outcome.odds < minOdds) return false;

    const isExcluded = rule.scope_include.some((scope) => {
        if (scope.mode !== 'exclude') return false;
        return isSameScope(selection, scope);
    });
    if (isExcluded) return false;

    return rule.scope_include.some((scope) => {
        if (scope.mode !== 'include') return false;
        return isSameScope(selection, scope);
    });
};

/** Markets Excluded 行文案片段。 */
export interface ParlayBoostExcludedMarketsLabels {
    /** Outrights/Futures 固定前缀。 */
    base: string;
    /** 仅赛前活动时排除的滚球文案。 */
    inPlay: string;
    /** 非仅赛前活动时排除的赛前文案。 */
    preMatch: string;
}

/** 生成 Markets Excluded 行默认文案：最后一项按 pre_match_only 在 In-play / Pre-match 间切换。 */
export const formatParlayBoostExcludedMarketsValue = (
    rule: Pick<ParlayBoostRule, 'pre_match_only'> | null | undefined,
    labels: ParlayBoostExcludedMarketsLabels,
): string => {
    const isPreMatchOnly = (rule?.pre_match_only ?? 1) === 1;
    const timingLabel = isPreMatchOnly ? labels.inPlay : labels.preMatch;
    return `${labels.base}/${timingLabel}`;
};

/** 生成串关加赔购物车预览数据。 */
export const getParlayBoostPreview = (
    selections: ParlayBoostSelectionInput[],
    rule: ParlayBoostRule | null | undefined,
): ParlayBoostPreview => {
    if (!isActiveParlayBoostRule(rule)) {
        return {
            enabled: false,
            qualifyingCount: 0,
            maxLegs: 0,
            qualifyingSelectionIds: new Set<string>(),
        };
    }

    const ladder = getSortedParlayBoostLadder(rule);
    const maxLegs = getParlayBoostMaxLegs(rule);
    const qualifyingCap = getParlayBoostQualifyingCap(rule);
    const qualifyingSelectionIds = new Set(
        selections
            .filter((selection) => isParlayBoostSelectionQualified(selection, rule))
            .map((selection) => getParlayBoostSelectionId(selection)),
    );
    const cappedQualifyingCount = qualifyingCap > ZERO_LIMIT ? Math.min(qualifyingSelectionIds.size, qualifyingCap) : 0;

    let currentTier: ParlayBoostLadderTier | undefined;
    for (const tier of ladder) {
        if (tier.legs <= cappedQualifyingCount) {
            currentTier = tier;
        }
    }

    return {
        enabled: true,
        qualifyingCount: cappedQualifyingCount,
        currentTier,
        nextTier: ladder.find((tier) => tier.legs > cappedQualifyingCount),
        maxLegs,
        qualifyingSelectionIds,
    };
};

/** 计算合规腿赔率乘积；仅用于调试/展示合规范围，不参与加赔金额计算。 */
export const getParlayBoostQualifyingOdds = (
    selections: ParlayBoostSelectionInput[],
    preview: ParlayBoostPreview,
): number => {
    if (!preview.enabled || preview.qualifyingSelectionIds.size === 0) return 0;

    return selections
        .filter((selection) => preview.qualifyingSelectionIds.has(getParlayBoostSelectionId(selection)))
        .map((selection) => selection.outcome.odds)
        .reduce((acc, odds) => safeMultiplyParlayBoost(acc, odds), 1);
};

/** 串关总赔率：入参各腿 outcome.odds 连乘（购物车需先排除失效/锁盘等不可投注腿）。 */
export const computeParlayTotalOdds = (selections: ParlayBoostSelectionInput[]): number => {
    if (selections.length === 0) {
        return 1;
    }

    return selections
        .map((selection) => selection.outcome.odds)
        .reduce((acc, odds) => safeMultiplyParlayBoost(acc, odds), 1);
};

/** 计算 Base payout，统一使用串关加赔金额精度处理。 */
export const computeParlayBoostBasePayout = (stake: number, parlayOdds: number): number => {
    return safeMultiplyParlayBoost(stake, parlayOdds);
};

/** 购物车与规则弹窗共用的派彩计算结果。 */
export interface ParlayBoostPayoutComputation {
    /** 串关总赔率。 */
    parlayOdds: number;
    /** 基础派彩（stake × 全腿赔率乘积）。 */
    basePayout: number;
    /** 加赔基数（当前等于整单基础派彩）。 */
    boostBasePayout: number;
    /** 派彩预览（含加赔与 cap）。 */
    payoutPreview: ParlayBoostPayoutPreview;
}

/**
 * 购物车 parlay footer 与规则弹窗 Calculation 共用：
 * Base payout = stake × 全腿赔率；Boost amount = Base payout × 档位 boost；
 * cap 仅限制最终可支付加赔金额。
 */
export const computeParlayBoostPayoutFromPreview = (
    stake: number,
    selections: ParlayBoostSelectionInput[],
    preview: ParlayBoostPreview,
    rule: ParlayBoostRule | null | undefined,
): ParlayBoostPayoutComputation => {
    const parlayOdds = computeParlayTotalOdds(selections);
    const basePayout = computeParlayBoostBasePayout(stake, parlayOdds);
    const boostBasePayout = basePayout;
    const payoutPreview = getParlayBoostPayoutPreview(basePayout, preview, rule);

    return { parlayOdds, basePayout, boostBasePayout, payoutPreview };
};

/** 无用户本金时用于展示等效总赔率的单位本金。 */
export const PARLAY_BOOST_UNIT_DISPLAY_STAKE = 1;

/** 串关加赔 UI 展示赔率（与 finalPayout / stake 同源）。 */
export interface ParlayBoostDisplayOdds {
    /** 未加赔串关总赔率。 */
    parlayOdds: number;
    /** 含加赔等效总赔率。 */
    effectiveTotalOdds: number;
    /** 是否展示加赔前后对比。 */
    showBoostedOdds: boolean;
}

/**
 * 计算串关展示赔率；stake 为 0 时用单位本金 1，以便未输入本金时仍可展示总赔率。
 */
export const getParlayBoostDisplayOdds = (
    stake: number,
    selections: ParlayBoostSelectionInput[],
    preview: ParlayBoostPreview,
    rule: ParlayBoostRule | null | undefined,
): ParlayBoostDisplayOdds => {
    const displayStake = stake > ZERO_LIMIT ? stake : PARLAY_BOOST_UNIT_DISPLAY_STAKE;
    const { parlayOdds, payoutPreview } = computeParlayBoostPayoutFromPreview(displayStake, selections, preview, rule);

    return {
        parlayOdds,
        effectiveTotalOdds: payoutPreview.finalPayout / displayStake,
        showBoostedOdds: payoutPreview.payableBoostAmount > 0,
    };
};

/** 已结算订单：可支付加赔取后端 settled_boost_amount，Boost amount 仍按结算比例展示原始计算值。 */
export const buildSettledParlayBoostPayoutPreview = (
    basePayout: number,
    boostBasePayout: number,
    settledBoostAmount: string | number,
    rule: ParlayBoostRule,
    settledBoostRate?: string | number,
): ParlayBoostPayoutPreview => {
    const settledRate = toParlayBoostNumber(settledBoostRate);
    const boostAmount =
        settledRate > ZERO_LIMIT
            ? safeMultiplyParlayBoost(boostBasePayout, settledRate)
            : toParlayBoostNumber(settledBoostAmount);
    const boostCap = toParlayBoostNumber(rule.boost_cap_per_bet);
    const truncated = boostCap > ZERO_LIMIT && boostAmount > boostCap;
    const payableBoostAmount = toParlayBoostNumber(settledBoostAmount);

    return {
        basePayout,
        boostBasePayout,
        boostAmount,
        payableBoostAmount,
        finalPayout: safeSumParlayBoost(basePayout, payableBoostAmount),
        truncated,
        boostCap,
    };
};

/**
 * 订单 detail 预览：合规腿与 getParlayBoostPreview 一致，档位腿数/比例来自 order_activity_ref 快照。
 */
export const buildParlayBoostPreviewWithSnapshotTier = (
    selections: ParlayBoostSelectionInput[],
    rule: ParlayBoostRule,
    snapshot: { qualifyingCount: number; currentTier?: ParlayBoostLadderTier },
): ParlayBoostPreview => {
    const rulePreview = getParlayBoostPreview(selections, rule);
    const ladder = getSortedParlayBoostLadder(rule);

    return {
        enabled: true,
        qualifyingCount: snapshot.qualifyingCount,
        currentTier: snapshot.currentTier,
        nextTier: ladder.find((tier) => tier.legs > snapshot.qualifyingCount),
        maxLegs: rulePreview.maxLegs,
        qualifyingSelectionIds: rulePreview.qualifyingSelectionIds,
    };
};

/** 计算串关加赔后的预估派彩。 */
export const getParlayBoostPayoutPreview = (
    basePayout: number,
    preview: ParlayBoostPreview,
    rule: ParlayBoostRule | null | undefined,
): ParlayBoostPayoutPreview => {
    const boostBasePayout = basePayout;
    const emptyPreview: ParlayBoostPayoutPreview = {
        basePayout,
        boostBasePayout,
        boostAmount: 0,
        payableBoostAmount: 0,
        finalPayout: basePayout,
        truncated: false,
        boostCap: 0,
    };

    if (basePayout <= ZERO_LIMIT || !preview.enabled || !preview.currentTier || !rule) {
        return emptyPreview;
    }

    const boostRate = toParlayBoostNumber(preview.currentTier.boost);
    const boostAmount = safeMultiplyParlayBoost(basePayout, boostRate);
    const boostCap = toParlayBoostNumber(rule.boost_cap_per_bet);
    const truncated = boostCap > ZERO_LIMIT && boostAmount > boostCap;
    const payableBoostAmount = truncated ? boostCap : boostAmount;

    return {
        basePayout,
        boostBasePayout,
        boostAmount,
        payableBoostAmount,
        finalPayout: safeSumParlayBoost(basePayout, payableBoostAmount),
        truncated,
        boostCap,
    };
};

/** 倍率展示文案。 */
export const formatParlayBoostMultiplier = (tier: ParlayBoostLadderTier | undefined): string => {
    if (!tier) return '';

    const multiplier = toParlayBoostNumber(tier.multiplier);
    if (multiplier > ZERO_LIMIT) {
        return `x${multiplier.toFixed(2).replace(/\.?0+$/, '')}`;
    }

    const boost = toParlayBoostNumber(tier.boost);
    return `x${(1 + boost).toFixed(2).replace(/\.?0+$/, '')}`;
};

/** 加赔比例展示文案；默认展示正号，公式中可关闭。 */
export const formatParlayBoostPercent = (
    tier: ParlayBoostLadderTier | undefined,
    options: { signed?: boolean } = {},
): string => {
    const signed = options.signed ?? true;
    if (!tier) return signed ? '+0%' : '0%';

    const boost = toParlayBoostNumber(tier.boost);
    const percent = `${(boost * 100).toFixed(2).replace(/\.?0+$/, '')}%`;
    return signed ? `+${percent}` : percent;
};
