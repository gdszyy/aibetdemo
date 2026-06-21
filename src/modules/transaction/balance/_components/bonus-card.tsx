'use client';

import { useCountDown } from 'ahooks';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { BalanceListItemProps } from '@/api/models/transaction';
import { Countdown } from '@/components/icons';
import { QuestionTooltip } from '@/components/question-tooltip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { cn } from '@/utils/common';
import { SegmentedProgress } from './segmented-progress';

// ─── Strategy: gradient by bonus type ───────────────────────────────

const BONUS_TYPE_GRADIENT: Record<string, string> = {
    sportBonus: 'from-[#3c5ad3] to-[#00b3ff]',
    casinoBonus: 'from-[#ff2c2c] to-[#ffbf48]',
    freeSport: 'from-[#309d1a] to-[#becf5f]',
    freeSpin: 'from-[#4d5cfe] to-[#b45bfb]',
};

// ─── Countdown formatter ─────────────────────────────────────────────

function formatCountdownTime(ms: number): string {
    if (!ms || ms <= 0) return '00:00';

    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const pad = (n: number) => String(n).padStart(2, '0');

    if (days > 0) return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    if (hours > 0) return `${hours}h ${pad(minutes)}:${pad(seconds)}`;
    return `${pad(minutes)}:${pad(seconds)}`;
}

// ─── BonusCard ───────────────────────────────────────────────────────

interface BonusCardProps {
    item: BalanceListItemProps;
    bonusType: string;
    onTransfer: (item: BalanceListItemProps) => void;
    transferLoading?: boolean;
}

export const BonusCard: FC<BonusCardProps> = ({ item, bonusType, onTransfer, transferLoading }) => {
    const t = useTranslations('transaction');
    const { formatCompactAmount, formatCurrency } = useIntlFormatter();

    const isFreeReward = bonusType === 'freeSport' || bonusType === 'freeSpin';
    const balanceAmount = Number(item.balance) || 0;
    const maxWithdrawAmount = Number(item.withdraw_max) || 0;
    const currentUsage = Number(item.effective_amount) || 0;
    const usageTarget = Number(item.withdraw_limit) || 0;
    const mainAmount = Number(item.main_effective_amount) || 0;

    const [countdownTime] = useCountDown({ targetDate: item.valid_to * 1000 });
    const isCountdownExpired = countdownTime <= 0;
    const isTransferDisabled = !item.is_withdraw || isCountdownExpired;

    const gradient = BONUS_TYPE_GRADIENT[bonusType] ?? BONUS_TYPE_GRADIENT.sportBonus;

    return (
        <div className="flex flex-col items-center pt-2 transition-transform duration-200 hover:-translate-y-1">
            {/* Banner — gradient header */}
            <div
                className={cn(
                    'flex items-center justify-center w-full px-4 py-2 gap-2 rounded-t-sm bg-gradient-to-r',
                    gradient,
                )}
            >
                <span className="text-[10px] text-filltext-ft-a">✦</span>
                <span className="text-body-lg text-filltext-ft-a truncate">{item.product_name}</span>
                <span className="text-[10px] text-filltext-ft-a">✦</span>
            </div>

            {/* Body */}
            <div className="w-full flex flex-col gap-2 p-2 bg-surface-1 border border-t-0 border-filltext-ft-b rounded-b-sm">
                {/* Timer + Main amount */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                        <Countdown className="size-3.5" />
                        <span className="text-body-sm text-filltext-ft-f">{formatCountdownTime(countdownTime)}</span>
                    </div>
                    {!isFreeReward && (
                        <div className="flex items-center gap-1">
                            <span className="text-auxiliary-md text-func-favorite">
                                Main : {formatCompactAmount(mainAmount)}
                            </span>
                            <QuestionTooltip
                                title={t('balanceItemUsageRulesTitle')}
                                items={[`${t('balanceItemMaximumWin')}: ${formatCurrency(maxWithdrawAmount)}`]}
                            />
                        </div>
                    )}
                </div>

                {/* Reward area */}
                {isFreeReward ? (
                    <div className="flex min-h-[80px] flex-col justify-between rounded-sm bg-filltext-ft-c p-2 overflow-clip">
                        <span className="text-auxiliary-md text-filltext-ft-g">
                            {t('balanceItemAvailableCount', { count: 1 })}
                        </span>
                        <span className="text-title-sm text-func-bonus">{formatCurrency(balanceAmount)}</span>
                        <span className="text-auxiliary-sm text-filltext-ft-f">
                            {t('balanceItemDirectReturn', { amount: formatCurrency(balanceAmount) })}
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start bg-filltext-ft-c rounded-sm h-[80px] p-2 overflow-clip">
                            <span className="text-auxiliary-md text-filltext-ft-g">
                                reward {formatCompactAmount(balanceAmount)}
                            </span>
                        </div>

                        {/* Usage amount + segmented progress */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="text-auxiliary-md text-filltext-ft-g">UsageAmount</span>
                                    <QuestionTooltip
                                        title={t('balanceItemUsageAmountRulesTitle')}
                                        items={[
                                            t('balanceItemUsageRule1'),
                                            t('balanceItemUsageRule2'),
                                            t('balanceItemUsageRule3'),
                                        ]}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <span className="text-auxiliary-md text-func-bonus">
                                        {formatCompactAmount(currentUsage)}
                                    </span>
                                    <span className="text-auxiliary-sm text-filltext-ft-f mx-0.5">/</span>
                                    <span className="text-auxiliary-sm text-filltext-ft-f">
                                        {formatCompactAmount(usageTarget)}
                                    </span>
                                </div>
                            </div>
                            <SegmentedProgress current={currentUsage} total={usageTarget} />
                        </div>
                    </>
                )}

                {/* Transfer button */}
                <div className="py-1">
                    <button
                        type="button"
                        disabled={isTransferDisabled || transferLoading}
                        onClick={() => onTransfer(item)}
                        className={cn(
                            'w-full h-6 rounded-xs text-auxiliary-sm cursor-pointer transition-colors',
                            isTransferDisabled
                                ? 'bg-filltext-ft-b text-filltext-ft-e cursor-not-allowed'
                                : cn('bg-gradient-to-r text-filltext-ft-a', gradient),
                        )}
                    >
                        {t('balanceItemTransaction')}
                    </button>
                </div>
            </div>
        </div>
    );
};
