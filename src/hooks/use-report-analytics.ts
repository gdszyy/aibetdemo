import { useMutation } from '@tanstack/react-query';
import { ReportAnalyticsInterface } from '@/api/handlers/analytics';
import type { InterfaceRequest } from '@/api/lib/types';

export const REPORT_ANALYTICS_MUTATION_KEY = 'reportAnalytics';

type ReportAnalyticsRequest = InterfaceRequest<typeof ReportAnalyticsInterface>;

/** Report analytics data */
export const useReportAnalytics = () =>
    useMutation({
        mutationKey: [REPORT_ANALYTICS_MUTATION_KEY],
        mutationFn: (params: ReportAnalyticsRequest) => ReportAnalyticsInterface(params),
    });
