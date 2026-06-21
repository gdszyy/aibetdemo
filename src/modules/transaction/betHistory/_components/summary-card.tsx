import type { FC, ReactNode } from 'react';
import { cn } from '@/utils/common';

interface SummaryCardProps {
    children: ReactNode;
    className?: string;
}

/** sport 详情弹窗中的信息卡片容器。 */
export const SummaryCard: FC<SummaryCardProps> = ({ children, className }) => (
    <div className={cn('rounded-sm bg-filltext-ft-a p-4', className)}>{children}</div>
);
