'use client';

import type { FC } from 'react';

interface CasinoHomeSkeletonProps {
    /** 骨架分组数量 */
    sectionCount?: number;
    /** 每个分组展示的卡片数量 */
    cardCount?: number;
}

/**
 * 赌场大厅列表骨架屏
 * 用于大厅数据加载中，占位当前游戏分组与卡片布局。
 */
export const CasinoHomeSkeleton: FC<CasinoHomeSkeletonProps> = ({ sectionCount = 3, cardCount = 6 }) => {
    const sections = Array.from({ length: sectionCount }, (_, index) => `casino-home-skeleton-section-${index + 1}`);
    const cards = Array.from({ length: cardCount }, (_, index) => `casino-home-skeleton-card-${index + 1}`);

    return (
        <div className="flex flex-col gap-4 md:gap-8">
            {sections.map((sectionKey) => (
                <section key={sectionKey} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-7 animate-skeleton-pulse rounded-full bg-filltext-ft-a" />
                            <div className="h-5 w-28 animate-skeleton-pulse rounded-xs bg-filltext-ft-a" />
                        </div>
                        <div className="hidden items-center gap-1 md:flex">
                            <div className="size-7 animate-skeleton-pulse rounded-full bg-filltext-ft-a" />
                            <div className="size-7 animate-skeleton-pulse rounded-full bg-filltext-ft-a" />
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-hidden">
                        {cards.map((cardKey) => (
                            <div key={`${sectionKey}-${cardKey}`} className="w-[135px] shrink-0 pt-2">
                                <div className="flex flex-col gap-1">
                                    <div className="aspect-[135/160] animate-skeleton-pulse rounded-sm bg-filltext-ft-a" />
                                    <div className="h-4 w-24 animate-skeleton-pulse rounded-xs bg-filltext-ft-a" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};
