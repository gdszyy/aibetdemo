import { useQueryClient } from '@tanstack/react-query';
import type { MatchEvent } from '@/api/models/match-game';
import type { FixtureChangePayload, LiveScorePayload, MatchStatusPayload, OddsChangePayload } from '@/api/models/ws';
import { FixtureChangeType } from '@/api/models/ws';
import { useEventObserver } from '@/hooks/use-socket-listener';
import { FixtureEvent, LiveScoreEvent, MatchStatusEvent, OddsChangeEvent } from '@/libs/event-constants';
import type { PeriodMappingBySport } from '@/utils/period-mapping';
import { PERIOD_MAPPING_QUERY_KEY } from '@/utils/period-mapping';
import {
    isMatchFinished,
    updateEventWithFixture,
    updateEventWithLiveScore,
    updateEventWithMatchStatus,
    updateEventWithOdds,
} from '../_logic/match-cache-utils';

/**
 * Hook to observe WS updates for a single match and update its React Query cache.
 * Subscribes to: LiveScore, OddsChange, Fixture, MatchStatus.
 */
export function useMatchObserver({
    matchId,
    queryKey,
    sportId,
}: {
    matchId: string;
    queryKey: readonly unknown[];
    sportId?: string;
}) {
    const queryClient = useQueryClient();

    // 1. LiveScore (status + score)
    useEventObserver<LiveScorePayload>(LiveScoreEvent.getUpdateEventName(matchId), (payload) => {
        if (String(payload.event_id) !== String(matchId)) return;

        queryClient.setQueryData<MatchEvent>(queryKey, (prev) => {
            if (!prev) return prev;
            const periodMappings = queryClient.getQueryData<PeriodMappingBySport>(PERIOD_MAPPING_QUERY_KEY);
            return updateEventWithLiveScore(prev, payload, sportId, periodMappings);
        });
    });

    // 2. OddsChange (markets only)
    useEventObserver<OddsChangePayload>(OddsChangeEvent.getUpdateEventName(matchId), (payload) => {
        queryClient.setQueryData<MatchEvent>(queryKey, (prev) => {
            if (!prev) return prev;
            return updateEventWithOdds(prev, payload);
        });
    });

    // 3. Fixture (start time, cancellation)
    useEventObserver<FixtureChangePayload>(FixtureEvent.getUpdateEventName(matchId), (payload) => {
        if (payload.change_type === FixtureChangeType.Cancelled) {
            queryClient.removeQueries({ queryKey });
            return;
        }
        queryClient.setQueryData<MatchEvent>(queryKey, (prev) => {
            if (!prev) return prev;
            return updateEventWithFixture(prev, payload);
        });
    });

    // 4. MatchStatus (state changes, removal on finish)
    useEventObserver<MatchStatusPayload>(MatchStatusEvent.getUpdateEventName(matchId), (payload) => {
        if (isMatchFinished(payload.status_code)) {
            queryClient.removeQueries({ queryKey });
            return;
        }
        queryClient.setQueryData<MatchEvent>(queryKey, (prev) => {
            if (!prev) return prev;
            return updateEventWithMatchStatus(prev, payload);
        });
    });
}
