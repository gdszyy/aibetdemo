import { useCallback, useMemo } from 'react';
import { type WorldCupPassClaimRequest, type WorldCupPassInfo, WorldCupPassType } from '@/api/models/world-cup-pass';
import type { WorldCupPassClaimedRewardItem } from '../components/ClaimSuccessModal';
import {
    buildRewardTrack,
    isRewardUnlocked,
    isWorldCupPassRewardAvailable,
    isWorldCupPassRewardClaimed,
    type RewardTrackItem,
} from '../constants';

interface UsePassRewardsParams {
    /** 首页接口返回数据 */
    data: WorldCupPassInfo | null | undefined;
    /** 是否已解锁高级通行证 */
    isHighLevel: boolean;
}

interface UsePassRewardsReturn {
    /** 普通/高级奖励轨道数据 */
    rewardTracks: RewardTrackItem[];
    /** 是否存在任意可领取奖励 */
    canClaimAll: boolean;
    /** 根据领取请求生成成功弹窗奖励明细 */
    getClaimedRewardItems: (params: WorldCupPassClaimRequest) => WorldCupPassClaimedRewardItem[];
}

/** 构建世界杯通行证奖励轨道，并判断奖励领取状态。 */
export const usePassRewards = ({ data, isHighLevel }: UsePassRewardsParams): UsePassRewardsReturn => {
    const rewardTracks = useMemo(
        () => buildRewardTrack(data?.normalRewards ?? [], data?.premiumRewards ?? []),
        [data?.normalRewards, data?.premiumRewards],
    );

    const canClaimAll = useMemo(() => {
        const currentLevel = data?.level ?? 0;

        return rewardTracks.some((rewardTrack) => {
            const canClaimNormal =
                isWorldCupPassRewardAvailable(rewardTrack.normalReward) &&
                isRewardUnlocked(rewardTrack.normalReward, currentLevel) &&
                !isWorldCupPassRewardClaimed(rewardTrack.normalReward);

            const canClaimPremium =
                isHighLevel &&
                isWorldCupPassRewardAvailable(rewardTrack.premiumReward) &&
                isRewardUnlocked(rewardTrack.premiumReward, currentLevel) &&
                !isWorldCupPassRewardClaimed(rewardTrack.premiumReward);

            return canClaimNormal || canClaimPremium;
        });
    }, [data?.level, isHighLevel, rewardTracks]);

    const getClaimedRewardItems = useCallback(
        (params: WorldCupPassClaimRequest): WorldCupPassClaimedRewardItem[] => {
            const currentLevel = data?.level ?? 0;

            if (typeof params.level === 'number' && typeof params.type === 'number') {
                const targetTrack = rewardTracks.find((rewardTrack) => rewardTrack.level === params.level);
                const reward =
                    params.type === WorldCupPassType.Normal ? targetTrack?.normalReward : targetTrack?.premiumReward;

                return isWorldCupPassRewardAvailable(reward) ? [{ type: params.type, reward }] : [];
            }

            return rewardTracks.flatMap((rewardTrack) => {
                const items: WorldCupPassClaimedRewardItem[] = [];

                if (
                    isWorldCupPassRewardAvailable(rewardTrack.normalReward) &&
                    isRewardUnlocked(rewardTrack.normalReward, currentLevel) &&
                    !isWorldCupPassRewardClaimed(rewardTrack.normalReward)
                ) {
                    items.push({ type: WorldCupPassType.Normal, reward: rewardTrack.normalReward });
                }

                if (
                    isHighLevel &&
                    isWorldCupPassRewardAvailable(rewardTrack.premiumReward) &&
                    isRewardUnlocked(rewardTrack.premiumReward, currentLevel) &&
                    !isWorldCupPassRewardClaimed(rewardTrack.premiumReward)
                ) {
                    items.push({ type: WorldCupPassType.Premium, reward: rewardTrack.premiumReward });
                }

                return items;
            });
        },
        [data?.level, isHighLevel, rewardTracks],
    );

    return {
        rewardTracks,
        canClaimAll,
        getClaimedRewardItems,
    };
};
