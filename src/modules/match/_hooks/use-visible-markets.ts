import { useSize } from 'ahooks';
import { type RefObject, useMemo } from 'react';
import { MATCH_LIST_LAYOUT, MATCH_LIST_LAYOUT_MOBILE } from '@/modules/match/_constants/constants';

/** Minimum container width to show 1 market on mobile (left + market + right + gaps) */
const MOBILE_1_MARKET_MIN =
    MATCH_LIST_LAYOUT_MOBILE.HORIZONTAL_PADDING * 2 +
    MATCH_LIST_LAYOUT_MOBILE.MARKET_COLUMN_WIDTH +
    MATCH_LIST_LAYOUT_MOBILE.RIGHT_COLUMN_WIDTH +
    MATCH_LIST_LAYOUT_MOBILE.GAP * 2;

const MAX_VISIBLE_MARKETS = 3;
const DESKTOP_FIT_BUFFER = 2;

function getDesktopRequiredWidth(marketColumnWidths: number[], visibleMarkets: number): number {
    if (visibleMarkets <= 0) return 0;

    return (
        MATCH_LIST_LAYOUT.HORIZONTAL_PADDING * 2 +
        MATCH_LIST_LAYOUT.LEFT_COLUMN_WIDTH +
        marketColumnWidths.slice(0, visibleMarkets).reduce((total, width) => total + width, 0) +
        MATCH_LIST_LAYOUT.GAP * 2 +
        MATCH_LIST_LAYOUT.GAP * Math.max(visibleMarkets - 1, 0) +
        MATCH_LIST_LAYOUT.MARKET_DIVIDER_WIDTH * Math.max(visibleMarkets - 1, 0) +
        DESKTOP_FIT_BUFFER
    );
}

export function getVisibleMarketsLayout(containerWidth?: number, marketColumnWidths: number[] = []) {
    const normalizedColumnWidths = marketColumnWidths.filter((width) => width > 0).slice(0, MAX_VISIBLE_MARKETS);
    const maxConfiguredMarkets = normalizedColumnWidths.length;

    if (maxConfiguredMarkets === 0) {
        return { maxVisibleMarkets: 0, isMobileLayout: false };
    }

    if (!containerWidth) {
        return {
            maxVisibleMarkets: Math.min(1, maxConfiguredMarkets),
            isMobileLayout: false,
        };
    }

    for (let visibleMarkets = maxConfiguredMarkets; visibleMarkets >= 1; visibleMarkets -= 1) {
        if (containerWidth >= getDesktopRequiredWidth(normalizedColumnWidths, visibleMarkets)) {
            return { maxVisibleMarkets: visibleMarkets, isMobileLayout: false };
        }
    }

    return {
        maxVisibleMarkets: containerWidth >= MOBILE_1_MARKET_MIN ? 1 : 0,
        isMobileLayout: true,
    };
}

/**
 * Returns the number of visible market columns (0-3) and whether mobile layout is active.
 * Used by both HotMatches and MatchListContent for responsive layout.
 */
export function useVisibleMarkets(containerRef: RefObject<HTMLDivElement | null>, marketColumnWidths: number[] = []) {
    const size = useSize(containerRef);

    return useMemo(() => {
        return getVisibleMarketsLayout(size?.width, marketColumnWidths);
    }, [marketColumnWidths, size?.width]);
}
