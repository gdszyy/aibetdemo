import {
    compareOutcomesByDisplayOrder,
    LineStatus,
    type MarketLine,
    OutcomeActiveEnum,
    type OutcomeModel,
} from '@/api/models/market';
import type { OddsChangeLinePayload, OddsChangeOutcomePayload } from '@/api/models/ws';

const resolveOddsChangeOutcomeActive = ({
    existingActive,
    incomingActive,
}: {
    existingActive: OutcomeActiveEnum | undefined;
    incomingActive: OutcomeActiveEnum | undefined;
}): OutcomeActiveEnum => {
    if (incomingActive !== undefined) {
        return incomingActive;
    }

    return existingActive ?? OutcomeActiveEnum.Inactive;
};

export const sortOddsChangeOutcomes = (outcomes: OutcomeModel[]): OutcomeModel[] => {
    return outcomes.sort(compareOutcomesByDisplayOrder);
};

const resolveOutcomeLastUpdate = (outcome: Pick<OutcomeModel, 'last_update'> | OddsChangeOutcomePayload | undefined) =>
    typeof outcome?.last_update === 'number' ? outcome.last_update : undefined;

/** 判断 WS/HTTP outcome 是否比本地投注项更新。 */
export const isIncomingOutcomeFresh = (
    existing: Pick<OutcomeModel, 'last_update'> | undefined,
    incoming: OddsChangeOutcomePayload,
): boolean => {
    const incomingLastUpdate = resolveOutcomeLastUpdate(incoming);
    const existingLastUpdate = resolveOutcomeLastUpdate(existing);

    if (existingLastUpdate === undefined) {
        return true;
    }

    if (incomingLastUpdate === undefined) {
        return false;
    }

    return incomingLastUpdate >= existingLastUpdate;
};

export const mergeOddsChangeOutcome = (
    existing: OutcomeModel | undefined,
    incoming: OddsChangeOutcomePayload,
): OutcomeModel => {
    if (existing && !isIncomingOutcomeFresh(existing, incoming)) {
        return existing;
    }

    const id = String(incoming.id);
    const name = incoming.name || existing?.name || '';
    const nameAlias = incoming.name_alias || existing?.name_alias;
    const quickName = incoming.quick_name || existing?.quick_name;

    return {
        ...existing,
        ...incoming,
        id,
        name,
        name_alias: nameAlias || undefined,
        quick_name: quickName || undefined,
        odds: incoming.odds ?? existing?.odds ?? 0,
        line: incoming.line ?? existing?.line ?? '',
        sorted: incoming.sorted ?? existing?.sorted,
        last_update: incoming.last_update ?? existing?.last_update,
        active: resolveOddsChangeOutcomeActive({
            existingActive: existing?.active,
            incomingActive: incoming.active,
        }),
    };
};

/** When `allowNewOutcomes: false`, WS deltas only merge into ids already present (match list snapshot). Default `true`. */
export type MergeOddsChangeOutcomesOptions = {
    allowNewOutcomes?: boolean;
};

export const mergeOddsChangeOutcomes = (
    existingOutcomes: OutcomeModel[],
    incomingOutcomes: OddsChangeLinePayload['outcomes'],
    options?: MergeOddsChangeOutcomesOptions,
): OutcomeModel[] => {
    if (!incomingOutcomes || incomingOutcomes.length === 0) {
        return existingOutcomes;
    }

    const allowNewOutcomes = options?.allowNewOutcomes !== false;

    const mergedOutcomes = new Map<string, OutcomeModel>();
    for (const outcome of existingOutcomes) {
        mergedOutcomes.set(String(outcome.id), outcome);
    }

    for (const incoming of incomingOutcomes) {
        const id = String(incoming.id);
        if (!allowNewOutcomes && !mergedOutcomes.has(id)) continue;
        mergedOutcomes.set(id, mergeOddsChangeOutcome(mergedOutcomes.get(id), incoming));
    }

    return sortOddsChangeOutcomes(Array.from(mergedOutcomes.values()));
};

export const createOddsChangeMarketLine = (wsLine: OddsChangeLinePayload): MarketLine => {
    const outcomes = sortOddsChangeOutcomes(
        (wsLine.outcomes || []).map((outcome) => mergeOddsChangeOutcome(undefined, outcome)),
    );

    return {
        id: wsLine.id ?? 0,
        product: wsLine.product,
        product_raw: wsLine.product_raw,
        specifiers: wsLine.specifiers,
        row: wsLine.row,
        is_main_line: wsLine.is_main_line,
        line_status: LineStatus.Active, // !只占位
        outcomes,
    };
};
