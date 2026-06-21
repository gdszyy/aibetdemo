'use client';

import type { FC } from 'react';
import { IconButton, type IconButtonSize } from '@/components/icon-button';
import { ArrowLeft, ArrowRight } from '@/components/icons';
import { cn } from '@/utils/common';

// ─── Map legacy variant names to IconButton size ───────────────────

type CarouselButtonVariant = 'default' | 'compact' | 'mini';

const VARIANT_TO_SIZE: Record<CarouselButtonVariant, IconButtonSize> = {
    mini: 'xs', // 24px
    compact: 'sm', // 32px
    default: 'lg', // 40px
};

const ICON_SIZE_OVERRIDE: Record<CarouselButtonVariant, string> = {
    mini: 'size-2.5',
    compact: 'size-3',
    default: 'size-3',
};

// ─── Inline Nav (buttons sit next to content) ──────────────────────

interface CarouselInlineNavProps {
    canScrollPrev: boolean;
    canScrollNext: boolean;
    onPrev: () => void;
    onNext: () => void;
    className?: string;
    buttonClassName?: string;
    iconClassName?: string;
    buttonVariant?: CarouselButtonVariant;
}

/** 滚动的左右按钮 */
export const CarouselInlineNav: FC<CarouselInlineNavProps> = ({
    canScrollPrev,
    canScrollNext,
    onPrev,
    onNext,
    className,
    buttonClassName,
    iconClassName,
    buttonVariant = 'default',
}) => {
    const size = VARIANT_TO_SIZE[buttonVariant];
    const iconOverride = ICON_SIZE_OVERRIDE[buttonVariant];

    return (
        <div className={cn('flex shrink-0 items-center gap-1', className)}>
            {canScrollPrev && (
                <IconButton
                    icon={ArrowLeft}
                    size={size}
                    variant="solid"
                    disabled={!canScrollPrev}
                    iconClassName={cn(iconOverride, iconClassName)}
                    className={buttonClassName}
                    onClick={onPrev}
                />
            )}
            {canScrollNext && (
                <IconButton
                    icon={ArrowRight}
                    size={size}
                    variant="solid"
                    disabled={!canScrollNext}
                    iconClassName={cn(iconOverride, iconClassName)}
                    className={buttonClassName}
                    onClick={onNext}
                />
            )}
        </div>
    );
};

// ─── Overlay Nav (buttons float over content) ──────────────────────

interface CarouselOverlayNavProps {
    canScrollPrev: boolean;
    canScrollNext: boolean;
    onPrev: () => void;
    onNext: () => void;
    prevClassName?: string;
    nextClassName?: string;
    buttonClassName?: string;
    iconClassName?: string;
    buttonVariant?: CarouselButtonVariant;
    showOnHover?: boolean;
}

/** 滚动的悬浮遮罩和按钮 */
export const CarouselOverlayNav: FC<CarouselOverlayNavProps> = ({
    canScrollPrev,
    canScrollNext,
    onPrev,
    onNext,
    prevClassName,
    nextClassName,
    buttonClassName,
    iconClassName,
    buttonVariant = 'default',
    showOnHover = true,
}) => {
    if (!canScrollPrev && !canScrollNext) {
        return null;
    }

    const size = VARIANT_TO_SIZE[buttonVariant];
    const iconOverride = ICON_SIZE_OVERRIDE[buttonVariant];

    const hoverVisibilityClass = showOnHover
        ? 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'
        : undefined;

    return (
        <>
            {canScrollPrev && (
                <IconButton
                    icon={ArrowLeft}
                    size={size}
                    variant="solid"
                    iconClassName={cn(iconOverride, iconClassName)}
                    className={cn(
                        'absolute z-10 -translate-y-1/2',
                        hoverVisibilityClass,
                        buttonClassName,
                        prevClassName,
                    )}
                    onClick={onPrev}
                />
            )}
            {canScrollNext && (
                <IconButton
                    icon={ArrowRight}
                    size={size}
                    variant="solid"
                    iconClassName={cn(iconOverride, iconClassName)}
                    className={cn(
                        'absolute z-10 -translate-y-1/2',
                        hoverVisibilityClass,
                        buttonClassName,
                        nextClassName,
                    )}
                    onClick={onNext}
                />
            )}
        </>
    );
};
