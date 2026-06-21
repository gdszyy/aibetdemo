'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { AnalyticsEventType } from '@/api/models/analytics';
import { usePathname } from '@/i18n';
import {
    buildAnalyticsPayload,
    isPageReload,
    markPageAnalyticsEventSent,
    markSessionEngagementSent,
    persistAnalyticsAttribution,
} from '@/utils/analytics';
import { useReportAnalytics } from './use-report-analytics';

const ENGAGEMENT_EVENTS: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'scroll', 'touchstart'];

/** Global analytics tracker */
export const useAnalyticsTracker = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const { mutate: mutateAnalytics } = useReportAnalytics();

    useEffect(() => {
        persistAnalyticsAttribution(searchParams);
    }, [searchParams]);

    useEffect(() => {
        if (isPageReload()) return;

        const context = { pathname, search };
        const payload = buildAnalyticsPayload(AnalyticsEventType.HomePageView, context);
        if (!payload) return;
        if (!markPageAnalyticsEventSent(AnalyticsEventType.HomePageView, context)) return;

        mutateAnalytics(payload);
    }, [mutateAnalytics, pathname, search]);

    useEffect(() => {
        if (isPageReload()) return;

        const context = { pathname, search };
        const payload = buildAnalyticsPayload(AnalyticsEventType.PageLoadView, context);
        if (!payload) return;
        if (!markPageAnalyticsEventSent(AnalyticsEventType.PageLoadView, context)) return;

        mutateAnalytics(payload);
    }, [mutateAnalytics, pathname, search]);

    useEffect(() => {
        const context = { pathname, search };

        const report = () => {
            const payload = buildAnalyticsPayload(AnalyticsEventType.SessionEngagement, context);
            if (!payload) return;
            if (!markSessionEngagementSent(payload.ch)) return;
            mutateAnalytics(payload);
            cleanup();
        };

        const timer = window.setTimeout(report, 10000);

        const handleEngagement = () => report();
        const cleanup = () => {
            window.clearTimeout(timer);
            for (const eventName of ENGAGEMENT_EVENTS) {
                window.removeEventListener(eventName, handleEngagement);
            }
        };

        for (const eventName of ENGAGEMENT_EVENTS) {
            window.addEventListener(eventName, handleEngagement, { passive: true });
        }

        return cleanup;
    }, [mutateAnalytics, pathname, search]);
};
