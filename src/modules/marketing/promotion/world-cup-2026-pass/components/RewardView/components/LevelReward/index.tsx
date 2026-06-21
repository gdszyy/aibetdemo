import type { FC } from 'react';
import { WorldCupPassType } from '@/api/models/world-cup-pass';
import { cn } from '@/utils/common';
import type { RewardTrackItem } from '../../../../constants';
import { isRewardUnlocked, isWorldCupPassRewardAvailable, isWorldCupPassRewardClaimed } from '../../../../constants';
import { PolygonIcon } from '../../../Polygon';
import { RewardCard } from '../RewardCard';

interface LevelRewardProps {
    rewardTrack: RewardTrackItem;
    curLevel: number;
    isHighLevel: boolean;
    isMaxLevel: boolean;
    isNormalReward?: boolean;
    isHighLevelReward?: boolean;
    onClaimReward: (level: number, type: WorldCupPassType) => void;
    /** 未登录时阻止交互并弹出登录框 */
    onRequireLogin: () => boolean;
    isClaiming: boolean;
}

export const LevelReward: FC<LevelRewardProps> = ({
    rewardTrack,
    curLevel,
    isHighLevel,
    isMaxLevel,
    isNormalReward,
    isHighLevelReward,
    onClaimReward,
    onRequireLogin,
    isClaiming,
}) => {
    const normalReward = isWorldCupPassRewardAvailable(rewardTrack.normalReward) ? rewardTrack.normalReward : undefined;
    const premiumReward = isWorldCupPassRewardAvailable(rewardTrack.premiumReward)
        ? rewardTrack.premiumReward
        : undefined;
    const isNormalUnlocked = isRewardUnlocked(rewardTrack.normalReward, curLevel);
    const isPremiumUnlocked = isRewardUnlocked(rewardTrack.premiumReward, curLevel);
    const isNormalClaimed = isWorldCupPassRewardClaimed(rewardTrack.normalReward);
    const isPremiumClaimed = isWorldCupPassRewardClaimed(rewardTrack.premiumReward);

    const handleClaimReward = (type: WorldCupPassType): void => {
        if (!onRequireLogin()) return;
        if (isClaiming) return;

        if (type === WorldCupPassType.Normal) {
            if (!normalReward || !isNormalUnlocked || isNormalClaimed) return;
        } else {
            if (!premiumReward || !isHighLevel || !isPremiumUnlocked || isPremiumClaimed) return;
        }

        onClaimReward(rewardTrack.level, type);
    };

    return (
        <div className="flex flex-col px-3 gap-4 items-center">
            <div className="w-31 h-38.5" onClick={() => handleClaimReward(WorldCupPassType.Normal)}>
                {isNormalReward && normalReward && (
                    <RewardCard isUnlocked={isNormalUnlocked} isClaimed={isNormalClaimed} reward={normalReward} />
                )}
            </div>
            <div className="relative h-8 w-31 flex justify-center items-center">
                <div className="z-10">
                    <PolygonIcon isHighLevel={isHighLevel} isUnlocked={isNormalUnlocked}>
                        {rewardTrack.level}
                    </PolygonIcon>
                </div>
                <div
                    className={cn(
                        'absolute w-37 h-1 top-3.5',
                        isNormalUnlocked ? (isHighLevel ? 'bg-[#009655]' : 'bg-brand-primary-4') : 'bg-[#A6A6A6]',
                        isMaxLevel && 'w-18.5 -left-3',
                    )}
                />
            </div>
            <div className="w-31 h-38.5" onClick={() => handleClaimReward(WorldCupPassType.Premium)}>
                {isHighLevelReward && premiumReward && (
                    <RewardCard
                        isHighLevelReward
                        isUnlocked={isPremiumUnlocked && isHighLevel}
                        isClaimed={isPremiumClaimed}
                        reward={premiumReward}
                    />
                )}
            </div>
        </div>
    );
};
