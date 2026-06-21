import type { FC, ReactNode } from 'react';
import { cn } from '@/utils/common';

interface SummaryLineProps {
    label: string;
    value?: ReactNode;
    strong?: boolean;
}

/** sport 详情弹窗中的标签和值展示行。 */
export const SummaryLine: FC<SummaryLineProps> = ({ label, value, strong }) => (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className={cn('text-filltext-ft-g', strong ? 'text-body-lg' : 'text-body-md')}>{label}</span>
        <span className={cn('break-all text-filltext-ft-f', strong ? 'text-body-md' : 'text-body-sm')}>{value}</span>
    </div>
);
