import { shouldShowOutcome } from '@/api/models/market';
import type { OddsEntity } from '../_constants/match.types';
import { shouldShowLine } from './match-utils';

/**
 * Check if a selection is structurally invalid.
 * Hidden outcomes are invalid immediately; hidden line statuses are invalid when present.
 */
export const isSelectionInvalid = (s: OddsEntity): boolean => {
    if (!shouldShowOutcome(s.outcome.active)) {
        return true;
    }

    if (s.lineStatus === undefined) {
        return false;
    }

    return !shouldShowLine(s.lineStatus);
};
