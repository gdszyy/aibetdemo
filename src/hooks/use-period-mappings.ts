'use client';

import { useQuery } from '@tanstack/react-query';
import { GetPeriodMappingInterface } from '@/api/handlers/app';
import { buildPeriodMappingMap, PERIOD_MAPPING_QUERY_KEY } from '@/utils/period-mapping';

/**
 * Initialize global period-name mappings used to restore live-score period labels from WS updates.
 */
export const useInitPeriodMappings = (): void => {
    useQuery({
        queryKey: PERIOD_MAPPING_QUERY_KEY,
        queryFn: async () => {
            const periodMappings = await GetPeriodMappingInterface();
            return buildPeriodMappingMap(periodMappings);
        },
        staleTime: Number.POSITIVE_INFINITY,
        gcTime: Number.POSITIVE_INFINITY,
    });
};
