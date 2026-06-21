import type { MarketGroup } from '@/api/models/market';

export function sortDetailMarketsByMarketSort<T extends Pick<MarketGroup, 'id'>>(
    markets: T[],
    marketSort?: readonly number[] | null,
): T[] {
    if (!marketSort?.length || markets.length <= 1) {
        return markets;
    }

    const rankByMarketId = new Map<number, number>();
    marketSort.forEach((marketId, index) => {
        if (!rankByMarketId.has(marketId)) {
            rankByMarketId.set(marketId, index);
        }
    });

    return markets
        .map((market, index) => ({ market, index, rank: rankByMarketId.get(market.id) }))
        .sort((a, b) => {
            const aRank = a.rank;
            const bRank = b.rank;
            const aRanked = aRank !== undefined;
            const bRanked = bRank !== undefined;

            if (aRanked && bRanked && aRank !== bRank) {
                return aRank - bRank;
            }

            if (aRanked !== bRanked) {
                return aRanked ? -1 : 1;
            }

            return a.index - b.index;
        })
        .map(({ market }) => market);
}
