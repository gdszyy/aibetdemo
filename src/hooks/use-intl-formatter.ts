import { useTimeZone, useTranslations } from 'next-intl';
import { useCurrencyCode, useCurrencySymbol } from '@/hooks/use-wallet';
import { useRegionIntlLocale } from '@/i18nV2/store';
import {
    formatCompactAmount,
    formatCurrency,
    formatDate,
    formatDatetime,
    formatFullDatetime,
    formatList,
    formatNumber,
    formatRelativeDate,
    formatRelativeDatetime,
    formatRelativeFullDatetime,
    formatRelativeShortDate,
    formatShortDate,
    formatShortTime,
    formatTime,
    getDecimalSeparator,
} from '@/utils/intl-formatter';

/** Internationalization formatting hook */
export const useIntlFormatter = () => {
    const locale = useRegionIntlLocale();
    const timezone = useTimeZone();
    const currencyCode = useCurrencyCode();
    const t = useTranslations('common');

    // 货币标准符号
    const currencySymbol = useCurrencySymbol({
        currencyDisplay: 'symbol',
    });
    // 货币精简符号
    const currencySymbolNarrow = useCurrencySymbol({
        currencyDisplay: 'narrowSymbol',
    });
    // 货币完整名称
    const currencySymbolName = useCurrencySymbol({
        currencyDisplay: 'name',
    });
    // 货币编码
    const currencySymbolCode = useCurrencySymbol({
        currencyDisplay: 'code',
    });

    const relativeDateLabels = {
        today: t('date.today'),
        tomorrow: t('date.tomorrow'),
    };

    return {
        /** Format currency */
        formatCurrency: (
            /** Amount */
            value: number,
            /** Number formatting overrides */
            options?: Intl.NumberFormatOptions,
        ) => formatCurrency(value, locale, currencyCode, options),
        /** 货币标准符号 */
        currencySymbol,
        /** 货币精简符号 */
        currencySymbolNarrow,
        /** 货币完整名称 */
        currencySymbolName,
        /** 货币编码 */
        currencySymbolCode,
        /** Format number */
        formatNumber: (
            /** Number */
            value: number,
            /** Number formatting overrides */
            options?: Intl.NumberFormatOptions,
        ) => formatNumber(value, locale, options),
        /** Format date + time */
        formatDatetime: (
            /** Date object */
            value: Date,
        ) => formatDatetime(value, locale, timezone || 'UTC'),
        /** Format full date + time YYYY-MM-DD HH:mm:ss */
        formatFullDatetime: (
            /** Date object */
            value: Date,
        ) => formatFullDatetime(value, locale, timezone || 'UTC'),
        /** Format date */
        formatDate: (
            /** Date object */
            value: Date,
        ) => formatDate(value, locale, timezone || 'UTC'),
        /** Format date with localized Today / Tomorrow */
        formatRelativeDate: (
            /** Date object */
            value: Date,
        ) => formatRelativeDate(value, locale, timezone || 'UTC', relativeDateLabels),
        /** Format time */
        formatTime: (
            /** Date object */
            value: Date,
        ) => formatTime(value, locale, timezone || 'UTC'),
        /** Format short time HH:mm */
        formatShortTime: (
            /** Date object */
            value: Date,
        ) => formatShortTime(value, locale, timezone || 'UTC'),
        /** Format short date e.g. Jan 14 */
        formatShortDate: (
            /** Date object */
            value: Date,
        ) => formatShortDate(value, locale, timezone || 'UTC'),
        /** Format short date with localized Today / Tomorrow */
        formatRelativeShortDate: (
            /** Date object */
            value: Date,
        ) => formatRelativeShortDate(value, locale, timezone || 'UTC', relativeDateLabels),
        /** Format datetime with localized Today / Tomorrow */
        formatRelativeDatetime: (
            /** Date object */
            value: Date,
        ) => formatRelativeDatetime(value, locale, timezone || 'UTC', relativeDateLabels),
        /** Format full datetime with localized Today / Tomorrow */
        formatRelativeFullDatetime: (
            /** Date object */
            value: Date,
        ) => formatRelativeFullDatetime(value, locale, timezone || 'UTC', relativeDateLabels),
        /** Format list */
        formatList: (
            /** List */
            list: string[],
        ) => formatList(list, locale),
        /** Format amount (large numbers auto-abbreviated: 1M, 1B) */
        formatCompactAmount: (
            /** Amount */
            value: number,
        ) => formatCompactAmount(value, locale),
        /** Decimal separator for current locale */
        decimalSeparator: getDecimalSeparator(locale),
    };
};
