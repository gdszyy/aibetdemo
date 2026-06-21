'use client';

import type { FC, ReactNode } from 'react';
import { UI_CONSTANTS } from '@/constants/ui';
import { cn } from '@/utils/common';

interface StickyBlurHeaderProps {
    className?: string;
    innerClassName?: string;
    children: ReactNode;
    fullBleed?: boolean;
}

/**
 * Full-bleed sticky header with backdrop blur.
 *
 * Uses CSS container query units (cqi) to stretch the blur background
 * across the full width of the nearest @container ancestor,
 * while keeping inner content centered within max-w.
 */
export const StickyBlurHeader: FC<StickyBlurHeaderProps> = ({
    className,
    innerClassName,
    children,
    fullBleed = true,
}) => (
    <div
        className={cn(
            'sticky z-20 backdrop-blur-md',
            fullBleed ? 'w-[100cqi] ml-[calc(50%-50cqi)]' : 'w-full',
            UI_CONSTANTS.STICKY_TOP_CLASS,
            className,
        )}
    >
        <div className={cn(fullBleed ? 'max-w-(--main-content-max-width) mx-auto' : 'w-full', innerClassName)}>
            {children}
        </div>
    </div>
);
