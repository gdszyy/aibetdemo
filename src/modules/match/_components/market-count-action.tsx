'use client';

import { type FC, type MouseEvent, useCallback } from 'react';
import { useIntentPrefetch } from '@/hooks/use-intent-prefetch';
import { useRouter } from '@/i18n';
import { formatMarketCount } from '@/modules/match/_utils/match-utils';
import { cn } from '@/utils/common';

interface MarketCountActionProps {
    count: number;
    href: string;
    className?: string;
}

export const MarketCountAction: FC<MarketCountActionProps> = ({ count, href, className }) => {
    const router = useRouter();
    // 悬停 / 触摸 / 聚焦"+N"入口时预取详情路由，与卡片主体保持一致的瞬时跳转体验。
    // 关闭视口预取：卡片根元素已负责可见预取，小入口无需各自再观察。
    const intentHandlers = useIntentPrefetch(href, { viewport: false });

    const navigateToMatch = useCallback((): void => {
        router.push(href, { scroll: true });
    }, [href, router]);

    const handleClick = useCallback(
        (event: MouseEvent<HTMLSpanElement>): void => {
            event.preventDefault();
            event.stopPropagation();
            navigateToMatch();
        },
        [navigateToMatch],
    );

    return (
        <span
            className={cn(
                '-m-2 flex min-h-8 min-w-8 cursor-pointer items-center justify-end rounded-xs p-2 text-right text-auxiliary-2xs text-filltext-ft-g tabular-nums transition-colors hover:text-brand-primary-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0',
                className,
            )}
            {...intentHandlers}
            onClick={handleClick}
        >
            +{formatMarketCount(count)}
        </span>
    );
};
