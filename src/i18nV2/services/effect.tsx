'use client';

import Cookies from 'js-cookie';
import { type FunctionComponent, useCallback, useEffect, useRef } from 'react';
import { getUserRegion } from '@/api/handlers/app';
import { CacheKey } from '@/constants/cache';
import { config } from '@/constants/config';
import { useLocationReload } from '@/stores/location-reload-store';
import { useIsLogin } from '@/stores/session-store';
import { reportError } from '@/utils/error';
import { getBrowserTimezone } from '@/utils/timezone';
import { useI18nStore, useRegionCode } from '../store';
import { type RegionCode, regionConfigs } from './constant';

/**
 * 执行一些副作用
 */
const useI18nEffect = () => {
    // 页面刷新
    const reload = useLocationReload();

    const isLogin = useIsLogin();

    const regionCode = useRegionCode();
    const lastRegionCode = useRef(regionCode);
    const setRegionCode = useI18nStore((s) => s.setRegionCode);

    useEffect(() => {
        !config.isProd && console.debug('==last region', regionCode);
    }, [regionCode]);

    // 更新国别地区
    useEffect(() => {
        void isLogin;
        getUserRegion().then((res) => {
            !config.isProd && console.debug('==got api region', res.country_code);
            const currentCountryCode =
                (Cookies.get(CacheKey.I18nRegionDebug) as RegionCode) || (res.country_code as RegionCode);
            const rc = regionConfigs[currentCountryCode];
            if (rc) {
                const currentRegionCode = rc.regionCode;
                !config.isProd && console.debug('==reload region', lastRegionCode.current, currentRegionCode);
                // 设置国别地区
                setRegionCode(currentRegionCode);
                if (lastRegionCode.current !== currentRegionCode) {
                    reload();
                }
            } else {
                reportError(`Region code ${currentCountryCode} not found in regionConfigs`, {
                    level: 'fatal',
                });
            }
        });
    }, [isLogin, setRegionCode, reload]);

    // 更新语言
    const lastLanguage = useRef(Cookies.get(CacheKey.I18nLanguage));
    const setLanguage = useCallback((payload: string) => {
        Cookies.set(CacheKey.I18nLanguage, payload);
    }, []);

    useEffect(() => {
        if (!regionCode) {
            return;
        }
        const rc = regionConfigs[regionCode];
        if (rc) {
            const currentLanguage = rc.defaultLanguage;
            !config.isProd && console.debug('==reload language', lastLanguage.current, currentLanguage);
            setLanguage(currentLanguage);
            if (lastLanguage.current !== currentLanguage) {
                reload();
            }
        }
    }, [regionCode, reload, setLanguage]);

    // 更新时区
    const lastTimezone = useRef(Cookies.get(CacheKey.I18nTimezone));
    const setTimezone = useCallback((payload: string) => {
        Cookies.set(CacheKey.I18nTimezone, payload);
    }, []);
    useEffect(() => {
        if (!regionCode) {
            return;
        }
        const currentTimezone = getBrowserTimezone();
        !config.isProd && console.debug('==reload timezone', lastTimezone.current, currentTimezone);
        setTimezone(currentTimezone);
        if (lastTimezone.current !== currentTimezone) {
            reload();
        }
    }, [reload, setTimezone, regionCode]);
};

/** 执行一些副作用 */
export const I18nEffect: FunctionComponent = () => {
    useI18nEffect();

    return null;
};
