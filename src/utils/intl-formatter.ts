/**
 * Internationalization formatting utilities (for display formatting only, e.g. list items, simple conversions.
 * For complex translation logic, use i18n-icu instead.)
 * Formats currency, numbers, dates, times, lists, timezones, etc.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
 */

import { INVARIANT_LOCALE } from '@/constants';

type NumberFormatOptions = Intl.NumberFormatOptions;

type RelativeDateLabels = {
    today: string;
    tomorrow: string;
};

const getDateKey = (value: Date, timezone: string): string => {
    const parts = new Intl.DateTimeFormat(INVARIANT_LOCALE, {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(value);

    const getPart = (type: string) => parts.find((part) => part.type === type)?.value || '';
    return `${getPart('year')}-${getPart('month')}-${getPart('day')}`;
};

const getRelativeDateLabel = (value: Date, timezone: string, labels: RelativeDateLabels): string | null => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const valueKey = getDateKey(value, timezone);
    if (valueKey === getDateKey(today, timezone)) {
        return labels.today;
    }
    if (valueKey === getDateKey(tomorrow, timezone)) {
        return labels.tomorrow;
    }

    return null;
};

/** Format currency */
export const formatCurrency = (
    /** Amount */
    value: number,
    /** Locale */
    locale: string,
    /** Currency code */
    currency: string | null,
    /** Number formatting overrides */
    options: NumberFormatOptions = {},
): string => {
    if (!currency) {
        return '';
    }

    const parts = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
        roundingMode: 'trunc',
        ...options,
    }).formatToParts(value);

    const symbol = parts
        .filter((p) => p.type === 'currency')
        .map((p) => p.value)
        .join('');
    const number = parts
        .filter((p) => p.type !== 'currency' && p.type !== 'literal')
        .map((p) => p.value)
        .join('');

    return `${symbol} ${number}`;
};

/** Format number */
export const formatNumber = (
    /** Number */
    value: number,
    /** Locale */
    locale: string,
    /** Number formatting overrides */
    options: NumberFormatOptions = {},
): string => {
    return new Intl.NumberFormat(locale, options).format(value);
};

/** Format date + time */
export const formatDatetime = (
    /** Date object */
    value: Date,
    /** Locale */
    locale: string,
    /** Timezone */
    timezone: string,
    options?: Intl.DateTimeFormatOptions,
) => {
    return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        dateStyle: 'medium',
        timeStyle: 'short',
        ...options,
    }).format(value);
};

/** Format full date + time YYYY-MM-DD HH:mm:ss */
export const formatFullDatetime = (
    /** Date object */
    value: Date,
    /** Locale */
    locale: string,
    /** Timezone */
    timezone: string,
    options?: Intl.DateTimeFormatOptions,
) => {
    const parts = new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        ...options,
    }).formatToParts(value);

    const getPart = (type: string) => parts.find((p) => p.type === type)?.value || '';

    return `${getPart('year')}-${getPart('month')}-${getPart('day')} ${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;
};

/** Format date */
export const formatDate = (
    /** Date object */
    value: Date,
    /** Locale */
    locale: string,
    /** Timezone */
    timezone: string,
    options?: Intl.DateTimeFormatOptions,
): string => {
    return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
    }).format(value);
};

/** Format date with localized Today / Tomorrow fallback */
export const formatRelativeDate = (
    value: Date,
    locale: string,
    timezone: string,
    labels: RelativeDateLabels,
): string => {
    return getRelativeDateLabel(value, timezone, labels) ?? formatDate(value, locale, timezone);
};

/** Format time */
export const formatTime = (
    /** Date object */
    value: Date,
    /** Locale */
    locale: string,
    /** Timezone */
    timezone: string,
    options?: Intl.DateTimeFormatOptions,
): string => {
    return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        ...options,
    }).format(value);
};

/** Format time (without seconds) HH:mm */
export const formatShortTime = (
    /** Date object */
    value: Date,
    /** Locale */
    locale: string,
    /** Timezone */
    timezone: string,
    options?: Intl.DateTimeFormatOptions,
): string => {
    return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        ...options,
    }).format(value);
};

/** Format short date e.g. Jan 14 */
export const formatShortDate = (
    /** Date object */
    value: Date,
    /** Locale */
    locale: string,
    /** Timezone */
    timezone: string,
    options?: Intl.DateTimeFormatOptions,
): string => {
    return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        month: 'short',
        day: 'numeric',
        ...options,
    }).format(value);
};

/** Format short date with localized Today / Tomorrow fallback */
export const formatRelativeShortDate = (
    value: Date,
    locale: string,
    timezone: string,
    labels: RelativeDateLabels,
): string => {
    return getRelativeDateLabel(value, timezone, labels) ?? formatShortDate(value, locale, timezone);
};

/** Format date + time with localized Today / Tomorrow fallback */
export const formatRelativeDatetime = (
    value: Date,
    locale: string,
    timezone: string,
    labels: RelativeDateLabels,
): string => {
    const relativeLabel = getRelativeDateLabel(value, timezone, labels);
    if (!relativeLabel) {
        return formatDatetime(value, locale, timezone);
    }

    return `${relativeLabel}, ${new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        timeStyle: 'short',
    }).format(value)}`;
};

/** Format full date + time with localized Today / Tomorrow fallback */
export const formatRelativeFullDatetime = (
    value: Date,
    locale: string,
    timezone: string,
    labels: RelativeDateLabels,
): string => {
    const relativeLabel = getRelativeDateLabel(value, timezone, labels);
    if (!relativeLabel) {
        return formatFullDatetime(value, locale, timezone);
    }

    return `${relativeLabel} ${formatTime(value, locale, timezone)}`;
};

/** Format list */
export const formatList = (
    /** List */
    list: string[],
    /** Locale */
    locale: string,
): string => {
    return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(list);
};

/** Compact display threshold: 1 million */
const COMPACT_THRESHOLD = 1_000_000;

/**
 * Format amount (large numbers auto-abbreviated)
 * < 1M: 100,000.00
 * >= 1M: 920.93M
 * >= 1B: 1.23B
 */
export const formatCompactAmount = (
    /** Amount */
    value: number,
    /** Locale */
    locale: string,
    /** Whether to truncate (default true) */
    shouldTruncate = true,
): string => {
    if (!Number.isFinite(value)) return '0.00';

    // Below 1 million, normal display (with thousands separator)
    if (value < COMPACT_THRESHOLD) {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            roundingMode: shouldTruncate ? 'trunc' : 'halfExpand',
        }).format(value);
    }

    // 1 million or above, compact display
    return new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 2,
        roundingMode: 'trunc',
    }).format(value);
};

/** Get decimal separator for the given locale */
export const getDecimalSeparator = (locale: string): string => {
    const parts = new Intl.NumberFormat(locale).formatToParts(1.1);
    return parts.find((part) => part.type === 'decimal')?.value || '.';
};
