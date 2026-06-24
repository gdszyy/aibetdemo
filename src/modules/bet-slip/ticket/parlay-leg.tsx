'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { match } from 'ts-pattern';
import type { OrderSelection } from '@/api/models/order';
import { AtOdds } from '@/components/icons';
import { ConditionalTooltip } from '@/components/tooltip';
import { getSportConfig } from '@/constants/sports-config';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { formatOddsByFormat, getFullOddsByFormat, hasOddsExtraPrecision } from '../_utils';
import { resolveLegStatus, TICKET_STATUS_CONFIG, TicketDisplayStatus } from './ticket.types';
import { TicketLegStatusNode } from './ticket-leg-status-node';

export interface ParlayLegProps {
    data: OrderSelection;
    cardStatus: TicketDisplayStatus;
    hasPendingSelection?: boolean;
    expanded?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
    className?: string;
}

export const ParlayLeg: FC<ParlayLegProps> = ({
    data,
    cardStatus,
    hasPendingSelection = false,
    expanded = false,
    isFirst = false,
    isLast = false,
    className,
}) => {
    const { title, outcome_name, outcome_name_alias, market_name, outcome_odds, result, void_factor, void_reason } =
        data;
    const t = useTranslations('betSlip');
    const oddsFormat = useOddsFormat();
    const sportConfig = getSportConfig(data.sport_id);
    const SportIcon = sportConfig?.icon;
    const status = resolveLegStatus(result, void_factor);
    const config = TICKET_STATUS_CONFIG[status];
    const isPendingInLostCard = cardStatus === TicketDisplayStatus.Lost && status === TicketDisplayStatus.Pending;
    const isDimmed = status === TicketDisplayStatus.Void || isPendingInLostCard;
    const isLoss = status === TicketDisplayStatus.Lost || status === TicketDisplayStatus.HalfLost;
    const isLossInMixedPendingCard = cardStatus === TicketDisplayStatus.Lost && hasPendingSelection && isLoss;
    const timelineLineClassName = status === TicketDisplayStatus.Won ? 'bg-filltext-ft-f' : 'bg-filltext-ft-d';
    const textClassName = cn(
        'w-full',
        expanded ? 'whitespace-normal wrap-break-word' : 'block truncate whitespace-nowrap',
    );
    const outcomeName = outcome_name_alias || outcome_name;

    const badgeClassName = match(status)
        .with(TicketDisplayStatus.Won, () => 'border-func-win text-func-win')
        .with(TicketDisplayStatus.HalfWon, () => 'border-func-win text-func-win')
        .with(TicketDisplayStatus.Lost, () =>
            cn(
                'border-func-lost',
                isLossInMixedPendingCard ? 'bg-func-lost-solid text-neutral-white-h' : 'text-func-lost',
            ),
        )
        .with(TicketDisplayStatus.HalfLost, () => 'border-func-lost/75 text-func-lost')
        .with(TicketDisplayStatus.Void, () => 'border-func-void text-func-void')
        .with(TicketDisplayStatus.Pending, () => 'border-func-pending text-func-pending')
        .with(TicketDisplayStatus.Crediting, () => 'border-func-pending text-func-pending')
        .exhaustive();

    return (
        <div className={cn('flex w-full items-center gap-1', isDimmed && 'opacity-[0.45]', className)}>
            <div className="flex w-5 shrink-0 self-stretch flex-col items-center">
                <div className={cn('w-px flex-1', timelineLineClassName, isFirst && 'opacity-0')} />
                <TicketLegStatusNode
                    status={status}
                    cardStatus={cardStatus}
                    hasPendingSelection={hasPendingSelection}
                />
                <div className={cn('w-px flex-1', timelineLineClassName, isLast && 'opacity-0')} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col py-0.5">
                <div className="flex min-w-0 flex-1 items-start justify-between gap-1 rounded-sm border-[0.5px] border-filltext-ft-c bg-surface-1 p-2 shadow-[0px_2px_2px_0px_var(--filltext-ft-a)]">
                    <div className="flex min-w-0 flex-1 gap-1">
                        {SportIcon && <SportIcon className="mt-px size-4 shrink-0 text-filltext-ft-f" />}
                        <div className="flex min-w-0 flex-1 flex-col gap-2 pr-2">
                            <div className="flex flex-col items-start justify-center">
                                {expanded ? (
                                    <span className={cn(textClassName, 'text-body-md text-filltext-ft-h')}>
                                        {market_name}
                                    </span>
                                ) : (
                                    <ConditionalTooltip content={market_name} side="top">
                                        <span className={cn(textClassName, 'text-body-md text-filltext-ft-h')}>
                                            {market_name}
                                        </span>
                                    </ConditionalTooltip>
                                )}

                                {expanded ? (
                                    <span className={cn(textClassName, 'text-auxiliary-sm text-filltext-ft-g')}>
                                        {outcomeName}
                                    </span>
                                ) : (
                                    <ConditionalTooltip content={outcomeName} side="top">
                                        <span className={cn(textClassName, 'text-auxiliary-sm text-filltext-ft-g')}>
                                            {outcomeName}
                                        </span>
                                    </ConditionalTooltip>
                                )}
                            </div>

                            {expanded ? (
                                <span className={cn(textClassName, 'text-auxiliary-xs text-filltext-ft-e')}>
                                    {title}
                                </span>
                            ) : (
                                <ConditionalTooltip content={title} side="top">
                                    <span className={cn(textClassName, 'text-auxiliary-xs text-filltext-ft-e')}>
                                        {title}
                                    </span>
                                </ConditionalTooltip>
                            )}

                            {status === TicketDisplayStatus.Void && void_reason && (
                                <div className="flex items-start gap-1 text-auxiliary-xs text-filltext-ft-g">
                                    <span className="shrink-0 opacity-70">⚠️</span>
                                    <ConditionalTooltip content={void_reason} side="top">
                                        <span className="whitespace-normal wrap-break-word italic">{void_reason}</span>
                                    </ConditionalTooltip>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1 self-start">
                        <span
                            className={cn(
                                'rounded-full border-[0.25px] px-2 py-[2px] text-auxiliary-sm whitespace-nowrap',
                                badgeClassName,
                            )}
                        >
                            {t(config.labelKey)}
                        </span>

                        <ConditionalTooltip
                            content={getFullOddsByFormat(parseFloat(outcome_odds), oddsFormat)}
                            side="top"
                            forceShow={hasOddsExtraPrecision(parseFloat(outcome_odds))}
                        >
                            <span
                                className={cn(
                                    'flex items-center gap-0.5 pr-px text-auxiliary-md text-filltext-ft-h',
                                    (isLoss || isDimmed) && 'text-filltext-ft-e',
                                )}
                            >
                                <AtOdds className="size-3" />
                                {formatOddsByFormat(parseFloat(outcome_odds), oddsFormat)}
                            </span>
                        </ConditionalTooltip>
                    </div>
                </div>
            </div>
        </div>
    );
};
