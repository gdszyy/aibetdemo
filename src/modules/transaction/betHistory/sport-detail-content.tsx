'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { OrderStatus } from '@/api/models/order';
import type { SportReportItem } from '@/api/models/transaction-bethistory';
import { ConditionalTooltip } from '@/components/tooltip';
import { getSportConfig } from '@/constants/sports-config';
import {
    hasActivitySettledAmount,
    resolveTicketPayoutAmount,
    TicketDisplayStatus,
} from '@/modules/bet-slip/ticket/ticket.types';
import { SummaryCard } from './_components/summary-card';
import { SummaryLine } from './_components/summary-line';
import { resolveBetHistoryActivitySettledAmount, resolveBetHistoryProfitAmount } from './parlay-boost-history.utils';

interface SportDetailContentProps {
    item: SportReportItem;
}

const SelectionCard: FC<{ detail: SportReportItem['selections'][number]; statusText: string }> = ({
    detail,
    statusText,
}) => {
    const t = useTranslations('transaction');
    const sportConfig = getSportConfig(detail.sport_id);
    const SportIcon = sportConfig?.icon;
    const odds = detail.outcome_odds;

    return (
        <SummaryCard className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-2 rounded-sm bg-filltext-ft-b px-4 py-3">
                    {SportIcon && <SportIcon className="size-6 shrink-0 text-brand-primary-0" />}
                    <span className="text-body-md text-filltext-ft-h">{detail.sport_name}</span>
                </div>

                {statusText && (
                    <span className="rounded-xs bg-filltext-ft-g px-[6px] py-1 text-auxiliary-md text-neutral-white-h">
                        {statusText}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-2 text-filltext-ft-g">
                    <span className="text-body-lg">{detail.tournament_name}</span>
                    <span className="text-body-md">
                        {detail.home_competitor_name} vs {detail.away_competitor_name}
                    </span>
                </div>

                <div className="text-body-sm text-filltext-ft-f">{detail.result}</div>
            </div>

            <div className="grid gap-4 border-t border-filltext-ft-c pt-4 md:grid-cols-3">
                <SummaryLine label={`${t('betHistoryV2.market')}:`} value={detail.market_name} strong />
                <SummaryLine label={`${t('betHistoryV2.outcome')}:`} value={detail.outcome_name} strong />
                <SummaryLine
                    label={`${t('betHistoryV2.odds')}:`}
                    value={
                        <ConditionalTooltip content={odds} side="top" forceShow>
                            <span>{odds}</span>
                        </ConditionalTooltip>
                    }
                    strong
                />
            </div>
        </SummaryCard>
    );
};

/** 将注单历史状态映射为票据展示状态，供结算金额复用同一套派彩规则。 */
const resolveSportReportTicketStatus = (status: SportReportItem['status']): TicketDisplayStatus => {
    if (status === OrderStatus.Pending) return TicketDisplayStatus.Pending;
    if (status === OrderStatus.SettledVoid) return TicketDisplayStatus.Void;
    if (status === OrderStatus.SettledLost) return TicketDisplayStatus.Lost;

    return TicketDisplayStatus.Won;
};

/** 注单历史详情结算金额；有活动引用时才叠加 activity_settled_amount。 */
const resolveSportReportSettledAmount = (item: SportReportItem): string | number => {
    if (!hasActivitySettledAmount(item.activity_parlay_boost)) return item.settled_amount_main_bonus;

    return resolveTicketPayoutAmount(
        item.settled_amount_main_bonus,
        resolveSportReportTicketStatus(item.status),
        resolveBetHistoryActivitySettledAmount(item),
        item.activity_parlay_boost,
    );
};

export const SportDetailContent: FC<SportDetailContentProps> = ({ item }) => {
    const t = useTranslations('transaction');
    const totalOdds = item.settled_odds;
    const settledAmount = resolveSportReportSettledAmount(item);
    const profitAmount = resolveBetHistoryProfitAmount(item);

    return (
        <div className="flex flex-col gap-4">
            <SummaryCard className="flex flex-col gap-4">
                <SummaryLine label={`${t('betHistoryV2.orderId')} :`} value={item.bet_id} strong />
                <SummaryLine label={`${t('betHistoryV2.ticketId')} :`} value={item.ticket_id} strong />
                <SummaryLine label={`${t('betHistoryV2.betType')} :`} value={item.bet_type_string} strong />
            </SummaryCard>

            {item?.selections?.map((selection) => (
                <SelectionCard
                    key={`${selection.event_id}-${selection.outcome_id}`}
                    detail={selection}
                    statusText={item?.status_text || ''}
                />
            ))}

            <div className="grid gap-4 md:grid-cols-[1fr_1fr_0.9fr]">
                <SummaryCard className="flex flex-col gap-3">
                    <SummaryLine label={`${t('betHistoryV2.stake')} :`} value={item.stake_amount} strong />
                    {item?.financial_init?.map((financial) => (
                        <SummaryLine
                            key={`stake-${financial.name}`}
                            label={`${financial.name} :`}
                            value={financial.stake}
                        />
                    ))}
                </SummaryCard>

                <SummaryCard className="flex flex-col gap-3">
                    <SummaryLine label={`${t('betHistoryV2.settleAmount')} :`} value={settledAmount} strong />
                    {item?.financial_init?.map((financial) => (
                        <SummaryLine
                            key={`settled-${financial.name}`}
                            label={`${financial.name} :`}
                            value={financial.settled}
                        />
                    ))}
                </SummaryCard>

                <SummaryCard className="flex flex-col gap-3">
                    <SummaryLine
                        label={`${t('betHistoryV2.totalOdds')} :`}
                        value={
                            <ConditionalTooltip content={totalOdds} side="top" forceShow>
                                <span>{totalOdds}</span>
                            </ConditionalTooltip>
                        }
                        strong
                    />
                    <SummaryLine label={`${t('betHistoryV2.profit')} :`} value={profitAmount} strong />
                </SummaryCard>
            </div>
        </div>
    );
};
