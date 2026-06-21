'use client';

import type { ComponentProps, FunctionComponent } from 'react';
import { useSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { cn } from '@/utils/common';
import { LogoInvert } from '../icons2/LogoInvert';
import { LogoLong } from '../icons2/LogoLong';
import { LogoLongH5 } from '../icons2/LogoLongH5';
import { LogoShort } from '../icons2/LogoShort';
import { LogoSingle } from '../icons2/LogoSingle';

const BetanoWordmark: FunctionComponent<
    {
        compact?: boolean;
        className?: string;
    } & ComponentProps<typeof LogoLong>
> = ({ compact = false, className, color: _color, ...props }) => {
    if (compact) {
        return (
            <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                className={className}
                {...props}
            >
                <rect width="48" height="48" rx="10" fill="currentColor" />
                <text
                    x="24"
                    y="32"
                    textAnchor="middle"
                    fontFamily="var(--font-rowdies), var(--font-poppins), sans-serif"
                    fontSize="30"
                    fontStyle="italic"
                    fontWeight="700"
                    fill="#ffffff"
                >
                    B
                </text>
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 132 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            className={className}
            {...props}
        >
            <path d="M13 10H47L41 18H7L13 10Z" fill="currentColor" opacity="0.9" />
            <text
                x="20"
                y="29"
                fontFamily="var(--font-rowdies), var(--font-poppins), sans-serif"
                fontSize="28"
                fontStyle="italic"
                fontWeight="700"
                letterSpacing="0"
                fill="currentColor"
            >
                Betano
            </text>
        </svg>
    );
};

export const Logo: FunctionComponent<
    {
        variant: 'long' | 'short' | 'single' | 'invert' | 'top';
        className?: string;
        wrapperClassName?: string;
    } & ComponentProps<typeof LogoLong>
> = ({ variant = 'long', className, wrapperClassName, ...props }) => {
    const schemeMeta = useSchemeMeta();

    if (schemeMeta.brand === 'betano') {
        if (variant === 'single') {
            return (
                <div className={cn('p-4 rounded-md bg-brand-primary-0', wrapperClassName)}>
                    <BetanoWordmark
                        compact
                        className={cn('text-brand-primary-0 aspect-square w-12', className)}
                        {...props}
                    />
                </div>
            );
        }

        return (
            <BetanoWordmark
                className={cn(
                    variant === 'top'
                        ? 'text-white aspect-[132/40] w-32.5'
                        : 'text-brand-primary-0 aspect-[132/40] w-33',
                    className,
                )}
                {...props}
            />
        );
    }

    if (variant === 'long' || !variant) {
        return <LogoLong className={cn('text-brand-primary-0 aspect-[124/17.24] w-31', className)} {...props} />;
    }

    if (variant === 'short') {
        return <LogoShort className={cn('text-brand-primary-0 aspect-[73.4/17.2] w-18.5', className)} {...props} />;
    }

    if (variant === 'invert') {
        return <LogoInvert className={cn('text-brand-primary-0 aspect-180/26 w-45', className)} {...props} />;
    }

    if (variant === 'top') {
        return <LogoLongH5 className={cn('text-brand-primary-0 aspect-[130/37] w-32.5', className)} {...props} />;
    }

    if (variant === 'single') {
        return (
            <div className={cn('p-4 rounded-md bg-brand-primary-0', wrapperClassName)}>
                <LogoSingle className={cn('text-neutral-white-h aspect-square w-12', className)} {...props} />
            </div>
        );
    }

    return null;
};
