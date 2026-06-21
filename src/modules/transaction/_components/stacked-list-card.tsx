'use client';

import type { FC, ReactNode } from 'react';
import { cn } from '@/utils/common';

interface StackedListCardProps {
    title: ReactNode;
    titleRight?: ReactNode;
    children: ReactNode;
    className?: string;
}

export const StackedListCard: FC<StackedListCardProps> = ({ title, titleRight, children, className }) => {
    return (
        <div className={cn('rounded-sm border border-filltext-ft-b bg-surface-1 px-3 pb-2 pt-0', className)}>
            <div className="flex min-h-9 items-center justify-between gap-3 border-b border-filltext-ft-b">
                <div className="min-w-0 flex-1">{title}</div>
                {titleRight ? <div className="shrink-0">{titleRight}</div> : null}
            </div>

            <div className="pt-1">{children}</div>
        </div>
    );
};
