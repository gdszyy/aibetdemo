export enum CacheKey {
    /** sports */
    UseSports = 'use/sports',

    /** 地区 */
    I18nRegion = 'i18n-region-2',
    I18nRegionDebug = `${CacheKey.I18nRegion}-debug`,
    /** 语言 */
    I18nLanguage = 'i18n-language-2',
    /** 时区 */
    I18nTimezone = 'i18n-timezone-2',
}
