import type { OddsEntity } from '@/modules/match/_constants/match.types';

/**
 * Extract the primary numeric value from a specifier string for sorting.
 * e.g. "total=3.5" -> 3.5, "hcp=-0.5" -> -0.5, "hcp=-0.5|total=2.5" -> -0.5
 */
export function extractSpecifierNum(value: string): number {
    const match = value.match(/-?\d+\.?\d*/);
    return match ? Number.parseFloat(match[0]) : 0;
}

/**
 * Check if two OddsEntity objects refer to the same line (ignoring outcome)
 */
export function isSameLine(a: OddsEntity, b: OddsEntity) {
    return (
        a.eventId === b.eventId &&
        String(a.marketId) === String(b.marketId) &&
        String(a.productId) === String(b.productId) &&
        a.specifiers === b.specifiers
    );
}

/**
 * Check if two OddsEntity objects refer to the same selection (including outcome)
 */
export function isSameSelection(a: OddsEntity, b: OddsEntity) {
    return isSameLine(a, b) && String(a.outcome.id) === String(b.outcome.id);
}
