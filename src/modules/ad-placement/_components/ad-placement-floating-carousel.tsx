'use client';

import type { FC, MouseEvent } from 'react';
import type { FloatingCardAdPlacement } from '@/api/models/ad-placement';
import { cn } from '@/utils/common';
import { AdPlacementFloatingCard } from './ad-placement-floating-card';

interface AdPlacementFloatingCarouselProps {
    items: FloatingCardAdPlacement[];
    activeIndex: number;
    showIndicators?: boolean;
    onSelectIndex: (index: number) => void;
    onClick: (item: FloatingCardAdPlacement) => void;
    onRemove: (event: MouseEvent<HTMLButtonElement>, id: number) => void;
}

/**
 * 悬浮广告收起态轮播。
 *
 * 通过 activeIndex 控制横向位移，自动轮播逻辑在 useAdPlacementFloatingGroup 中维护。
 * 这里仅负责渲染当前轨道和底部指示点，保持为受控展示组件。
 */
export const AdPlacementFloatingCarousel: FC<AdPlacementFloatingCarouselProps> = ({
    items,
    activeIndex,
    showIndicators = true,
    onSelectIndex,
    onClick,
    onRemove,
}) => {
    return (
        <div className="relative overflow-hidden rounded-sm">
            <div
                className="flex transition-transform duration-300"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
                {items.map((item) => (
                    <AdPlacementFloatingCard
                        key={item.id}
                        item={item}
                        className="w-full shrink-0"
                        onClick={onClick}
                        onRemove={onRemove}
                    />
                ))}
            </div>
            {showIndicators && items.length > 1 && (
                <div className="absolute bottom-2 left-3 z-20 flex gap-0.5">
                    {items.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            className={cn(
                                'h-0.5 w-0.5 rounded-full bg-surface-1 transition-all',
                                index === activeIndex && 'w-2 rounded-full bg-brand-primary-0',
                            )}
                            onClick={() => onSelectIndex(index)}
                            aria-label={`${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
