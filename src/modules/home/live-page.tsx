'use client';

import { type FC, useEffect } from 'react';
import { FirebaseAnalyticsEventName } from '@/api/models/analytics';
import { StorageEnum } from '@/constants';
import { useBusinessFirebaseAnalytics } from '@/hooks/use-business-firebase-analytics';
import { SportsPage } from './sports-page';

export const LivePage: FC = () => {
    const { trackFirst } = useBusinessFirebaseAnalytics();

    useEffect(() => {
        const clickTime = Date.now();
        trackFirst(FirebaseAnalyticsEventName.FirstInplayPageClick, StorageEnum.AnalyticsFirstInplayPageClick, {
            first_inplay_click_time: clickTime,
        });
    }, [trackFirst]);

    return <SportsPage type="live" />;
};
