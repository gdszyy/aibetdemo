'use client';

import { type FC, useRef } from 'react';
import { useIsDesktop } from '@/hooks/use-media-query';
import { ReferenceSportsHome } from '@/modules/home/_components/reference-sports-home';
import {
    MAIN_SCROLL_OFFSET_HEIGHT_DESKTOP,
    MAIN_SCROLL_OFFSET_HEIGHT_MOBILE,
} from '@/modules/home/_constants/constants';
import { useKycTips } from '@/modules/home/_hooks/use-kyc-tips';
import { LiveMatches } from '@/modules/match/home/live-matches';

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
