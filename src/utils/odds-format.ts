import { INVARIANT_LOCALE } from '@/constants';

/** Odds format types */
export type OddsFormat = 'decimal' | 'american' | 'fractional';

/** Maximum displayable odds value (shows as "999999.990+") */
export const MAX_DISPLAY_ODDS = 999999.99;

/**
 * Convert decimal odds to American odds
 * @param decimal Decimal odds (e.g., 1.50, 2.75)
 * @returns American odds string (e.g., "+150", "-200")
 */
export const decimalToAmerican = (decimal: number): string => {
    if (decimal >= 2.0) {
        // Positive odds: (decimal - 1) * 100
        const american = Math.round((decimal - 1) * 100);
        return `+${american}`;
    }
    // Negative odds: -100 / (decimal - 1)
    const american = Math.round(-100 / (decimal - 1));
    return `${american}`;
};

/**
 * Calculate Greatest Common Divisor (GCD)
 */
const gcd = (a: number, b: number): number => {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
};

/**
 * Convert decimal odds to fractional odds
 * @param decimal Decimal odds (e.g., 1.50, 2.75)
 * @returns Fractional odds string (e.g., "1/2", "7/4")
 */
export const decimalToFractional = (decimal: number): string => {
    // Fractional odds = (decimal - 1) expressed as a fraction
    // Example: 1.50 -> 0.50 -> 1/2
    //          2.75 -> 1.75 -> 7/4
    const profit = decimal - 1;

    // Convert decimal to fraction with 1/100 precision
    const precision = 100;
    let numerator = Math.round(profit * precision);
    let denominator = precision;

    // Simplify fraction
    const divisor = gcd(numerator, denominator);
    numerator = numerator / divisor;
    denominator = denominator / divisor;

    return `${numerator}/${denominator}`;
};

/**
 * Format odds for tooltips (higher precision for decimal)
 * @param odds Decimal odds
 * @param format Odds format
 * @returns Formatted odds string with higher precision
 */
export const getFullOddsByFormat = (odds: number, format: OddsFormat): string => {
    // Handle very large or invalid values
    if (!Number.isFinite(odds) || odds > MAX_DISPLAY_ODDS) {
        return `${MAX_DISPLAY_ODDS.toFixed(3)}+`;
    }

    if (format === 'decimal') {
        return new Intl.NumberFormat(INVARIANT_LOCALE, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 6, // Show more precision on hover
            useGrouping: false,
        }).format(odds);
    }

    // American and Fractional are exact or integer-based, so use standard formatting
    return formatOddsByFormat(odds, format);
};

/**
 * Check if raw decimal odds has more precision than what formatOddsByFormat displays.
 * Used to conditionally show tooltip only when it adds information.
 */

export const hasOddsExtraPrecision = (odds: number): boolean => {
    if (odds < 1.01 && 0 < odds) return false;
    const str = String(odds);
    const dotIndex = str.indexOf('.');
    if (dotIndex === -1) return false;
    return str.length - dotIndex - 1 > 2;
};

/**
 * Format odds according to specified format
 * @param odds Decimal odds
 * @param format Odds format
 * @returns Formatted odds string
 */
export const formatOddsByFormat = (odds: number, format: OddsFormat): string => {
    // Handle very large or invalid values
    if (!Number.isFinite(odds) || odds > MAX_DISPLAY_ODDS) {
        return `${MAX_DISPLAY_ODDS.toFixed(3)}+`;
    }

    switch (format) {
        case 'american':
            return decimalToAmerican(odds);
        case 'fractional':
            return decimalToFractional(odds);
        default: {
            const fractionDigits = odds < 1.01 && 0 < odds ? 3 : 2;
            return new Intl.NumberFormat(INVARIANT_LOCALE, {
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
                useGrouping: false,
                roundingMode: 'trunc',
            }).format(odds);
        }
    }
};
