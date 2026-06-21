import type { FunctionComponent } from 'react';
import { HotLeagueMatchCarousel } from '@/modules/match/home/hot-league-match-carousel';

/** 
热门比赛模块
// TODO 
// 当前可暂按每个热门联赛取即将开始的一场比赛（开赛时间排序）；后续预留人工配置热门战队/热门比赛。
 */
export const HotMatches: FunctionComponent = () => {
    return <HotLeagueMatchCarousel variant="upcoming" />;
};
