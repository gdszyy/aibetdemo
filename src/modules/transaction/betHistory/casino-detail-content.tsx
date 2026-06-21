'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { CasinoReportItem } from '@/api/models/transaction-bethistory';
import { formatLikeTime } from '@/utils/time';
import { DetailTile } from './_components/detail-tile';

interface CasinoDetailContentProps {
    item: CasinoReportItem;
}

export const CasinoDetailContent: FC<CasinoDetailContentProps> = ({ item }) => {
    const t = useTranslations('transaction');

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <DetailTile label={`${t('betHistoryV2.orderId')} :`} value={item.order_id} />
            <DetailTile label={`${t('betHistoryV2.currency')} :`} value={item.currency} />
            <DetailTile label={`${t('betHistoryV2.merchant')} :`} value={item.merchant_name} />
            <DetailTile label={`${t('betHistoryV2.gameType')} :`} value={item.game_type} />
            <DetailTile label={`${t('betHistoryV2.odds')} :`} value={item.odds} />
            <DetailTile label={`${t('betHistoryV2.stake')} :`} value={item.total_stake} />
            <DetailTile label={`${t('betHistoryV2.profit')} :`} value={item.total_profit} />
            <DetailTile label={`${t('betHistoryV2.settledAmount')} :`} value={item.settled_amount} />
            <DetailTile label={`${t('betHistoryV2.result')} :`} value={item.result} />
            <DetailTile label={`${t('betHistoryV2.status')} :`} value={item.status_text} />
            <DetailTile label={`${t('betHistoryV2.betTime')} :`} value={formatLikeTime(item.bet_time)} />
        </div>
    );
};
