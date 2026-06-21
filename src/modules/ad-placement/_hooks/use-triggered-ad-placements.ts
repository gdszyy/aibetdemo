import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { AdPlacementTriggerTiming } from '@/api/models/ad-placement';
import { useIsLogin } from '@/stores/session-store';
import { AdPlacementQueryKeys } from '../_constants/ad-placement-query-keys';
import { getTriggeredAdPlacementsByTriggerTiming } from '../_logic/ad-placement-service';

/**
 * 获取触发型广告的命令式 hook。
 *
 * 触发型广告不是页面常驻数据，通常由首访 effect 或 SSE 事件即时拉取。
 * 这里用 queryClient.fetchQuery 复用 React Query 的错误处理和请求去重，但 staleTime=0 保证每次触发都重新询问后端。
 */
export const useTriggeredAdPlacements = () => {
    const queryClient = useQueryClient();
    const isLogin = useIsLogin();

    const fetchTriggeredAdPlacements = useCallback(
        (triggerTiming: AdPlacementTriggerTiming) => {
            return queryClient.fetchQuery({
                queryKey: AdPlacementQueryKeys.triggered(triggerTiming, isLogin),
                queryFn: () => getTriggeredAdPlacementsByTriggerTiming(triggerTiming, isLogin),
                staleTime: 0,
            });
        },
        [isLogin, queryClient],
    );

    return { fetchTriggeredAdPlacements };
};
