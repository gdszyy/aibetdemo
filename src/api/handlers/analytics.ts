import { userFetcher } from '@/api/client';
import type { AnalyticsPayload } from '@/api/models/analytics';

/** Report analytics tracking data */
export const ReportAnalyticsInterface = (params: AnalyticsPayload) =>
    userFetcher.post<unknown>(`/v1/ads/track`, params, {
        withAuth: false,
    });
