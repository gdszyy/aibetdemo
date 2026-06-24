import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import type { RecommendCardSelection } from '@/api/models/recommend-card';
import { formatOddsByFormat, type OddsFormat } from '@/utils/odds-format';
import {
    getParlayBoostDisplayOdds,
    getParlayBoostPreview,
    PARLAY_BOOST_UNIT_DISPLAY_STAKE,
    type ParlayBoostDisplayOdds,
    toParlayBoostNumber,
} from '@/utils/parlay-boost-preview';
import {
    getRecommendCardQualifiedSelections,
    toRecommendCardSelectionInput,
} from '@/utils/recommend-card-to-odds-entity';

/** @deprecated 使用 PARLAY_BOOST_UNIT_DISPLAY_STAKE。 */
export const RECOMMEND_CARD_DISPLAY_STAKE = PARLAY_BOOST_UNIT_DISPLAY_STAKE;

/** 推荐卡与购物车对齐的串关加赔展示赔率。 */
export type RecommendCardParlayBoostDisplayOdds = ParlayBoostDisplayOdds;

/** 获取推荐项展示说明。 */
export const getSelectionDescription = (selection: RecommendCardSelection, oddsFormat: OddsFormat): string => {
    const marketName = selection.market_name.trim();
    const outcomeName = (selection.outcome_name_alias || selection.outcome_name).trim();
    const odds = formatOddsByFormat(toParlayBoostNumber(selection.outcome_odds), oddsFormat);

    return `${marketName} ${outcomeName} @ ${odds}`;
};

export {
    getRecommendCardOddsEligibleSelections,
    getRecommendCardQualifiedSelections,
    toRecommendCardSelectionInput,
} from '@/utils/recommend-card-to-odds-entity';

/** 推荐卡展示赔率：与购物车 getParlayBoostDisplayOdds 同源，无 stake 时用单位本金 1。 */
export const getRecommendCardParlayBoostDisplayOdds = (
    selections: RecommendCardSelection[],
    rule: ParlayBoostRule | null,
): RecommendCardParlayBoostDisplayOdds => {
    const qualifiedSelections = getRecommendCardQualifiedSelections(selections, rule);
    const selectionInputs = qualifiedSelections.map(toRecommendCardSelectionInput);
    const preview = getParlayBoostPreview(selectionInputs, rule);

    return getParlayBoostDisplayOdds(0, selectionInputs, preview, rule);
};
