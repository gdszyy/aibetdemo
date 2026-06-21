import type { FC } from 'react';

/**
 * NotificationCard skeleton component
 */
export const NotificationCardSkeleton: FC = () => (
    <div className="relative flex flex-1 flex-col gap-1 min-w-0 px-2 py-1 bg-filltext-ft-a min-h-[50px] rounded-[8px]">
        {/* Timestamp skeleton */}
        <div className="h-3.5 w-32 animate-skeleton-pulse rounded bg-surface-raised/30" />
        {/* Content skeleton */}
        <div className="flex justify-between w-full gap-2">
            <div className="h-4 w-95 animate-skeleton-pulse rounded bg-surface-raised/30" />
            <div className="h-3.5 w-20 animate-skeleton-pulse rounded bg-surface-raised/30" />
        </div>
    </div>
);

/**
 * Notification list skeleton component
 */
export const NotificationListSkeleton: FC = () => (
    <div className="flex flex-col gap-2 overflow-hidden flex-1 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <NotificationCardSkeleton key={i} />
        ))}
    </div>
);
