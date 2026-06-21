import type { TournamentMarkets } from '@/api/handlers/tournament';
import { mergeMarkets } from './merge-match';

/**
 * Merge tournament data.
 * Used for React Query cache updates to ensure data freshness and completeness.
 *
 * @param current - Currently cached tournament data
 * @param incoming - New data from WebSocket/API
 * @returns Merged tournament data
 *
 * Merge strategy:
 * 1. Basic info: use the data with timestamp >= (incoming preferred)
 * 2. Markets: use incoming as the structural base, preserve fresher specifier data from current
 *    (delegates to mergeMarkets for fine-grained per-specifier timestamp merging)
 */
export function mergeTournamentData(
    current: TournamentMarkets | undefined,
    incoming: TournamentMarkets,
): TournamentMarkets {
    // If no current data, return incoming directly
    if (!current) {
        return incoming;
    }

    // Regardless of which basic info is used, markets need fine-grained merging since specifier updates are typically more frequent than match updates
    // Strategy: use incoming's market list structure (it represents the latest snapshot), but fill in fresher specifier values from current
    const mergedMarkets = mergeMarkets(current.markets, incoming.markets);

    return {
        ...incoming,
        markets: mergedMarkets,
    };
}
