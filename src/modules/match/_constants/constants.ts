import { match } from 'ts-pattern';

export const MATCH_LIST_LAYOUT = {
    /** Figma match-info column width */
    LEFT_COLUMN_WIDTH: 402,
    /** Horizontal padding on each card row */
    HORIZONTAL_PADDING: 12,
    /** Competitor content actual visible width */
    COMPETITOR_CONTENT_WIDTH: 402,
    /** Minimum width for one market offer section */
    MARKET_COLUMN_WIDTH: 520,
    /** Figma superbet offer section width for two-outcome markets */
    TWO_OUTCOME_MARKET_WIDTH: 378,
    /** Fixed pin and more-markets count width */
    RIGHT_COLUMN_WIDTH: 37,
    /** Divider between market columns */
    MARKET_DIVIDER_WIDTH: 1,
    /** Gap between match info, divider, and market area */
    GAP: 16,
    /** Width where two market sections match the superbet state */
    SUPERBET_MARKET_WIDTH: 772,
};

/** 滚球盘口超过 5 分钟没有投注项更新时从详情页隐藏。 */
export const LIVE_MARKET_STALE_MS = 5 * 60 * 1000;

/** 详情页滚球盘口过期检查频率。 */
export const LIVE_MARKET_STALE_TICK_MS = 30 * 1000;

/** 准确比分盘口：锁盘投注项不展示 */
export const CORRECT_SCORE_MARKETS_HIDE_LOCKED = new Set([
    6, 9, 100, 217, 394, 395, 428, 602, 2744, 2745, 2746, 3200, 3309, 3310, 3432,
]);

/** Mobile layout — narrower columns to fit 1 market on small screens */
export const MATCH_LIST_LAYOUT_MOBILE = {
    LEFT_COLUMN_WIDTH: 402,
    HORIZONTAL_PADDING: 12,
    COMPETITOR_CONTENT_WIDTH: 378,
    MARKET_COLUMN_WIDTH: 320,
    RIGHT_COLUMN_WIDTH: 37,
    MARKET_DIVIDER_WIDTH: 1,
    GAP: 8,
};

interface GetMarketColumnWidthOptions {
    isMobileLayout?: boolean;
    outcomeCount?: number;
}

export function getMarketColumnWidth({
    isMobileLayout = false,
    outcomeCount = 3,
}: GetMarketColumnWidthOptions): number {
    if (isMobileLayout) return MATCH_LIST_LAYOUT_MOBILE.MARKET_COLUMN_WIDTH;
    return match(outcomeCount)
        .with(2, () => MATCH_LIST_LAYOUT.TWO_OUTCOME_MARKET_WIDTH)
        .with(3, () => MATCH_LIST_LAYOUT.MARKET_COLUMN_WIDTH)
        .otherwise(() => MATCH_LIST_LAYOUT.MARKET_COLUMN_WIDTH);
}
