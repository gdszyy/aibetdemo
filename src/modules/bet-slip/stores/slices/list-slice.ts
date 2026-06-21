import type { StateCreator } from 'zustand';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { isSameLine, isSameSelection } from '@/utils/specifier';
import type { BetSlipState, ListSlice } from './_types';

/**
 * Create List Slice.
 */
export const createListSlice: StateCreator<BetSlipState, [], [], ListSlice> = (set, get) => ({
    // === Initial state ===
    selections: [],

    // === List operations ===
    remove: (oddsEntity) => {
        get().setSelections(
            get().selections.filter((selection) => !isSameSelection(selection, oddsEntity)),
            { pendingSync: true },
        );
        get().syncToServer();
    },

    toggle: (oddsEntity: OddsEntity) => {
        const state = get();
        const sameSelectionIndex = state.selections.findIndex((s) => isSameSelection(s, oddsEntity));

        // If same selection, toggle off (remove)
        if (sameSelectionIndex !== -1) {
            get().setSelections(
                state.selections.filter((_, i) => i !== sameSelectionIndex),
                { pendingSync: true },
            );
            get().syncToServer();
            return;
        }

        // If same line (but different outcome), replace with new one
        const sameLineIndex = state.selections.findIndex((s) => isSameLine(s, oddsEntity));
        if (sameLineIndex !== -1) {
            get().setSelections([oddsEntity, ...state.selections.filter((s) => !isSameLine(s, oddsEntity))], {
                pendingSync: true,
            });
            get().syncToServer();
            return;
        }

        // Otherwise add new selection
        get().setSelections([oddsEntity, ...state.selections], { pendingSync: true });
        get().syncToServer();
    },

    clearAll: () => {
        const state = get();
        // Notify cleanup listeners (handled externally)
        state.onClearAll?.();

        get().setSelections([], { pendingSync: true });

        get().syncToServer();
    },

    setSelections: (selections: OddsEntity[], options) => {
        set({
            selections,
            hasPendingSync: options?.pendingSync ?? false,
        });
    },
});
