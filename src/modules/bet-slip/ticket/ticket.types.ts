/**
 * Ticket-related type definitions.
 *
 * Unifies Single and Parlay ticket types and configs.
 */

import { match } from 'ts-pattern';
import type { ActivityParlayBoostRef, OrderSelection } from '@/api/models/order';
import { OrderSelectionResultStatus, OrderStatus } from '@/api/models/order';
import type { TranslationKey } from '@/i18nV2/types';

/** Unified display status (covers Won/Lost/HalfWon/HalfLost/Pending/Void) */
export enum TicketDisplayStatus {
    Won = 'won',
    Lost = 'lost',
    HalfWon = 'halfWon',
    HalfLost = 'halfLost',
    Pending = 'pending',
    Crediting = 'crediting',
    Void = 'void',
}

/** Status config */
export interface StatusConfig {
    labelKey: TranslationKey<'betSlip'>;
    statusColor: string;
    payoutColor: string;
    payoutLabel: TranslationKey<'betSlip'>;
    payoutStyle?: string;
    textColor: string;
    showPayout: boolean;
    hoverBorderColor: string;
    hoverBoxShadow: string;
    hoverGradient: string;
    singleHoverGradient: string;
    stateKey: 'pending' | 'won' | 'halfWon' | 'lost' | 'void';
}

/** Unified status config mapping */
export const TICKET_STATUS_CONFIG: Record<TicketDisplayStatus, StatusConfig> = {
    won: {
        labelKey: 'ticket.status.won',
        statusColor: 'text-func-win',
        payoutColor: 'text-func-win',
        payoutLabel: 'ticket.payout',
        textColor: 'text-filltext-ft-g',
        showPayout: true,
        hoverBorderColor: 'rgba(26, 127, 30, 0.32)',
        hoverBoxShadow:
            '0 0 0 1px rgba(26, 127, 30, 0.12), 0 4px 20px rgba(26, 127, 30, 0.16), 0 8px 32px rgba(26, 127, 30, 0.09), 0 2px 8px rgba(0, 0, 0, 0.08)',
        hoverGradient: 'linear-gradient(to bottom, rgba(26, 127, 30, 0.08) 0%, transparent 40%)',
        singleHoverGradient: 'linear-gradient(180deg, rgba(26, 127, 30, 0.12) 0%, rgba(255, 255, 255, 0.005) 100%)',
        stateKey: 'won',
    },
    lost: {
        labelKey: 'ticket.status.lost',
        statusColor: 'text-func-lost',
        payoutColor: 'text-func-lost',
        payoutLabel: 'ticket.payout',
        textColor: 'text-filltext-ft-g',
        showPayout: true,
        hoverBorderColor: 'rgba(175, 5, 7, 0.3)',
        hoverBoxShadow:
            '0 0 0 1px rgba(175, 5, 7, 0.12), 0 4px 20px rgba(175, 5, 7, 0.16), 0 8px 32px rgba(175, 5, 7, 0.09), 0 2px 8px rgba(0, 0, 0, 0.08)',
        hoverGradient: 'linear-gradient(to bottom, rgba(175, 5, 7, 0.09) 0%, transparent 40%)',
        singleHoverGradient: 'linear-gradient(180deg, rgba(175, 5, 7, 0.12) 0%, rgba(255, 255, 255, 0.005) 100%)',
        stateKey: 'lost',
    },
    halfWon: {
        labelKey: 'ticket.status.halfWon',
        statusColor: 'text-func-win',
        payoutColor: 'text-func-win',
        payoutLabel: 'ticket.payout',
        textColor: 'text-filltext-ft-g',
        showPayout: true,
        hoverBorderColor: 'rgba(26, 127, 30, 0.24)',
        hoverBoxShadow:
            '0 0 0 1px rgba(26, 127, 30, 0.09), 0 4px 20px rgba(26, 127, 30, 0.12), 0 8px 32px rgba(26, 127, 30, 0.07), 0 2px 8px rgba(0, 0, 0, 0.08)',
        hoverGradient: 'linear-gradient(to bottom, rgba(26, 127, 30, 0.06) 0%, transparent 40%)',
        singleHoverGradient: 'linear-gradient(180deg, rgba(26, 127, 30, 0.12) 0%, rgba(255, 255, 255, 0.005) 100%)',
        stateKey: 'halfWon',
    },
    halfLost: {
        labelKey: 'ticket.status.halfLost',
        statusColor: 'text-func-lost',
        payoutColor: 'text-func-lost',
        payoutLabel: 'ticket.payout',
        textColor: 'text-filltext-ft-g',
        showPayout: true,
        hoverBorderColor: 'rgba(196, 196, 196, 0.5)',
        hoverBoxShadow:
            '0 0 0 1px rgba(196, 196, 196, 0.15), 0 4px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        hoverGradient: 'linear-gradient(to bottom, rgba(196, 196, 196, 0.06) 0%, transparent 40%)',
        singleHoverGradient: 'linear-gradient(180deg, rgba(196, 196, 196, 0.18) 0%, rgba(255, 255, 255, 0.005) 100%)',
        stateKey: 'lost',
    },
    pending: {
        labelKey: 'ticket.status.pending',
        statusColor: 'text-func-pending',
        payoutColor: 'text-filltext-ft-e',
        payoutLabel: 'ticket.maxPayout',
        textColor: 'text-filltext-ft-g',
        showPayout: false,
        hoverBorderColor: 'rgba(177, 129, 24, 0.4)',
        hoverBoxShadow:
            '0 0 0 1px rgba(177, 129, 24, 0.15), 0 4px 20px rgba(177, 129, 24, 0.18), 0 8px 32px rgba(177, 129, 24, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08)',
        hoverGradient: 'linear-gradient(to bottom, rgba(177, 129, 24, 0.09) 0%, transparent 40%)',
        singleHoverGradient: 'linear-gradient(180deg, rgba(177, 129, 24, 0.12) 0%, rgba(255, 255, 255, 0.005) 100%)',
        stateKey: 'pending',
    },
    crediting: {
        labelKey: 'ticket.status.crediting',
        statusColor: 'text-func-pending',
        payoutColor: 'text-filltext-ft-e',
        payoutLabel: 'ticket.maxPayout',
        textColor: 'text-filltext-ft-g',
        showPayout: false,
        hoverBorderColor: 'rgba(177, 129, 24, 0.4)',
        hoverBoxShadow:
            '0 0 0 1px rgba(177, 129, 24, 0.15), 0 4px 20px rgba(177, 129, 24, 0.18), 0 8px 32px rgba(177, 129, 24, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08)',
        hoverGradient: 'linear-gradient(to bottom, rgba(177, 129, 24, 0.09) 0%, transparent 40%)',
        singleHoverGradient: 'linear-gradient(180deg, rgba(177, 129, 24, 0.12) 0%, rgba(255, 255, 255, 0.005) 100%)',
        stateKey: 'pending',
    },
    void: {
        labelKey: 'ticket.status.void',
        statusColor: 'text-func-void',
        payoutColor: 'text-func-void',
        payoutLabel: 'ticket.payout',
        textColor: 'text-filltext-ft-e',
        showPayout: true,
        hoverBorderColor: 'rgba(196, 196, 196, 0.5)',
        hoverBoxShadow:
            '0 0 0 1px rgba(196, 196, 196, 0.15), 0 4px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        hoverGradient: 'linear-gradient(to bottom, rgba(196, 196, 196, 0.06) 0%, transparent 40%)',
        singleHoverGradient: 'linear-gradient(180deg, rgba(196, 196, 196, 0.42) 0%, rgba(255, 255, 255, 0.017) 100%)',
        stateKey: 'void',
    },
};

const parseVoidFactor = (voidFactor?: string): number | null => {
    const parsedVoidFactor = Number.parseFloat(voidFactor ?? '');
    return Number.isFinite(parsedVoidFactor) ? parsedVoidFactor : null;
};

const TICKET_AMOUNT_PRECISION_FACTOR = 1_000_000;

/** 将后端金额字段转换为可计算数字，空值按 0 处理。 */
const parseTicketAmount = (amount?: string | number): number => {
    if (amount === undefined || amount === '') return 0;

    const parsedAmount = Number(amount);
    return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};

/** 金额求和时使用整数缩放，避免 JS 浮点误差影响展示。 */
const sumTicketAmounts = (...amounts: number[]): number => {
    const sum = amounts.reduce((acc, amount) => acc + Math.round(amount * TICKET_AMOUNT_PRECISION_FACTOR), 0);
    return sum / TICKET_AMOUNT_PRECISION_FACTOR;
};

/** 判断订单是否存在活动加赔引用；非 null 时才计入 activity_settled_amount。 */
export function hasActivitySettledAmount(activityParlayBoost?: ActivityParlayBoostRef | null): boolean {
    return activityParlayBoost != null;
}

/**
 * Resolve parlay leg display status.
 *
 * Based on selection.result + selection.void_factor:
 * - Won                         -> won
 * - Lost                        -> lost
 * - Won + void_factor=0.5 -> halfWon
 * - Lost + void_factor=0.5 -> halfLost
 * - Lost + void_factor=1   -> void (full refund)
 * - Canceled               -> void
 */
export function resolveLegStatus(result: OrderSelectionResultStatus | '', voidFactor?: string): TicketDisplayStatus {
    const parsedVoidFactor = parseVoidFactor(voidFactor);

    return match({ result, parsedVoidFactor })
        .with({ result: '' }, () => TicketDisplayStatus.Pending)
        .with({ result: OrderSelectionResultStatus.Pending }, () => TicketDisplayStatus.Pending)
        .with({ result: OrderSelectionResultStatus.Canceled }, () => TicketDisplayStatus.Void)
        .with({ result: OrderSelectionResultStatus.Won, parsedVoidFactor: 0.5 }, () => TicketDisplayStatus.HalfWon)
        .with({ result: OrderSelectionResultStatus.Won }, () => TicketDisplayStatus.Won)
        .with({ result: OrderSelectionResultStatus.Lost, parsedVoidFactor: 1 }, () => TicketDisplayStatus.Void)
        .with({ result: OrderSelectionResultStatus.Lost, parsedVoidFactor: 0.5 }, () => TicketDisplayStatus.HalfLost)
        .with({ result: OrderSelectionResultStatus.Lost }, () => TicketDisplayStatus.Lost)
        .otherwise(() => TicketDisplayStatus.Pending);
}

/** Resolve overall parlay card display status from legs. */
export function resolveParlayStatus(selections: OrderSelection[]): TicketDisplayStatus {
    const legStatuses = selections.map((selection) => resolveLegStatus(selection.result, selection.void_factor));
    const hasOnlyVoidSelections =
        legStatuses.length > 0 && legStatuses.every((status) => status === TicketDisplayStatus.Void);
    const hasLoss = legStatuses.some((status) => status === TicketDisplayStatus.Lost);
    const hasPending = legStatuses.some((status) => status === TicketDisplayStatus.Pending);
    return match({ hasOnlyVoidSelections, hasLoss, hasPending })
        .with({ hasOnlyVoidSelections: true }, () => TicketDisplayStatus.Void)
        .with({ hasLoss: true }, () => TicketDisplayStatus.Lost)
        .with({ hasPending: true }, () => TicketDisplayStatus.Pending)
        .otherwise(() => TicketDisplayStatus.Won);
}

export function hasAllSelectionsSettled(selections: OrderSelection[]): boolean {
    return (
        selections.length > 0 &&
        selections.every(
            (selection) => resolveLegStatus(selection.result, selection.void_factor) !== TicketDisplayStatus.Pending,
        )
    );
}

export function resolveOpenOrderDisplayStatus(
    orderStatus: OrderStatus,
    selections: OrderSelection[],
    status: TicketDisplayStatus,
): TicketDisplayStatus {
    if (orderStatus === OrderStatus.Pending && hasAllSelectionsSettled(selections)) {
        return TicketDisplayStatus.Crediting;
    }

    return status;
}

/**
 * 订单串关加赔规则弹窗是否展示 Markets / 派彩计算区块。
 * Open 未结算单关闭；Settled 仅整体判定为赢时展示。
 */
export function shouldShowParlayBoostOrderDetailSections(
    orderStatus: OrderStatus,
    overallStatus: TicketDisplayStatus,
): boolean {
    return orderStatus !== OrderStatus.Pending && overallStatus === TicketDisplayStatus.Won;
}

/**
 * 解析已结算票据派彩金额。
 * activity_parlay_boost 非空时，派彩 = settled_amount + activity_settled_amount。
 */
export function resolveTicketPayoutAmount(
    settledAmount: string | number,
    status: TicketDisplayStatus,
    activitySettledAmount?: string | number,
    activityParlayBoost?: ActivityParlayBoostRef | null,
): number {
    return match(status)
        .with(TicketDisplayStatus.Pending, () => 0)
        .with(TicketDisplayStatus.Crediting, () => 0)
        .with(TicketDisplayStatus.Void, () => 0)
        .otherwise(() => {
            const baseSettledAmount = parseTicketAmount(settledAmount);
            if (!hasActivitySettledAmount(activityParlayBoost)) return baseSettledAmount;

            return sumTicketAmounts(baseSettledAmount, parseTicketAmount(activitySettledAmount));
        });
}
