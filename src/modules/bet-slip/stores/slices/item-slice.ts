import type { StateCreator } from 'zustand';
import type { LiveScorePayload, MatchStatusPayload, OddsChangePayload } from '@/api/models/ws';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { isIncomingOutcomeFresh, mergeOddsChangeOutcome } from '@/utils/odds-change-merge';
import { createSelectionSnapshotPatch } from '../internal/selection-snapshot';
import type { BetSlipState, ItemSlice } from './_types';

/** LiveScore 的 match_status 为非 0 时才用于刷新购物车赛事阶段。 */
const getLiveScoreMatchStatus = (payload: LiveScorePayload): number | null => {
    if (payload.match_status === null || payload.match_status === 0) {
        return null;
    }

    return payload.match_status;
};

/** 按赛事 ID 批量更新购物车投注项赛事阶段。 */
const updateSelectionsMatchStatus = (
    selections: OddsEntity[],
    eventId: string,
    nextMatchStatus: number,
): {
    hasChanged: boolean;
    selections: OddsEntity[];
} => {
    let hasChanged = false;
    const newSelections = selections.map((selection) => {
        if (selection.eventId !== eventId) return selection;
        if (selection.matchStatus === nextMatchStatus) return selection;

        hasChanged = true;
        return {
            ...selection,
            matchStatus: nextMatchStatus,
        };
    });

    return { hasChanged, selections: newSelections };
};

/**
 * Create Item Slice.
 */
export const createItemSlice: StateCreator<BetSlipState, [], [], ItemSlice> = (set) => ({
    updateByOddsChangePayload: (eventId: string, payload: OddsChangePayload) => {
        set((state) => {
            // Guard check: if selections is empty, skip update
            if (state.selections.length === 0) {
                console.warn(
                    '[updateByOddsChangePayload] selections is empty, ignoring WebSocket update, eventId:',
                    eventId,
                );
                return state;
            }

            const newSelections: OddsEntity[] = state.selections.map((selection) => {
                if (selection.eventId !== eventId) return selection;
                const incomingMarket = payload.markets?.find((m) => Number(m.id) === Number(selection.marketId));
                if (!incomingMarket) return selection;

                const incomingLine = incomingMarket.lines?.find(
                    (l) => l.specifiers === selection.specifiers && l.product === selection.productId,
                );
                if (!incomingLine) return selection;

                const outcome = incomingLine.outcomes?.find((o) => String(o.id) === selection.outcome.id);
                const nextProductRaw = incomingLine.product_raw ?? selection.productRaw;

                if (!outcome) {
                    return {
                        ...selection,
                        productRaw: nextProductRaw,
                    };
                }

                if (!isIncomingOutcomeFresh(selection.outcome, outcome)) {
                    return {
                        ...selection,
                        productRaw: nextProductRaw,
                    };
                }

                const nextOutcome = mergeOddsChangeOutcome(selection.outcome, outcome);

                return {
                    ...selection,
                    productRaw: nextProductRaw,
                    line: nextOutcome.line,
                    outcome: {
                        ...nextOutcome,
                        id: selection.outcome.id,
                        name: selection.outcome.name,
                        name_alias: selection.outcome.name_alias,
                    },
                    timestamp: nextOutcome.last_update ?? selection.timestamp,
                };
            });
            return createSelectionSnapshotPatch({
                selections: newSelections,
                hasPendingSync: state.hasPendingSync,
            });
        });
    },

    updateByLiveScorePayload: (eventId: string, payload: LiveScorePayload) => {
        set((state) => {
            if (state.selections.length === 0) {
                return state;
            }

            const nextMatchStatus = getLiveScoreMatchStatus(payload);
            if (nextMatchStatus === null) {
                return state;
            }

            const { hasChanged, selections } = updateSelectionsMatchStatus(state.selections, eventId, nextMatchStatus);

            if (!hasChanged) {
                return state;
            }

            return createSelectionSnapshotPatch({
                selections,
                hasPendingSync: state.hasPendingSync,
            });
        });
    },

    updateByMatchStatusPayload: (eventId: string, payload: MatchStatusPayload) => {
        set((state) => {
            if (state.selections.length === 0) {
                return state;
            }

            const { hasChanged, selections } = updateSelectionsMatchStatus(
                state.selections,
                eventId,
                payload.status_code,
            );

            if (!hasChanged) {
                return state;
            }

            return createSelectionSnapshotPatch({
                selections,
                hasPendingSync: state.hasPendingSync,
            });
        });
    },
});
