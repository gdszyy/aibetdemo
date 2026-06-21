'use client';

import { logEvent } from 'firebase/analytics';
import { useCallback } from 'react';
import type {
    FirebaseAnalyticsEventName,
    FirebaseAnalyticsParams,
    FirebaseAnalyticsParamValue,
} from '@/api/models/analytics';
import type { StorageEnum } from '@/constants';
import { config } from '@/constants/config';
import { usePathname } from '@/i18n';
import { getFirebaseAnalytics } from '@/libs/firebase';
import { useUser } from '@/stores/session-store';
import { markFirstAnalyticsEvent, persistAnalyticsAttributionFromLocation } from '@/utils/analytics';
import { resolveAnalyticsChannel } from './use-analytics-channel';

/** Firebase Analytics 业务埋点上报方法。 */
interface BusinessFirebaseAnalytics {
    /** 上报普通业务事件。 */
    track: (eventName: FirebaseAnalyticsEventName, params?: FirebaseAnalyticsParams) => void;
    /** 上报只触发一次的业务事件。 */
    trackFirst: (
        eventName: FirebaseAnalyticsEventName,
        storageKey: StorageEnum,
        params?: FirebaseAnalyticsParams,
    ) => void;
}

/** 过滤 undefined，避免 Firebase 参数里出现无效值。 */
const compactParams = (params: Record<string, FirebaseAnalyticsParamValue | undefined>): FirebaseAnalyticsParams => {
    const nextParams: FirebaseAnalyticsParams = {};
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
            nextParams[key] = value;
        }
    }
    return nextParams;
};

/** 提供自动补公共参数的 Firebase Analytics 业务埋点能力。 */
export const useBusinessFirebaseAnalytics = (): BusinessFirebaseAnalytics => {
    const pathname = usePathname();
    const profileChannel = useUser()?.ads_ch_code;

    const track = useCallback(
        (eventName: FirebaseAnalyticsEventName, params: FirebaseAnalyticsParams = {}): void => {
            const eventTime = Date.now();
            persistAnalyticsAttributionFromLocation();
            const channel = resolveAnalyticsChannel(profileChannel);
            const payload = compactParams({
                ...params,
                ch: channel,
                event_time: eventTime,
                from_page: pathname,
                pathname,
                page_url: typeof window !== 'undefined' ? window.location.href : undefined,
            });

            if (config.isDev) {
                console.log('[FirebaseAnalytics] logEvent', eventName, payload);
            }

            getFirebaseAnalytics()
                .then((analytics) => {
                    if (!analytics) {
                        if (config.isDev) {
                            console.log('[FirebaseAnalytics] skipped: analytics is unavailable in this environment');
                        }
                        return;
                    }
                    logEvent(analytics, eventName, payload);
                })
                .catch((error: unknown) => {
                    if (config.isDev) {
                        console.error('Failed to report Firebase analytics event', error);
                    }
                });
        },
        [pathname, profileChannel],
    );

    const trackFirst = useCallback(
        (
            eventName: FirebaseAnalyticsEventName,
            storageKey: StorageEnum,
            params: FirebaseAnalyticsParams = {},
        ): void => {
            if (!markFirstAnalyticsEvent(storageKey)) return;
            track(eventName, params);
        },
        [track],
    );

    return { track, trackFirst };
};
