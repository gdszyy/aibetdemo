import { type FunctionComponent, useMemo } from 'react';
import { cn } from '@/utils/common';

/** 滚动进度条 样式二 */
export const CarouselProgress2: FunctionComponent<{
    snapCount: number | undefined;
    selectedIndex: number;
    onClick?: (index: number) => void;
}> = ({ snapCount = 0, selectedIndex, onClick }) => {
    const datas = useMemo(() => {
        return Array.from({ length: snapCount });
    }, [snapCount]);

    return (
        <div className="flex items-center justify-center">
            {datas.map((_, index) => {
                const isSelected = selectedIndex === index;

                return (
                    <button
                        key={index.toString()}
                        type="button"
                        onClick={() => {
                            onClick?.(index);
                        }}
                        className={cn('inline-flex items-center justify-center p-1 cursor-pointer')}
                    >
                        <span
                            className={cn(
                                'transition-colors duration-200',
                                !isSelected && 'size-1.5 rounded-full bg-filltext-ft-d',
                                isSelected && 'w-3 h-1.5 rounded-full bg-filltext-ft-e',
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
};
