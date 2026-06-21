'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { Order, OrderSelection } from '@/api/models/order';
import { AtOdds, Warn } from '@/components/icons';
import { ConditionalTooltip } from '@/components/tooltip';
import { getSportConfig } from '@/constants/sports-config';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { formatOddsByFormat, getFullOddsByFormat, hasOddsExtraPrecision } from '../_utils';
import {
    resolveLegStatus,
    resolveOpenOrderDisplayStatus,
    resolveTicketPayoutAmount,
    TICKET_STATUS_CONFIG,
    TicketDisplayStatus,
} from './ticket.types';
import { formatTicketTime, PAYOUT_DISPLAY_FORMAT_OPTIONS, PAYOUT_TOOLTIP_FORMAT_OPTIONS } from './ticket.utils';
import { TicketCard } from './ticket-card';

export interface TicketProps {
    order: Order;
    /** Ticket selection data */
    data: OrderSelection;
    /** Custom class name */
    className?: string;
}

export const Ticket: FC<TicketProps> = ({ order, data, className }) => {
    const { status, stake_amount, created_at, settled_amount, activity_settled_amount, activity_parlay_boost } = order;
    const t = useTranslations('betSlip');
    const displayStatus = resolveOpenOrderDisplayStatus(
        status,
        order.selections,
        resolveLegStatus(data.result, data.void_factor),
    );
    const config = TICKET_STATUS_CONFIG[displayStatus];
    const oddsFormat = useOddsFormat();
    const { formatCurrency, formatNumber, formatRelativeFullDatetime } = useIntlFormatter();

    const sportConfig = getSportConfig(data.sport_id);
    const SportIcon = sportConfig?.icon;

    const payoutAmount = resolveTicketPayoutAmount(
        settled_amount,
        displayStatus,
        activity_settled_amount,
        activity_parlay_boost,
    );
    const outcomeName = data.outcome_name_alias || data.outcome_name;
    const payoutText = (
        <span className={cn('text-body-lg', config.payoutColor, config.payoutStyle)}>
            {formatCurrency(payoutAmount, PAYOUT_DISPLAY_FORMAT_OPTIONS)}
        </span>
    );
    const showsVoidReason = displayStatus === TicketDisplayStatus.Void && Boolean(data.void_reason);
    return (
        <TicketCard status={displayStatus} surface="single" className={cn('flex w-full flex-col', className)}>
            <div className="flex items-center justify-between gap-2.5 border-b-[0.5px] border-filltext-ft-c px-[10px] py-2">
                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex min-w-0 max-w-full flex-wrap items-center gap-1.5 text-auxiliary-md text-filltext-ft-g">
                        <span className="min-w-0 max-w-full truncate">{data.title}</span>
                    </div>
                    <span className="truncate text-auxiliary-xs text-filltext-ft-f">
                        {formatTicketTime(created_at, formatRelativeFullDatetime)}
                    </span>
                </div>
                <span className={cn('shrink-0 text-body-lg', config.statusColor)}>{t(config.labelKey)}</span>
            </div>

            <div className="bg-neutral-white-e px-2 py-2">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-2 pr-2">
                        <div className="flex flex-col items-start justify-center">
                            <div className="flex w-full min-w-0 items-center gap-1">
                                {SportIcon && <SportIcon className="size-4 shrink-0 text-filltext-ft-f" />}
                                <span className="whitespace-normal break-words text-body-md text-filltext-ft-h">
                                    {data.market_name}
                                </span>
                            </div>
                            <span className="block w-full whitespace-normal wrap-break-word text-auxiliary-sm text-filltext-ft-g">
                                {outcomeName}
                            </span>
                        </div>
                    </div>

                    <ConditionalTooltip
                        content={getFullOddsByFormat(parseFloat(data.outcome_odds), oddsFormat)}
                        side="top"
                        forceShow={hasOddsExtraPrecision(parseFloat(data.outcome_odds))}
                    >
                        <span className="flex shrink-0 items-center gap-0.5 pr-px text-auxiliary-md text-filltext-ft-h">
                            <AtOdds className="size-3" />
                            {formatOddsByFormat(parseFloat(data.outcome_odds), oddsFormat)}
                        </span>
                    </ConditionalTooltip>
                </div>

                {showsVoidReason && (
                    <div className="mt-1 flex items-center gap-1 text-auxiliary-xs text-filltext-ft-g">
                        <Warn className="size-3 shrink-0 text-func-lost" />
                        <ConditionalTooltip content={data.void_reason} side="top">
                            <span className="truncate italic">{data.void_reason}</span>
                        </ConditionalTooltip>
                    </div>
                )}
            </div>

            <div className="border-t-[0.5px] border-neutral-white-h shadow-[0px_-1px_1px_0px_var(--neutral-black-b)]">
                <div className="flex items-center justify-between border-t-[0.5px] border-neutral-white-g px-[10px] py-2">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-auxiliary-xs text-filltext-ft-g">{t('ticket.stake')}</span>
                        <ConditionalTooltip content={formatNumber(Number(stake_amount))} side="top">
                            <span className="text-body-lg text-filltext-ft-h">
                                {formatCurrency(Number(stake_amount))}
                            </span>
                        </ConditionalTooltip>
                    </div>

                    {config.showPayout && (
                        <div className="flex flex-col items-end gap-0.5 text-right">
                            <span className="text-auxiliary-xs text-filltext-ft-h">{t(config.payoutLabel)}</span>
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
    );
};
