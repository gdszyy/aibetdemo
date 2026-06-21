import type { CSSProperties } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AdPlacementType, type TopAnnouncementAdPlacement } from '@/api/models/ad-placement';
import { useAdPlacements } from './use-ad-placements';

const MARQUEE_SPEED = 48; // px/s
const ANNOUNCEMENT_ROTATION_INTERVAL = 4000;
const VERTICAL_TRANSITION_DURATION = 240;
const MARQUEE_START_DELAY = 1000;
const MARQUEE_END_DELAY = 1000;

/**
 * 顶部公告条数据与轮播状态。
 *
 * 公告条从常驻广告配置中筛选 TopAnnouncement。多条公告时垂直轮播；
 * 单条文案宽度超过容器时启用 CSS 跑马灯；鼠标/触摸按住时暂停动画。
 */
export const useAdPlacementAnnouncementBar = () => {
    const [paused, setPaused] = useState(false);
    const [marqueeStyle, setMarqueeStyle] = useState<CSSProperties>({});
    const [shouldMarquee, setShouldMarquee] = useState(false);
    const [startedMarqueeKey, setStartedMarqueeKey] = useState<string | null>(null);
    const [completedMarqueeKey, setCompletedMarqueeKey] = useState<string | null>(null);
    const [activeAnnouncementIndex, setActiveAnnouncementIndex] = useState(0);
    const [activeAnnouncementCycle, setActiveAnnouncementCycle] = useState(0);

    const marqueeViewportRef = useRef<HTMLDivElement>(null);
    const marqueeTextRef = useRef<HTMLDivElement>(null);

    const { data = [] } = useAdPlacements({
        types: [AdPlacementType.TopAnnouncement],
    });

    const announcements = useMemo(
        () =>
            data.filter(
                (item): item is TopAnnouncementAdPlacement => item.activity_type === AdPlacementType.TopAnnouncement,
            ),
        [data],
    );

    const shouldVerticalCarousel = announcements.length > 1;
    const normalizedActiveAnnouncementIndex =
        announcements.length > 0 ? activeAnnouncementIndex % announcements.length : 0;
    const activeAnnouncement = announcements[normalizedActiveAnnouncementIndex];
    const activeAnnouncementId = activeAnnouncement?.id;
    const activeMarqueeKey =
        activeAnnouncementId && shouldVerticalCarousel && shouldMarquee
            ? `${activeAnnouncementId}:${activeAnnouncementCycle}`
            : null;
    const activeRotationKey =
        activeAnnouncementId && shouldVerticalCarousel && !shouldMarquee
            ? `${activeAnnouncementId}:${activeAnnouncementCycle}`
            : null;
    const canStartMarquee = startedMarqueeKey === activeMarqueeKey;
    const marqueeCompleted = completedMarqueeKey === activeMarqueeKey;

    const advanceAnnouncement = useCallback(() => {
        if (announcements.length === 0) return;

        setActiveAnnouncementIndex((currentIndex) => (currentIndex + 1) % announcements.length);
        setActiveAnnouncementCycle((currentCycle) => currentCycle + 1);
    }, [announcements.length]);

    const markMarqueeComplete = useCallback(() => {
        if (!activeMarqueeKey) return;

        setCompletedMarqueeKey(activeMarqueeKey);
    }, [activeMarqueeKey]);

    useEffect(() => {
        if (!activeMarqueeKey || paused || canStartMarquee) return;

        const timer = window.setTimeout(
            () => setStartedMarqueeKey(activeMarqueeKey),
            VERTICAL_TRANSITION_DURATION + MARQUEE_START_DELAY,
        );

        return () => window.clearTimeout(timer);
    }, [activeMarqueeKey, canStartMarquee, paused]);

    useEffect(() => {
        if (!marqueeCompleted || paused) return;

        const timer = window.setTimeout(advanceAnnouncement, MARQUEE_END_DELAY);

        return () => window.clearTimeout(timer);
    }, [advanceAnnouncement, marqueeCompleted, paused]);

    useEffect(() => {
        if (!activeRotationKey || paused) return;

        const timer = window.setTimeout(advanceAnnouncement, ANNOUNCEMENT_ROTATION_INTERVAL);

        return () => window.clearTimeout(timer);
    }, [activeRotationKey, advanceAnnouncement, paused]);

    useLayoutEffect(() => {
        const viewport = marqueeViewportRef.current;
        if (!viewport || (shouldVerticalCarousel && !activeAnnouncement)) return;

        const updateMarquee = () => {
            const text = marqueeTextRef.current;
            if (!text) {
                setMarqueeStyle({});
                return;
            }

            const viewportWidth = viewport.clientWidth;
            const textWidth = text.scrollWidth;
            const scrollDistance = shouldVerticalCarousel ? textWidth - viewportWidth : textWidth + viewportWidth;
            const nextShouldMarquee = textWidth > viewportWidth;
            setShouldMarquee(nextShouldMarquee);

            if (!nextShouldMarquee) {
                setMarqueeStyle({});
                return;
            }

            // 使用实际文本宽度计算滚动距离和时长，避免不同语言长度下速度忽快忽慢。
            setMarqueeStyle({
                //@ts-expect-error - CSSProperties does not recognize custom properties, but they are valid for styling
                '--ad-placement-marquee-left': shouldVerticalCarousel ? '0px' : `${viewportWidth}px`,
                '--ad-placement-marquee-distance': `${scrollDistance}px`,
                '--ad-placement-marquee-duration': `${Math.max(scrollDistance / MARQUEE_SPEED, 3)}s`,
            });
        };

        updateMarquee();

        // 文案、语言或容器尺寸变化都需要重新计算跑马灯参数。
        const observer = new ResizeObserver(updateMarquee);
        observer.observe(viewport);

        const text = marqueeTextRef.current;
        if (text) observer.observe(text);

        return () => observer.disconnect();
    }, [activeAnnouncement, shouldVerticalCarousel]);

    return {
        announcements,
        activeAnnouncementIndex: normalizedActiveAnnouncementIndex,
        canStartMarquee,
        markMarqueeComplete,
        paused,
        setPaused,
        marqueeStyle,
        shouldMarquee,
        shouldVerticalCarousel,
        marqueeViewportRef,
        marqueeTextRef,
    };
};
