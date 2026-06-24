'use client';

import dynamic from 'next/dynamic';
import { type FC, useRef } from 'react';
import { SkeletonMatchListContent, SkeletonSportsContent } from '@/components/route-skeletons';
import { useIsDesktop } from '@/hooks/use-media-query';
import {
    MAIN_SCROLL_OFFSET_HEIGHT_DESKTOP,
    MAIN_SCROLL_OFFSET_HEIGHT_MOBILE,
} from '@/modules/home/_constants/constants';
import { useKycTips } from '@/modules/home/_hooks/use-kyc-tips';

/**
 * 足球首页内容（ReferenceSportsHome）体量很大：横幅 / 实时 / 串关 / 球员玩法 / 智能活动卡等多块组件。
 * 静态引入会把它压进 (sports) 布局的首屏 JS 包，客户端导航切入时先白屏再出内容。
 * 改为按需加载 + 骨架屏兜底：拆出独立 chunk 缩小首包，下载/挂载期间显示骨架而非白屏（保留 SSR，冷启动首屏不回退）。
 */
const ReferenceSportsHome = dynamic(
    () => import('@/modules/home/_components/reference-sports-home').then((m) => m.ReferenceSportsHome),
    { loading: () => <SkeletonSportsContent /> },
);

/**
 * 实时（En Vivo / /sports-live）列表 LiveMatches 同样按需加载：它走 MatchListBase（标题 + 筛选 + 实时比赛列表），
 * 用比赛列表骨架兜底，避免客户端切入时白屏，并把它从 (sports) 布局首包里拆出。
 */
const LiveMatches = dynamic(() => import('@/modules/match/home/live-matches').then((m) => m.LiveMatches), {
    loading: () => <SkeletonMatchListContent />,
});

interface SportsPageProps {
    type: 'hot' | 'live';
}

/**
 * Common SportsPage component for both sports-home and sports-live.
 */
export const SportsPage: FC<SportsPageProps> = ({ type }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDesktop = useIsDesktop();

    const mainScrollOffsetHeight = isDesktop ? MAIN_SCROLL_OFFSET_HEIGHT_DESKTOP : MAIN_SCROLL_OFFSET_HEIGHT_MOBILE;
    const extraTopSpace = isDesktop ? 18 : 8;

    const isHot = type === 'hot';
    const isLive = type === 'live';

    useKycTips();

    return (
        <div
            ref={containerRef}
            className="flex min-w-0 flex-1 flex-col gap-y-4 px-2 pb-10 md:gap-y-6 md:px-5"
            style={{ marginTop: -mainScrollOffsetHeight, paddingTop: mainScrollOffsetHeight + extraTopSpace }}
        >
            {isHot && <ReferenceSportsHome />}
            {isLive && <LiveMatches />}
        </div>
    );
};
