import type { CartStatus } from '@/api/models/cart';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import type { BetSlipState } from '../slices';
import type { BetSlipStore } from './store-api';

type SelectionSnapshotPatchOptions = {
    selections: OddsEntity[];
    hasPendingSync: boolean;
    version?: number | null;
    cartStatus?: CartStatus | null;
};

export const createSelectionSnapshotPatch = (options: SelectionSnapshotPatchOptions): Partial<BetSlipState> => {
    const patch: Partial<BetSlipState> = {
        selections: options.selections,
        hasPendingSync: options.hasPendingSync,
    };

    if (options.version !== undefined) {
        patch.version = options.version;
    }

    if (options.cartStatus !== undefined) {
        patch.cartStatus = options.cartStatus;
    }

    return patch;
};

export const applySelectionSnapshot = (store: BetSlipStore, options: SelectionSnapshotPatchOptions) => {
    store.setState(createSelectionSnapshotPatch(options));
};

export const clearSelectionSnapshot = (
    store: BetSlipStore,
    options?: {
        version?: number | null;
        cartStatus?: CartStatus | null;
    },
) => {
    applySelectionSnapshot(store, {
        selections: [],
        hasPendingSync: false,
        version: options?.version,
        cartStatus: options?.cartStatus,
    });
};
