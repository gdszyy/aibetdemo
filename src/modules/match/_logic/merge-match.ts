import type { MarketGroup, MarketLine } from '@/api/models/market';
import { getMarketGroupId, mergeMarketGroupsByGroupId } from '@/api/models/market';
import type { MatchWithMarkets } from '@/api/models/match';
import { mergeOddsChangeOutcomes } from '@/utils/odds-change-merge';

function getMarketLineKey(line: Pick<MarketLine, 'product' | 'specifiers'>): string {
    return `${line.product}:${line.specifiers}`;
}

/** Merge a single line by outcome-level freshness. */
export function mergeLine(current: MarketLine, incoming: MarketLine): MarketLine {
    return {
        ...incoming,
        outcomes: mergeOddsChangeOutcomes(current.outcomes, incoming.outcomes),
    };
}

/**
 * Merge markets lists.
 * Uses incoming as the base structure; if current has fresher outcomes, uses current outcome data.
 */
export function mergeMarkets(currentMarkets: MarketGroup[] = [], incomingMarkets: MarketGroup[] = []): MarketGroup[] {
    const mergedCurrentMarkets = mergeMarketGroupsByGroupId(currentMarkets);
    const mergedIncomingMarkets = mergeMarketGroupsByGroupId(incomingMarkets);

    // Build current lines index: groupId -> product + specifiers -> MarketLine
    const currentLineMap = new Map<string, Map<string, MarketLine>>();

    for (const market of mergedCurrentMarkets) {
        const lineMap = new Map<string, MarketLine>();
        for (const line of market.lines) {
            lineMap.set(getMarketLineKey(line), line);
        }
        currentLineMap.set(getMarketGroupId(market), lineMap);
    }

    return mergedIncomingMarkets.map((incomingMarket) => {
        const currentLines = currentLineMap.get(getMarketGroupId(incomingMarket));

        // If current has no corresponding market, use incoming directly
        if (!currentLines) {
            return incomingMarket;
        }

        // Merge lines
        const mergedLines = incomingMarket.lines.map((incomingLine) => {
            const currentLine = currentLines.get(getMarketLineKey(incomingLine));
            if (currentLine) {
                return mergeLine(currentLine, incomingLine);
            }
            return incomingLine;
        });

        return {
            ...incomingMarket,
            lines: mergedLines,
        };
    });
}

/**
 * Merge match data.
 * 1. Basic info: use the one with the larger timestamp.
 * 2. Markets: use incoming as the structural base, preserve fresher specifier data from current.
 */
export function mergeMatchData(current: MatchWithMarkets | undefined, incoming: MatchWithMarkets): MatchWithMarkets {
    // If no current data, return incoming directly
    if (!current) {
        return incoming;
    }

    // 1. Merge basic info
    // Use incoming basic info as long as it's not stale (or current has expired)
    // Note: timestamp represents the freshness of basic info
    const useIncomingBasic = incoming.timestamp >= current.timestamp;

    const baseMatch = useIncomingBasic ? incoming : current;

    // 2. Merge markets
    // Regardless of which basic info is used, markets need fine-grained merging since specifier updates are typically more frequent than match updates
    // Strategy: use incoming's market list structure (it represents the latest snapshot), but fill in fresher specifier values from current
    const mergedMarkets = mergeMarkets(current.markets, incoming.markets);

    return {
        ...baseMatch,
        // HTTP 快照里的计时需要重新叠加 match_clock_offset，不能被 WS 缓存挡住。
        match_clock: incoming.match_clock,
        curr_time: incoming.curr_time,
        match_clock_offset: incoming.match_clock_offset,
        markets: mergedMarkets,
    };
}
