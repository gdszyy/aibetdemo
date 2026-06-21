import { useQueryClient } from '@tanstack/react-query';
import type { Match } from '@/api/models/match';
import type { MatchStatusPayload } from '@/api/models/ws';
import { useEventObserver } from '@/hooks/use-socket-listener';
import { MatchStatusEvent } from '@/libs/event-constants';

export function useDetailMatchStatusObserver({ matchId }: { matchId: string }): void {
    const queryClient = useQueryClient();
    const event = MatchStatusEvent.getUpdateEventName(String(matchId));
    const callback = (payload: MatchStatusPayload) => {
        queryClient.setQueryData(['match-detail', matchId], (prevData: Match | undefined) => {
            // Return early when cache has no data yet
            if (!prevData) return prevData;

            return {
                ...prevData,
                status: payload.status_code,
                match_status: payload.match_status_code,
            };
        });
    };

    useEventObserver<MatchStatusPayload>(event, callback);
}
