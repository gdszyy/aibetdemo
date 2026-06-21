import { useEffect } from 'react';
import { type AdPlacementSSEPayload, AdPlacementTriggerTiming } from '@/api/models/ad-placement';
import { globalEventObserver } from '@/hooks/use-socket-listener';
import { AdPlacementSSEEvent } from '../_constants/ad-placement-events';
import { useAdPlacementStore } from '../_stores/ad-placement-store';
import { useTriggeredAdPlacements } from './use-triggered-ad-placements';

/**
 * 监听广告位 SSE 触发事件。
 *
 * 服务端只通过 SSE 告诉前端“某个触发时机发生了”，不会直接推送广告详情。
 * 收到事件后按 triggerTiming 调 trigger 接口，结果写入 store，由 AdPlacementLayer 统一渲染。
 */
export const useAdPlacementSSEListener = () => {
    const { fetchTriggeredAdPlacements } = useTriggeredAdPlacements();

    useEffect(() => {
        const unsubscribe = globalEventObserver.subscribe(AdPlacementSSEEvent.Triggered, (payload) => {
            const { data } = payload as AdPlacementSSEPayload;
            const triggerTiming = data.type;

            // SSE 目前只处理充值/投注事件
            if (
                [AdPlacementTriggerTiming.BetSuccess, AdPlacementTriggerTiming.DepositSuccess].includes(triggerTiming)
            ) {
                // SSE 只携带触发时机，实际弹窗/浮窗内容按该时机再次请求后端获取。
                fetchTriggeredAdPlacements(triggerTiming)
                    .then((items) => {
                        useAdPlacementStore.getState().setTriggeredAdPlacements(items);
                    })
                    .catch((error) => {
                        console.error('[AdPlacement] Failed to fetch SSE triggered placements', {
                            triggerTiming,
                            error,
                        });
                    });
            }
        });

        return unsubscribe;
    }, [fetchTriggeredAdPlacements]);
};
