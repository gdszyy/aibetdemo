'use client';

import { useEffect } from 'react';
import { useSharedSocketStore } from '@/stores/shared-socket-store';

/**
 * 订阅赛事实时数据，并在卸载或赛事列表变化时取消订阅。
 *
 * @param eventIds 需要订阅的赛事 ID 列表
 * @param enabled 是否启用订阅
 */
export const useGameSubscription = (eventIds: string[], enabled = true): void => {
    const subscribeGame = useSharedSocketStore((state) => state.subscribeGame);
    const unsubscribeGame = useSharedSocketStore((state) => state.unsubscribeGame);

    useEffect(() => {
        if (!enabled || eventIds.length === 0) return;

        subscribeGame(eventIds);

        return () => {
            unsubscribeGame(eventIds);
        };
    }, [eventIds, enabled, subscribeGame, unsubscribeGame]);
};
