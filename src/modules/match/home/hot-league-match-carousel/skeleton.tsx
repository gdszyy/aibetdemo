import type { FC } from 'react';
import { BlockTitle2 } from '@/components/block-title-2';
import { DoubleArrowUpOutlined } from '@/components/icons2/DoubleArrowUpOutlined';
import { LiveOutlined } from '@/components/icons2/LiveOutlined';
import { cn } from '@/utils/common';
import type { HotLeagueMatchCarouselVariant } from './types';

interface HotLeagueMatchCarouselSkeletonProps {
    title: string;
    variant: HotLeagueMatchCarouselVariant;
}

const SkeletonCard: FC<{ variant: HotLeagueMatchCarouselVariant }> = ({ variant }) => (
    <div
        className={cn(
            'min-w-0 w-full shrink-0 rounded-sm bg-surface-1 p-3 md:w-[402px]',
            variant === 'live' ? 'h-[167px]' : 'h-[171px]',
        )}
    >
        <div className="flex h-full flex-col gap-2">
            <div className="h-3.5 w-56 animate-skeleton-pulse rounded-xs bg-filltext-ft-c/70" />
            <div className="h-4 w-20 animate-skeleton-pulse rounded-xs bg-filltext-ft-c/70" />
            <div className="mt-1 flex flex-col gap-2">
                <div className="h-[18px] w-44 animate-skeleton-pulse rounded-xs bg-filltext-ft-c/70" />
                <div className="h-[18px] w-48 animate-skeleton-pulse rounded-xs bg-filltext-ft-c/70" />
            </div>
            <div className="mt-auto h-px bg-filltext-ft-c" />
            <div className="flex h-8 gap-2">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="h-8 flex-1 animate-skeleton-pulse rounded-xs bg-filltext-ft-a" />
                ))}
            </div>
        </div>
    </div>
);

export const HotLeagueMatchCarouselSkeleton: FC<HotLeagueMatchCarouselSkeletonProps> = ({ title, variant }) => {
    const Icon = variant === 'live' ? LiveOutlined : DoubleArrowUpOutlined;

    return (
        <section className="flex min-w-0 w-full flex-col gap-4">
            <BlockTitle2 icon={Icon} iconClassName="text-brand-primary-0" title={title} />
            <div className="min-w-0 w-full overflow-hidden">
                <div className="flex gap-4">
                    {[1, 2, 3].map((item) => (
                        <SkeletonCard key={item} variant={variant} />
                    ))}
                </div>
            </div>
            <div className="flex h-8 items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center justify-center gap-2 py-[9px] pl-16">
                    {[1, 2, 3, 4, 5].map((item, index) => (
                        <div
                            key={item}
                            className={cn(
                                'h-0.5 w-6 rounded-full',
                                index === 0 ? 'bg-brand-primary-0' : 'bg-filltext-ft-d',
                            )}
                        />
                    ))}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <div className="size-[30px] rounded-full bg-surface-1" />
                    <div className="size-[30px] rounded-full bg-surface-1" />
                </div>
            </div>
        </section>
    );
};
