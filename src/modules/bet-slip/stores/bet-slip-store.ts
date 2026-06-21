'use client';

import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { isSameSelection } from '@/modules/bet-slip/_logic/cart-sync';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { createPersistRehydrateHandler, setupBetSlipSessionSync } from './internal/lifecycle';
import { createBetSlipListenerManager } from './internal/listener-manager';
import { type BetSlipState, createItemSlice, createListSlice, createSyncSlice } from './slices';

export type { BetSlipState };

type BetSlipStore = UseBoundStore<StoreApi<BetSlipState>>;

let betSlipStoreRef: BetSlipStore | null = null;

const getBetSlipStore = () => {
    if (!betSlipStoreRef) {
        throw new Error('BetSlipStore has not been initialized yet.');
    }
    return betSlipStoreRef;
};

const listenerManager = createBetSlipListenerManager(getBetSlipStore);
const handlePersistRehydrate = createPersistRehydrateHandler(getBetSlipStore, listenerManager);

export const useBetSlipStore = create<BetSlipState>()(
    persist(
        (...args) => {
            const listSlice = createListSlice(...args);
            const itemSlice = createItemSlice(...args);
            const syncSlice = createSyncSlice(...args);

            syncSlice.onClearAll = listenerManager.clearAllListeners;

            return {
                ...listSlice,
                ...itemSlice,
                ...syncSlice,
            };
        },
        {
            name: 'bet-slip-storage',
            storage: createJSONStorage(() => window.localStorage),
            partialize: (state) => ({
                selections: state.selections,
                version: state.version,
                hasPendingSync: state.hasPendingSync,
            }),
            onRehydrateStorage: handlePersistRehydrate,
        },
    ),
);

betSlipStoreRef = useBetSlipStore;
listenerManager.setupSelectionListenerSubscription();
setupBetSlipSessionSync(useBetSlipStore);

export const useIsSelectedByEntity = (oddsEntity: OddsEntity) => {
    return useBetSlipStore((state) => {
        return state.selections.some((selection) => isSameSelection(selection, oddsEntity));
    });
};

export const useSelectionCount = () => {
    return useBetSlipStore((state) => state.selections.length);
};

export const useAllSelections = () => {
    return useBetSlipStore((state) => state.selections);
};

export const useCartStatus = () => {
    return useBetSlipStore((state) => state.cartStatus);
};
