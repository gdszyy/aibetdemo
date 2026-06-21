import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetRGConfigInterface } from '@/api/handlers/health-setting';
import { generateQueryKey, HealthSettingActions, ModuleKeys } from '@/constants/query-keys';

/** Health setting query key */
export const healthSettingQueryKey = () =>
    generateQueryKey(ModuleKeys.HEALTH_SETTING, HealthSettingActions.GET_HEALTH_SETTING);

/**
 * Fetch health setting hook
 */
export const useHealthSetting = () => {
    return useQuery({
        queryKey: healthSettingQueryKey(),
        queryFn: GetRGConfigInterface,
    });
};

/**
 * Refresh health setting data
 */
export const useRefreshHealthSetting = () => {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: healthSettingQueryKey() });
    };
};
