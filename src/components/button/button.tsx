'use client';

import { cva } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '@/utils/common';
import { Loading, type LoadingVariant } from '../loading/loading';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

const buttonVariants = cva(
    'w-fit inline-flex items-center justify-center gap-2 rounded text-body-lg px-3 py-2.75 whitespace-nowrap cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-func-void ',
    {
        variants: {
            variant: {
                primary:
                    'bg-brand-red text-neutral-white-h hover:bg-brand-primary-4 disabled:bg-func-void disabled:text-neutral-white-h',
                secondary: 'bg-filltext-ft-b text-filltext-ft-e disabled:text-func-void',
                outline: 'py-[11px] bg-surface-1 border border-brand-red text-brand-red disabled:border-func-void',
                text: 'text-filltext-ft-e disabled:text-func-void',
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    },
);

const loadingVariant = (variant: ButtonVariant): LoadingVariant => {
    switch (variant) {
        case 'primary':
            return 'color-white';
        case 'outline':
            return 'color-red';
        default:
            return 'color-gray';
    }
};

interface ButtonProps {
    variant?: ButtonVariant;
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
    /** Option to stretch button width to its parent's width */
    block?: boolean;
    className?: string;
    disabled?: boolean;
    /** Loading state — button is disabled when loading */
    loading?: boolean;
    icon?: React.ReactNode;
    onClick?: () => void;
}
/**
 * Shared button component
 * @returns
 */
export const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
    children,
    variant = 'primary',
    type = 'button',
    onClick,
    disabled,
    loading,
    className,
    icon,
    block,
}) => {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            className={cn(
                buttonVariants({ variant }),
                className,
                block && 'w-full',
                loading && 'pointer-events-none cursor-not-allowed ',
            )}
            onClick={() => {
                !isDisabled && onClick?.();
            }}
            disabled={disabled}
        >
            {loading ? (
                <Loading className="size-4" variant={loadingVariant(variant)} />
            ) : (
                <>
                    {Boolean(icon) && icon}
                    {typeof children === 'string' ? <span key="string_button">{children}</span> : children}
                </>
            )}
        </button>
    );
};
