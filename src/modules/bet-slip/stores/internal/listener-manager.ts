import type { LiveScorePayload, MatchStatusPayload, OddsChangePayload } from '@/api/models/ws';
import { config } from '@/constants/config';
import { globalEventObserver } from '@/hooks/use-socket-listener';
import { LiveScoreEvent, MatchStatusEvent, OddsChangeEvent } from '@/libs/event-constants';
import type { BetSlipState } from '../slices';
import type { BetSlipStoreGetter } from './store-api';

export interface BetSlipListenerManager {
    clearAllListeners: () => void;
    initializeSelectionListeners: (eventIds: Iterable<string>) => void;
    setupSelectionListenerSubscription: () => void;
}

export const createBetSlipListenerManager = (getStore: BetSlipStoreGetter): BetSlipListenerManager => {
    const matchListeners = new Map<string, () => void>();
    let isSelectionSubscriptionSetup = false;

    const clearAllListeners = () => {
        if (config.isDev) console.log('[clearAll] Clearing listeners, count:', matchListeners.size);
        for (const [matchId, unsubscribe] of matchListeners.entries()) {
            unsubscribe();
            matchListeners.delete(matchId);
        }
    };

    const subscribeToMatch = (
        matchId: string,
        updateOddsFn: BetSlipState['updateByOddsChangePayload'],
        updateLiveScoreFn: BetSlipState['updateByLiveScorePayload'],
        updateStatusFn: BetSlipState['updateByMatchStatusPayload'],
    ) => {
        if (matchListeners.has(matchId)) {
            if (config.isDev) console.log('[subscribeToMatch] Listener exists, skipping:', matchId);
            return matchListeners.get(matchId) as () => void;
        }

        const oddsEvent = OddsChangeEvent.getUpdateEventName(matchId);
        const oddsCallback = (data: unknown) => {
            const payload = data as OddsChangePayload;
            updateOddsFn(matchId, payload);
        };
        const unsubscribeOdds = globalEventObserver.subscribe(oddsEvent, oddsCallback);

        const liveScoreEvent = LiveScoreEvent.getUpdateEventName(matchId);
        const liveScoreCallback = (data: unknown) => {
            const payload = data as LiveScorePayload;
            updateLiveScoreFn(matchId, payload);
        };
        const unsubscribeLiveScore = globalEventObserver.subscribe(liveScoreEvent, liveScoreCallback);

        const statusEvent = MatchStatusEvent.getUpdateEventName(matchId);
        const statusCallback = (data: unknown) => {
            const payload = data as MatchStatusPayload;
            updateStatusFn(matchId, payload);
        };
        const unsubscribeStatus = globalEventObserver.subscribe(statusEvent, statusCallback);

        const unsubscribe = () => {
            unsubscribeOdds();
            unsubscribeLiveScore();
            unsubscribeStatus();
        };
        matchListeners.set(matchId, unsubscribe);
        if (config.isDev) console.log('[subscribeToMatch] New listener for matchId:', matchId);
        return unsubscribe;
    };

    const ensureMatchListener = (matchId: string) => {
        subscribeToMatch(
            matchId,
            (id, payload) => {
                getStore().getState().updateByOddsChangePayload(id, payload);
            },
            (id, payload) => {
                getStore().getState().updateByLiveScorePayload(id, payload);
            },
            (id, payload) => {
                getStore().getState().updateByMatchStatusPayload(id, payload);
            },
        );
    };

    const initializeSelectionListeners = (eventIds: Iterable<string>) => {
        for (const eventId of eventIds) {
            ensureMatchListener(eventId);
        }
    };

    const setupSelectionListenerSubscription = () => {
        if (isSelectionSubscriptionSetup) {
            return;
        }
        isSelectionSubscriptionSetup = true;

        getStore().subscribe((state, prevState) => {
            const currentEventIds = new Set(state.selections.map((selection) => selection.eventId));
            const prevEventIds = new Set(prevState.selections.map((selection) => selection.eventId));

            for (const eventId of prevEventIds) {
                if (!currentEventIds.has(eventId)) {
                    const unsubscribe = matchListeners.get(eventId);
                    unsubscribe?.();
                    matchListeners.delete(eventId);
                }
            }

            for (const eventId of currentEventIds) {
                if (!prevEventIds.has(eventId)) {
                    if (config.isDev) console.log('[subscribe] Adding listener for new eventId:', eventId);
                    ensureMatchListener(eventId);
                }
            }
        });
    };

    return {
        clearAllListeners,
        initializeSelectionListeners,
        setupSelectionListenerSubscription,
    };
};
