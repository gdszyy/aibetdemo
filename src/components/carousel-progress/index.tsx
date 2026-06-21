'use client';

import { type FunctionComponent, useMemo } from 'react';
import { cn } from '@/utils/common';

/** 滚动进度条 样式一 */
export const CarouselProgress: FunctionComponent<{
    snapCount: number | undefined;
    selectedIndex: number;
    onClick?: (index: number) => void;
}> = ({ snapCount = 0, selectedIndex, onClick }) => {
    const datas = useMemo(() => {
        return Array.from({ length: snapCount });
    }, [snapCount]);

    return (
        <div className="flex items-center justify-center">
            {datas.map((_, index) => (
                <button
                    key={index.toString()}
                    type="button"
                    onClick={() => {
                        onClick?.(index);
                    }}
                    className="max-w-6 flex-1 h-5 px-1 flex items-center justify-center cursor-pointer"
                >
                    <span
                        className={cn(
                            'w-full h-0.5 rounded-full transition-colors',
                            selectedIndex === index ? 'bg-brand-primary-0' : 'bg-filltext-ft-d',
                        )}
                    />
                </button>
            ))}
        </div>
    );
};
