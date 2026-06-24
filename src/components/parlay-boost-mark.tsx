'use client';

import type { FC } from 'react';
import { useSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { cn } from '@/utils/common';
import { ParlayBadge } from './parlay-badge';

interface ParlayBoostMarkProps {
    className?: string;
    innerClassName?: string;
}

export const ParlayBoostMark: FC<ParlayBoostMarkProps> = ({ className, innerClassName }) => {
    const { brand } = useSchemeMeta();

    if (brand === 'superbet') {
        return <ParlayBadge variant="icon" className={className} />;
    }

    if (brand === 'betano') {
        return (
            <span
                className={cn(
                    'inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-primary-0 text-on-brand',
                    className,
                )}
                aria-hidden
            >
                <span className={cn('text-auxiliary-xxs font-black leading-none', innerClassName)}>+</span>
            </span>
        );
    }

    return (
        <span
            className={cn(
                'inline-flex size-4 shrink-0 items-center justify-center rounded-[3px] bg-brand-primary-1 text-brand-primary-0 ring-1 ring-brand-primary-0/60',
                className,
            )}
            aria-hidden
        >
            <span className={cn('text-auxiliary-xxs font-black leading-none', innerClassName)}>+</span>
        </span>
    );
};
