import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/utils/common';

/** 一种区块，样式见screenshot.png */
export const Block1: FunctionComponent<
    PropsWithChildren<{
        className?: string;
        title: ReactNode;
        titleRight?: ReactNode;
    }>
> = ({ children, className, title, titleRight }) => {
    return (
        <div className={cn('px-4 pb-4 rounded-sm bg-surface-1', className)}>
            <div className="h-12 flex items-center justify-between">
                <span className="text-title-lg text-neutral-white-g">{title}</span>
                {titleRight}
            </div>
            {children}
        </div>
    );
};
