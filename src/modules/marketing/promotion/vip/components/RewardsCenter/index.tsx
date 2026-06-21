import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { VipRewardClaimInterface } from '@/api/handlers/vip';
import type { RewardItem } from '@/api/models/vip';
import { Toast } from '@/components/toast/toast';
import { useIsLogin } from '@/stores/session-store';
import { useVipBaseInfoStore } from '../../services/store';
import { Title } from '../Title';
import { RewardCard } from './reward-card';

export const RewardsCenter = () => {
    const isLogin = useIsLogin();
    const t = useTranslations('vip');
    const tCommon = useTranslations('common');
    const activityId = useVipBaseInfoStore((state) => state.activityId);
    const fetchUserVipInfo = useVipBaseInfoStore((state) => state.fetchUserVipInfo);
    const userVipInfo = useVipBaseInfoStore((state) => state.userVipInfo);
    const claimReward = useMutation({
        mutationFn: async (reward: RewardItem) =>
            VipRewardClaimInterface({
                activityId,
                rewradType: reward.type,
            }),
        onSuccess: async () => {
            fetchUserVipInfo();
            Toast.success(tCommon('message.success'), { id: 'vip-reward-claim' });
        },
        onError: (error: Error) => {
            Toast.error(error.message || tCommon('message.error'), { id: 'vip-reward-claim' });
        },
    });

    if (!isLogin) return null;

    return (
        <section className="w-full ">
            <div className="mx-auto flex w-full max-w-(--main-content-max-width) flex-col items-center">
                <Title title={t('rewardsCenter.title')} />

                <div className="mt-10 grid w-full grid-cols-4 gap-6 max-md:grid-cols-1 max-md:gap-4">
                    {userVipInfo?.rewards?.map((reward) => (
                        <RewardCard
                            key={`${reward.type}-${reward.unlockLevel}-${reward.status}`}
                            currentLevelNo={userVipInfo.currentLevelNo}
                            isClaiming={claimReward.isPending && claimReward.variables?.type === reward.type}
                            item={reward}
                            onClaim={(item) => {
                                claimReward.mutate(item);
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
