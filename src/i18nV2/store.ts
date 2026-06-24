'use client';

import Cookies from 'js-cookie';
import { create } from 'zustand';
import { CacheKey } from '@/constants/cache';
import { type CurrencyCode, type RegionCode, regionConfigs } from './services/constant';

export const FALLBACK_REGION_CODE: RegionCode = 'BR';
export const FALLBACK_INTL_LOCALE = regionConfigs[FALLBACK_REGION_CODE].intlLocale;
export const FALLBACK_CURRENCY_CODE: CurrencyCode = regionConfigs[FALLBACK_REGION_CODE].currencyCode;

/** 国际化 store */
export const useI18nStore = create<{
    /** 国别码 */
    regionCode: RegionCode;
    /** 设置国别码 */
    setRegionCode: (region: RegionCode) => void;
}>((set) => {
    return {
        regionCode: Cookies.get(CacheKey.I18nRegion) as unknown as RegionCode,
        setRegionCode: (payload) => {
            set({ regionCode: payload });
            Cookies.set(CacheKey.I18nRegion, payload);
        },
    };
});

/** 获取国别码 */
export const useRegionCode = () => {
    return useI18nStore((s) => s.regionCode);
};

/** 当前国别的配置 */
export const useRegionConfig = () => {
    const regionCode = useRegionCode();
    if (!regionCode) {
        return null;
    }
    return regionConfigs[regionCode] || null;
};

/** 当前国别的intl locale */
export const useRegionIntlLocale = () => {
    return useRegionConfig()?.intlLocale || FALLBACK_INTL_LOCALE;
};
