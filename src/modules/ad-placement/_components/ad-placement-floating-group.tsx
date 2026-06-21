'use client';

import type { FC, MouseEvent } from 'react';
import type { FloatingCardAdPlacement } from '@/api/models/ad-placement';
import { cn } from '@/utils/common';
import { useAdPlacementFloatingGroup } from '../_hooks/use-ad-placement-floating-group';
import { AdPlacementFloatingCard } from './ad-placement-floating-card';
import { AdPlacementFloatingCarousel } from './ad-placement-floating-carousel';

const FLOATING_CARD_HEIGHT = 76;
const FLOATING_CARD_GAP = 8;
const FLOATING_CARD_STEP = FLOATING_CARD_HEIGHT + FLOATING_CARD_GAP;

interface AdPlacementFloatingGroupProps {
    items: FloatingCardAdPlacement[];
    onRemove: (id: number) => void;
}

/**
 * 桌面端右下角悬浮广告容器。
 *
 * 收起态展示 AdPlacementFloatingCarousel，节省页面空间并轮播多张广告；
 * hover 展开后保持底部卡片原位，其他卡片向上展开并允许逐个关闭。
 */
export const AdPlacementFloatingGroup: FC<AdPlacementFloatingGroupProps> = ({ items, onRemove }) => {
    const { activeIndex, containerRef, expanded, handleCardClick, handleHoverChange, setActiveIndex } =
        useAdPlacementFloatingGroup(items, onRemove);

    const handleRemove = (event: MouseEvent<HTMLButtonElement>, id: number): void => {
        // 关闭按钮位于可点击卡片内部，需要阻止冒泡，避免关闭时同时触发广告跳转。
        event.stopPropagation();
        onRemove(id);
    };

    if (items.length === 0) return null;

    const canExpand = items.length > 1;
    const anchorItem = items[activeIndex] ?? items[0];
    const expandedItems = items.filter((item) => item.id !== anchorItem.id);
    const hoverBridgeHeight = expandedItems.length * FLOATING_CARD_STEP;

    return (
        <div
            ref={containerRef}
            className="fixed right-16 bottom-25 z-50 hidden w-50 flex-col items-end md:flex"
            onMouseEnter={canExpand ? () => handleHoverChange(true) : undefined}
            onMouseLeave={canExpand ? () => handleHoverChange(false) : undefined}
        >
            {canExpand && expanded && (
                <div className="absolute right-0 bottom-full w-full" style={{ height: hoverBridgeHeight }} />
            )}

            {canExpand && (
                <div
                    className={cn(
                        'absolute right-0 bottom-0 z-10 w-full',
                        expanded ? 'pointer-events-auto' : 'pointer-events-none',
                    )}
                >
                    {expandedItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="absolute right-0 bottom-0 w-full rounded-sm shadow-[0px_10px_16px_0px_#2E2E2E66] transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                            style={{
                                transform: expanded ? `translateY(-${(index + 1) * FLOATING_CARD_STEP}px)` : 'none',
                                zIndex: expandedItems.length - index,
                            }}
                        >
                            <AdPlacementFloatingCard item={item} onClick={handleCardClick} onRemove={handleRemove} />
                        </div>
                    ))}
                </div>
            )}

            <div className="relative z-20 w-full origin-center rounded-sm shadow-[0px_10px_16px_0px_#2E2E2E66]">
                <AdPlacementFloatingCarousel
                    items={items}
                    activeIndex={activeIndex}
                    showIndicators={!expanded}
                    onSelectIndex={setActiveIndex}
                    onClick={handleCardClick}
                    onRemove={handleRemove}
                />
            </div>
        </div>
    );
};
