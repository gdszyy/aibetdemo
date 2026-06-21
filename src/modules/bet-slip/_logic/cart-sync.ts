import type { CartItem, CartItemOutcome } from '@/api/models/cart';
import type { OddsEntity } from '@/modules/match/_constants/match.types';

/**
 * Convert Cart item to OddsEntitySelection
 */
export function convertCartItemToOddsEntity(item: CartItem, eventId: string): OddsEntity {
    // Combine home and away team names as match title
    const title = item.title;
    const outcomeDisplayName = item.outcome_name_alias || item.outcome_name;

    // Convert market_id string to number
    const marketId = parseInt(item.market_id, 10) || 0;

    const ret: OddsEntity = {
        sportName: item.sport_name,
        sportId: item.sport_id,
        eventId: eventId,
        eventIdType: item.event_id_type,
        matchStatus: item.match_status,
        tournamentId: item.tournament_id,
        categoryId: item.category_id,
        isOutright: item.is_outright ?? eventId.startsWith('sr:season:'),
        title,
        marketId,
        marketName: item.market_name,
        productRaw: item.product_raw,
        productId: item.product,
        specifiers: item.specifiers,
        lineStatus: item.specifiers_status,
        line: item.line,
        outcome: {
            id: item.outcome_id,
            name: outcomeDisplayName,
            name_alias: outcomeDisplayName,
            odds: Number(item.outcome_odds),
            active: item.outcome_active,
            line: item.line,
            last_update: item.timestamp,
        },
        timestamp: item.timestamp,
    };

    return ret;
}

// Re-export from shared location for backwards compatibility within this module
export { isSameLine, isSameSelection } from '@/utils/specifier';

/**
 * Get a unique identifier for a selection
 */
export const getUniqueSelectionId = (s: OddsEntity) =>
    `${s.eventId}/${s.marketId}/${s.productId}/${s.specifiers}/${s.outcome.id}`;

/** 按 selection 唯一键去重，后出现的项覆盖先前的项。 */
export const dedupeSelectionsByUniqueId = (selections: OddsEntity[]): OddsEntity[] => {
    const selectionById = new Map<string, OddsEntity>();

    for (const selection of selections) {
        selectionById.set(getUniqueSelectionId(selection), selection);
    }

    return [...selectionById.values()];
};

/**
 * 获取单关金额的 line 级 key。
 *
 * 同一 market line 的不同 outcome 会共用同一个金额槽位，避免切换赔率后 stake 被清空。
 */
export const getSingleStakeLineKey = (s: OddsEntity): string =>
    `${s.eventId}/${s.marketId}/${s.productId}/${s.specifiers}`;

/**
 * 读取单关金额。
 *
 * 单关金额按 market line 维度存储，同一行切换 outcome 时会读取到同一个值。
 */
export const getSingleStakeAmount = (stakeMap: Record<string, number> | undefined, selection: OddsEntity): number => {
    const currentStakeMap = stakeMap ?? {};
    const lineKey = getSingleStakeLineKey(selection);
    return currentStakeMap[lineKey] ?? 0;
};

/**
 * 规范化单关金额映射。
 *
 * 仅保留当前 selections 对应的 line key，清理已移除 selection 的旧值。
 */
export const normalizeSingleStakeMap = (
    selections: OddsEntity[],
    stakeMap: Record<string, number> | undefined,
): Record<string, number> => {
    const currentStakeMap = stakeMap ?? {};
    const nextStakeMap: Record<string, number> = {};

    for (const selection of selections) {
        const lineKey = getSingleStakeLineKey(selection);
        const currentValue = currentStakeMap[lineKey];

        if (currentValue != null) {
            nextStakeMap[lineKey] = currentValue;
        }
    }

    const currentKeys = Object.keys(currentStakeMap);
    const nextKeys = Object.keys(nextStakeMap);

    if (currentKeys.length === nextKeys.length) {
        const isSameMap = currentKeys.every((key) => nextStakeMap[key] === currentStakeMap[key]);
        if (isSameMap) return currentStakeMap;
    }

    return nextStakeMap;
};

export function mergeCartSelectionsByTimestamp(
    currentSelections: OddsEntity[],
    incomingSelections: OddsEntity[],
): OddsEntity[] {
    const currentSelectionMap = new Map(
        currentSelections.map((selection) => [getUniqueSelectionId(selection), selection]),
    );

    return incomingSelections.map((incomingSelection) => {
        const currentSelection = currentSelectionMap.get(getUniqueSelectionId(incomingSelection));
        if (!currentSelection) {
            return incomingSelection;
        }

        const latestSelection =
            incomingSelection.timestamp > currentSelection.timestamp ? incomingSelection : currentSelection;
        const fallbackSelection = latestSelection === incomingSelection ? currentSelection : incomingSelection;

        return {
            ...latestSelection,
            categoryId: latestSelection.categoryId?.trim() ? latestSelection.categoryId : fallbackSelection.categoryId,
            matchStatus: incomingSelection.matchStatus ?? latestSelection.matchStatus,
        };
    });
}

/**
 * Convert OddsEntity to CartItem
 */
export function convertOddsEntityToCartItem(oddsEntity: OddsEntity): CartItemOutcome {
    return {
        product: oddsEntity.productId,
        product_raw: oddsEntity.productRaw,
        event_id: oddsEntity.eventId,
        event_id_type: oddsEntity.eventIdType,
        market_id: String(oddsEntity.marketId),
        specifiers: oddsEntity.specifiers,
        outcome_id: oddsEntity.outcome.id,
        category_id: oddsEntity.categoryId,
    };
}
