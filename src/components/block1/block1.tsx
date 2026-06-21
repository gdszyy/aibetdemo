import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/utils/common';

/** 一种区块，样式见screenshot.png */
export const Block1: FunctionComponent<
    PropsWithChildren<{
        className?: string;
        titleClassName?: string;
        title: ReactNode;
        titleRight?: ReactNode;
    }>
> = ({ children, className, titleClassName, title, titleRight }) => {
    return (
        <div className={cn(className)}>
            <div className={cn('bg-surface-1 h-10 flex items-center justify-between', titleClassName)}>
                <span className="text-title-sm text-filltext-ft-g font-bold">{title}</span>
                {titleRight}
            </div>
            {children}
        </div>
    );
};
