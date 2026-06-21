'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { ArrowRight } from '@/components/icons';
import { cn } from '@/utils/common';

const commonButtonVariants = cva(
    'inline-flex w-fit items-center justify-center gap-2 rounded-full border px-4 whitespace-nowrap transition-colors duration-200 cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                primary:
                    'border-filltext-ft-h bg-transparent text-filltext-ft-h hover:bg-brand-primary-0 hover:text-neutral-white-h',
                secondary:
                    'border-filltext-ft-f bg-transparent text-filltext-ft-f hover:bg-filltext-ft-h hover:text-neutral-white-h',
                secondarySpecial:
                    'border-white/55 text-neutral-white-h  bg-transparent  hover:bg-brand-primary-0 hover:text-neutral-white-h hover:border-brand-primary-0',
            },
            size: {
                small: 'h-10 text-body-lg',
                medium: 'h-8 text-auxiliary-sm',
                large: 'h-10 text-body-lg',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'medium',
        },
    },
);

interface CommonButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
        VariantProps<typeof commonButtonVariants> {
    children: ReactNode;
    icon?: boolean;
}

/**
 * VIP 模块通用按钮组件，支持主题色和尺寸切换。
 */
export const CommonButton: FC<CommonButtonProps> = ({
    children,
    className,
    icon,
    size,
    type = 'button',
    variant,
    ...props
}) => {
    return (
        <button type={type} className={cn(commonButtonVariants({ variant, size }), className)} {...props}>
            {/* 按钮文本内容 */}
            <span>{children}</span>

            {/* 按钮图标区域 */}
            {icon && <ArrowRight className="size-3" />}
        </button>
    );
};
