import type { FC } from 'react';
import { cn } from '@/utils/common';

interface BetItemSkeletonProps {
    rows: number;
    columns?: 2 | 3;
    withRowLabels?: boolean;
    withColumnLabels?: boolean;
}

const SkeletonLine: FC<{ className?: string }> = ({ className }) => (
    <div className={cn('animate-skeleton-pulse rounded bg-filltext-ft-d/20', className)} />
);

const BetItemSkeleton: FC<BetItemSkeletonProps> = ({
    rows,
    columns = 2,
    withRowLabels = false,
    withColumnLabels = false,
}) => {
    const gridTemplateColumns = withRowLabels
        ? `minmax(min-content, 44px) repeat(${columns}, minmax(0, 1fr))`
        : `repeat(${columns}, minmax(0, 1fr))`;

    return (
        <div className="w-full overflow-hidden rounded-sm bg-surface-1">
            <div className="flex h-10 items-center justify-between border-filltext-ft-c border-b px-3">
                <SkeletonLine className="h-[18px] w-32 bg-filltext-ft-d/30" />
                <div className="hidden items-center gap-4 md:flex">
                    <SkeletonLine className="size-4" />
                    <SkeletonLine className="size-4" />
                </div>
            </div>
            {withColumnLabels && (
                <div
                    className="grid border-filltext-ft-c border-b bg-surface-1 px-3 py-2.5"
                    style={{ gridTemplateColumns }}
                >
                    {withRowLabels && <div />}
                    {Array.from({ length: columns }).map((_, i) => (
                        <div key={i.toString()} className="flex justify-center">
                            <SkeletonLine className="h-4 w-14" />
                        </div>
                    ))}
                </div>
            )}
            <div className={cn('flex flex-col gap-3 px-3 py-3 md:py-4', withColumnLabels && 'md:py-3')}>
                {Array.from({ length: rows }).map((_, i) => (
                    <div
                        key={i.toString()}
                        className="grid items-center gap-x-2 gap-y-3"
                        style={{ gridTemplateColumns }}
                    >
                        {withRowLabels && <SkeletonLine className="mx-auto h-4 w-8" />}
                        {Array.from({ length: columns }).map((_, columnIndex) => (
                            <SkeletonLine key={columnIndex.toString()} className="h-8 min-w-0 rounded-xs" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const MarketsSkeleton: FC = () => (
    <div className="flex flex-col gap-y-2 md:gap-y-4">
        <BetItemSkeleton rows={3} withRowLabels withColumnLabels />
        <BetItemSkeleton rows={2} columns={3} />
        <BetItemSkeleton rows={1} columns={3} />
    </div>
);
