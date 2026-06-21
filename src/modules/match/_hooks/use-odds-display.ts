import { isOutcomeActiveLocked, shouldShowOutcome } from '@/api/models/market';
import type { OddsEntity } from '@/modules/match/_constants/match.types';

export const useOddsDisplay = (value: OddsEntity) => {
    const isInvalid = !shouldShowOutcome(value.outcome.active);

    if (isInvalid) {
        return { isLocked: false, isInvalid: true };
    }

    if (isOutcomeActiveLocked(value.outcome.active)) {
        return { isLocked: true, isInvalid: false };
    }

    return { isLocked: false, isInvalid: false };
};
