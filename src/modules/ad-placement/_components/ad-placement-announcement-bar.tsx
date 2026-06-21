'use client';

import type { CSSProperties, FC } from 'react';
import { NoticeIcon } from '@/components/icons';
import { cn } from '@/utils/common';
import { useAdPlacementAnnouncementBar } from '../_hooks/use-ad-placement-announcement-bar';
import { useAdPlacementNavigation } from '../_hooks/use-ad-placement-navigation';
import styles from './ad-placement-announcement-bar.module.css';
import { AdPlacementAnnouncementItem } from './ad-placement-announcement-item';

interface AdPlacementAnnouncementBarProps {
    className?: string;
}

/**
 * 顶部公告广告条。
 *
 * 从常驻广告配置中读取 TopAnnouncement，并根据 hook 返回的测量结果决定是否启用跑马灯。
 * 鼠标悬停或触摸按住时暂停动画，方便用户阅读长文案。
 */
export const AdPlacementAnnouncementBar: FC<AdPlacementAnnouncementBarProps> = ({ className }) => {
    const navigate = useAdPlacementNavigation();
    const {
        announcements,
        activeAnnouncementIndex,
        canStartMarquee,
        markMarqueeComplete,
        paused,
        setPaused,
        marqueeStyle,
        shouldMarquee,
        shouldVerticalCarousel,
        marqueeViewportRef,
        marqueeTextRef,
    } = useAdPlacementAnnouncementBar();

    if (announcements.length === 0) return null;

    return (
        <div
            className={cn(
                'flex h-10 min-w-0 items-center gap-2 overflow-hidden rounded-full bg-neutral-white-e px-3',
                className,
            )}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
            onTouchCancel={() => setPaused(false)}
        >
            <NoticeIcon className="size-5 shrink-0 text-filltext-ft-g" />

            {shouldVerticalCarousel ? (
                <div ref={marqueeViewportRef} className="h-full min-w-0 flex-1 overflow-hidden">
                    <div
                        style={{ transform: `translateY(-${activeAnnouncementIndex * 100}%)` }}
                        className={cn(styles.verticalTrack, 'flex h-full min-w-0 flex-col')}
                    >
                        {announcements.map((item, index) => {
                            const isActive = index === activeAnnouncementIndex;
                            const shouldRunMarquee = isActive && shouldMarquee && canStartMarquee;

                            return (
                                <div
                                    key={item.id}
                                    data-active={isActive}
                                    className={cn(styles.verticalItem, 'flex h-full min-w-0 shrink-0 items-center')}
                                >
                                    <div
                                        ref={isActive ? marqueeTextRef : undefined}
                                        style={isActive ? (marqueeStyle as CSSProperties) : undefined}
                                        className={cn(
                                            'min-w-0 max-w-full',
                                            shouldRunMarquee
                                                ? cn(styles.marqueeOnce, 'relative w-max max-w-none')
                                                : 'truncate',
                                            paused && styles.paused,
                                        )}
                                        onAnimationEnd={shouldRunMarquee ? markMarqueeComplete : undefined}
                                    >
                                        <AdPlacementAnnouncementItem
                                            item={item}
                                            onNavigate={navigate}
                                            truncate={!shouldRunMarquee}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div ref={marqueeViewportRef} className="min-w-0 flex-1 overflow-hidden">
                    <div
                        ref={marqueeTextRef}
                        style={marqueeStyle as CSSProperties}
                        className={cn(
                            'flex min-w-0 max-w-full items-center gap-12 whitespace-nowrap',
                            shouldMarquee ? cn(styles.marquee, 'relative w-max') : 'truncate',
                            paused && styles.paused,
                        )}
                    >
                        {announcements.map((item) => (
                            <AdPlacementAnnouncementItem key={item.id} item={item} onNavigate={navigate} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
