'use client';

import { useTranslations } from 'next-intl';
import { type FC, useMemo, useState } from 'react';
import type { CasinoReportItem, GameReportItem, SportReportItem } from '@/api/models/transaction-bethistory';
import { Button } from '@/components/button/button';
import { ParlayBadge } from '@/components/parlay-badge';
import { ParlayBoostRulesModal } from '@/components/parlay-boost-rules-modal';
import { ConditionalTooltip } from '@/components/tooltip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useParlayBoostActivityDetail } from '@/hooks/use-parlay-boost-activity-detail';
import { cn } from '@/utils/common';
import {
    resolveBetHistoryParlayBoostContext,
    resolveBetHistoryParlayBoostModalSections,
    resolveBetHistoryProfitAmount,
} from './parlay-boost-history.utils';
import type { BetHistoryListItem } from './types';

const LIST_GRID_CLASS = 'grid min-w-[1188px] grid-cols-[220px_220px_220px_220px_220px_80px] items-center gap-2';

interface ListItemProps {
    item: BetHistoryListItem;
    onDetail: () => void;
}

const isGameReportItem = (item: BetHistoryListItem): item is GameReportItem => {
    return 'data' in item && 'type' in item && 'order_id' in item;
};

const isSportReportItem = (item: BetHistoryListItem): item is SportReportItem => {
    return 'financial_init' in item;
};

const isCasinoHistoryItem = (item: BetHistoryListItem): item is CasinoReportItem => {
    return 'merchant_name' in item && 'order_id' in item && !('data' in item);
};

const getOrderId = (item: BetHistoryListItem) => {
    if (isGameReportItem(item)) return item.order_id;
    if (isCasinoHistoryItem(item)) return item.order_id;
    return item.bet_id;
};

const getStake = (item: BetHistoryListItem) => {
    if (isGameReportItem(item)) return item.stake;
    if (isSportReportItem(item)) return item.stake_amount;
    return item.total_stake;
};

const getProfit = (item: BetHistoryListItem) => {
    return resolveBetHistoryProfitAmount(item);
};

/** 获取列表展示的游戏类型，按不同报表接口字段选择展示值。 */
const getGameType = (item: BetHistoryListItem): string => {
    if ('gametype' in item && item.gametype) return item.gametype;
    if ('game_type' in item) return item.game_type;
    return item.type;
};

const getCreatedAt = (item: BetHistoryListItem) => {
    return item.created_at ?? null;
};

const getUpdatedAt = (item: BetHistoryListItem) => {
    return item.updated_at ?? null;
};

const toDate = (value: string | number | Date) => {
    if (value instanceof Date) return value;
    if (typeof value === 'string') return new Date(value);
    return new Date(value < 1_000_000_000_000 ? value * 1000 : value);
};

const formatDateValue = (value: string | number | null | undefined, formatter: (value: Date) => string) => {
    if (value == null || value === '') return '-';
    return formatter(toDate(value));
};

/** 直接使用接口字段渲染统一列表行。 */
export const ListItem: FC<ListItemProps> = ({ item, onDetail }) => {
    const t = useTranslations('transaction');
    const tCommon = useTranslations('common');
    const { formatRelativeFullDatetime } = useIntlFormatter();
    const orderId = getOrderId(item);
    const parlayBoostContext = resolveBetHistoryParlayBoostContext(item);
    const hasParlayBoost = parlayBoostContext !== null;
    const modalSections = useMemo(() => resolveBetHistoryParlayBoostModalSections(item), [item]);
    const [rulesModalOpen, setRulesModalOpen] = useState(false);
    const {
        data: parlayBoostActivity,
        isLoading: isParlayBoostDetailLoading,
        isError: isParlayBoostDetailError,
    } = useParlayBoostActivityDetail({
        orderId: parlayBoostContext?.mtsOrderId ?? '',
        activityParlayBoostId: parlayBoostContext?.activityParlayBoostId,
        enabled: hasParlayBoost && rulesModalOpen,
    });
    const parlayBoostDetailState = isParlayBoostDetailError ? 'error' : isParlayBoostDetailLoading ? 'loading' : 'idle';

    return (
        <>
            <div className="flex min-h-[88px] min-w-[1188px] flex-col justify-between rounded-xs bg-filltext-ft-a">
                <div className={`${LIST_GRID_CLASS} min-h-6 px-5 py-4`}>
                    <div className="col-span-4 flex min-w-0 max-w-[612px] items-center gap-2">
                        <ConditionalTooltip content={orderId}>
                            <span className="block min-w-0 max-w-[520px] truncate text-body-sm text-filltext-ft-g">
                                {orderId}
                            </span>
                        </ConditionalTooltip>
                        {hasParlayBoost && (
                            <button
                                type="button"
                                className="inline-flex cursor-pointer"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setRulesModalOpen(true);
                                }}
                            >
                                <ParlayBadge
                                    variant="boost"
                                    size="sm"
                                    label={tCommon('parlayBoostBadge.boost')}
                                    className="shrink-0"
                                />
                            </button>
                        )}
                    </div>
                    <Button
                        variant="text"
                        className={cn(
                            'col-start-5 mr-8 h-6 justify-self-end rounded-sm bg-filltext-ft-b px-3 py-0 text-body-sm text-filltext-ft-e transition-colors',
                            'hover:bg-brand-primary-0 hover:text-on-brand',
                        )}
                        onClick={onDetail}
                    >
                        {t('betHistoryV2.detail')}
                    </Button>
                </div>

                <div className="w-full border-b border-filltext-ft-c" />

                <div className={`${LIST_GRID_CLASS} min-h-9 px-5 py-4`}>
                    <div>
                        <span className="block truncate text-body-sm text-filltext-ft-g">{getGameType(item)}</span>
                    </div>
                    <div>
                        <span className="block truncate text-body-sm text-filltext-ft-g">{getStake(item)}</span>
                    </div>
                    <div>
                        <span className="block truncate text-body-sm text-filltext-ft-g">{getProfit(item)}</span>
                    </div>
                    <div>
                        <span className="block truncate text-body-sm text-filltext-ft-g">
                            {formatDateValue(getCreatedAt(item), formatRelativeFullDatetime)}
                        </span>
                    </div>
                    <div>
                        <span className="block truncate text-body-sm text-filltext-ft-g">
                            {formatDateValue(getUpdatedAt(item), formatRelativeFullDatetime)}
                        </span>
                    </div>
                    <div />
                </div>
            </div>
            <ParlayBoostRulesModal
                visible={hasParlayBoost && rulesModalOpen}
                onClose={() => setRulesModalOpen(false)}
                fetchRule={false}
                rule={parlayBoostActivity?.rule ?? null}
                betContext={parlayBoostActivity?.betContext}
                detailState={parlayBoostDetailState}
                {...modalSections}
            />
        </>
    );
};
