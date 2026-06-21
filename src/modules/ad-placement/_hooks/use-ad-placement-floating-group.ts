import { type RefObject, useEffect, useRef, useState } from 'react';
import { AdPlacementJumpType, type FloatingCardAdPlacement } from '@/api/models/ad-placement';
import { useAdPlacementNavigation } from './use-ad-placement-navigation';

const FLOATING_CARD_AUTOPLAY_INTERVAL = 3000;
const FLOATING_CARD_TRANSITION_DURATION = 400;

interface UseAdPlacementFloatingGroupResult {
    activeIndex: number;
    containerRef: RefObject<HTMLDivElement | null>;
    expanded: boolean;
    handleCardClick: (item: FloatingCardAdPlacement) => void;
    handleHoverChange: (nextExpanded: boolean) => void;
    setActiveIndex: (index: number) => void;
}

/**
 * 右侧悬浮广告组的交互状态。
 *
 * 收起态展示单张轮播卡片，展开态展示完整卡片列表。
 * hover 展开/收起期间会加短暂锁，避免用户快速移入移出时动画状态和真实 hover 状态不同步。
 */
export const useAdPlacementFloatingGroup = (
    items: FloatingCardAdPlacement[],
    onRemove: (id: number) => void,
): UseAdPlacementFloatingGroupResult => {
    const [expanded, setExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const expandedRef = useRef(expanded);
    const transitionLockedRef = useRef(false);
    const transitionTimerRef = useRef<number | null>(null);
    const navigate = useAdPlacementNavigation();

    useEffect(() => {
        expandedRef.current = expanded;
    }, [expanded]);

    useEffect(() => {
        return () => {
            if (transitionTimerRef.current) {
                window.clearTimeout(transitionTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        setActiveIndex((index) => Math.min(index, Math.max(items.length - 1, 0)));
    }, [items.length]);

    useEffect(() => {
        if (items.length > 1 || !expandedRef.current) return;

        expandedRef.current = false;
        setExpanded(false);
    }, [items.length]);

    useEffect(() => {
        if (expanded || items.length <= 1) return;

        // 收起态只露出一张卡片，多张广告自动轮播以保证曝光。
        const timer = window.setInterval(() => {
            setActiveIndex((index) => (index + 1) % items.length);
        }, FLOATING_CARD_AUTOPLAY_INTERVAL);

        return () => window.clearInterval(timer);
    }, [expanded, items.length]);

    const startExpandedTransition = (nextExpanded: boolean): void => {
        if (items.length <= 1) return;
        if (nextExpanded === expandedRef.current) return;

        // 展开/收起动画期间锁定 hover 切换，动画结束后再同步真实 hover 状态。
        transitionLockedRef.current = true;
        expandedRef.current = nextExpanded;
        setExpanded(nextExpanded);

        if (transitionTimerRef.current) {
            window.clearTimeout(transitionTimerRef.current);
        }

        transitionTimerRef.current = window.setTimeout(() => {
            transitionLockedRef.current = false;
            const shouldExpand = containerRef.current?.matches(':hover') ?? false;
            if (shouldExpand !== expandedRef.current) {
                startExpandedTransition(shouldExpand);
            }
        }, FLOATING_CARD_TRANSITION_DURATION);
    };

    const handleCardClick = (item: FloatingCardAdPlacement): void => {
        if (item.data.jump_type !== AdPlacementJumpType.None) {
            navigate(item);
        }
        onRemove(item.id);
    };

    const handleHoverChange = (nextExpanded: boolean): void => {
        if (items.length <= 1) return;
        if (transitionLockedRef.current) return;
        startExpandedTransition(nextExpanded);
    };

    return {
        activeIndex,
        containerRef,
        expanded,
        handleCardClick,
        handleHoverChange,
        setActiveIndex,
    };
};
