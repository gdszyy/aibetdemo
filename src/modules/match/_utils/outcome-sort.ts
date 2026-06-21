import { compareOutcomesByDisplayOrder, type OutcomeModel } from '@/api/models/market';
import { LSPORT_REVERSE_SORT_MARKET_ID_LIST } from '../_constants/lsport-market-sort';

const LSPORT_REVERSE_SORT_MARKET_ID_SET: ReadonlySet<number> = new Set(LSPORT_REVERSE_SORT_MARKET_ID_LIST);

export const isLsportReverseSortMarketId = (marketId: number): boolean =>
    LSPORT_REVERSE_SORT_MARKET_ID_SET.has(marketId);

export function compareDetailOutcomesByDisplayOrder(marketId: number, a: OutcomeModel, b: OutcomeModel): number {
    if (
        isLsportReverseSortMarketId(marketId) &&
        a.sorted !== undefined &&
        b.sorted !== undefined &&
        a.sorted !== b.sorted
    ) {
        return b.sorted - a.sorted;
    }

    return compareOutcomesByDisplayOrder(a, b);
}

export const sortDetailMarketOutcomes = (marketId: number, outcomes: OutcomeModel[]): OutcomeModel[] =>
    [...outcomes].sort((a, b) => compareDetailOutcomesByDisplayOrder(marketId, a, b));
