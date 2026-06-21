import { useMemo } from 'react';
import { useParlayBoostRule } from '@/hooks/use-parlay-boost-rule';
import { getParlayOddsEligibleSelections } from '@/modules/bet-slip/_utils';
import {
    computeParlayBoostPayoutFromPreview,
    getParlayBoostDisplayOdds,
    getParlayBoostPreview,
    type ParlayBoostPreview,
} from '@/utils/parlay-boost-preview';
import type { ParlayBoostRulesBetContext } from '@/utils/parlay-boost-rules-context';
import { useAllSelections } from '../../stores/bet-slip-store';
import { useParlayConflicts, useParlayNonCompliantSelectionIds } from './use-parlay-selection-map';

/** 串关购物车规则弹窗所需的预览与 betContext（与 footer 派彩计算口径一致）。 */
export interface ParlayBoostCartRulesState {
    /** 是否存在可展示的串关加赔活动。 */
    enabled: boolean;
    /** 串关加赔预览，供进度条等展示。 */
    preview: ParlayBoostPreview;
    /** 规则弹窗 bet 模式上下文。 */
    betContext?: ParlayBoostRulesBetContext;
    /** 展示用串关赔率。 */
    parlayOdds: number;
    /** 派彩预览，与 footer Payout 一致。 */
    payoutPreview: ReturnType<typeof computeParlayBoostPayoutFromPreview>['payoutPreview'];
    /** 展示用总赔率（含加赔语义）。 */
    parlayDisplayOdds: ReturnType<typeof getParlayBoostDisplayOdds>;
}

/** 汇总购物车串关加赔预览、派彩与规则弹窗上下文。 */
export const useParlayBoostCartRules = (stake: number | undefined): ParlayBoostCartRulesState => {
    const selections = useAllSelections();
    const conflictedSelectionIds = useParlayConflicts();
    const nonCompliantSelectionIds = useParlayNonCompliantSelectionIds();
    const { data: parlayBoostRule = null } = useParlayBoostRule();
    const normalizedStake = stake ?? 0;

    const parlayOddsSelections = useMemo(
        () => getParlayOddsEligibleSelections(selections, conflictedSelectionIds, nonCompliantSelectionIds),
        [conflictedSelectionIds, nonCompliantSelectionIds, selections],
    );

    const parlayBoostPreview = useMemo(
        () => getParlayBoostPreview(parlayOddsSelections, parlayBoostRule),
        [parlayBoostRule, parlayOddsSelections],
    );

    const { parlayOdds, payoutPreview } = useMemo(
        () =>
            computeParlayBoostPayoutFromPreview(
                normalizedStake,
                parlayOddsSelections,
                parlayBoostPreview,
                parlayBoostRule,
            ),
        [normalizedStake, parlayBoostPreview, parlayBoostRule, parlayOddsSelections],
    );

    const parlayDisplayOdds = useMemo(
        () => getParlayBoostDisplayOdds(normalizedStake, parlayOddsSelections, parlayBoostPreview, parlayBoostRule),
        [normalizedStake, parlayBoostPreview, parlayBoostRule, parlayOddsSelections],
    );

    const betContext = useMemo(
        (): ParlayBoostRulesBetContext | undefined =>
            parlayBoostPreview.enabled
                ? {
                      selections: parlayOddsSelections,
                      preview: parlayBoostPreview,
                      payoutPreview,
                      stake: normalizedStake,
                      parlayOdds,
                  }
                : undefined,
        [normalizedStake, parlayBoostPreview, parlayOdds, parlayOddsSelections, payoutPreview],
    );

    return {
        enabled: parlayBoostPreview.enabled,
        preview: parlayBoostPreview,
        betContext,
        parlayOdds,
        payoutPreview,
        parlayDisplayOdds,
    };
};
