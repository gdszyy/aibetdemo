import { isOutcomeActiveLocked, shouldShowOutcome } from '@/api/models/market';
import type { TranslationFunction } from '@/i18nV2/types';
import { getUniqueSelectionId } from '@/modules/bet-slip/_logic/cart-sync';
import { checkIsConflicted } from '@/modules/bet-slip/_logic/conflict';
import type { OddsEntity } from '@/modules/match/_constants/match.types';

// Re-export odds formatting utilities (shared across modules)
export {
    decimalToAmerican,
    decimalToFractional,
    formatOddsByFormat,
    getFullOddsByFormat,
    hasOddsExtraPrecision,
    MAX_DISPLAY_ODDS,
    type OddsFormat,
} from '@/utils/odds-format';

/**
 * Bet slip precision calculation tools
 * Uses integer arithmetic to avoid floating-point precision issues
 */

/** Precision factor, supports up to 6 decimal places */
const PRECISION_FACTOR = 1000000;

const isBetSlipSelectionInvalid = (selection: OddsEntity): boolean => !shouldShowOutcome(selection.outcome.active);

const isBetSlipSelectionLocked = (selection: OddsEntity): boolean => isOutcomeActiveLocked(selection.outcome.active);

/**
 * 判断注单是否因 liveMap 失活。
 * Disconnect liveness is ignored by bet slip availability.
 */

/**
 * Safe multiplication (used for stake * odds to calculate potential returns)
 * @param a First number (e.g., stake)
 * @param b Second number (e.g., odds)
 * @returns Result, rounded to 2 decimal places
 */
export const safeMultiply = (a: number, b: number): number => {
    // Convert floating-point numbers to integers for calculation to avoid precision loss
    const aInt = Math.round(a * PRECISION_FACTOR);
    const bInt = Math.round(b * PRECISION_FACTOR);
    return (aInt * bInt) / (PRECISION_FACTOR * PRECISION_FACTOR);
};

/**
 * Safe addition (used for accumulating bet amounts)
 * @param values Array of values to accumulate
 * @returns Result, rounded to 2 decimal places
 */
export const safeSum = (...values: number[]): number => {
    const sum = values.reduce((acc, val) => acc + Math.round(val * PRECISION_FACTOR), 0);
    return sum / PRECISION_FACTOR;
};

/**
 * 根据投注金额与可用余额生成余额摘要。
 */
export const getBetSlipBalanceSummary = (
    availableBalance: number,
    totalStake: number,
): {
    /** 可用于体育投注的余额（main + sport bonus）。 */
    availableBalance: number;
    /** 当前投注与可用余额之间的差额。 */
    differenceAmount: number;
    /** 是否余额不足。 */
    isInsufficient: boolean;
} => {
    const rawDifference = safeSum(totalStake, -availableBalance);
    const differenceAmount = rawDifference > 0 ? rawDifference : 0;

    return {
        availableBalance,
        differenceAmount,
        isInsufficient: differenceAmount > 0,
    };
};

/**
 * Check for any exceptions (locked, invalid, conflicted)
 * @param selections List of all selections
 * @param conflictedIds Set of selection IDs that are in conflict (passed in Parlay mode)
 * @param nonCompliantIds Set of selection IDs that are non-compliant in the current mode
 * @returns Whether any exception exists
 */
export const hasAnyException = (
    selections: OddsEntity[],
    conflictedIds: Set<string> = new Set(),
    nonCompliantIds: Set<string> = new Set(),
): boolean => {
    // Check for locked or invalid selections
    const hasLockedOrInvalid = selections.some((s) => {
        const isInvalid = isBetSlipSelectionInvalid(s);
        const isLocked = !isInvalid && isBetSlipSelectionLocked(s);
        return isInvalid || isLocked;
    });
    return hasLockedOrInvalid || conflictedIds.size > 0 || nonCompliantIds.size > 0;
};

/**
 * Calculate the set of selection IDs to be removed and their statistics
 * @param selections List of all selections
 * @param conflictedIds Set of selection IDs that are in conflict
 * @param nonCompliantIds Set of selection IDs that are non-compliant in the current mode
 * @returns Object containing Set of IDs and statistics
 */
export const getSelectionsToRemove = (
    selections: OddsEntity[],
    conflictedIds: Set<string>,
    nonCompliantIds: Set<string> = new Set(),
): {
    ids: Set<string>;
    counts: {
        conflictsRemoved: number;
        lockedRemoved: number;
        invalidRemoved: number;
        inactiveRemoved: number;
        nonCompliantRemoved: number;
    };
} => {
    const ids = new Set<string>();
    const counts = {
        conflictsRemoved: 0,
        lockedRemoved: 0,
        invalidRemoved: 0,
        inactiveRemoved: 0,
        nonCompliantRemoved: 0,
    };

    const keptSelections: OddsEntity[] = [];

    selections.forEach((s) => {
        const key = getUniqueSelectionId(s);
        const isInvalid = isBetSlipSelectionInvalid(s);
        const isLocked = !isInvalid && isBetSlipSelectionLocked(s);

        if (isInvalid) {
            ids.add(key);
            counts.invalidRemoved++;
            return;
        }

        if (isLocked) {
            ids.add(key);
            counts.lockedRemoved++;
            return;
        }

        if (nonCompliantIds.has(key)) {
            ids.add(key);
            counts.nonCompliantRemoved++;
            return;
        }

        // 2. Conflict handling (Parlay mode)
        if (conflictedIds.has(key)) {
            // Greedy strategy: check if it conflicts with already kept items
            const hasConflictWithKept = keptSelections.some((kept) => checkIsConflicted(s, kept));
            if (hasConflictWithKept) {
                // Conflicts with kept items -> remove
                ids.add(key);
                counts.conflictsRemoved++;
            } else {
                // No conflict -> keep
                keptSelections.push(s);
            }
        } else {
            // No conflict -> keep
            keptSelections.push(s);
        }
    });
    return { ids, counts };
};

/**
 * 串关底部赔率 / 派彩 / 加赔预览用投注项：排除失效、锁盘、失活、冲突、串关不合规腿。
 */
export const getParlayOddsEligibleSelections = (
    selections: OddsEntity[],
    conflictedIds: Set<string> = new Set(),
    nonCompliantIds: Set<string> = new Set(),
): OddsEntity[] => {
    return selections.filter((selection) => {
        const key = getUniqueSelectionId(selection);
        if (conflictedIds.has(key) || nonCompliantIds.has(key)) {
            return false;
        }
        if (isBetSlipSelectionInvalid(selection)) {
            return false;
        }
        if (isBetSlipSelectionLocked(selection)) {
            return false;
        }
        return true;
    });
};

// Re-export from shared location for backwards compatibility within this module
export { checkParlaySelectionLimit, checkSelectionLimit, checkSingleSelectionLimit } from '@/utils/selection-limit';

/**
 * Generate toast notification message after removing exceptional selections
 * @param counts - Object containing counts of removed conflicted, locked, and invalid items
 * @param t - i18n translation function
 * @returns Formatted message string, or null if no exceptions
 */
export const generateRemovedToastMessage = (
    counts: {
        conflictsRemoved: number;
        lockedRemoved: number;
        invalidRemoved: number;
        inactiveRemoved: number;
        nonCompliantRemoved: number;
    },
    t: TranslationFunction<'betSlip'>,
): string | null => {
    const { conflictsRemoved, lockedRemoved, invalidRemoved, inactiveRemoved, nonCompliantRemoved } = counts;

    // Generate toast message
    const messageParts = [];
    if (conflictsRemoved > 0) {
        messageParts.push(t('toast.conflicts_plural', { count: conflictsRemoved }));
    }
    if (lockedRemoved > 0) {
        messageParts.push(t('toast.locked_plural', { count: lockedRemoved }));
    }
    if (invalidRemoved > 0) {
        messageParts.push(t('toast.invalid_plural', { count: invalidRemoved }));
    }
    if (inactiveRemoved > 0) {
        messageParts.push(t('toast.inactive_plural', { count: inactiveRemoved }));
    }
    if (nonCompliantRemoved > 0) {
        messageParts.push(t('toast.non_compliant_plural', { count: nonCompliantRemoved }));
    }

    if (messageParts.length === 0) {
        return null;
    }
    if (messageParts.length === 1) {
        return t('toast.removed_single', { part: messageParts[0] });
    }
    if (messageParts.length === 2) {
        return t('toast.removed_two', { part1: messageParts[0], part2: messageParts[1] });
    }
    if (messageParts.length === 3) {
        return t('toast.removed_three', {
            part1: messageParts[0],
            part2: messageParts[1],
            part3: messageParts[2],
        });
    }

    return t('toast.removed_three', {
        part1: messageParts[0],
        part2: messageParts[1],
        part3: messageParts.slice(2).join(', '),
    });
};
