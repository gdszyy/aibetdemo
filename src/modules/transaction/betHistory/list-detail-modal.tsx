'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { CasinoReportItem, GameReportItem, SportReportItem } from '@/api/models/transaction-bethistory';
import { Modal } from '@/components/modal/modal';
import { cn } from '@/utils/common';
import { CasinoDetailContent } from './casino-detail-content';
import { resolveBetHistoryActivitySettledAmount, resolveBetHistorySportReport } from './parlay-boost-history.utils';
import { SportDetailContent } from './sport-detail-content';
import type { BetHistoryListItem } from './types';

interface ListDetailModalProps {
    visible: boolean;
    onClose: () => void;
    item: BetHistoryListItem | null;
}

const isGameReportItem = (item: BetHistoryListItem): item is GameReportItem => {
    return 'data' in item && 'type' in item && 'order_id' in item;
};

/** 从 All/Sport 列表项中取实际体育详情，并保留顶层活动结算字段。 */
const resolveSportDetailItem = (item: BetHistoryListItem): SportReportItem | null => {
    const sport = resolveBetHistorySportReport(item);
    if (!sport) return null;

    if (!isGameReportItem(item) || item.type !== 'sport') return sport;

    const activityParlayBoost = sport.activity_parlay_boost ?? item.activity_parlay_boost;

    return {
        ...sport,
        activity_parlay_boost: activityParlayBoost,
        activity_settled_amount:
            resolveBetHistoryActivitySettledAmount(item) ?? resolveBetHistoryActivitySettledAmount(sport),
    };
};

/** 根据注单来源分发 sport/casino 详情弹窗。 */
export const ListDetailModal: FC<ListDetailModalProps> = ({ visible, onClose, item }) => {
    const t = useTranslations('transaction');

    if (!visible || item === null) return null;

    const sportDetailItem = resolveSportDetailItem(item);

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            withBg={false}
            closeButton={true}
            contentClassName="w-[660px]"
            maskClosable={false}
        >
            <div className=" overflow-hidden rounded-lg bg-surface-1 shadow-lg">
                <div className="flex items-center justify-between border-b border-filltext-ft-c px-4 py-4">
                    <h2 className="text-title-md text-filltext-ft-h">{t('betHistoryV2.detail')}</h2>
                </div>

                <div className={cn('max-h-[calc(100vh-105px)] overflow-auto p-4')}>
                    {sportDetailItem ? (
                        <SportDetailContent item={sportDetailItem} />
                    ) : (
                        <CasinoDetailContent item={item as CasinoReportItem} />
                    )}
                </div>
            </div>
        </Modal>
    );
};
