'use client';

import type { FC } from 'react';
import { cn } from '@/utils/common';

const TOTAL_SEGMENTS = 10;

interface SegmentedProgressProps {
    current: number;
    total: number;
}

export const SegmentedProgress: FC<SegmentedProgressProps> = ({ current, total }) => {
    const filled = total > 0 ? Math.min(Math.round((current / total) * TOTAL_SEGMENTS), TOTAL_SEGMENTS) : 0;

    return (
        <div className="flex gap-2 items-center">
            {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
                <div
                    key={i.toString()}
                    className={cn(
                        'h-2 flex-1 rounded-xs',
                        i < filled
                            ? 'bg-func-win shadow-card'
                            : 'bg-surface-1 shadow-[inset_0_0_3px_0_var(--filltext-ft-d)]',
                    )}
                />
            ))}
        </div>
    );
};
