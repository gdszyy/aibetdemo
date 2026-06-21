'use client';

import { type FC, useRef } from 'react';
import { useIsDesktop, useIsMobile } from '@/hooks/use-media-query';
import { AdPlacementAnnouncementBar } from '@/modules/ad-placement';
import {
    MAIN_SCROLL_OFFSET_HEIGHT_DESKTOP,
    MAIN_SCROLL_OFFSET_HEIGHT_MOBILE,
} from '@/modules/home/_constants/constants';
import { useKycTips } from '@/modules/home/_hooks/use-kyc-tips';
import { HotMatches } from '@/modules/match/home/hot-matches';
import { LiveMatches } from '@/modules/match/home/live-matches';
import { HotCasinoGames } from './_components/hot-casino-games';
import { HotLeagues } from './_components/hot-leageus';
import { HotMatches as HotMatches2 } from './_components/hot-matches';
import { MatchFilter } from './_components/match-filters';
import { RecommendLiveMatches } from './_components/recommend-live-matches';
import { SportsActivity } from './_components/sports-activity';
import { ParlayBoost } from './_components/super-odds';
import { WinningsTicker } from './_components/winnings-ticker';

interface SportsPageProps {
    type: 'hot' | 'live';
}

/**
 * Common SportsPage component for both sports-home and sports-live
 */
export const SportsPage: FC<SportsPageProps> = ({ type }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDesktop = useIsDesktop();
    const isMobile = useIsMobile();

    const MAIN_SCROLL_OFFSET_HEIGHT = isDesktop ? MAIN_SCROLL_OFFSET_HEIGHT_DESKTOP : MAIN_SCROLL_OFFSET_HEIGHT_MOBILE;
    const extraTopSpace = isDesktop ? 24 : 8;

    const isHot = type === 'hot';
    const isLive = type === 'live';

    // Fetch KYC tips once when user is logged in
    useKycTips();

    return (
        <div
            ref={containerRef}
            className={'flex min-w-0 flex-1 flex-col px-2 md:px-4 gap-y-4 md:gap-y-10 pb-10'}
            style={{ marginTop: -MAIN_SCROLL_OFFSET_HEIGHT, paddingTop: MAIN_SCROLL_OFFSET_HEIGHT + extraTopSpace }}
        >
            {/* 
            顺序
            banner-顶部导航栏-滚球-最佳比赛-游戏导航-热门联赛-热门比赛
            */}

            <AdPlacementAnnouncementBar className="-mb-8 md:-md-6" />

            {isHot && (
                <>
                    <SportsActivity />
                    {isMobile && <MatchFilter />}
                    <WinningsTicker />
                    <ParlayBoost />
                    <RecommendLiveMatches />
                    <HotMatches2 />
                    <HotCasinoGames />
                    <HotLeagues />
                    <HotMatches />
                </>
            )}

            {isLive && <LiveMatches />}
        </div>
    );
};
