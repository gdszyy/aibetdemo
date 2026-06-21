import { type InfiniteData, type QueryKey, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { MatchListPageResponse, TournamentGroup } from '@/api/models/match-game';
import {
    type FixtureChangePayload,
    FixtureChangeType,
    type LiveScorePayload,
    type MatchStatusPayload,
    type OddsChangePayload,
} from '@/api/models/ws';
import { globalEventObserver } from '@/hooks/use-socket-listener';
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
import { shouldShowMatchInList } from '../_utils/match-utils';

type MatchListUpdater = (groups: TournamentGroup[]) => TournamentGroup[];
type MatchListCacheData = TournamentGroup[] | InfiniteData<MatchListPageResponse>;
type GroupEvent = TournamentGroup['events'][number];

const isInfiniteMatchListData = (data: MatchListCacheData | undefined): data is InfiniteData<MatchListPageResponse> => {
    return !!data && !Array.isArray(data) && Array.isArray(data.pages);
};

const updateCacheData = (
    data: MatchListCacheData | undefined,
    updater: MatchListUpdater,
): MatchListCacheData | undefined => {
    if (!data) return data;
    if (!isInfiniteMatchListData(data)) return updater(data);

    return {
        ...data,
        pages: data.pages.map((page) => ({
            ...page,
            list: updater(page.list),
        })),
    };
};

const updateEventInGroups = (
    eventId: string,
    updateEvent: (event: GroupEvent, group: TournamentGroup) => GroupEvent,
): MatchListUpdater => {
    return (groups) => {
        let changed = false;

        const nextGroups = groups
            .map((group) => {
                const eventIndex = group.events.findIndex((event) => String(event.event_id) === String(eventId));
                if (eventIndex < 0) return group;

                const event = group.events[eventIndex];
                if (!event) return group;

                const nextEvent = updateEvent(event, group);

                changed = true;
                if (!shouldShowMatchInList(nextEvent)) {
                    return { ...group, events: group.events.filter((_, index) => index !== eventIndex) };
                }

                if (nextEvent === event) return group;

                const nextEvents = group.events.map((currentEvent, index) =>
                    index === eventIndex ? nextEvent : currentEvent,
                );
                return { ...group, events: nextEvents };
            })
            .filter((group) => group.events.length > 0);

        return changed ? nextGroups : groups;
    };
};

const removeEventFromGroups = (eventId: string): MatchListUpdater => {
    return (groups) => {
        let changed = false;
        const nextGroups = groups
            .map((group) => {
                const nextEvents = group.events.filter((event) => String(event.event_id) !== String(eventId));
                if (nextEvents.length === group.events.length) return group;

                changed = true;
                return { ...group, events: nextEvents };
            })
            .filter((group) => group.events.length > 0);

        return changed ? nextGroups : groups;
    };
};

export function useMatchListObserver({ eventIds, queryKey }: { eventIds: string[]; queryKey: QueryKey }) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (eventIds.length === 0) return;

        const updateGroups = (updater: MatchListUpdater) => {
            queryClient.setQueryData<MatchListCacheData>(queryKey, (data) => updateCacheData(data, updater));
        };

        const unsubscribeList = eventIds.flatMap((eventId) => [
            globalEventObserver.subscribe(LiveScoreEvent.getUpdateEventName(eventId), (payload) => {
                const liveScorePayload = payload as LiveScorePayload;
                const periodMappings = queryClient.getQueryData<PeriodMappingBySport>(PERIOD_MAPPING_QUERY_KEY);
                updateGroups(
                    updateEventInGroups(liveScorePayload.event_id, (event, group) =>
                        updateEventWithLiveScore(event, liveScorePayload, group.sport_id, periodMappings),
                    ),
                );
            }),
            globalEventObserver.subscribe(OddsChangeEvent.getUpdateEventName(eventId), (payload) => {
                const oddsPayload = payload as OddsChangePayload;
                updateGroups(
                    updateEventInGroups(oddsPayload.event_id, (event) => updateEventWithOdds(event, oddsPayload)),
                );
            }),
            globalEventObserver.subscribe(FixtureEvent.getUpdateEventName(eventId), (payload) => {
                const fixturePayload = payload as FixtureChangePayload;
                const updater =
                    fixturePayload.change_type === FixtureChangeType.Cancelled
                        ? removeEventFromGroups(fixturePayload.event_id)
                        : updateEventInGroups(fixturePayload.event_id, (event) =>
                              updateEventWithFixture(event, fixturePayload),
                          );

                updateGroups(updater);
            }),
            globalEventObserver.subscribe(MatchStatusEvent.getUpdateEventName(eventId), (payload) => {
                const statusPayload = payload as MatchStatusPayload;
                const updater = isMatchFinished(statusPayload.status_code)
                    ? removeEventFromGroups(statusPayload.sport_event_id)
                    : updateEventInGroups(statusPayload.sport_event_id, (event) =>
                          updateEventWithMatchStatus(event, statusPayload),
                      );

                updateGroups(updater);
            }),
        ]);

        return () => {
            unsubscribeList.forEach((unsubscribe) => {
                unsubscribe();
            });
        };
    }, [eventIds, queryClient, queryKey]);
}
