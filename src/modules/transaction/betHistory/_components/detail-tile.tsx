import type { FC, ReactNode } from 'react';
import { cn } from '@/utils/common';

interface DetailTileProps {
    label: string;
    value: ReactNode;
    className?: string;
}

/** casino 详情弹窗中的单个字段卡片。 */
export const DetailTile: FC<DetailTileProps> = ({ label, value, className }) => (
    <div className={cn('flex items-start justify-between gap-4 rounded-sm bg-filltext-ft-a p-4', className)}>
        <span className="text-body-lg text-filltext-ft-g">{label}</span>
        <span className="break-all text-body-sm text-filltext-ft-f text-right">{value}</span>
    </div>
);
