'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import type { MarketGroup } from '@/api/models/market';
import type { OddsEventEntity } from '@/api/models/match';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible/collapsible';
import { ArrowDown, OddsSort, UpTriangle } from '@/components/icons';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { getVisibleMarketLines } from '@/modules/match/_utils/match-utils';
import { cn } from '@/utils/common';
import { BetBtnStandard } from '../_components/bet-btn-standard';
import { useForceCollapse } from '../_hooks/use-force-collapse';
import { createOddsEntityFromOEE } from '../_logic/odds-factory';

type CardProps = {
    oee: OddsEventEntity;
    market: MarketGroup;
    forceCollapsed?: boolean;
};

type SortOrder = 'asc' | 'desc';

/** 冠军盘盘口卡片，支持按赔率升序/降序切换展示投注项。 */
export const Card: FC<CardProps> = ({ oee, market, forceCollapsed }) => {
    const t = useTranslations('matches');

    const [isExpanded, setIsExpanded] = useForceCollapse(forceCollapsed);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    // 展平所有可展示投注项，同时保留投注线上下文。
    const oddsEntities = useMemo(() => {
        const entities: OddsEntity[] = [];
        for (const line of getVisibleMarketLines(market.lines, { marketId: market.id, isOutright: true })) {
            for (const outcome of line.outcomes) {
                entities.push(createOddsEntityFromOEE(oee, market, line, outcome));
            }
        }
        return entities;
    }, [market, oee]);

    // 按赔率排序，无赔率投注项始终沉底。
    const sortedEntities = useMemo(() => {
        const desc = sortOrder === 'desc';
        return [...oddsEntities].sort((a, b) => {
            const aOdds = a.outcome.odds || 0;
            const bOdds = b.outcome.odds || 0;
            if (!aOdds && !bOdds) return 0;
            if (!aOdds) return 1;
            if (!bOdds) return -1;
            return desc ? bOdds - aOdds : aOdds - bOdds;
        });
    }, [oddsEntities, sortOrder]);

    return (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="w-full group/card bg-surface-1 ">
            {/* caption */}
            <CollapsibleTrigger asChild>
                <div
                    className={cn(
                        'flex group/caption flex-row justify-between items-center h-10 px-4 py-2 bg-surface-1 cursor-pointer hover:bg-neutral-black-a transition-colors  border-filltext-ft-a',
                        isExpanded && 'border-b',
                    )}
                >
                    <span className="text-body-lg text-filltext-ft-g truncate capitalize">{market.name}</span>
                    <div className="flex items-center justify-center size-3">
                        <ArrowDown
                            className={cn(
                                'w-3 h-3 text-filltext-ft-e group-hover/caption:text-filltext-ft-g transition-colors transition-transform duration-200 ease-in-out',
                                isExpanded && 'rotate-180',
                            )}
                        />
                    </div>
                </div>
            </CollapsibleTrigger>
            {/* panel */}
            <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                <div className="p-4">
                    {/* operation */}
                    <div className="flex justify-end items-center mb-4">
                        {/* sort */}
                        <button
                            type="button"
                            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                            className="flex items-center gap-2 group/filter hover:border-filltext-ft-g border border-filltext-ft-e h-8 px-4 bg-surface-1 rounded-full cursor-pointer transition-colors"
                        >
                            <OddsSort className="size-5 text-filltext-ft-e group-hover/filter:text-filltext-ft-g transition-colors" />
                            <div className="flex items-center gap-0.5">
                                <span className="text-body-md text-filltext-ft-e group-hover/filter:text-filltext-ft-g transition-colors">
                                    {t('odds')}
                                </span>
                                <UpTriangle
                                    className={cn(
                                        'w-3 h-2 text-filltext-ft-e group-hover/filter:text-filltext-ft-g transition-transform duration-200',
                                        sortOrder === 'desc' && 'rotate-180',
                                    )}
                                />
                            </div>
                        </button>
                    </div>
                    {/* list */}
                    <div
                        className={cn(
                            'grid w-full grid-cols-1 gap-2 md:grid-cols-1',
                            sortedEntities.length <= 3 && sortedEntities.length === 1
                                ? 'md:grid-cols-1'
                                : sortedEntities.length === 2
                                  ? 'md:grid-cols-2'
                                  : 'md:grid-cols-3',
                        )}
                    >
                        {sortedEntities.map((entity) => (
                            <BetBtnStandard key={entity.outcome.id} oddsEntity={entity} />
                        ))}
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
