import { isOutcomeActiveLocked, LineStatus, type OutcomeActiveEnum, shouldShowOutcome } from '@/api/models/market';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import type { RecommendCardSelection } from '@/api/models/recommend-card';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import {
    isActiveParlayBoostRule,
    isParlayBoostSelectionQualified,
    type ParlayBoostSelectionInput,
    toParlayBoostNumber,
} from '@/utils/parlay-boost-preview';

/** 将推荐卡片投注项转换为购物车 OddsEntity。 */
export const convertRecommendCardSelectionToOddsEntity = (selection: RecommendCardSelection): OddsEntity => {
    const outcomeDisplayName = selection.outcome_name_alias || selection.outcome_name;

    return {
        sportId: selection.sport_id,
        eventId: selection.event_id,
        eventIdType: selection.event_id_type,
        matchStatus: selection.match_status,
        tournamentId: selection.tournament_id,
        categoryId: selection.category_id,
        title: selection.title,
        marketId: Number(selection.market_id) || 0,
        marketName: selection.market_name,
        productRaw: selection.product_raw,
        productId: selection.product,
        specifiers: selection.specifiers,
        lineStatus: selection.specifiers_status,
        line: selection.outcome_line,
        outcome: {
            id: selection.outcome_id,
            name: outcomeDisplayName,
            name_alias: outcomeDisplayName,
            odds: toParlayBoostNumber(selection.outcome_odds),
            active: selection.outcome_active as OutcomeActiveEnum,
            line: selection.outcome_line,
            last_update: selection.timestamp,
        },
        timestamp: selection.timestamp,
    };
};

/** 将推荐卡片全部投注项转换为购物车 OddsEntity 列表。 */
export const convertRecommendCardSelectionsToOddsEntities = (selections: RecommendCardSelection[]): OddsEntity[] => {
    return selections.map(convertRecommendCardSelectionToOddsEntity);
};

/** 推荐卡串关赔率 / 档位预览基础过滤：排除失效、锁盘、暂停盘口。 */
export const getRecommendCardOddsEligibleSelections = (
    selections: RecommendCardSelection[],
): RecommendCardSelection[] => {
    return selections.filter((selection) => {
        if (!shouldShowOutcome(selection.outcome_active)) {
            return false;
        }
        if (isOutcomeActiveLocked(selection.outcome_active)) {
            return false;
        }
        if (selection.specifiers_status === LineStatus.Suspended) {
            return false;
        }
        return true;
    });
};

/** 将推荐投注项转换为串关加赔规则判断入参。 */
export const toRecommendCardSelectionInput = (selection: RecommendCardSelection): ParlayBoostSelectionInput => {
    return {
        eventId: selection.event_id,
        marketId: Number(selection.market_id),
        productId: selection.product,
        matchStatus: selection.match_status,
        specifiers: selection.specifiers,
        outcome: {
            id: selection.outcome_id,
            odds: toParlayBoostNumber(selection.outcome_odds),
            active: selection.outcome_active,
        },
        tournamentId: selection.tournament_id,
        categoryId: selection.category_id,
        productRaw: selection.product_raw,
        sportId: selection.sport_id,
        lineStatus: selection.specifiers_status,
    };
};

/** 推荐卡 UI 展示 / 加购用：排除失效、锁盘、暂停，以及不符合加赔规则的投注项。 */
export const getRecommendCardQualifiedSelections = (
    selections: RecommendCardSelection[],
    rule: ParlayBoostRule | null,
): RecommendCardSelection[] => {
    const eligibleSelections = getRecommendCardOddsEligibleSelections(selections);
    if (!isActiveParlayBoostRule(rule)) {
        return eligibleSelections;
    }

    return eligibleSelections.filter((selection) =>
        isParlayBoostSelectionQualified(toRecommendCardSelectionInput(selection), rule),
    );
};
