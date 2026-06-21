'use client';

import type { ButtonHTMLAttributes, FC, SVGProps } from 'react';
import { cn } from '@/utils/common';

// ─── Size: button dimensions + icon dimensions ─────────────────────

const SIZE = {
    xxs: { button: 'size-6', icon: 'size-3' }, // 24px, icon 12px
    xs: { button: 'size-6', icon: 'size-3.5' }, // 24px, icon 14px
    sm: { button: 'size-8', icon: 'size-3.5' }, // 32px, icon 14px
    md: { button: 'size-9', icon: 'size-5' }, // 36px, icon 20px
    lg: { button: 'size-10', icon: 'size-5' }, // 40px, icon 20px
} as const;

// ─── Shape: border-radius per size ─────────────────────────────────

const SHAPE = {
    square: { xxs: 'rounded-xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-sm', lg: 'rounded-sm' },
    round: { xxs: 'rounded-full', xs: 'rounded-full', sm: 'rounded-full', md: 'rounded-full', lg: 'rounded-full' },
} as const;

// ─── Variant: background + hover behavior ──────────────────────────

const VARIANT = {
    solid: {
        base: 'bg-surface-1',
        hover: 'hover:text-filltext-ft-g',
    },
    subtle: {
        base: 'bg-filltext-ft-a',
        hover: 'hover:bg-filltext-ft-b hover:text-filltext-ft-g',
    },
    ghost: {
        base: '',
        hover: 'hover:bg-filltext-ft-b hover:text-filltext-ft-g',
    },
} as const;

// ─── Types ─────────────────────────────────────────────────────────

export type IconButtonSize = keyof typeof SIZE;
export type IconButtonShape = keyof typeof SHAPE;
export type IconButtonVariant = keyof typeof VARIANT;

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    /** Icon component (must accept className) */
    icon: FC<SVGProps<SVGSVGElement>>;
    /** 24 | 32 | 36 | 40 */
    size?: IconButtonSize;
    /** square = rounded rect, round = circle */
    shape?: IconButtonShape;
    /** solid = white bg, subtle = gray bg, ghost = transparent bg */
    variant?: IconButtonVariant;
    /** Red badge number (top-right corner) */
    badge?: number;
    /** Additional icon className */
    iconClassName?: string;
}

/**
 * Generic icon button following Figma spec:
 * - 4 sizes: xs(24) sm(32) md(36) lg(40)
 * - 2 shapes: square / round
 * - 3 variants: solid(white) / subtle(gray) / ghost(transparent)
 * - States: default → hover → disabled
 * - Optional red badge
 */
export const IconButton: FC<IconButtonProps> = ({
    icon: Icon,
    size = 'sm',
    shape = 'square',
    variant = 'solid',
    badge,
    disabled,
    className,
    iconClassName,
    ...props
}) => {
    const sizeConfig = SIZE[size];
    const shapeClass = SHAPE[shape][size];
    const variantConfig = VARIANT[variant];

    return (
        <button
            type="button"
            disabled={disabled}
            className={cn(
                'relative flex shrink-0 items-center justify-center transition-all duration-200',
                'text-filltext-ft-e',
                sizeConfig.button,
                shapeClass,
                variantConfig.base,
                disabled
                    ? 'cursor-default text-filltext-ft-d'
                    : cn('cursor-pointer active:scale-95', variantConfig.hover),
                className,
            )}
            {...props}
        >
            <Icon className={cn(sizeConfig.icon, iconClassName)} />
            {badge != null && badge > 0 && (
                <span className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-xs bg-brand-primary-0 text-[10px] font-semibold leading-none text-neutral-white-h">
                    {badge}
                </span>
            )}
        </button>
    );
};
