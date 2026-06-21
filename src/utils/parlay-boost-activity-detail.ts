import { OutcomeActiveEnum, resolveProductRaw } from '@/api/models/market';
import type { Order, OrderSelection } from '@/api/models/order';
import { OrderStatus } from '@/api/models/order';
import type {
    ParlayBoostActivityDetail,
    ParlayBoostActivityDetailRule,
    ParlayBoostLadderTier,
    ParlayBoostOrderActivityRef,
    ParlayBoostRule,
    ParlayBoostScopeRule,
} from '@/api/models/parlay-boost';
import {
    hasAllSelectionsSettled,
    resolveLegStatus,
    resolveParlayStatus,
    TicketDisplayStatus,
} from '@/modules/bet-slip/ticket/ticket.types';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import {
    buildParlayBoostPreviewWithSnapshotTier,
    buildSettledParlayBoostPayoutPreview,
    computeParlayBoostBasePayout,
    computeParlayBoostPayoutFromPreview,
    getParlayBoostSelectionId,
    getSortedParlayBoostLadder,
    toParlayBoostNumber,
} from '@/utils/parlay-boost-preview';
import type { ParlayBoostRulesBetContext } from '@/utils/parlay-boost-rules-context';

/** 将 detail scope 字段兼容为规则判断消费的 region_id / league_id。 */
const normalizeParlayBoostDetailScope = (scope: ParlayBoostScopeRule): ParlayBoostScopeRule => {
    return {
        ...scope,
        league_id: scope.league_id || scope.tournament_id || '',
        region_id: scope.region_id || scope.category_id || '',
        last_synced_at: scope.last_synced_at ?? 0,
    };
};

/** 将 detail 规则补齐为弹窗可消费的完整规则。 */
export const normalizeParlayBoostDetailRule = (rule: ParlayBoostActivityDetailRule): ParlayBoostRule => {
    return {
        id: rule.id,
        country_id: rule.country_id ?? 0,
        country_code: rule.country_code ?? '',
        name: rule.name,
        version: rule.version,
        start_time: rule.start_time,
        end_time: rule.end_time,
        legs: rule.legs,
        min_odds_per_leg: rule.min_odds_per_leg,
        boost_cap_per_bet: rule.boost_cap_per_bet,
        pre_match_only: rule.pre_match_only,
        status: rule.status,
        ladder: rule.ladder.map((tier) => ({
            legs: tier.legs,
            boost: tier.boost,
            multiplier: tier.multiplier ?? '',
        })),
        scope_include: rule.scope_include?.map(normalizeParlayBoostDetailScope) ?? [],
        allow_tags: rule.allow_tags ?? [],
        deny_tags: rule.deny_tags ?? [],
        created_at: rule.created_at ?? '',
        updated_at: rule.updated_at ?? '',
    };
};

/** 将订单腿转换为 OddsEntity，供规则弹窗展示。 */
export const orderSelectionToOddsEntity = (selection: OrderSelection): OddsEntity => {
    const odds = Number.parseFloat(selection.outcome_odds);

    return {
        eventId: selection.event_id,
        eventIdType: selection.event_id_type ?? '',
        line: '',
        tournamentId: selection.tournament_id ?? '',
        title: selection.title,
        marketId: Number.parseInt(selection.market_id, 10) || 0,
        marketName: selection.market_name,
        productRaw: resolveProductRaw(selection.product),
        productId: selection.product,
        specifiers: selection.specifiers,
        outcome: {
            id: selection.outcome_id,
            name: selection.outcome_name,
            name_alias: selection.outcome_name_alias ?? selection.outcome_name,
            odds: Number.isFinite(odds) ? odds : 0,
            line: '',
            active: OutcomeActiveEnum.Active,
        },
        sportId: selection.sport_id,
        sportName: selection.sport_name,
        timestamp: 0,
    };
};

const isOrderSettled = (order: Order): boolean => {
    return order.status !== OrderStatus.Pending;
};

/** 已结算且 settled_boost_* 均为 0 时表示无有效结算档位快照（仅 settled 会出现），不参与档位解析。 */
const hasSettledBoostTierSnapshot = (activityRef: ParlayBoostOrderActivityRef): boolean => {
    const settledRate = toParlayBoostNumber(activityRef.settled_boost_rate);
    return activityRef.settled_boost_legs > 0 || settledRate > 0;
};

/** detail 快照可能只给命中腿数与比例，优先精确命中，否则按腿数向下取档。 */
const resolveSnapshotTier = (
    ladder: ParlayBoostLadderTier[],
    legs: number,
    boostRate: number,
): ParlayBoostLadderTier | undefined => {
    const matchedTier = ladder.find((tier) => tier.legs === legs && toParlayBoostNumber(tier.boost) === boostRate);
    if (matchedTier) {
        return matchedTier;
    }

    let currentTier: ParlayBoostLadderTier | undefined;
    for (const tier of ladder) {
        if (tier.legs <= legs) {
            currentTier = tier;
        }
    }

    return currentTier;
};

/** 从订单串关加赔 detail 构建弹窗上下文（仅消费 detail 快照，供 Open 注单规则弹窗）。 */
export const buildParlayBoostBetContextFromActivityDetail = (
    detail: ParlayBoostActivityDetail,
    normalizedRule = normalizeParlayBoostDetailRule(detail.rule),
): ParlayBoostRulesBetContext => {
    const { order, order_activity_ref: activityRef } = detail;
    if (!order || !activityRef) {
        throw new Error('Parlay boost activity detail is missing order snapshot.');
    }

    const selections = order.selections.map(orderSelectionToOddsEntity);
    const ladder = getSortedParlayBoostLadder(normalizedRule);
    const orderSettled = isOrderSettled(order);
    const qualifyingCount = orderSettled
        ? hasSettledBoostTierSnapshot(activityRef)
            ? activityRef.settled_boost_legs
            : 0
        : activityRef.order_boost_legs;
    const currentTier = orderSettled
        ? hasSettledBoostTierSnapshot(activityRef)
            ? resolveSnapshotTier(
                  ladder,
                  activityRef.settled_boost_legs,
                  toParlayBoostNumber(activityRef.settled_boost_rate),
              )
            : undefined
        : resolveSnapshotTier(ladder, activityRef.order_boost_legs, toParlayBoostNumber(activityRef.order_boost_rate));
    const preview = buildParlayBoostPreviewWithSnapshotTier(selections, normalizedRule, {
        qualifyingCount,
        currentTier,
    });
    const stake = Number.parseFloat(order.stake_amount) || 0;
    const payoutComputation = computeParlayBoostPayoutFromPreview(stake, selections, preview, normalizedRule);
    const settledOdds = orderSettled ? toParlayBoostNumber(order.settled_odds) : 0;
    const parlayOdds = settledOdds > 0 ? settledOdds : payoutComputation.parlayOdds;
    const basePayout =
        settledOdds > 0 ? computeParlayBoostBasePayout(stake, settledOdds) : payoutComputation.basePayout;
    const boostBasePayout = basePayout;
    const payoutPreview = orderSettled
        ? buildSettledParlayBoostPayoutPreview(
              basePayout,
              boostBasePayout,
              activityRef.settled_boost_amount,
              normalizedRule,
              activityRef.settled_boost_rate,
          )
        : payoutComputation.payoutPreview;
    const legStatusBySelectionId = new Map<string, TicketDisplayStatus>();

    selections.forEach((selection, index) => {
        const orderSelection = order.selections[index];
        if (!orderSelection) {
            return;
        }

        legStatusBySelectionId.set(
            getParlayBoostSelectionId(selection),
            resolveLegStatus(orderSelection.result, orderSelection.void_factor),
        );
    });

    const hasPendingSelection = selections.some((selection) => {
        const legStatus = legStatusBySelectionId.get(getParlayBoostSelectionId(selection));
        return legStatus === TicketDisplayStatus.Pending;
    });

    return {
        selections,
        preview,
        payoutPreview,
        stake,
        parlayOdds,
        legStatusBySelectionId,
        parlayCardStatus: resolveParlayStatus(order.selections),
        hasPendingSelection: hasPendingSelection || !hasAllSelectionsSettled(order.selections),
        fromOrderDetail: true,
    };
};
