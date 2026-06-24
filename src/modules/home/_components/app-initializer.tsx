'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useLocalStorageState } from 'ahooks';
import { useLocale } from 'next-intl';
import { type FC, useEffect, useMemo } from 'react';
import { getServiceUrl } from '@/api/client';
import { UserKycStatus } from '@/api/models/user';
import { NetworkSignalWithToast } from '@/components/network-signal/network-signal-with-toast';
import { clearCacheData } from '@/components/tanstack-provider/services/utils';
import { StorageEnum } from '@/constants';
import { config } from '@/constants/config';
import { UserCenterMenu } from '@/constants/user-center';
import { useInitAppInfo } from '@/hooks/use-app-info';
import { useBetObserver } from '@/hooks/use-bet-observer';
import { useFirebaseAnalyticsUserProperties } from '@/hooks/use-firebase-analytics-user-properties';
import { useLiveMatchTotalsPolling } from '@/hooks/use-live-match-total';
import { useIsMobile } from '@/hooks/use-media-query';
import { useInitPeriodMappings } from '@/hooks/use-period-mappings';
import { useRechargeCodeStore } from '@/hooks/use-recharge-code';
import { useAllSports } from '@/hooks/use-sports';
import { useSSEConnection } from '@/hooks/use-sse-connection';
import { useWallet, useWalletDispatchBalance } from '@/hooks/use-wallet';
import { useWalletSync } from '@/hooks/use-wallet-sync';
import { regionConfigs, useRegionCode } from '@/i18nV2';
import { navigateToAccount } from '@/libs/account-navigator';
import { CMD_AUTH, CMD_LANG } from '@/libs/event-constants';
import { getFirebaseAnalytics } from '@/libs/firebase';
import { useUnreadMessages } from '@/modules/user-center/notification/use-unread-messages';
import { useRegionStore } from '@/stores/region-store';
import {
    getSessionToken,
    SessionStatusEnum,
    useIsLogin,
    useSessionReady,
    useSessionStore,
    useUser,
} from '@/stores/session-store';
import { useSharedSocketStore } from '@/stores/shared-socket-store';
import { wsLogger } from '@/utils/websocket/ws-logger';
import { SentryUserContextSync } from './sentry-user-context-sync';

/**
 * AppInitializer - Handles all client-side side effects and initialization.
 * This component is imported with { ssr: false } to prevent hydration mismatches.
 */
const AppInitializer: FC = () => {
    const initialize = useSessionStore((state) => state.initialize);
    const user = useUser();
    const isSessionReady = useSessionReady();
    const isLogin = useIsLogin();
    const language = useLocale();
    const connect = useSharedSocketStore((s) => s.connect);
    const disconnect = useSharedSocketStore((s) => s.disconnect);
    const send = useSharedSocketStore((s) => s.send);
    const isConnected = useSharedSocketStore((s) => s.isConnected);
    const dispatchCurrency = useWallet((s) => s.dispatchCurrency);
    const setCurrencyCode = useWallet((s) => s.setCurrencyCode);
    const dispatchBalance = useWalletDispatchBalance();
    const isMobile = useIsMobile();
    const allSports = useAllSports();
    const allSportIds = useMemo(() => allSports.map((sport) => sport.sport_id), [allSports]);

    // Init core app info
    useInitAppInfo();
    useInitPeriodMappings();
    useUnreadMessages();
    useBetObserver();
    useSSEConnection();
    useWalletSync();
    useLiveMatchTotalsPolling(allSportIds);
    useFirebaseAnalyticsUserProperties();

    // Firebase Analytics lazy init
    useEffect(() => {
        const run = () => {
            getFirebaseAnalytics();
        };
        if ('requestIdleCallback' in window) {
            const idleId = window.requestIdleCallback(run, { timeout: 3000 });
            return () => window.cancelIdleCallback(idleId);
        }

        const timeoutId = globalThis.setTimeout(run, 1500);
        return () => globalThis.clearTimeout(timeoutId);
    }, []);

    // WS Connection
    useEffect(() => {
        const wsUrl = getServiceUrl('app/ws');
        if (!wsUrl) {
            console.error('ws api url is empty');
            return;
        }
        connect(wsUrl);
        return () => disconnect();
    }, [connect, disconnect]);

    // Session Init
    useEffect(() => {
        initialize();
        useRegionStore.persist.rehydrate();
    }, [initialize]);

    // Post-login action (after reload triggered by signIn)
    // Shows success toast + opens KYC modal if needed
    useEffect(() => {
        if (isLogin && window.localStorage.getItem(StorageEnum.PostLogin)) {
            window.localStorage.removeItem(StorageEnum.PostLogin);

            const storeUser = useSessionStore.getState().data?.user;
            if (storeUser?.kyc_status !== UserKycStatus.Success && !config.disableKycVerify) {
                navigateToAccount(UserCenterMenu.KYC);
            }
        }
    }, [isLogin]);

    // Wallet & Currency Sync
    useEffect(() => {
        if (isLogin) {
            dispatchCurrency();
        }
    }, [isLogin, dispatchCurrency]);

    useEffect(() => {
        if (getSessionToken()) {
            dispatchBalance();
        }
    }, [dispatchBalance]); // Trigger balance sync on login state change (e.g. after signIn redirect)

    const dispatchCodes = useRechargeCodeStore((s) => s.dispatchCodes);
    // 刷新充值码
    useEffect(() => {
        void user?.uid;
        if (isSessionReady) {
            dispatchCodes();
        }
    }, [dispatchCodes, isSessionReady, user?.uid]);

    const regionCode = useRegionCode();
    const setRegion = useRegionStore((s) => s.setRegion);

    // 设置地区
    useEffect(() => {
        if (regionCode) {
            setRegion(regionCode);
        }
    }, [regionCode, setRegion]);

    // 设置货币码
    useEffect(() => {
        if (regionCode) {
            const regionConfig = regionConfigs[regionCode];
            if (regionConfig) {
                setCurrencyCode(regionConfig.currencyCode);
            }
        }
    }, [regionCode, setCurrencyCode]);

    // Language Sync to WS
    useEffect(() => {
        if (isConnected && language) {
            try {
                const encoder = new TextEncoder();
                const langData = encoder.encode(language);
                send(CMD_LANG, langData);
            } catch (error) {
                console.error('Failed to send language update:', error);
            }
        }
    }, [language, isConnected, send]);

    // Auth Sync to WS
    useEffect(() => {
        const token = getSessionToken();
        if (isConnected && isLogin && token) {
            try {
                const encoder = new TextEncoder();
                const authData = encoder.encode(token);
                send(CMD_AUTH, authData);
                wsLogger.debug('auth-sync');
            } catch (error) {
                console.error('Failed to send auth command:', error);
            }
        }
    }, [isLogin, isConnected, send]);

    const queryClient = useQueryClient();

    // 用户变化，清空 query cache
    const authStatus = useSessionStore((s) => s.status);
    const userId = useUser()?.uid;
    const [cacheUserId, setCacheUserId] = useLocalStorageState('cache-user-id');
    useEffect(() => {
        // console.debug('[clear cache] authStatus', authStatus);
        if (authStatus === SessionStatusEnum.Loading) {
            return;
        }
        if (userId !== cacheUserId) {
            console.debug('[clear api data cache] because userId changed: ', `${cacheUserId} => ${userId}`);
            clearCacheData(queryClient);
            setCacheUserId(userId);
        }
    }, [authStatus, cacheUserId, queryClient, setCacheUserId, userId]);

    // 地区变化，清空 query cache
    const [cacheRegionCode, setCacheRegionCode] = useLocalStorageState('cache-region-code');
    useEffect(() => {
        if (regionCode && regionCode !== cacheRegionCode) {
            console.debug('[clear api data cache] because region changed: ', `${cacheRegionCode} => ${regionCode}`);
            clearCacheData(queryClient);
            setCacheRegionCode(regionCode);
        }
    }, [regionCode, cacheRegionCode, setCacheRegionCode, queryClient]);

    // 语言变化，清空 query cache
    const [cacheLanguage, setCacheLanguage] = useLocalStorageState('cache-language');
    useEffect(() => {
        if (language && language !== cacheLanguage) {
            console.debug('[clear api data cache] because language changed: ', `${cacheLanguage} => ${language}`);
            clearCacheData(queryClient);
            setCacheLanguage(language);
        }
    }, [language, cacheLanguage, setCacheLanguage, queryClient]);

    return (
        <>
            <SentryUserContextSync />
            {isMobile && <NetworkSignalWithToast />}
        </>
    );
};

export default AppInitializer;
