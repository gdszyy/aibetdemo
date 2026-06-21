import { type FC, useEffect, useState } from 'react';
import { cn } from '@/utils/common';

type Size = 'small' | 'medium';

interface ProgressBarProps {
    current: number;
    total: number;
    isHighLevel?: boolean;
    size?: Size;
}

/** 中等尺寸进度条组件 */
const ProgressMedium: FC<{ isHighLevel: boolean; safePercent: number }> = ({ isHighLevel, safePercent }) => {
    return (
        <div
            className={cn(
                'relative h-2.5 rounded-full shadow-[inset_0_0_4px_0_var(--filltext-ft-c)] bg-filltext-ft-a overflow-hidden',
            )}
        >
            {/* 进度 */}
            <div
                className={cn(
                    'absolute left-0 top-0 h-full rounded-full transition-all duration-300',
                    isHighLevel ? ' bg-[#00D492]' : 'bg-brand-primary-0',
                )}
                style={{ width: `${safePercent}%` }}
            />

            {/* 圆点 */}
            <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-surface-1 shadow"
                style={{ left: `calc(${safePercent}% - 9px)` }}
            />
        </div>
    );
};

/** 小尺寸进度条组件 */
const ProgressSmall: FC<{ isHighLevel: boolean; safePercent: number }> = ({ isHighLevel, safePercent }) => {
    return (
        <div
            className={cn(
                'relative h-2 rounded-full shadow-[inset_0_0_4px_0_var(--filltext-ft-c)] overflow-hidden',
                isHighLevel ? 'bg-filltext-ft-a' : 'bg-surface-1',
            )}
        >
            {/* 进度 */}
            <div
                className={cn(
                    'absolute left-px top-px h-1.5 rounded-full transition-all duration-300',
                    isHighLevel ? 'bg-[#00D492]' : 'bg-brand-primary-0',
                )}
                style={{ width: `calc(${safePercent}% - 2px)` }}
            />

            {/* 圆点 */}
            <div
                className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-surface-1 shadow"
                style={{ left: `calc(${safePercent}% - 6px)` }}
            />
        </div>
    );
};

const Progress: Record<Size, FC<{ isHighLevel: boolean; safePercent: number }>> = {
    medium: ProgressMedium,
    small: ProgressSmall,
};

/** 通行证：进度条组件 */
export const ProgressBar: FC<ProgressBarProps> = ({
    isHighLevel = false,
    size = 'medium',
    current: currentXP,
    total: totalXP,
}) => {
    const [safePercent, setSafePercent] = useState(0);

    useEffect(() => {
        if (totalXP === 0) return;
        const percent = (currentXP / totalXP) * 100;
        setSafePercent(Math.min(percent, 100));
    }, [currentXP, totalXP]);

    return Progress[size]({ isHighLevel, safePercent });
};
