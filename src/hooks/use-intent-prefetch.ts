'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-media-query';
import { useRouter } from '@/i18n';

/** 鼠标悬停达到此时长（毫秒）才判定为"将要点击"，避免列表快速划过即预取。 */
const HOVER_INTENT_DELAY_MS = 100;
/** 移动端卡片在视口中停留达到此时长（毫秒）才预取，避免快速滑动逐张预取。 */
const VIEWPORT_DWELL_MS = 250;
/** 视口可见度阈值：卡片露出过半才视为"停留可见"。 */
const VIEWPORT_VISIBLE_RATIO = 0.5;

/** 意图预取处理器：整体展开到卡片根元素（含回调 ref）。 */
export interface IntentPrefetchHandlers {
    /** 鼠标移入：延时判定为悬停意图后预取（桌面端）。 */
    onPointerEnter: () => void;
    /** 鼠标移出：取消尚未触发的悬停预取。 */
    onPointerLeave: () => void;
    /** 触摸开始：移动端按下即视为明确意图，立即预取（先于 click）。 */
    onTouchStart: () => void;
    /** 键盘聚焦：Tab 导航视为明确意图，立即预取。 */
    onFocus: () => void;
    /** 卡片根元素回调 ref：移动端进入视口并停留后自动预取（桌面端 / 关闭视口时为空操作）。 */
    ref: (node: Element | null) => void;
}

/** Hook 选项。 */
export interface IntentPrefetchOptions {
    /** 是否启用移动端视口停留预取。卡片根元素用默认 true；卡内小入口（如"+N"）传 false。 */
    viewport?: boolean;
}

/**
 * 意图预取 Hook（桌面悬停 + 移动视口/触摸 + 键盘聚焦）。
 *
 * 背景：比赛详情、赌场游戏等路由在 `@/i18n` 的 Link 中被关闭了默认（视口）预取
 * （列表页卡片众多，视口预取会造成预取风暴），导致点击卡片为冷导航而卡顿。
 * 本 Hook 按"用户将要点击"的多种信号精准预取目标路由：
 * - 桌面：悬停 100ms（移出取消）—— 避免鼠标快速划过整列时连续预取；
 * - 移动（无 hover）：触摸即预取；并对**当前可见**的少数卡片在停留 250ms 后自动
 *   预取（仅可见 + 需停留，远小于全量视口预取）；
 * - 键盘：聚焦即预取。
 *
 * 同一 href 仅预取一次；预取走 Next AUTO 模式（仅到 loading 边界，不触发详情页
 * generateMetadata 接口），开销很小。
 *
 * @param href 目标路由（locale-less，与 Link / router 同一路径空间）；为空时不预取。
 * @param options.viewport 是否启用移动端视口停留预取，默认 true。
 * @returns 可整体展开到卡片根元素上的事件处理器与回调 ref。
 */
export function useIntentPrefetch(href: string, options?: IntentPrefetchOptions): IntentPrefetchHandlers {
    const viewportEnabled = options?.viewport ?? true;
    const isMobile = useIsMobile();
    const router = useRouter();
    /** 已预取的 href：同一目标只预取一次，href 变化（卡片虚拟列表复用）时自然允许重取。 */
    const prefetchedRef = useRef<string | null>(null);

    const prefetch = useCallback((): void => {
        if (!href || prefetchedRef.current === href) return;
        prefetchedRef.current = href;
        router.prefetch(href);
    }, [href, router]);

    // —— 悬停意图（桌面）——
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clearHoverTimer = useCallback((): void => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
    }, []);
    const prefetchAfterHover = useCallback((): void => {
        if (prefetchedRef.current === href) return;
        clearHoverTimer();
        hoverTimerRef.current = setTimeout(prefetch, HOVER_INTENT_DELAY_MS);
    }, [clearHoverTimer, href, prefetch]);

    // —— 视口停留预取（移动端）——
    const observerRef = useRef<IntersectionObserver | null>(null);
    const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clearDwellTimer = useCallback((): void => {
        if (dwellTimerRef.current) {
            clearTimeout(dwellTimerRef.current);
            dwellTimerRef.current = null;
        }
    }, []);

    const setRef = useCallback(
        (node: Element | null): void => {
            observerRef.current?.disconnect();
            observerRef.current = null;
            clearDwellTimer();

            // 仅移动端、启用视口预取、环境支持时才观察。
            if (!node || !viewportEnabled || !isMobile || typeof IntersectionObserver === 'undefined') return;

            const observer = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    if (!entry) return;
                    if (entry.isIntersecting) {
                        if (dwellTimerRef.current) return;
                        dwellTimerRef.current = setTimeout(() => {
                            dwellTimerRef.current = null;
                            prefetch();
                            observerRef.current?.disconnect();
                        }, VIEWPORT_DWELL_MS);
                    } else {
                        clearDwellTimer();
                    }
                },
                { threshold: VIEWPORT_VISIBLE_RATIO },
            );
            observer.observe(node);
            observerRef.current = observer;
        },
        // 注：href 变化时 prefetch 身份随之变化，已能使本回调重建并重新观察新 href，无需单列 href。
        [clearDwellTimer, isMobile, prefetch, viewportEnabled],
    );

    // 卸载清理（虚拟列表滚动会频繁挂载/卸载卡片）。
    useEffect(
        () => () => {
            clearHoverTimer();
            clearDwellTimer();
            observerRef.current?.disconnect();
        },
        [clearHoverTimer, clearDwellTimer],
    );

    return {
        onPointerEnter: prefetchAfterHover,
        onPointerLeave: clearHoverTimer,
        onTouchStart: prefetch,
        onFocus: prefetch,
        ref: setRef,
    };
}
