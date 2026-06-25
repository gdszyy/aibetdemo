'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from '@/i18n';

/**
 * 鼠标悬停达到此时长（毫秒）才判定为"将要点击"。
 * 列表页快速划过时不会触发预取，避免重新引入视口预取式的"预取风暴"。
 */
const HOVER_INTENT_DELAY_MS = 100;

/** 意图预取处理器：可直接展开到链接 / 可点击元素上。 */
export interface IntentPrefetchHandlers {
    /** 鼠标移入：延时判定为悬停意图后预取（桌面端）。 */
    onPointerEnter: () => void;
    /** 鼠标移出：取消尚未触发的悬停预取，避免划过即预取。 */
    onPointerLeave: () => void;
    /** 触摸开始：移动端按下即视为明确意图，立即预取（先于 click）。 */
    onTouchStart: () => void;
    /** 键盘聚焦：Tab 导航视为明确意图，立即预取。 */
    onFocus: () => void;
}

/**
 * 意图预取 Hook。
 *
 * 在用户"将要点击"目标链接时（悬停 / 触摸 / 聚焦），对目标路由做一次（且仅一次）
 * 预取，从而消除点击后冷导航（下载路由代码块 + 拉取 RSC）造成的卡顿。
 *
 * 背景：比赛详情、赌场游戏等路由在 `@/i18n` 的 Link 中被显式排除在默认（视口）预取
 * 之外——列表页会同时渲染大量卡片，视口预取会造成预取风暴。意图预取只预取用户真正
 * 即将进入的那一个，兼顾"无风暴"与"导航瞬时"；悬停场景再加一层短延时判定，避免
 * 鼠标快速划过列表时的连续预取。
 *
 * @param href 目标路由（locale-less，与 Link / router 同一路径空间）；为空时不预取。
 * @returns 可展开到目标元素上的事件处理器集合。
 */
export function useIntentPrefetch(href: string): IntentPrefetchHandlers {
    const router = useRouter();
    // 记录已预取的 href：同一目标只预取一次，href 变化（卡片虚拟列表复用）时自动重置。
    const prefetchedRef = useRef<string | null>(null);
    // 悬停意图计时器。
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = useCallback((): void => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const prefetchNow = useCallback((): void => {
        clearTimer();
        if (!href || prefetchedRef.current === href) return;
        prefetchedRef.current = href;
        router.prefetch(href);
    }, [clearTimer, href, router]);

    const prefetchAfterHover = useCallback((): void => {
        if (!href || prefetchedRef.current === href) return;
        clearTimer();
        timerRef.current = setTimeout(prefetchNow, HOVER_INTENT_DELAY_MS);
    }, [clearTimer, href, prefetchNow]);

    // 卸载时清理悬停计时器（虚拟列表滚动会频繁挂载/卸载卡片）。
    useEffect(() => clearTimer, [clearTimer]);

    return {
        onPointerEnter: prefetchAfterHover,
        onPointerLeave: clearTimer,
        onTouchStart: prefetchNow,
        onFocus: prefetchNow,
    };
}
