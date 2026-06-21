'use client';

import type { FC, MouseEvent } from 'react';
import type { FloatingCardAdPlacement } from '@/api/models/ad-placement';
import { cn } from '@/utils/common';
import { AdPlacementFloatingCard } from './ad-placement-floating-card';

interface AdPlacementFloatingStackProps {
    items: FloatingCardAdPlacement[];
    className?: string;
    onClick: (item: FloatingCardAdPlacement) => void;
    onRemove: (event: MouseEvent<HTMLButtonElement>, id: number) => void;
}

/**
 * 悬浮广告展开态卡片列表。
 *
 * 按传入顺序展示卡片，具体的点击跳转和关闭行为继续复用单卡片组件。
 */
export const AdPlacementFloatingStack: FC<AdPlacementFloatingStackProps> = ({
    items,
    className,
    onClick,
    onRemove,
}) => {
    return (
        <div className={cn('flex flex-col gap-2 py-1', className)}>
            {items.map((item) => (
                <AdPlacementFloatingCard key={item.id} item={item} onClick={onClick} onRemove={onRemove} />
            ))}
        </div>
    );
};
