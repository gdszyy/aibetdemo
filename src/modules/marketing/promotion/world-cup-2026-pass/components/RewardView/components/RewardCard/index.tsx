import type { FC } from 'react';
import type { WorldCupPassRewardWithCoupon } from '../../../../constants';
import { NormalClaimableRewardCard } from '../NormalClaimableRewardCard';
import { NormalClaimedRewardCard } from '../NormalClaimedRewardCard';
import { NormalLockedRewardCard } from '../NormalLockedRewardCard';
import { PremiumClaimableRewardCard } from '../PremiumClaimableRewardCard';
import { PremiumClaimedRewardCard } from '../PremiumClaimedRewardCard';
import { PremiumLockedRewardCard } from '../PremiumLockedRewardCard';

interface RewardCardProps {
    /** 是否为高级通行证奖励 */
    isHighLevelReward?: boolean;
    /** 是否解锁 */
    isUnlocked: boolean;
    /** 是否领取 */
    isClaimed: boolean;
    /** 有实际优惠券定义的奖励 */
    reward: WorldCupPassRewardWithCoupon;
}

/** 奖励卡片组件 */
export const RewardCard: FC<RewardCardProps> = ({ isHighLevelReward = false, isUnlocked, isClaimed, reward }) => {
    // 高级通行证和免费通行证分别走各自的三态组件分发。
    if (isHighLevelReward) {
        if (!isUnlocked) {
            return <PremiumLockedRewardCard reward={reward} />;
        }

        if (isClaimed) {
            return <PremiumClaimedRewardCard reward={reward} />;
        }

        return <PremiumClaimableRewardCard reward={reward} />;
    }

    if (!isUnlocked) {
        return <NormalLockedRewardCard reward={reward} />;
    }

    if (isClaimed) {
        return <NormalClaimedRewardCard reward={reward} />;
    }

    return <NormalClaimableRewardCard reward={reward} />;
};
