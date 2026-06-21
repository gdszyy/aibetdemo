'use client';

import type * as React from 'react';
import { cn } from '@/utils/common';

interface ProgressProps {
    value: number;
    className?: string;
    max?: number;
}

export const Progress: React.FC<ProgressProps> = ({ value, className, max = 100 }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div
            className={cn('relative h-[2px] w-full overflow-hidden rounded-full bg-filltext-ft-c', className)}
            role="progressbar"
        >
            <div
                className="h-full bg-brand-red transition-all duration-300 ease-in-out"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};
