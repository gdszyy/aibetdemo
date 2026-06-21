import type { MarketGroup } from '@/api/models/market';
import { MatchStatus } from '@/api/models/match';
import type { MatchEvent } from '@/api/models/match-game';
import {
    type FixtureChangePayload,
    FixtureChangeType,
    type LiveScorePayload,
    type MatchStatusPayload,
    type OddsChangePayload,
} from '@/api/models/ws';
import { OddsUpdateProcessor, type OddsUpdateProcessorOptions } from '@/modules/match/_logic/odds-change';
import { applyLiveScore } from '@/modules/match/_utils/match-utils';
import type { PeriodMappingBySport } from '@/utils/period-mapping';

/**
 * Update existing markets from WS payload — no market add/remove.
 * Adds new specifiers to existing markets if specifiers not yet present.
 * Matches by marketKey (variant_id:market_id) + specifiers + product.
 */
const updateExistingMarkets = (
    markets: MarketGroup[],
    payload: OddsChangePayload,
    processorOptions?: OddsUpdateProcessorOptions,
): MarketGroup[] => {
    if (!payload.markets || payload.markets.length === 0) return markets;

    const processor = new OddsUpdateProcessor(payload, processorOptions);
    const { markets: updatedMarkets } = processor.updateMarkets(markets);

    return updatedMarkets;
};

/**
 * Updates a single MatchEvent with LiveScorePayload (status + score).
 */
export const updateEventWithLiveScore = (
    event: MatchEvent,
    payload: LiveScorePayload,
    sportId?: string,
    periodMappings?: PeriodMappingBySport,
): MatchEvent => {
    return applyLiveScore(event, payload, sportId, periodMappings);
};

/**
 * Updates MatchEvent markets from Odds WS.
 * List-row (`useMatchObserver`): no new markets, lines, or outcome ids vs HTTP snapshot.
 */
const listRowOddsWsOptions: OddsUpdateProcessorOptions = {
    allowNewLines: false,
    mergeOutcomes: { allowNewOutcomes: false },
};

export const updateEventWithOdds = (event: MatchEvent, payload: OddsChangePayload): MatchEvent => {
    return {
        ...event,
        markets: updateExistingMarkets(event.markets || [], payload, listRowOddsWsOptions),
        popularMarkets: updateExistingMarkets(event.popularMarkets || [], payload, listRowOddsWsOptions),
    };
};

/**
 * Updates a single MatchEvent with FixtureChangePayload
 */
export const updateEventWithFixture = (event: MatchEvent, payload: FixtureChangePayload): MatchEvent => {
    if (payload.change_type === FixtureChangeType.StartTimeUpdated && payload.start_time !== null) {
        return { ...event, start_time: payload.start_time };
    }
    return event;
};

/**
 * Updates a single MatchEvent with MatchStatusPayload
 */
export const updateEventWithMatchStatus = (event: MatchEvent, payload: MatchStatusPayload): MatchEvent => ({
    ...event,
    status: payload.status_code,
    match_status: payload.match_status_code,
});

/**
 * Checks if a match has finished (Ended or Closed)
 */
export const isMatchFinished = (status: MatchStatus): boolean => status === MatchStatus.Ended;
