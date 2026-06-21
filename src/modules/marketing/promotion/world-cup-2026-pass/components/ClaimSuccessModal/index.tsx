'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { WorldCupPassType } from '@/api/models/world-cup-pass';
import { Button } from '@/components/button/button';
import { Close } from '@/components/icons';
import { Modal } from '@/components/modal/modal';
import { useAmount } from '../../../_utils/useAmount';
import type { WorldCupPassRewardWithCoupon } from '../../constants';
import { useRewardTypeLabels } from '../../hooks/useRewardTypeLabels';
import { getWorldCupPassRewardImage } from '../../reward-assets';

/** 领取成功弹窗内展示的奖励项。 */
export interface WorldCupPassClaimedRewardItem {
    /** 领取的通行证类型 */
    type: WorldCupPassType;
    /** 领取的奖励数据 */
    reward: WorldCupPassRewardWithCoupon;
}

interface ClaimSuccessModalProps {
    /** 是否显示弹窗 */
    visible: boolean;
    /** 本次成功领取的奖励列表 */
    rewards: WorldCupPassClaimedRewardItem[];
    /** 关闭弹窗回调 */
    onClose: () => void;
}

/** 世界杯通行证奖励领取成功弹窗。 */
export const ClaimSuccessModal: FC<ClaimSuccessModalProps> = ({ visible, rewards, onClose }) => {
    const t = useTranslations('promotionWorldCupPass');
    const { getRewardTypeLabel } = useRewardTypeLabels();
    const formatAmount = useAmount();

    return (
        <Modal visible={visible} onClose={onClose} withBg={false} closeButton={false} maskClosable>
            <div className="relative w-81.25 max-h-73.5 overflow-hidden rounded-md bg-surface-1 px-6 py-8 max-md:px-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-2 top-2 inline-flex size-6 cursor-pointer items-center justify-center rounded-xs text-filltext-ft-e transition-colors hover:bg-filltext-ft-b hover:text-filltext-ft-g max-md:right-3 max-md:top-3"
                >
                    <Close className="size-3" />
                </button>

                <div className="flex flex-col items-center gap-6 text-center max-md:gap-7">
                    <div className="flex flex-col items-center gap-1">
                        <h3 className="text-title-md text-filltext-ft-h uppercase max-md:text-title-lg">
                            {t('claimSuccess.title')}
                        </h3>
                        <p className="text-auxiliary-xs uppercase max-md:text-body-lg">
                            {t('claimSuccess.description')}
                        </p>
                    </div>

                    <div className="flex max-h-25 min-h-16 w-full flex-col gap-2 overflow-y-auto rounded-sm bg-filltext-ft-a p-2">
                        {rewards.map((item) => {
                            const rewardTypeText = getRewardTypeLabel(item.reward.coupon.type);
                            const rewardImage = getWorldCupPassRewardImage(item.reward.coupon.type);

                            return (
                                <div
                                    key={`${item.type}-${item.reward.level}-${item.reward.coupon.id}`}
                                    className="flex h-12 w-full items-center gap-2 rounded-sm border border-filltext-ft-b bg-surface-1 p-2 text-left max-md:min-h-20 max-md:p-3"
                                >
                                    <Image
                                        src={rewardImage.src}
                                        alt={t('rewardCard.gear')}
                                        width={32}
                                        height={32}
                                        className="size-8 shrink-0 rounded-xs object-cover max-md:size-6"
                                    />
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <div className="truncate text-auxiliary-md text-brand-primary-0 uppercase max-md:text-title-sm">
                                            {t('claimSuccess.levelReward', { level: item.reward.level })}
                                        </div>
                                        <div className="truncate text-auxiliary-md text-filltext-ft-h uppercase max-md:text-title-sm">
                                            {t('claimSuccess.rewardValue', {
                                                amount: formatAmount(Number(item.reward.amount)),
                                                type: rewardTypeText,
                                                count: item.reward.count,
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Button block onClick={onClose} className="hover:bg-brand-primary-4 active:bg-brand-primary-4">
                        {t('claimSuccess.confirm')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
