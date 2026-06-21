import { useMemo } from 'react';
import { BetType } from '@/api/models/cart';
import { useParlayBoostRule } from '@/hooks/use-parlay-boost-rule';
import { getUniqueSelectionId } from '@/modules/bet-slip/_logic/cart-sync';
import { getConflictedIds } from '@/modules/bet-slip/_logic/conflict';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import { isActiveParlayBoostRule, isExpiredPreMatchSelectionForRule } from '@/utils/parlay-boost-preview';
import { useAllSelections } from '../../stores/bet-slip-store';

/**
 * Compute conflicted selection IDs in Parlay mode.
 */
export function useParlayConflicts(): Set<string> {
    const selections = useAllSelections();

    return useMemo(() => getConflictedIds(selections, getUniqueSelectionId), [selections]);
}

export function useParlayNonCompliantSelectionIds(): Set<string> {
    const selections = useAllSelections();
    const betMode = useBetCartStore((state) => state.betMode);
    const { data: parlayBoostRule = null } = useParlayBoostRule({
        enabled: betMode === BetType.Parlay && selections.length > 0,
    });

    return useMemo(() => {
        if (betMode !== BetType.Parlay) {
            return new Set<string>();
        }

        const isActivePreMatchOnlyRule =
            isActiveParlayBoostRule(parlayBoostRule) && parlayBoostRule.pre_match_only === 1;

        return new Set(
            selections
                .filter(
                    (selection) =>
                        selection.isOutright ||
                        (isActivePreMatchOnlyRule && isExpiredPreMatchSelectionForRule(selection, parlayBoostRule)),
                )
                .map((selection) => getUniqueSelectionId(selection)),
        );
    }, [betMode, parlayBoostRule, selections]);
}
