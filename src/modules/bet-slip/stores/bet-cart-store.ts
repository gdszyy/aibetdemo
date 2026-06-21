'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { BetType } from '@/api/models/cart';
import { STORAGE_KEYS } from '@/modules/bet-slip/cart/_constants';

/**
 * Bet Cart Store state.
 *
 * Only manages UI-related state:
 * - betMode: bet mode (Single/Parlay)，全局持久化至 localStorage
 *
 * Note: version and status have been moved to betSlipStore.
 */
interface BetCartState {
    /** Current bet mode (Single / Parlay) */
    betMode: BetType;
    /** Set bet mode */
    setBetMode: (mode: BetType) => void;
}

const isPersistedBetMode = (value: unknown): value is BetType => {
    return value === BetType.Single || value === BetType.Parlay;
};

/**
 * Bet Cart Store.
 */
export const useBetCartStore = create<BetCartState>()(
    persist(
        (set) => ({
            betMode: BetType.Single,
            setBetMode: (mode: BetType) => {
                set({ betMode: mode });
            },
        }),
        {
            name: STORAGE_KEYS.BET_MODE,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ betMode: state.betMode }),
            merge: (persistedState, currentState) => {
                const persisted = persistedState as Partial<BetCartState> | undefined;
                const betMode = persisted?.betMode;

                return {
                    ...currentState,
                    betMode: isPersistedBetMode(betMode) ? betMode : currentState.betMode,
                };
            },
        },
    ),
);
