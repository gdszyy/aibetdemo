import { PostLocalCartInterface, type SpecifierStatusCheckItem } from '@/api/handlers/match';
import { OutcomeActiveEnum } from '@/api/models/market';
import { config } from '@/constants/config';
import {
    convertOddsEntityToCartItem,
    dedupeSelectionsByUniqueId,
    isSameSelection,
} from '@/modules/bet-slip/_logic/cart-sync';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { useSessionStore } from '@/stores/session-store';
import { reportError } from '@/utils/error';
import type { BetSlipState } from '../slices';
import type { BetSlipListenerManager } from './listener-manager';
import { clearSelectionSnapshot } from './selection-snapshot';
import type { BetSlipStore, BetSlipStoreGetter } from './store-api';

export const verifyLocalSelections = async (selections: OddsEntity[]): Promise<OddsEntity[]> => {
    const orderSelections = selections.map(convertOddsEntityToCartItem);

    const response = await PostLocalCartInterface(orderSelections);
    if (config.isDev) console.log('[BetSlipStore] Local data verification result:', response);

    if (!response || !Array.isArray(response)) {
        return selections;
    }

    return selections.map((selection) => {
        const remote = response.find(
            (item: SpecifierStatusCheckItem) =>
                item.event_id === selection.eventId &&
                item.market_id === String(selection.marketId) &&
                item.outcome_id === selection.outcome.id &&
                String(item.product) === String(selection.productId) &&
                item.specifiers === selection.specifiers,
        );

        if (!remote) {
            return {
                ...selection,
                outcome: {
                    ...selection.outcome,
                    active: OutcomeActiveEnum.Hidden,
                },
            };
        }

        if (remote.timestamp < selection.timestamp) {
            return {
                ...selection,
                categoryId: remote.category_id?.trim() ? remote.category_id : selection.categoryId,
                matchStatus: remote.match_status,
            };
        }

        return {
            ...selection,
            categoryId: remote.category_id?.trim() ? remote.category_id : selection.categoryId,
            matchStatus: remote.match_status,
            timestamp: remote.timestamp,
            outcome: {
                ...selection.outcome,
                active: remote.outcome_active,
                odds: parseFloat(remote.outcome_odds),
                last_update: remote.timestamp,
            },
        };
    });
};

export const executeLoginMerge = async (store: BetSlipStore, localSelections: OddsEntity[]) => {
    await store.getState().fetchLatest(true);
    const remoteSelections = store.getState().selections;
    const toAdd = localSelections.filter(
        (localSelection) => !remoteSelections.some((selection) => isSameSelection(selection, localSelection)),
    );

    if (toAdd.length > 0) {
        store
            .getState()
            .setSelections(dedupeSelectionsByUniqueId([...toAdd, ...remoteSelections]), { pendingSync: true });
        store.getState().syncToServer();
    }
};

export const createPersistRehydrateHandler = (
    getStore: BetSlipStoreGetter,
    listenerManager: BetSlipListenerManager,
) => {
    return () => (state?: BetSlipState) => {
        if (config.isDev) console.log('[BetSlipStore] onRehydrateStorage', state);
        if (!state?.selections) {
            return;
        }

        const eventIds = new Set(state.selections.map((selection) => selection.eventId));
        if (config.isDev) console.log('[onRehydrateStorage] Initializing listeners, eventIds:', Array.from(eventIds));
        listenerManager.initializeSelectionListeners(eventIds);

        const { data } = useSessionStore.getState();
        if (data?.user?.uid && state.selections.length > 0) {
            setTimeout(async () => {
                try {
                    const store = getStore();
                    const currentState = store.getState();
                    if (currentState.hasPendingSync) {
                        await executeLoginMerge(store, [...currentState.selections]).catch(() =>
                            currentState.fetchLatest(),
                        );
                    } else {
                        await currentState.fetchLatest();
                    }
                } catch (error) {
                    if (config.isDev) {
                        console.error('[BetSlipStore] Rehydration sync failed:', error);
                    } else {
                        reportError(error, {
                            tags: {
                                module: 'bet-slip-store',
                                action: 'rehydration',
                            },
                        });
                    }
                }
            }, 0);
            return;
        }

        if (!data?.user?.uid && state.selections.length > 0) {
            if (config.isDev) console.log('[BetSlipStore] Not logged in, verifying local data...');
            setTimeout(async () => {
                try {
                    const updatedSelections = await verifyLocalSelections(getStore().getState().selections);
                    getStore().getState().setSelections(updatedSelections, { pendingSync: false });
                } catch (error) {
                    if (config.isDev) {
                        console.error('[BetSlipStore] Local data verification failed:', error);
                    } else {
                        reportError(error, {
                            tags: {
                                module: 'bet-slip-store',
                                action: 'local-verification',
                            },
                        });
                    }
                }
            }, 0);
        }
    };
};

let isSessionSyncSetup = false;

export const setupBetSlipSessionSync = (store: BetSlipStore) => {
    if (isSessionSyncSetup) {
        return;
    }
    isSessionSyncSetup = true;

    useSessionStore.subscribe((state, prevState) => {
        const isLoggedIn = Boolean(state.data?.user?.uid);
        const wasLoggedIn = Boolean(prevState.data?.user?.uid);

        if (isLoggedIn && !wasLoggedIn) {
            const { selections: localSelections, fetchLatest } = store.getState();

            if (localSelections.length > 0) {
                if (config.isDev) console.log('[BetSlipStore] User logged in with local selections, merging...');
                executeLoginMerge(store, [...localSelections]).catch(() => fetchLatest());
            } else {
                if (config.isDev) console.log('[BetSlipStore] User logged in, pulling server cart data...');
                fetchLatest();
            }
        } else if (!isLoggedIn && wasLoggedIn) {
            if (config.isDev) console.log('[BetSlipStore] User logged out, clearing cart data...');
            clearSelectionSnapshot(store, {
                version: null,
                cartStatus: null,
            });
        }
    });
};
