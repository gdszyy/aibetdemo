import { TicketDisplayStatus } from '@/modules/bet-slip/ticket/ticket.types';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { getOutcomeDisplayName } from '@/utils/outcome-display';
import {
    getParlayBoostSelectionId,
    type ParlayBoostPayoutPreview,
    type ParlayBoostPreview,
} from '@/utils/parlay-boost-preview';

/** 规则弹窗贡献行展示数据。 */
export interface ParlayBoostContributionRowModel {
    /** 投注项唯一标识。 */
    selectionId: string;
    /** 与 Open/Settled 串关腿一致的状态图标。 */
    legStatus: TicketDisplayStatus;
    /** 是否计入加赔合规腿。 */
    isQualifying: boolean;
    /** 赛事标题。 */
    match: string;
    /** 市场 + 投注项。 */
    market: string;
    /** 赔率展示文案。 */
    odds: string;
}

/** 投注场景规则弹窗上下文（购物车实时数据）。 */
export interface ParlayBoostRulesBetContext {
    /** 购物车投注项。 */
    selections: OddsEntity[];
    /** 串关加赔预览。 */
    preview: ParlayBoostPreview;
    /** 派彩预览。 */
    payoutPreview: ParlayBoostPayoutPreview;
    /** 串关本金。 */
    stake: number;
    /** 串关总赔率。 */
    parlayOdds: number;
    /** 已结算订单各腿状态（有则展示真实结算图标）。 */
    legStatusBySelectionId?: Map<string, TicketDisplayStatus>;
    /** 串关票整体状态，用于 pending-in-lost 节点样式。 */
    parlayCardStatus?: TicketDisplayStatus;
    /** 是否存在未结算腿。 */
    hasPendingSelection?: boolean;
    /** Open 注单 detail 弹窗：合规数据来自 order_activity_ref 快照，非购物车前端重算。 */
    fromOrderDetail?: boolean;
}

/** 生成贡献区块行数据。 */
export const buildParlayBoostContributionRows = (
    context: ParlayBoostRulesBetContext,
    formatOdds: (odds: number) => string,
): ParlayBoostContributionRowModel[] => {
    const { selections, preview, legStatusBySelectionId } = context;

    return selections.map((selection) => {
        const selectionId = getParlayBoostSelectionId(selection);
        const isQualifying = preview.qualifyingSelectionIds.has(selectionId);
        const legStatus =
            legStatusBySelectionId?.get(selectionId) ??
            (isQualifying ? TicketDisplayStatus.Pending : TicketDisplayStatus.Void);

        return {
            selectionId,
            legStatus,
            isQualifying,
            match: selection.title,
            market: `${selection.marketName} · ${getOutcomeDisplayName(selection.outcome)}`,
            odds: formatOdds(selection.outcome.odds),
        };
    });
};
