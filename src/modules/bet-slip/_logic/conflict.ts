import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { isSameSelection } from './cart-sync';

/**
 * Check if two betting selections are in conflict
 *
 * Core logic:
 * 1. Standard selections from the same match conflict (cannot be parlayed).
 * 2. Outrights do not participate in conflict logic.
 */
export function checkIsConflicted(a: OddsEntity, b: OddsEntity): boolean {
    // The same selection is not considered in conflict
    if (isSameSelection(a, b)) {
        return false;
    }

    if (a.isOutright || b.isOutright) {
        return false;
    }

    // 1. Conflict within the same standard match
    if (a.eventId === b.eventId) {
        return true;
    }

    return false;
}

/**
 * Calculate which selections among all selected items are in conflict
 * @returns Returns a Set of uniqueIds for conflicted selections
 */
export function getConflictedIds(selections: OddsEntity[], getUniqueId: (s: OddsEntity) => string): Set<string> {
    const conflictedIds = new Set<string>();

    for (let i = 0; i < selections.length; i++) {
        for (let j = i + 1; j < selections.length; j++) {
            if (checkIsConflicted(selections[i], selections[j])) {
                conflictedIds.add(getUniqueId(selections[i]));
                conflictedIds.add(getUniqueId(selections[j]));
            }
        }
    }

    return conflictedIds;
}
