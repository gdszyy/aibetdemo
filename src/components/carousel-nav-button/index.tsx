import type { ComponentProps, FunctionComponent } from 'react';
import { cn } from '@/utils/common';
import { Arrow } from '../Arrow';

const NavButton: FunctionComponent<{
    className?: string;
    position: 'left' | 'right';
    show: boolean;
    onClick?: () => void;
    variant?: 'default' | 'compact';
}> = ({ className, position, show, onClick, variant = 'default' }) => {
    const isLeft = position === 'left';

    const isVariantDefault = variant === 'default';
    const isVariantCompact = variant === 'compact';

    return (
        <div
            className={cn(
                'transition-all duration-200',
                'size-[30px] inline-flex justify-center items-center bg-surface-1',
                isVariantDefault && 'rounded-full',
                isVariantCompact && 'rounded-sm',
                show
                    ? 'cursor-pointer text-filltext-ft-e hover:text-filltext-ft-g'
                    : 'cursor-not-allowed text-filltext-ft-d',
                className,
            )}
            onClick={onClick}
        >
            <Arrow className={cn('size-3', show ? 'active:scale-95 ' : '')} direction={isLeft ? 'left' : 'right'} />
        </div>
    );
};

type NavButtonProps = ComponentProps<typeof NavButton>;

/** 滚动 左右按钮 */
export const CarouselNavButton: FunctionComponent<{
    canScrollPrev: boolean;
    canScrollNext: boolean;
    className?: string;
    onPrevClick: () => void;
    onNextClick: () => void;
    variant?: NavButtonProps['variant'];
}> = ({ canScrollPrev, canScrollNext, className, onPrevClick, onNextClick, variant }) => {
    return (
        <div className="inline-flex items-center gap-x-1">
            <NavButton
                className={className}
                position="left"
                show={canScrollPrev}
                onClick={onPrevClick}
                variant={variant}
            />
            <NavButton
                className={className}
                position="right"
                show={canScrollNext}
                onClick={onNextClick}
                variant={variant}
            />
        </div>
    );
};
