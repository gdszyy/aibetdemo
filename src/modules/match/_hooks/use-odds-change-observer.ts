import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import type { OutrightMarketEvent, OutrightMarketsResponse } from '@/api/handlers/tournament';
import type { MatchWithMarkets } from '@/api/models/match';
import {
    type FixtureChangePayload,
    FixtureChangeType,
    type LiveScorePayload,
    type OddsChangePayload,
} from '@/api/models/ws';
import { globalEventObserver, useEventObserver } from '@/hooks/use-socket-listener';
import { FixtureEvent, LiveScoreEvent, OddsChangeEvent } from '@/libs/event-constants';
import { mergeMarkets } from '@/modules/match/_logic/merge-match';
import { OddsUpdateProcessor } from '@/modules/match/_logic/odds-change';
import { resolveOddsChangeOutcomeNames } from '@/modules/match/_logic/odds-change-name';
import { updateMatchBasicInfo } from '@/modules/match/_utils/match-utils';
import { reportError } from '@/utils/error';
import type { PeriodMappingBySport } from '@/utils/period-mapping';
import { PERIOD_MAPPING_QUERY_KEY } from '@/utils/period-mapping';
import { wsLogger } from '@/utils/websocket/ws-logger';

export function useMatchItemObserver({ matchId, key }: { matchId: string; key: readonly unknown[] }): void {
    const queryClient = useQueryClient();
    const event = OddsChangeEvent.getUpdateEventName(matchId);

    useEventObserver<OddsChangePayload>(event, (payload: OddsChangePayload) => {
        const prevData = queryClient.getQueryData<MatchWithMarkets>(key);
        if (!prevData) return;

        resolveOddsChangeOutcomeNames(prevData, payload)
            .then((resolvedPayload) => {
                let requiresRefetch = false;

                queryClient.setQueryData(key, (currentData: MatchWithMarkets | undefined) => {
                    if (!currentData) {
                        return currentData;
                    }

                    const processor = new OddsUpdateProcessor(resolvedPayload);
                    const result = processor.generateMarkets(currentData.markets || []);
                    requiresRefetch = result.requiresRefetch;

                    return {
                        ...currentData,
                        markets: result.markets,
                    };
                });

                if (requiresRefetch) {
                    queryClient.invalidateQueries({ queryKey: key }).catch((error) => {
                        reportError(error, {
                            level: 'warning',
                            tags: { module: 'match-item-observer', matchId },
                        });
                    });
                }
            })
            .catch((error) => {
                reportError(error, {
                    level: 'warning',
                    tags: { module: 'match-item-outcome-name', matchId },
                });
            });
    });
}

export function useMatchLiveScoreObserver({ matchId, key }: { matchId: string; key: readonly unknown[] }): void {
    const queryClient = useQueryClient();
    const event = LiveScoreEvent.getUpdateEventName(matchId);

    useEventObserver<LiveScorePayload>(event, (payload: LiveScorePayload) => {
        if (String(payload.event_id) !== String(matchId)) return;

        queryClient.setQueryData(key, (prevData: MatchWithMarkets | undefined) => {
            if (!prevData) return prevData;
            const periodMappings = queryClient.getQueryData<PeriodMappingBySport>(PERIOD_MAPPING_QUERY_KEY);
            return updateMatchBasicInfo(prevData, payload, periodMappings);
        });
    });
}

export function useMatchFixtureObserver({ callback }: { callback: (payload: FixtureChangePayload) => void }): void {
    const event = FixtureEvent.getUpdateEvent();

    useEventObserver<FixtureChangePayload>(event, (payload: FixtureChangePayload) => {
        callback(payload);
    });
}

export function useMatchItemFixtureObserver({
    matchId,
    key,
    cancelCallback,
}: {
    matchId: string;
    key: readonly unknown[];
    cancelCallback?: (payload: FixtureChangePayload) => void;
}): void {
    const queryClient = useQueryClient();
    const event = FixtureEvent.getUpdateEventName(matchId);
    const callback = (payload: FixtureChangePayload) => {
        if (payload.change_type === FixtureChangeType.StartTimeUpdated && payload.start_time !== null) {
            queryClient.setQueryData(key, (prevData: MatchWithMarkets) => {
                return {
                    ...prevData,
                    start_time: payload.start_time,
                };
            });
        } else if (payload.change_type === FixtureChangeType.Cancelled) {
            cancelCallback?.(payload);
        }
    };

    useEventObserver<FixtureChangePayload>(event, (payload: FixtureChangePayload) => {
        callback(payload);
    });
}

export const mergeOutrightMarketsData = (
    current: OutrightMarketsResponse | undefined,
    incoming: OutrightMarketsResponse,
): OutrightMarketsResponse => {
    if (!current) {
        return incoming;
    }

    const currentEventMap = new Map(current.map((event) => [event.event_id, event]));

    return incoming.map((event) => {
        const currentEvent = currentEventMap.get(event.event_id);
        if (!currentEvent) {
            return event;
        }

        return {
            ...event,
            markets: mergeMarkets(currentEvent.markets, event.markets),
        };
    });
};

const updateOutrightEventMarkets = (
    event: OutrightMarketEvent,
    payload: OddsChangePayload,
): { event: OutrightMarketEvent; requiresRefetch: boolean } => {
    const processor = new OddsUpdateProcessor(payload);
    const { markets, requiresRefetch } = processor.generateMarkets(event.markets);

    return {
        event: {
            ...event,
            markets,
        },
        requiresRefetch,
    };
};

export function useOutrightObserver({ eventIds, key }: { eventIds: string[]; key: readonly unknown[] }): void {
    const queryClient = useQueryClient();
    const events = useMemo(() => eventIds.map((eventId) => OddsChangeEvent.getUpdateEventName(eventId)), [eventIds]);

    useEffect(() => {
        const handleOddsChange = (payload: OddsChangePayload) => {
            wsLogger.debug('odds-change-outright', payload);

            const currentData = queryClient.getQueryData<OutrightMarketsResponse>(key);
            const targetEvent = currentData?.find(
                (outrightEvent) => String(outrightEvent.event_id) === String(payload.event_id),
            );
            if (!targetEvent) return;

            resolveOddsChangeOutcomeNames(targetEvent, payload)
                .then((resolvedPayload) => {
                    let requiresRefetch = false;

                    queryClient.setQueryData(key, (cacheData: OutrightMarketsResponse | undefined) => {
                        if (!cacheData) return cacheData;

                        return cacheData.map((outrightEvent) => {
                            if (String(outrightEvent.event_id) !== String(resolvedPayload.event_id)) {
                                return outrightEvent;
                            }

                            const updated = updateOutrightEventMarkets(outrightEvent, resolvedPayload);
                            requiresRefetch = updated.requiresRefetch;
                            return updated.event;
                        });
                    });

                    if (requiresRefetch) {
                        queryClient.invalidateQueries({ queryKey: key }).catch((error) => {
                            reportError(error, {
                                level: 'warning',
                                tags: { module: 'outright-observer', eventId: resolvedPayload.event_id },
                            });
                        });
                    }
                })
                .catch((error) => {
                    reportError(error, {
                        level: 'warning',
                        tags: { module: 'outright-outcome-name', eventId: payload.event_id },
                    });
                });
        };

        const unsubscribes = events.map((event) =>
            globalEventObserver.subscribe(event, (payload) => {
                handleOddsChange(payload as OddsChangePayload);
            }),
        );

        return () => {
            for (const unsubscribe of unsubscribes) {
                unsubscribe();
            }
        };
    }, [events, key, queryClient]);
}
