import type { Locale } from '@/i18n/locale';

/**
 * 国别码
 * 取值规范：https://zh.wikipedia.org/wiki/ISO_3166-1 2位码
 */
export type RegionCode =
    /** 巴西 */
    | 'BR'
    /** 墨西哥 */
    | 'MX';

/**
 * 货币码
 * 规范：https://zh.wikipedia.org/wiki/ISO_4217#%E7%8E%B0%E8%A1%8C%E4%BB%A3%E7%A0%81
 */
export type CurrencyCode =
    /** 巴西雷亚尔 */
    | 'BRL'
    /** 墨西哥比索 */
    | 'MXN';

/** 国别码和语言、货币等映射关系 */
export const regionConfigs: Record<
    RegionCode,
    {
        /** 国别地区 */
        regionCode: RegionCode;
        /** 语言-地区 */
        intlLocale: string;
        /** 支持的语言列表 */
        supportLanguages: Locale[];
        /** 默认语言 */
        defaultLanguage: Locale;
        /** 货币码 */
        currencyCode: CurrencyCode;
        /**
         * 时区
         * 取值规范：https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
         */
        timezone: string;
        /** 时区utc偏移量 */
        timezoneUTC: string;
    }
> = {
    BR: {
        regionCode: 'BR',
        intlLocale: 'pt-BR',
        supportLanguages: ['pt', 'en'],
        defaultLanguage: 'pt',
        currencyCode: 'BRL',
        timezone: 'America/Sao_Paulo',
        timezoneUTC: 'UTC-3',
    },
    MX: {
        regionCode: 'MX',
        intlLocale: 'es-MX',
        supportLanguages: ['es', 'en'],
        defaultLanguage: 'es',
        currencyCode: 'MXN',
        timezone: 'America/Mexico_City',
        timezoneUTC: 'UTC-6',
    },
};
