import { BetType } from '@/api/models/cart';
import { type ActivityParlayBoostRef, OrderStatus, resolveActivityParlayBoostId } from '@/api/models/order';
import type { GameReportItem, SportReportItem } from '@/api/models/transaction-bethistory';
import type { ParlayBoostRulesSectionVisibility } from '@/constants/parlay-boost-rules-modal';
import type { BetHistoryListItem } from './types';

interface BetHistoryActivitySettledAmountSource {
    /** 旧结构：活动加赔结算金额在注单顶层。 */
    activity_settled_amount?: string;
    /** 新结构：活动加赔结算金额嵌套在活动引用内。 */
    activity_parlay_boost?: ActivityParlayBoostRef | null;
}

const BET_HISTORY_AMOUNT_PRECISION_FACTOR = 1_000_000;

/** 注单历史串关加赔弹窗所需的订单与活动标识。 */
export interface BetHistoryParlayBoostContext {
    /** MTS 订单主键，对应 parlay-boost detail 的 order_id。 */
    mtsOrderId: string;
    /** 串关加赔活动 ID。 */
    activityParlayBoostId: number;
}

const isGameReportItem = (item: BetHistoryListItem): item is GameReportItem => {
    return 'data' in item && 'type' in item && 'order_id' in item;
};

const isSportReportItem = (item: BetHistoryListItem): item is SportReportItem => {
    return 'financial_init' in item;
};

/** 从注单历史行解析体育注单详情。 */
export const resolveBetHistorySportReport = (item: BetHistoryListItem): SportReportItem | null => {
    if (isSportReportItem(item)) return item;
    if (isGameReportItem(item) && item.type === 'sport' && isSportReportItem(item.data)) {
        return item.data;
    }

    return null;
};

/** 判断注单历史行是否为体育串关。 */
export const isBetHistorySportParlay = (item: BetHistoryListItem): boolean => {
    const sport = resolveBetHistorySportReport(item);
    if (!sport) return false;

    return Number(sport.bet_type) === BetType.Parlay;
};

const resolveActivityParlayBoostRef = (item: BetHistoryListItem): ActivityParlayBoostRef | null | undefined => {
    if (isGameReportItem(item)) {
        return item.activity_parlay_boost ?? resolveBetHistorySportReport(item)?.activity_parlay_boost;
    }

    if (isSportReportItem(item)) {
        return item.activity_parlay_boost;
    }

    return undefined;
};

/** 读取注单历史活动加赔结算金额，兼容旧顶层字段与新嵌套字段。 */
export const resolveBetHistoryActivitySettledAmount = (
    item: BetHistoryActivitySettledAmountSource,
): string | undefined => {
    return item.activity_parlay_boost?.activity_settled_amount ?? item.activity_settled_amount;
};

const parseBetHistoryAmount = (amount?: string | number): number => {
    if (amount === undefined || amount === '') return 0;

    const parsedAmount = Number(amount);
    return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};

const sumBetHistoryAmounts = (...amounts: number[]): number => {
    const sum = amounts.reduce((acc, amount) => acc + Math.round(amount * BET_HISTORY_AMOUNT_PRECISION_FACTOR), 0);
    return sum / BET_HISTORY_AMOUNT_PRECISION_FACTOR;
};

const resolveBoostedBetHistoryProfit = (
    profitAmount: string,
    activitySettledAmount: string | undefined,
): string | number => {
    const parsedActivitySettledAmount = parseBetHistoryAmount(activitySettledAmount);
    if (parsedActivitySettledAmount === 0) return profitAmount;

    return sumBetHistoryAmounts(parseBetHistoryAmount(profitAmount), parsedActivitySettledAmount);
};

/** 注单历史 Profit：有串关加赔活动时叠加活动结算金额。 */
export const resolveBetHistoryProfitAmount = (item: BetHistoryListItem): string | number => {
    if (isGameReportItem(item)) {
        if (item.type !== 'sport') return item.profit;

        const sport = resolveBetHistorySportReport(item);
        const activityParlayBoost = item.activity_parlay_boost ?? sport?.activity_parlay_boost;
        if (!activityParlayBoost) return item.profit;

        const activitySettledAmount =
            resolveBetHistoryActivitySettledAmount(item) ?? resolveBetHistoryActivitySettledAmount(sport ?? {});
        return resolveBoostedBetHistoryProfit(item.profit, activitySettledAmount);
    }

    if (isSportReportItem(item)) {
        if (!item.activity_parlay_boost) return item.profit_amount;

        return resolveBoostedBetHistoryProfit(item.profit_amount, resolveBetHistoryActivitySettledAmount(item));
    }

    return item.total_profit;
};

/** 解析注单历史行的串关加赔上下文；无活动或非串关时返回 null。 */
export const resolveBetHistoryParlayBoostContext = (item: BetHistoryListItem): BetHistoryParlayBoostContext | null => {
    if (!isBetHistorySportParlay(item)) return null;

    const sport = resolveBetHistorySportReport(item);
    const activityParlayBoostId = resolveActivityParlayBoostId(resolveActivityParlayBoostRef(item));
    if (!sport || activityParlayBoostId === undefined || sport.id <= 0) return null;

    return {
        mtsOrderId: String(sport.id),
        activityParlayBoostId,
    };
};

/** 注单历史串关加赔规则弹窗是否展示 Markets / 派彩计算（历史腿状态可能为空，优先信任整单状态）。 */
export const resolveBetHistoryParlayBoostModalSections = (
    item: BetHistoryListItem,
): ParlayBoostRulesSectionVisibility => {
    const sport = resolveBetHistorySportReport(item);
    if (!sport) {
        return {
            showContributionSection: false,
            showPayoutCalculation: false,
            showMarketsSection: false,
        };
    }

    const orderStatus = Number(sport.status);
    const showSections = orderStatus === OrderStatus.SettledWon;

    return {
        showContributionSection: true,
        showPayoutCalculation: showSections,
        showMarketsSection: showSections,
    };
};
