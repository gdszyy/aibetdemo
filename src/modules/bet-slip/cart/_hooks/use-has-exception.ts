import { useMemo } from 'react';
import { hasAnyException } from '@/modules/bet-slip/_utils';
import type { OddsEntity } from '@/modules/match/_constants/match.types';

const EMPTY_SET = new Set<string>();

export const useHasException = (
    selections: OddsEntity[],
    conflictedSelectionIds: Set<string> = EMPTY_SET,
    nonCompliantIds: Set<string> = EMPTY_SET,
) => {
    return useMemo(() => {
        // Check existing exceptions (locked, invalid, conflicts)
        if (hasAnyException(selections, conflictedSelectionIds, nonCompliantIds)) {
            return true;
        }
        return false;
    }, [selections, conflictedSelectionIds, nonCompliantIds]);
};
