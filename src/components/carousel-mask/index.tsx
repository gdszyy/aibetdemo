import type { FunctionComponent } from 'react';
import { cn } from '@/utils/common';

const Mask: FunctionComponent<{
    className?: string;
    position: 'left' | 'right';
    show: boolean;
    color?: string;
}> = ({ className, position, show, color = 'var(--filltext-ft-b)' }) => {
    const isLeft = position === 'left';
    const isRight = position === 'right';

    return (
        <div
            className={cn(
                'w-25 pointer-events-none absolute bottom-0 top-0',
                isLeft && 'left-0',
                isRight && 'right-0',
                show ? 'opacity-100' : 'opacity-0',
                className,
            )}
            style={{
                background: `linear-gradient(${isLeft ? -90 : isRight ? 90 : 0}deg, rgba(255, 255, 255, 0.00) 0%, ${color} 100%)`,
            }}
        />
    );
};

/** 滚动 遮罩 */
export const CarouselMask: FunctionComponent<{
    canScrollPrev: boolean;
    canScrollNext: boolean;
    className?: string;
}> = ({ canScrollPrev, canScrollNext, className }) => {
    return (
        <>
            <Mask className={className} position="left" show={canScrollPrev} />
            <Mask className={className} position="right" show={canScrollNext} />
        </>
    );
};
