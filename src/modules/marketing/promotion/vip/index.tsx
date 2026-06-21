'use client';

import { type FC, useEffect, useState } from 'react';
import { useRouter } from '@/i18n';
import { useIsLogin } from '@/stores/session-store';
import { AllBenefits } from './components/AllBenefits';
import { EventEndedModal } from './components/EventEndedModal';
import { FAQ } from './components/FAQ';
import { MyVIPInfo } from './components/MyVIPInfo';
import { RewardsCenter } from './components/RewardsCenter';
import { SVIPBanner } from './components/SVIPBanner';
import { TierBenefits } from './components/TierBenefits';
import { WelcomeBanner } from './components/WelcomeBanner';
import { useVipActivityStatus } from './hooks/useVipActivityStatus';
import { useVipBaseInfoStore } from './services/store';

/**
 * VIP 页面主视图，负责按顺序组织各个区块。
 */
export const MarketingVIP: FC = () => {
    const router = useRouter();
    const [eventEndedDismissed, setEventEndedDismissed] = useState(false);
    const activityId = useVipBaseInfoStore((state) => state.activityId);
    const fetchVipBaseInfo = useVipBaseInfoStore((state) => state.fetchVipBaseInfo);
    const fetchVipLevelInfo = useVipBaseInfoStore((state) => state.fetchVipLevelInfo);
    const fetchVipTierRewards = useVipBaseInfoStore((state) => state.fetchVipTierRewards);
    const fetchUserVipInfo = useVipBaseInfoStore((state) => state.fetchUserVipInfo);
    const isLogin = useIsLogin();
    const { isEnded: isActivityEnded } = useVipActivityStatus(activityId);
    const eventEndedVisible = isActivityEnded && !eventEndedDismissed;

    useEffect(() => {
        fetchVipBaseInfo();
        fetchVipLevelInfo();
        fetchVipTierRewards();
        if (isLogin) {
            fetchUserVipInfo();
        }
    }, [fetchVipBaseInfo, fetchUserVipInfo, isLogin, fetchVipLevelInfo, fetchVipTierRewards]);

    /** 确认活动结束提示后返回体育活动大厅。 */
    const confirmEventEnded = (): void => {
        setEventEndedDismissed(true);
        router.push('/sports/promotions');
    };

    return (
        <>
            <div className="flex w-full flex-col gap-6 md:gap-14 px-2 md:px-4 py-6">
                {/* 欢迎横幅区域 */}
                <WelcomeBanner />

                {/* 我的 VIP 信息区域 */}
                <MyVIPInfo />

                {/* SVIP 横幅区域 */}
                <SVIPBanner />

                {/* 奖励中心区域 */}
                <RewardsCenter />

                {/* 全部权益区域 */}
                <AllBenefits />

                {/* 等级权益区域 */}
                <TierBenefits />

                {/* 常见问题区域 */}
                <FAQ />
            </div>
            <EventEndedModal visible={eventEndedVisible} onConfirm={confirmEventEnded} />
        </>
    );
};
