import type { FC } from 'react';
import { SHOW_WORLD_CUP_CHAMPION_CARD } from '../constants';
import { ActivityCard } from './components/ActivityCard';
import { BannerCountDown } from './components/BannerCountDown';
import { CountryCard } from './components/CountryCard';

// 联赛头部banner组件，目前仅世界杯使用
export const LeaguesBanner: FC = () => {
    return (
        <section className="flex flex-col mb-4 gap-2 md:gap-4">
            {/* 世界杯倒计时 */}
            <BannerCountDown className="mb-0" />
            {/* 活动卡片 */}
            <ActivityCard />
            {/* 国家 卡片 */}
            {SHOW_WORLD_CUP_CHAMPION_CARD && <CountryCard />}
        </section>
    );
};
