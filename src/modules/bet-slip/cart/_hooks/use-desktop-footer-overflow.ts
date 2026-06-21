import { type RefObject, useEffect, useState } from 'react';

/** 桌面端投注单底部工具栏预留高度（折叠态 Place Bet 条） */
export const DESKTOP_FOOTER_RESERVED_HEIGHT = 72;

/** 展开内容与 Place Bet 按钮之间的间距 */
const DESKTOP_EXPANDED_MARGIN_BOTTOM = 16;

/** 滚动区 shadow / padding 与 footer 的间距 */
const DESKTOP_FOOTER_SHADOW_OFFSET = 8;
const DESKTOP_CONTENT_PADDING_EXTRA = 8;

export const DESKTOP_SCROLL_MAX_HEIGHT = `calc(100vh - 72px - var(--header-strip-height) - 48px - 8px - ${DESKTOP_FOOTER_RESERVED_HEIGHT}px)`;

interface UseDesktopFooterOverflowOptions {
    /** 展开内容容器；桌面端需常驻 DOM，便于 scrollHeight 测量 */
    expandedContentRef: RefObject<HTMLElement | null>;
    isExpanded: boolean;
    enabled: boolean;
}

interface DesktopFooterOverflowMetrics {
    /** 展开时 footer 超出预留区的高度 */
    expandedOverflowHeight: number;
    desktopFooterShadowBottom: number;
    desktopContentBottomPadding: number | undefined;
}

/** 基于展开内容实测高度计算桌面端 footer overlay 的 padding / shadow 偏移 */
export function useDesktopFooterOverflow({
    expandedContentRef,
    isExpanded,
    enabled,
}: UseDesktopFooterOverflowOptions): DesktopFooterOverflowMetrics {
    const [expandedOverflowHeight, setExpandedOverflowHeight] = useState(0);

    useEffect(() => {
        if (!enabled) {
            setExpandedOverflowHeight(0);
            return;
        }

        const element = expandedContentRef.current;
        if (!element) {
            return;
        }

        const measureExpandedOverflow = () => {
            setExpandedOverflowHeight(element.scrollHeight + DESKTOP_EXPANDED_MARGIN_BOTTOM);
        };

        measureExpandedOverflow();

        const observer = new ResizeObserver(measureExpandedOverflow);
        observer.observe(element);
        window.addEventListener('resize', measureExpandedOverflow);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', measureExpandedOverflow);
        };
    }, [enabled, expandedContentRef]);

    const activeOverflow = isExpanded ? expandedOverflowHeight : 0;

    return {
        expandedOverflowHeight,
        desktopFooterShadowBottom: DESKTOP_FOOTER_RESERVED_HEIGHT + activeOverflow - DESKTOP_FOOTER_SHADOW_OFFSET,
        desktopContentBottomPadding: activeOverflow > 0 ? activeOverflow + DESKTOP_CONTENT_PADDING_EXTRA : undefined,
    };
}
