'use client';

import type { FC } from 'react';
import { useEffect } from 'react';
import { AdPlacementTriggerTiming } from '@/api/models/ad-placement';
import { StorageEnum } from '@/constants';
import { useAdPlacementSSEListener } from '../_hooks/use-ad-placement-sse-listener';
import { useTriggeredAdPlacements } from '../_hooks/use-triggered-ad-placements';
import { useAdPlacementStore } from '../_stores/ad-placement-store';
import { AdPlacementFloatingGroup } from './ad-placement-floating-group';
import { AdPlacementModal } from './ad-placement-modal';

const RECOVERABLE_TRIGGER_TIMINGS = new Set<AdPlacementTriggerTiming>([
    AdPlacementTriggerTiming.LoginSuccess,
    AdPlacementTriggerTiming.RegisterSuccess,
]);

/**
 * 全局触发型广告展示层。
 *
 * 该组件挂在 AppShell 内，负责两类触发型广告：
 * 1. 首次进入首页时主动拉取 FirstHomeVisit 广告；
 * 2. 登录、注册、充值、投注等后续时机由 SSE 监听触发刷新。
 *
 * 常驻 Banner、公告条和侧边栏广告不由这里渲染，它们各自通过 useAdPlacements 读取 config。
 */
export const AdPlacementLayer: FC = () => {
    useAdPlacementSSEListener();
    const { fetchTriggeredAdPlacements } = useTriggeredAdPlacements();

    const activeModal = useAdPlacementStore((state) => state.activeModal);
    const floatingCards = useAdPlacementStore((state) => state.floatingCards);
    const setActiveModal = useAdPlacementStore((state) => state.setActiveModal);
    const removeFloatingCard = useAdPlacementStore((state) => state.removeFloatingCard);

    useEffect(() => {
        const pendingTrigger = sessionStorage.getItem(StorageEnum.PendingAdPlacementTrigger);
        const pendingTriggerTiming = Number(pendingTrigger) as AdPlacementTriggerTiming;
        const hasRecoverableTrigger = pendingTrigger !== null && RECOVERABLE_TRIGGER_TIMINGS.has(pendingTriggerTiming);

        if (pendingTrigger !== null && !hasRecoverableTrigger) {
            sessionStorage.removeItem(StorageEnum.PendingAdPlacementTrigger);
        }

        if (hasRecoverableTrigger) {
            fetchTriggeredAdPlacements(pendingTriggerTiming).then((items) => {
                useAdPlacementStore.getState().setTriggeredAdPlacements(items);
                if (sessionStorage.getItem(StorageEnum.PendingAdPlacementTrigger) === pendingTrigger) {
                    sessionStorage.removeItem(StorageEnum.PendingAdPlacementTrigger);
                }
            });
        } else {
            // 全局广告层挂载时拉取首访广告，后续登录/充值/投注等触发由 SSE 监听更新。
            fetchTriggeredAdPlacements(AdPlacementTriggerTiming.FirstHomeVisit).then((items) => {
                useAdPlacementStore.getState().setTriggeredAdPlacements(items);
            });
        }
    }, [fetchTriggeredAdPlacements]);

    return (
        <>
            <AdPlacementModal item={activeModal} onClose={() => setActiveModal(null)} />
            <AdPlacementFloatingGroup items={floatingCards} onRemove={removeFloatingCard} />
        </>
    );
};
