import type { BetType } from '@/api/models/cart';
import {
    MAX_PARLAY_SELECTIONS,
    MAX_SINGLE_SELECTIONS,
    WARN_SELECTION_THRESHOLD,
} from '@/modules/bet-slip/_constants/constants';

/**
 * Check whether a new selection can be added (Parlay mode).
 */
export function checkParlaySelectionLimit(selectionsCount: number) {
    return {
        canAdd: selectionsCount < MAX_PARLAY_SELECTIONS,
        shouldWarn: selectionsCount === WARN_SELECTION_THRESHOLD,
        maxLimit: MAX_PARLAY_SELECTIONS,
    };
}

/**
 * Check whether a new selection can be added (Single mode).
 */
export function checkSingleSelectionLimit(selectionsCount: number) {
    return {
        canAdd: selectionsCount < MAX_SINGLE_SELECTIONS,
        shouldWarn: selectionsCount === WARN_SELECTION_THRESHOLD,
        maxLimit: MAX_SINGLE_SELECTIONS,
    };
}

/**
 * Check whether a new selection can be added based on betMode.
 */
export function checkSelectionLimit(selectionsCount: number, betMode: BetType) {
    return betMode === 1 ? checkSingleSelectionLimit(selectionsCount) : checkParlaySelectionLimit(selectionsCount);
}
