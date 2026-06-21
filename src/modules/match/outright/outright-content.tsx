'use client';

import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { GetOutrightMarketsInterface, type OutrightMarketsResponse } from '@/api/handlers/tournament';
import { getMarketGroupId } from '@/api/models/market';
import type { OddsEventEntity } from '@/api/models/match';
import { Empty } from '@/components/empty';
import { useGameSubscription } from '@/hooks/use-game-subscription';
import { mergeOutrightMarketsData, useOutrightObserver } from '@/modules/match/_hooks/use-odds-change-observer';
import { useCollapseContext } from '@/modules/match/list/collapse-context';
import { Card } from './card';

const OutrightSkeleton: FC = () => (
    <div className="flex flex-col gap-y-2 mb-4">
        {[1, 2].map((i) => (
            <div key={i} className="w-full bg-surface-1 rounded-xl">
                <div className="flex items-center h-10 px-4 bg-surface-1 border-b border-filltext-ft-b rounded-t-sm">
                    <div className="h-4 w-40 animate-skeleton-pulse rounded bg-filltext-ft-d/30" />
                </div>
                <div className="p-4">
                    <div className="flex justify-end mb-4">
                        <div className="h-8 w-24 animate-skeleton-pulse rounded-full bg-filltext-ft-d/30" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 6 }).map((_, j) => (
                            <div
                                key={j.toString()}
                                className="h-10 animate-skeleton-pulse rounded-sm bg-filltext-ft-d/20"
                            />
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

interface OutrightContentProps {
    tournamentId: string;
}

/**
 * Outright content area (excludes Breadcrumb / Tabs shell).
 * Reads isCollapsed state from CollapseContext.
 */
export const OutrightContent: FC<OutrightContentProps> = ({ tournamentId }) => {
    const t = useTranslations('matches');
    const queryClient = useQueryClient();
    const collapseCtx = useCollapseContext();
    const isCollapsed = collapseCtx?.isCollapsed ?? false;

    const key = useMemo(() => ['outright', tournamentId] as const, [tournamentId]);

    const { data: outrightEvents, isLoading } = useQuery({
        queryKey: key,
        queryFn: async () => {
            const data = await GetOutrightMarketsInterface({ tournament_id: tournamentId });
            const prev = queryClient.getQueryData<OutrightMarketsResponse>(key);
            return mergeOutrightMarketsData(prev, data);
        },
        gcTime: Number.POSITIVE_INFINITY,
        placeholderData: keepPreviousData,
    });

    const events = outrightEvents ?? [];
    const eventIds = useMemo(() => events.map((event) => event.event_id), [events]);

    // Subscribe to outright event feeds
    useGameSubscription(eventIds);

    // Listen for WebSocket updates (market data only)
    useOutrightObserver({ eventIds, key });

    if (isLoading) return <OutrightSkeleton />;

    return events.some((event) => event.markets.length > 0) ? (
        <>
            <div className="flex flex-col gap-y-2 mb-4">
                {events.flatMap((event) => {
                    const oee: OddsEventEntity = {
                        eventId: event.event_id,
                        eventIdType: event.event_id_type,
                        tournamentId,
                        isOutright: true,
                        title: '',
                    };

                    return event.markets.map((market) => (
                        <Card
                            key={`${event.event_id}:${getMarketGroupId(market)}`}
                            oee={oee}
                            market={market}
                            forceCollapsed={isCollapsed}
                        />
                    ));
                })}
            </div>
            <div className="flex h-4 pt-3 pb-10 leading-4 justify-center items-center text-filltext-ft-f font-normal text-sm text-center">
                {t('noMoreMarkets')}
            </div>
        </>
    ) : (
        <Empty desc={t('noMarketAvailable')} />
    );
};
