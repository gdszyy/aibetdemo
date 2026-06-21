'use client';

import { useTranslations } from 'next-intl';
import { type FC, useMemo, useState } from 'react';
import type { RewardItem } from '@/api/models/vip';
import { VipUserRewardStatusEnum } from '@/api/models/vip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { cn } from '@/utils/common';
import { formatVipCurrencyAmount } from '../../services/formatVipAmount';
import { useVipStaticConfGetter } from '../../services/useVipStaticConfGetter';

interface RewardCardProps {
    /** 用户当前 VIP 等级，用于判断奖励是否已解锁 */
    currentLevelNo: number;
    /** 当前卡片是否正在提交领取请求 */
    isClaiming?: boolean;
    /** VIP 奖励项数据 */
    item: RewardItem;
    /** 点击领取时触发的回调 */
    onClaim?: (item: RewardItem) => void;
}

type RewardVisualState = 'locked' | 'claimed' | 'claimable' | 'countdown';
type RewardButtonState = RewardVisualState | 'oneClickClaim';

/** 将秒级倒计时格式化为 VIP 奖励卡片展示文本 */
const formatCountdown = (countDown: number): string => {
    const totalMinutes = Math.max(Math.ceil(countDown / 60), 0);

    if (totalMinutes >= 24 * 60) {
        const days = Math.floor(totalMinutes / (24 * 60));
        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);

        return `${days}d ${hours}h`;
    }

    if (totalMinutes >= 60) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours}h ${minutes}m`;
    }

    return `${totalMinutes}m`;
};

/** 根据奖励状态、解锁等级和领取倒计时计算卡片视觉状态 */
const getRewardState = (item: RewardItem, currentLevelNo: number): RewardVisualState => {
    const rewardAmount = Number(item.amount || 0);
    const hasRewardAmount = rewardAmount > 0;
    const isLevelLocked = item.unlockLevel > currentLevelNo;
    const isPendingClaim =
        (item.status === VipUserRewardStatusEnum.PendingClaim ||
            item.status === VipUserRewardStatusEnum.OneClickClaim) &&
        hasRewardAmount;
    const isClaimAvailable = isPendingClaim && item.claimAvailableCountDown === 0 && item.countDown > 0;

    if (item.status === VipUserRewardStatusEnum.Claimed) {
        return 'claimed';
    }

    if (isLevelLocked || !hasRewardAmount) {
        return 'locked';
    }

    if (isClaimAvailable) {
        return 'claimable';
    }

    if (isPendingClaim && item.claimAvailableCountDown !== 0) {
        return 'countdown';
    }

    return 'locked';
};

export const RewardCard: FC<RewardCardProps> = ({ currentLevelNo, isClaiming = false, item, onClaim }) => {
    const t = useTranslations('vip');
    const { formatCurrency } = useIntlFormatter();
    const { benefitIconMap, benefitTitleMap } = useVipStaticConfGetter();
    const [isHovered, setIsHovered] = useState(false);

    const state = useMemo(() => getRewardState(item, currentLevelNo), [currentLevelNo, item]);
    const Icon = benefitIconMap[item.type];
    const amount = useMemo(
        () => formatVipCurrencyAmount(item.amount || 0, formatCurrency),
        [formatCurrency, item.amount],
    );
    const countdownText = useMemo(
        () => formatCountdown(state === 'countdown' ? item.claimAvailableCountDown : item.countDown),
        [item.claimAvailableCountDown, item.countDown, state],
    );
    const rewardAmount = useMemo(() => Number(item.amount || 0), [item.amount]);
    const buttonState = useMemo<RewardButtonState>(
        () =>
            item.status === VipUserRewardStatusEnum.OneClickClaim && state === 'claimable' ? 'oneClickClaim' : state,
        [item.status, state],
    );
    const showLockedLevelText = useMemo(
        () => item.unlockLevel > currentLevelNo && rewardAmount > 0,
        [currentLevelNo, item.unlockLevel, rewardAmount],
    );

    const statusTextMap: Record<RewardButtonState, string> = useMemo(
        () => ({
            locked: t('rewardsCenter.status.locked'),
            claimed: t('rewardsCenter.status.claimed'),
            claimable: t('rewardsCenter.status.claim'),
            countdown: t('rewardsCenter.status.claim'),
            oneClickClaim: t('rewardsCenter.status.oneClickClaim', { count: item.notReceived }),
        }),
        [t, item.notReceived],
    );

    const helperTextMap: Partial<Record<RewardVisualState, string>> = useMemo(
        () => ({
            claimable: t('rewardsCenter.helper.expires'),
            countdown: t('rewardsCenter.helper.available'),
        }),
        [t],
    );

    const claimDisabled = useMemo(() => state !== 'claimable' || isClaiming, [state, isClaiming]);
    const buttonText = useMemo(() => {
        if (buttonState !== 'oneClickClaim') {
            return statusTextMap[buttonState];
        }

        return statusTextMap.oneClickClaim;
    }, [buttonState, statusTextMap]);

    return (
        <article
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex flex-col rounded-md border border-filltext-ft-c bg-surface-1 p-4 hover:border-func-win "
        >
            <div className="flex flex-col items-start gap-3 max-md:flex-row max-md:items-center">
                <div
                    className={cn(
                        'flex w-fit px-3 py-2.5 shrink-0 items-center justify-center rounded-sm bg-filltext-ft-a',
                        isHovered && 'bg-[#E8F9EE]',
                    )}
                >
                    <Icon className="size-6 text-func-win" />
                </div>

                <div className="min-w-0">
                    <p
                        className={cn(
                            'text-body-md font-poppins text-filltext-ft-f',
                            isHovered && 'text-func-win',
                            claimDisabled && !isHovered && 'text-filltext-ft-f',
                        )}
                    >
                        {benefitTitleMap[item.type]}
                    </p>
                    <p className="mt-1 text-headline-md font-semibold text-filltext-ft-h">{amount}</p>

                    <p className="text-auxiliary-xxs text-filltext-ft-f mt-1">{item.unlockRemark}</p>
                </div>
            </div>

            <div className="mt-auto  ">
                {state === 'locked' && showLockedLevelText ? (
                    <div className="my-3 text-auxiliary-2xs text-filltext-ft-d">
                        <span>{t('rewardsCenter.helper.locked')}</span>
                    </div>
                ) : (
                    <div className="my-1 h-4 " />
                )}

                <button
                    type="button"
                    disabled={claimDisabled}
                    onClick={() => onClaim?.(item)}
                    className={cn(
                        ' cursor-pointer flex px-4 py-2 w-full items-center justify-center rounded-full text-auxiliary-md font-semibold transition-colors',
                        state === 'claimable' && 'bg-linear-to-l from-green-950 to-func-win text-neutral-white-h',
                        state === 'claimed' && 'bg-func-void text-neutral-white-h',
                        (state === 'locked' || state === 'countdown' || isClaiming) &&
                            'bg-filltext-ft-a text-filltext-ft-h',
                        claimDisabled && 'cursor-not-allowed',
                    )}
                >
                    {buttonText}
                </button>

                {helperTextMap[state] ? (
                    <div className="mt-3 flex items-center justify-center gap-2 text-auxiliary-2xs text-filltext-ft-d">
                        {(state === 'claimable' || state === 'countdown') && (
                            <span className="size-1.5 rounded-full bg-func-win" aria-hidden="true" />
                        )}
                        <span>
                            {helperTextMap[state] || null}
                            {(state === 'claimable' || state === 'countdown') && ` ${countdownText}`}
                        </span>
                    </div>
                ) : null}
            </div>
        </article>
    );
};
