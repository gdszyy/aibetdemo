import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { OrderType } from '@/api/models/order';
import { Loading } from '@/components/loading/loading';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useIsDesktop } from '@/hooks/use-media-query';
import { cn } from '@/utils/common';
import { EmptySlip } from '../_components/empty-slip';
import { useOrders } from './_hooks/use-orders';
import { TicketContainer } from './ticket-container';

export const Open = () => {
    const isDesktop = useIsDesktop();
    const [hasScrolledOnMobile, setHasScrolledOnMobile] = useState(false);
    const t = useTranslations('betSlip');
    const tHome = useTranslations('home');
    const {
        orders: openOrders,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        pageCount,
        fetchNextPage,
    } = useOrders({
        tab: OrderType.Open,
    });

    const allowFetchNextPage = isDesktop || hasScrolledOnMobile;
    const { sentinelRef } = useInfiniteScroll({
        hasNextPage: allowFetchNextPage && hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });
    const handleScroll = useCallback(() => {
        if (isDesktop || hasScrolledOnMobile) return;

        setHasScrolledOnMobile(true);
    }, [hasScrolledOnMobile, isDesktop]);

    if (isFetching && !isFetchingNextPage) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loading className="h-5 w-5" variant="color-red" />
            </div>
        );
    }

    return (
        <div
            className={cn(
                'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-y-contain pt-2 hidden-scrollbar mb-2 w-full',
                isDesktop && openOrders.length > 0 && 'rounded-b-sm bg-filltext-ft-b',
                !isDesktop &&
                    'mx-2 w-[calc(100dvw-16px)] min-w-0 max-w-[calc(100dvw-16px)] self-start overflow-x-hidden bg-filltext-ft-b px-2 [&>*]:min-w-0 [&>*]:max-w-full',
            )}
            data-bet-slip-scroll-region="true"
            onScroll={handleScroll}
        >
            {openOrders.length === 0 ? (
                <>
                    <div className="mx-2 flex h-9 items-center justify-between rounded bg-surface-selected px-3">
                        <span className="text-auxiliary-sm text-filltext-ft-f">Open bets</span>
                        <span className="rounded bg-brand-primary-0/12 px-2 py-0.5 text-auxiliary-sm font-bold text-accent-warm">
                            Mock filter
                        </span>
                    </div>
                    <EmptySlip text={t('label.noOpenBets')} card className={cn(isDesktop && 'w-full')} />
                </>
            ) : (
                <>
                    {openOrders.map((item) => {
                        return <TicketContainer key={item.bet_id} order={item} />;
                    })}
                    {/* Infinite scroll loading */}
                    {hasNextPage ? (
                        <div ref={sentinelRef} className="h-8 flex items-center justify-center shrink-0">
                            {isFetchingNextPage && <Loading className="h-4 w-4" variant="color-red" />}
                        </div>
                    ) : (
                        pageCount > 1 && (
                            <div className="h-8 flex items-center justify-center px-2 shrink-0">
                                <span className="text-body-sm text-filltext-ft-e">{tHome('noMore.categories')}</span>
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
};
