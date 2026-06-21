import {
    type PointerEvent as ReactPointerEvent,
    type RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import type { RewardTrackItem } from '../../../constants';

interface UseProgressViewParams {
    /** 用户当前通行证等级 */
    currentLevel: number;
    /** 奖励轨道数据，用于定位当前等级对应的卡片 */
    rewardTracks: RewardTrackItem[];
}

interface UseProgressViewResult {
    /** 奖励轨道横向滚动容器 */
    scrollContainerRef: RefObject<HTMLDivElement | null>;
    /** 底部自定义滚动条轨道 */
    scrollbarTrackRef: RefObject<HTMLDivElement | null>;
    /** 当前等级对应的奖励节点 */
    currentLevelItemRef: RefObject<HTMLDivElement | null>;
    /** 底部滚动条滑块宽度百分比 */
    scrollbarThumbWidthPercent: number;
    /** 底部滚动条滑块左侧偏移百分比 */
    scrollbarThumbLeftPercent: number;
    /** 是否正在拖拽底部滚动条 */
    isDraggingScrollbar: boolean;
    /** 是否展示左侧当前等级提示 */
    showCurrentLevel: boolean;
    /** 是否展示回到当前等级按钮 */
    showBackToCurrentLevel: boolean;
    /** 当前奖励轨道中匹配到的等级 */
    currentTrackLevel: number | null;
    /** 将当前等级滚动回可视区域起始位置 */
    handleBackToCurrentLevel: () => void;
    /** 点击或拖拽底部滚动条时同步奖励轨道滚动位置 */
    handleScrollbarPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
}

interface ScrollbarDragState {
    /** 本次拖拽的 pointer 标识 */
    pointerId: number;
    /** 按下时 pointer 相对滑块左侧的偏移像素 */
    thumbOffsetX: number;
}

/**
 * 管理 ProgressView 的横向滚动状态：
 * - 计算当前等级对应的轨道节点
 * - 同步底部滚动进度条
 * - 当当前等级被左侧固定区遮挡超过一半时，切换左侧等级提示
 * - 提供“回到当前等级”的滚动行为
 */
export const useProgressView = ({ currentLevel, rewardTracks }: UseProgressViewParams): UseProgressViewResult => {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const scrollbarTrackRef = useRef<HTMLDivElement | null>(null);
    const currentLevelItemRef = useRef<HTMLDivElement | null>(null);
    const hasAutoScrolledRef = useRef(false);
    const hasUserScrolledRef = useRef(false);
    const isBackToCurrentPendingRef = useRef(false);
    const scrollbarDragStateRef = useRef<ScrollbarDragState | null>(null);
    const [scrollbarThumbWidthPercent, setScrollbarThumbWidthPercent] = useState(100);
    const [scrollbarThumbLeftPercent, setScrollbarThumbLeftPercent] = useState(0);
    const [isDraggingScrollbar, setIsDraggingScrollbar] = useState(false);
    const [showCurrentLevel, setShowCurrentLevel] = useState(false);
    const [showBackToCurrentLevel, setShowBackToCurrentLevel] = useState(false);

    // 找到不超过当前用户等级的最后一个轨道等级，作为“当前等级”展示目标。
    const currentTrackLevel = rewardTracks.reduce<number | null>((matchedLevel, rewardTrack) => {
        if (rewardTrack.level > currentLevel) {
            return matchedLevel;
        }

        return rewardTrack.level;
    }, null);

    const syncScrollState = useCallback(() => {
        const container = scrollContainerRef.current;
        const currentLevelItem = currentLevelItemRef.current;
        if (!container) return;

        const { clientWidth, scrollLeft, scrollWidth } = container;
        if (scrollWidth <= 0 || clientWidth <= 0 || scrollWidth <= clientWidth) {
            setScrollbarThumbWidthPercent(100);
            setScrollbarThumbLeftPercent(0);
            setShowCurrentLevel(false);
            setShowBackToCurrentLevel(false);
            hasUserScrolledRef.current = false;
            isBackToCurrentPendingRef.current = false;
            return;
        }

        const maxScrollLeft = scrollWidth - clientWidth;
        const thumbWidthPercent = (clientWidth / scrollWidth) * 100;
        const thumbLeftPercent = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * (100 - thumbWidthPercent) : 0;
        setScrollbarThumbWidthPercent(thumbWidthPercent);
        setScrollbarThumbLeftPercent(thumbLeftPercent);

        if (!currentLevelItem) {
            setShowCurrentLevel(false);
            setShowBackToCurrentLevel(false);
            hasUserScrolledRef.current = false;
            isBackToCurrentPendingRef.current = false;
            return;
        }

        const containerRect = container.getBoundingClientRect();
        const currentLevelRect = currentLevelItem.getBoundingClientRect();
        const isCurrentLevelVisible =
            currentLevelRect.right > containerRect.left && currentLevelRect.left < containerRect.right;

        if (isBackToCurrentPendingRef.current) {
            if (isCurrentLevelVisible) {
                isBackToCurrentPendingRef.current = false;
            }

            setShowBackToCurrentLevel(false);
        } else if (!hasUserScrolledRef.current) {
            setShowBackToCurrentLevel(false);
        } else if (isCurrentLevelVisible) {
            setShowBackToCurrentLevel(false);
        } else if (!isCurrentLevelVisible) {
            setShowBackToCurrentLevel(true);
        }

        const hiddenWidth = Math.max(containerRect.left - currentLevelRect.left, 0);

        setShowCurrentLevel(hiddenWidth > currentLevelRect.width / 2);
    }, []);

    // 根据 pointer 在自定义滚动条轨道上的位置，换算奖励轨道的 scrollLeft。
    const updateScrollLeftByScrollbarPointer = useCallback(
        (clientX: number, thumbOffsetX: number): void => {
            const container = scrollContainerRef.current;
            const scrollbarTrack = scrollbarTrackRef.current;
            if (!container || !scrollbarTrack) return;

            const { clientWidth, scrollWidth } = container;
            const maxScrollLeft = scrollWidth - clientWidth;
            if (maxScrollLeft <= 0) return;

            const trackRect = scrollbarTrack.getBoundingClientRect();
            const thumbWidth = trackRect.width * (clientWidth / scrollWidth);
            const maxThumbLeft = trackRect.width - thumbWidth;
            if (maxThumbLeft <= 0) return;

            const nextThumbLeft = Math.min(Math.max(clientX - trackRect.left - thumbOffsetX, 0), maxThumbLeft);
            container.scrollLeft = (nextThumbLeft / maxThumbLeft) * maxScrollLeft;
            syncScrollState();
        },
        [syncScrollState],
    );

    const handleScrollbarPointerDown = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>): void => {
            const container = scrollContainerRef.current;
            const scrollbarTrack = scrollbarTrackRef.current;
            if (!container || !scrollbarTrack || container.scrollWidth <= container.clientWidth) return;

            event.preventDefault();
            hasUserScrolledRef.current = true;

            const trackRect = scrollbarTrack.getBoundingClientRect();
            const thumbWidth = trackRect.width * (container.clientWidth / container.scrollWidth);
            const thumbLeft = (scrollbarThumbLeftPercent / 100) * trackRect.width;
            const pointerOffsetInThumb = event.clientX - trackRect.left - thumbLeft;
            const isPointerInsideThumb = pointerOffsetInThumb >= 0 && pointerOffsetInThumb <= thumbWidth;
            const thumbOffsetX = isPointerInsideThumb ? pointerOffsetInThumb : thumbWidth / 2;

            scrollbarDragStateRef.current = {
                pointerId: event.pointerId,
                thumbOffsetX,
            };
            setIsDraggingScrollbar(true);
            event.currentTarget.setPointerCapture(event.pointerId);
            updateScrollLeftByScrollbarPointer(event.clientX, thumbOffsetX);
        },
        [scrollbarThumbLeftPercent, updateScrollLeftByScrollbarPointer],
    );

    useEffect(() => {
        const scrollbarTrack = scrollbarTrackRef.current;
        if (!scrollbarTrack) return;

        const handlePointerMove = (event: PointerEvent): void => {
            const dragState = scrollbarDragStateRef.current;
            if (!dragState || dragState.pointerId !== event.pointerId) return;

            updateScrollLeftByScrollbarPointer(event.clientX, dragState.thumbOffsetX);
        };

        const handlePointerEnd = (event: PointerEvent): void => {
            const dragState = scrollbarDragStateRef.current;
            if (!dragState || dragState.pointerId !== event.pointerId) return;

            scrollbarDragStateRef.current = null;
            setIsDraggingScrollbar(false);
            if (scrollbarTrack.hasPointerCapture(event.pointerId)) {
                scrollbarTrack.releasePointerCapture(event.pointerId);
            }
        };

        scrollbarTrack.addEventListener('pointermove', handlePointerMove);
        scrollbarTrack.addEventListener('pointerup', handlePointerEnd);
        scrollbarTrack.addEventListener('pointercancel', handlePointerEnd);

        return () => {
            scrollbarTrack.removeEventListener('pointermove', handlePointerMove);
            scrollbarTrack.removeEventListener('pointerup', handlePointerEnd);
            scrollbarTrack.removeEventListener('pointercancel', handlePointerEnd);
        };
    }, [updateScrollLeftByScrollbarPointer]);

    // 将当前等级卡片平滑滚动回可视区起始位置。
    const handleBackToCurrentLevel = useCallback(() => {
        const currentLevelItem = currentLevelItemRef.current;
        if (!currentLevelItem) return;

        isBackToCurrentPendingRef.current = true;
        setShowBackToCurrentLevel(false);
        currentLevelItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        syncScrollState();

        const handleScroll = () => {
            syncScrollState();
        };

        // 用户拖动横向内容时，允许后续根据当前位置显示“回到当前等级”。
        const handlePointerDown = (): void => {
            hasUserScrolledRef.current = true;
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        container.addEventListener('pointerdown', handlePointerDown, { passive: true });

        // 横向内容宽度变化时，重新计算滚动进度和当前等级遮挡状态。
        const resizeObserver = new ResizeObserver(() => {
            syncScrollState();
        });

        resizeObserver.observe(container);
        const content = container.firstElementChild;
        if (content instanceof HTMLElement) {
            resizeObserver.observe(content);
        }

        return () => {
            container.removeEventListener('scroll', handleScroll);
            container.removeEventListener('pointerdown', handlePointerDown);
            resizeObserver.disconnect();
        };
    }, [syncScrollState]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        /**
         * Windows 普通鼠标通常只产生纵向滚轮输入，这里将其映射为横向滚动；
         * 触控板或支持横向滚轮的设备若已有横向输入，则保留浏览器原生行为。
         */
        const handleWheel = (event: WheelEvent): void => {
            const isHorizontalWheel = Math.abs(event.deltaX) > Math.abs(event.deltaY);
            const canScrollHorizontally = container.scrollWidth > container.clientWidth;

            if (!canScrollHorizontally || (event.deltaX === 0 && event.deltaY === 0)) {
                return;
            }

            hasUserScrolledRef.current = true;

            if (isHorizontalWheel || event.deltaY === 0) {
                return;
            }

            event.preventDefault();
            container.scrollLeft += event.deltaY;
            syncScrollState();
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [syncScrollState]);

    useEffect(() => {
        if (currentTrackLevel === null) {
            setShowCurrentLevel(false);
            setShowBackToCurrentLevel(false);
            hasUserScrolledRef.current = false;
            return;
        }

        hasUserScrolledRef.current = false;
        // 当前等级变化后，立即同步一次显示状态，避免等待下一次滚动或 resize。
        syncScrollState();
    }, [currentTrackLevel, syncScrollState]);

    useEffect(() => {
        if (currentTrackLevel === null || hasAutoScrolledRef.current) {
            return;
        }

        const currentLevelItem = currentLevelItemRef.current;
        if (!currentLevelItem) {
            return;
        }

        hasAutoScrolledRef.current = true;

        // 首次进入页面时，自动将当前等级滚动到可视区域起始位置。
        requestAnimationFrame(() => {
            currentLevelItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            syncScrollState();
        });
    }, [currentTrackLevel, syncScrollState]);

    return {
        scrollContainerRef,
        scrollbarTrackRef,
        currentLevelItemRef,
        scrollbarThumbWidthPercent,
        scrollbarThumbLeftPercent,
        isDraggingScrollbar,
        showCurrentLevel,
        showBackToCurrentLevel,
        currentTrackLevel,
        handleBackToCurrentLevel,
        handleScrollbarPointerDown,
    };
};
