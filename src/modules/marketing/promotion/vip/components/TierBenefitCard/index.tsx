import type { FC } from 'react';
import { VipTierRewardStatusEnum, type VipTierRewards } from '@/api/models/vip';
import { cn } from '@/utils/common';
import { type BenefitStatus, BenfitItem, type TierBenefitTitleKey } from './components/BenfitItem';
import { Header } from './components/Header';

interface TierBenefitCardProps {
    iconIndex: number;
    /** 是否为用户当前 VIP 等级所在段位 */
    isCurrentTier: boolean;
    tier: VipTierRewards;
}

interface TierBenefitItem {
    key: string;
    status: BenefitStatus;
    titleKey: TierBenefitTitleKey;
}

type TierBenefitStatusField = keyof Pick<
    VipTierRewards,
    | 'sportCashback'
    | 'casinoCashback'
    | 'levelUpBonus'
    | 'weeklyBonus'
    | 'birthdayBonus'
    | 'vipSupport'
    | 'withdrawalBenefits'
    | 'premiumGiveaways'
>;

const tierRewardStatusMap: Record<VipTierRewardStatusEnum, BenefitStatus> = {
    [VipTierRewardStatusEnum.Unavailable]: 'unavailable',
    [VipTierRewardStatusEnum.Available]: 'available',
    [VipTierRewardStatusEnum.ComingSoon]: 'comingSoon',
};

/**
 * 将接口返回的权益状态转换为卡片展示状态。
 */
const getTierBenefitStatus = (tier: VipTierRewards, field: TierBenefitStatusField): BenefitStatus => {
    return tierRewardStatusMap[tier[field]];
};

export const TierBenefitCard: FC<TierBenefitCardProps> = ({ iconIndex, isCurrentTier, tier }) => {
    const benefits: TierBenefitItem[] = [
        {
            key: 'sportCashback',
            titleKey: 'tierBenefits.sportCashback',
            status: getTierBenefitStatus(tier, 'sportCashback'),
        },
        {
            key: 'casinoCashback',
            titleKey: 'tierBenefits.casinoCashback',
            status: getTierBenefitStatus(tier, 'casinoCashback'),
        },
        {
            key: 'levelUpBonus',
            titleKey: 'tierBenefits.levelUpBonus',
            status: getTierBenefitStatus(tier, 'levelUpBonus'),
        },
        {
            key: 'weeklyBonus',
            titleKey: 'tierBenefits.weeklyBonus',
            status: getTierBenefitStatus(tier, 'weeklyBonus'),
        },
        {
            key: 'birthdayBonus',
            titleKey: 'tierBenefits.birthdayBonus',
            status: getTierBenefitStatus(tier, 'birthdayBonus'),
        },
        {
            key: 'vipSupport',
            titleKey: 'tierBenefits.vipSupport',
            status: getTierBenefitStatus(tier, 'vipSupport'),
        },
        {
            key: 'withdrawalBenefits',
            titleKey: 'tierBenefits.withdrawalBenefits',
            status: getTierBenefitStatus(tier, 'withdrawalBenefits'),
        },
        {
            key: 'premiumGiveaways',
            titleKey: 'tierBenefits.premiumGiveaways',
            status: getTierBenefitStatus(tier, 'premiumGiveaways'),
        },
    ];

    return (
        <article
            className={cn(
                'flex w-70 shrink-0 flex-col overflow-hidden rounded-md bg-surface-1',
                isCurrentTier && 'bg-[#FFF6F6]',
            )}
        >
            <Header iconIndex={iconIndex} tier={tier} />

            <div className="flex flex-col gap-5 p-6">
                {benefits.map((benefit) => (
                    <BenfitItem key={benefit.key} status={benefit.status} titleKey={benefit.titleKey} />
                ))}
            </div>
        </article>
    );
};
