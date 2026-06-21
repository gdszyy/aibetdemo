'use client';

import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';
import { match } from 'ts-pattern';
import { type Order, resolveActivityParlayBoostId } from '@/api/models/order';
import { ArrowDoubleDown } from '@/components/icons';
import { ParlayBadge } from '@/components/parlay-badge';
import { ParlayBoostRulesModal } from '@/components/parlay-boost-rules-modal';
import { ConditionalTooltip } from '@/components/tooltip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useParlayBoostActivityDetail } from '@/hooks/use-parlay-boost-activity-detail';
import { cn } from '@/utils/common';
import { COLLAPSE_THRESHOLD, COLLAPSED_HEIGHT, EXPANDED_HEIGHT, PREVIEW_HEIGHT } from '../_constants/constants';
import { ParlayLeg } from './parlay-leg';
import {
    resolveLegStatus,
    resolveOpenOrderDisplayStatus,
    resolveParlayStatus,
    resolveTicketPayoutAmount,
    shouldShowParlayBoostOrderDetailSections,
    TICKET_STATUS_CONFIG,
    TicketDisplayStatus,
} from './ticket.types';
import { formatTicketTime, PAYOUT_DISPLAY_FORMAT_OPTIONS, PAYOUT_TOOLTIP_FORMAT_OPTIONS } from './ticket.utils';
import { TicketCard } from './ticket-card';

export interface ParlayTicketProps {
    /** Parlay ticket data */
    order: Order;
    /** Custom class name */
    className?: string;
}

type ParlayViewMode = 'collapsed' | 'preview' | 'expanded';

const resolveInitialViewMode = (isCollapsible: boolean): ParlayViewMode =>
    match(isCollapsible)
        .with(true, () => 'collapsed' as const)
        .otherwise(() => 'expanded' as const);

export const ParlayTicket: FC<ParlayTicketProps> = ({ order, className }) => {
    const { selections, created_at, stake_amount, settled_amount, activity_settled_amount, activity_parlay_boost } =
        order;
    const t = useTranslations('betSlip');
    const tCommon = useTranslations('common');
    const { formatCurrency, formatNumber, formatRelativeFullDatetime } = useIntlFormatter();
    const overallStatus = resolveOpenOrderDisplayStatus(order.status, selections, resolveParlayStatus(selections));
    const overallConfig = TICKET_STATUS_CONFIG[overallStatus];
    const activityParlayBoostId = resolveActivityParlayBoostId(activity_parlay_boost);
    const hasParlayBoost = activityParlayBoostId !== undefined;
    const isCollapsible = selections.length > COLLAPSE_THRESHOLD;
    const hiddenSelectionsCount = Math.max(selections.length - COLLAPSE_THRESHOLD, 0);
    const [viewMode, setViewMode] = useState<ParlayViewMode>(resolveInitialViewMode(isCollapsible));
    const [rulesModalOpen, setRulesModalOpen] = useState(false);
    const {
        data: parlayBoostActivity,
        isLoading: isParlayBoostDetailLoading,
        isError: isParlayBoostDetailError,
    } = useParlayBoostActivityDetail({
        orderId: String(order.id),
        activityParlayBoostId,
        enabled: hasParlayBoost && rulesModalOpen && order.id > 0,
    });
    const parlayBoostDetailState = isParlayBoostDetailError ? 'error' : isParlayBoostDetailLoading ? 'loading' : 'idle';
    const showBoostOrderDetailSections = shouldShowParlayBoostOrderDetailSections(order.status, overallStatus);
    const rulesSections = {
        showContributionSection: true,
        showPayoutCalculation: showBoostOrderDetailSections,
        showMarketsSection: showBoostOrderDetailSections,
    };

    useEffect(() => {
        setViewMode(resolveInitialViewMode(isCollapsible));
    }, [isCollapsible]);

    const payoutAmount = resolveTicketPayoutAmount(
        settled_amount,
        overallStatus,
        activity_settled_amount,
        activity_parlay_boost,
    );
    const payoutText = (
        <span className={cn('text-body-lg', overallConfig.payoutColor, overallConfig.payoutStyle)}>
            {formatCurrency(payoutAmount, PAYOUT_DISPLAY_FORMAT_OPTIONS)}
        </span>
    );
    const settledCount = selections.filter(
        (selection) => resolveLegStatus(selection.result, selection.void_factor) !== TicketDisplayStatus.Pending,
    ).length;
    const hasPendingSelection = selections.some(
        (selection) => resolveLegStatus(selection.result, selection.void_factor) === TicketDisplayStatus.Pending,
    );
    const maxHeight = match(viewMode)
        .with('expanded', () => EXPANDED_HEIGHT)
        .with('preview', () => PREVIEW_HEIGHT)
        .otherwise(() => COLLAPSED_HEIGHT);
    const toggleLabel = match(viewMode)
        .with('expanded', () => t('ticket.showLess'))
        .otherwise(() => t('ticket.showMore', { count: hiddenSelectionsCount }));
    const interactiveCardProps = match(isCollapsible)
        .with(true, () => ({ role: 'button' as const, tabIndex: 0 }))
        .otherwise(() => ({}));

    const handleToggle = () => {
        if (!isCollapsible) return;

        setViewMode((currentMode) =>
            match(currentMode)
                .with('expanded', () => 'collapsed' as const)
                .otherwise(() => 'expanded' as const),
        );
    };

    return (
        <>
            <TicketCard
                status={overallStatus}
                surface="single"
                className={cn('flex w-full flex-col', isCollapsible && 'cursor-pointer', className)}
                onClick={handleToggle}
                onKeyDown={(event) => {
                    if (!isCollapsible) return;

                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleToggle();
                    }
                }}
                onPointerEnter={(event) => {
                    if (!isCollapsible || event.pointerType !== 'mouse') return;

                    setViewMode((currentMode) =>
                        match(currentMode)
                            .with('collapsed', () => 'preview' as const)
                            .otherwise(() => currentMode),
                    );
                }}
                onPointerLeave={(event) => {
                    if (!isCollapsible || event.pointerType !== 'mouse') return;

                    setViewMode((currentMode) =>
                        match(currentMode)
                            .with('preview', () => 'collapsed' as const)
                            .otherwise(() => currentMode),
                    );
                }}
                {...interactiveCardProps}
            >
                <div className="flex items-center justify-between gap-2.5 border-b-[0.5px] border-filltext-ft-c px-[10px] py-2">
                    <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-auxiliary-md text-filltext-ft-g">
                                {t('ticket.accumulator', { count: selections.length })}
                            </span>
                            {overallStatus === TicketDisplayStatus.Pending && (
                                <span className="rounded-full bg-neutral-black-h/[0.05] px-[7px] py-[1px] text-auxiliary-xxs font-medium text-filltext-ft-f">
                                    {t('ticket.settledProgress', { settled: settledCount, total: selections.length })}
                                </span>
                            )}
                        </div>
                        <span className="truncate text-auxiliary-xs text-filltext-ft-f">
                            {formatTicketTime(created_at, formatRelativeFullDatetime)}
                        </span>
                    </div>
                    <span className={cn('shrink-0 text-body-lg', overallConfig.statusColor)}>
                        {t(overallConfig.labelKey)}
                    </span>
                </div>

                {isCollapsible && (
                    <button
                        type="button"
                        className={cn(
                            'flex items-center justify-center gap-2 border-b-[0.3px] border-t-[0.3px] border-filltext-ft-d py-2 text-auxiliary-sm text-filltext-ft-f transition-colors',
                            match(viewMode)
                                .with('collapsed', () => undefined)
                                .otherwise(() => 'text-filltext-ft-f'),
                        )}
                        onClick={(event) => {
                            event.stopPropagation();
                            handleToggle();
                        }}
                    >
                        <span>{toggleLabel}</span>
                        <ArrowDoubleDown
                            className={cn(
                                'size-3 shrink-0 text-filltext-ft-f transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                                viewMode === 'expanded' && 'rotate-180',
                            )}
                        />
                    </button>
                )}

                <div
                    className="relative overflow-hidden bg-neutral-white-e px-2 py-2 transition-[max-height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{ maxHeight }}
                >
                    {hasParlayBoost && (
                        <div className="flex w-full justify-end pb-1.5">
                            <button
                                type="button"
                                className="inline-flex cursor-pointer"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setRulesModalOpen(true);
                                }}
                            >
                                <ParlayBadge variant="protected" label={tCommon('parlayBoostBadge.boost')} />
                            </button>
                        </div>
                    )}

                    {selections.map((selection, index) => (
                        <ParlayLeg
                            key={`${index}-${selection.event_id}-${selection.market_id}-${selection.product}-${selection.specifiers}-${selection.outcome_id}`}
                            data={selection}
                            cardStatus={overallStatus}
                            hasPendingSelection={hasPendingSelection}
                            expanded={viewMode === 'expanded'}
                            isFirst={index === 0}
                            isLast={index === selections.length - 1}
                        />
                    ))}

                    {isCollapsible && viewMode === 'collapsed' && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_bottom,rgba(240,242,245,0)_0%,rgba(247,248,250,0.52)_72%,rgba(240,242,245,0.92)_100%)]" />
                    )}
                </div>

                <div className="border-t-[0.5px] border-neutral-white-h shadow-[0px_-1px_1px_0px_var(--neutral-black-b)]">
                    <div className="flex items-center justify-between border-t-[0.5px] border-neutral-white-g px-[10px] py-2">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-auxiliary-xs text-filltext-ft-g">{t('ticket.stake')}</span>
                            <span
                                title={formatNumber(Number(stake_amount))}
                                className="text-body-lg text-filltext-ft-h"
                            >
                                {formatCurrency(Number(stake_amount))}
                            </span>
                        </div>

                        {overallConfig.showPayout && (
                            <div className="flex flex-col items-end gap-0.5 text-right">
                                <span className="text-auxiliary-xs text-filltext-ft-h">
                                    {t(overallConfig.payoutLabel)}
                                </span>
                                {payoutAmount > 0 ? (
                                    <ConditionalTooltip
                                        content={formatNumber(payoutAmount, PAYOUT_TOOLTIP_FORMAT_OPTIONS)}
                                        side="top"
                                    >
                                        {payoutText}
                                    </ConditionalTooltip>
                                ) : (
                                    payoutText
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </TicketCard>
            <ParlayBoostRulesModal
                visible={hasParlayBoost && rulesModalOpen}
                onClose={() => setRulesModalOpen(false)}
                fetchRule={false}
                rule={parlayBoostActivity?.rule ?? null}
                betContext={parlayBoostActivity?.betContext}
                detailState={parlayBoostDetailState}
                {...rulesSections}
            />
        </>
    );
};
