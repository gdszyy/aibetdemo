'use client';

import { setUserId, setUserProperties } from 'firebase/analytics';
import { useEffect } from 'react';
import { config } from '@/constants/config';
import { getFirebaseAnalytics } from '@/libs/firebase';
import { useUser } from '@/stores/session-store';
import { getAnalyticsViewId } from '@/utils/analytics';

/** 同步 Firebase Analytics 全局用户属性。 */
export const useFirebaseAnalyticsUserProperties = (): void => {
    const userId = useUser()?.uid ?? '';

    useEffect(() => {
        const viewId = getAnalyticsViewId();

        getFirebaseAnalytics()
            .then((analytics) => {
                if (!analytics) return;

                setUserProperties(analytics, {
                    env: config.appEnv,
                    ...(viewId ? { view_id: viewId } : {}),
                });
                setUserId(analytics, userId);

                if (config.isDev) {
                    // console.log('[FirebaseAnalytics] userProperties', {
                    //     env: config.appEnv,
                    //     user_id: userId,
                    //     view_id: viewId,
                    // });
                }
            })
            .catch((error: unknown) => {
                if (config.isDev) {
                    console.error('Failed to sync Firebase analytics user properties', error);
                }
            });
    }, [userId]);
};
