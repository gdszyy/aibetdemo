import type { FunctionComponent } from 'react';
import { HotLeagueMatchCarousel } from '@/modules/match/home/hot-league-match-carousel';

/** 
滚球比赛推荐模块
// TODO 
// 筛选热门联赛的滚球比赛，然后按照开赛时间排序，越早开始排越前面
 */
export const RecommendLiveMatches: FunctionComponent = () => {
    return <HotLeagueMatchCarousel variant="live" />;
};
