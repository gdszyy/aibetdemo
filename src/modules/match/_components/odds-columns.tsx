import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { useTranslations } from 'next-intl';
import { type FC, useCallback } from 'react';
import { getMarketGroupId } from '@/api/models/market';
import type { MarketColumns, MatchEvent } from '@/api/models/match-game';
import { IconButton } from '@/components/icon-button';
import { ArrowLeft, ArrowRight } from '@/components/icons';
import { MatchPinOutlined } from '@/components/icons2/MatchPinOutlined';
import { useCarousel } from '@/hooks/use-carousel';
import { getMarketColumnWidth, MATCH_LIST_LAYOUT } from '@/modules/match/_constants/constants';
import { getVisibleMarketLines } from '@/modules/match/_utils/match-utils';
import { sortDetailMarketOutcomes } from '@/modules/match/_utils/outcome-sort';
import { cn } from '@/utils/common';
import { createOddsEntity } from '../_logic/odds-factory';
import { BetBtnShort } from './bet-btn-short';
import { BetBtnShortBase } from './bet-btn-short-base';
import { MarketCountAction } from './market-count-action';

interface OddsColumnsProps {
    match: MatchEvent;
    sportId: string;
    /** Category ID from parent TournamentGroup */
    categoryId: string;
    tournamentId: string;
    matchTitle: string;
    maxVisibleMarkets: number;
    /** Whether mobile compact layout is active */
    isMobileLayout?: boolean;
    /** Header market IDs from TournamentGroup — columns render in this order */
    columnMarkets: MarketColumns;
    /** Column widths aligned to marketIds */
    marketColumnWidths: number[];
    /** Hidden market row count displayed as +N */
    hiddenCount?: number;
    isMock?: boolean;
}

type VisibleMarketSlot = NonNullable<ReturnType<typeof getVisibleMarketSlot>>;
const SCROLL_FADE_WIDTH = 100;

const getVisibleMarketSlot = (
    match: MatchEvent,
    columnMarket: MarketColumns[number],
    columnWidth: number,
    isMobileLayout: boolean,
) => {
    const marketData = match.markets.find((market) => `${market.id}` === columnMarket.id);
    if (!marketData) return null;

    const lines = getVisibleMarketLines(marketData.lines, { marketId: marketData.id });
    const line = lines[0];
    if (!line) return null;

    return {
        market: { ...marketData, lines },
        line,
        outcomes: sortDetailMarketOutcomes(marketData.id, line.outcomes),
        width: columnWidth || getMarketColumnWidth({ isMobileLayout, outcomeCount: line.outcomes.length }),
    };
};

interface ScrollableMarketSlotsProps {
    renderMarketSlidesWithDividers: (sectionIsFlexible: boolean) => React.ReactNode;
    renderFixedMarketActions: () => React.ReactNode;
}

const ScrollableMarketSlots: FC<ScrollableMarketSlotsProps> = ({
    renderMarketSlidesWithDividers,
    renderFixedMarketActions,
}) => {
    const getScrollAlign = useCallback(
        (_viewSize: number, _snapSize: number, index: number) => (index === 0 ? 0 : SCROLL_FADE_WIDTH),
        [],
    );
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { align: getScrollAlign, containScroll: 'trimSnaps', dragFree: true, slidesToScroll: 1 },
        [WheelGesturesPlugin()],
    );
    const { canScrollPrev, canScrollNext, scrollPrev, scrollNext } = useCarousel(emblaApi);

    return (
        <div className="flex h-[70px] w-full min-w-0 items-stretch">
            <div className="relative z-20 h-full min-w-0 flex-1">
                <div ref={emblaRef} className="h-full overflow-hidden">
                    <div className="flex h-full items-stretch" style={{ gap: MATCH_LIST_LAYOUT.GAP }}>
                        {renderMarketSlidesWithDividers(false)}
                    </div>
                </div>

                {canScrollPrev && (
                    <>
                        <div
                            className="pointer-events-none absolute bottom-0 left-0 top-0 bg-gradient-to-r from-[var(--brand-match-card-bg,var(--neutral-white-h))] to-transparent"
                            style={{ width: SCROLL_FADE_WIDTH }}
                        />
                        <IconButton
                            icon={ArrowLeft}
                            size="xxs"
                            shape="round"
                            variant="subtle"
                            iconClassName="size-3"
                            className="pointer-events-none absolute left-1 top-1/2 z-10 -translate-y-1/2 opacity-0 transition-opacity group-hover/card:pointer-events-auto group-hover/card:opacity-100 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                scrollPrev();
                            }}
                        />
                    </>
                )}

                {canScrollNext && (
                    <>
                        <div
                            className="pointer-events-none absolute right-0 bottom-0 top-0 bg-gradient-to-l from-[var(--brand-match-card-bg,var(--neutral-white-h))] to-transparent"
                            style={{ width: SCROLL_FADE_WIDTH }}
                        />
                        <IconButton
                            icon={ArrowRight}
                            size="xxs"
                            shape="round"
                            variant="subtle"
                            iconClassName="size-3"
                            className="pointer-events-none absolute right-1 top-1/2 z-10 -translate-y-1/2 opacity-0 transition-opacity group-hover/card:pointer-events-auto group-hover/card:opacity-100 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                scrollNext();
                            }}
                        />
                    </>
                )}
            </div>

            {renderFixedMarketActions()}
        </div>
    );
};

/**
 * Responsive market odds columns for match cards.
 * Renders BetBtnShort buttons for each visible market (1x2, Total, Handicap).
 */
export const OddsColumns: FC<OddsColumnsProps> = ({
    match,
    sportId,
    categoryId,
    tournamentId,
    matchTitle,
    maxVisibleMarkets,
    isMobileLayout = false,
    columnMarkets,
    marketColumnWidths,
    hiddenCount = 0,
    isMock = false,
}) => {
    const t = useTranslations('matches');
    const matchDetailHref = isMock ? `/sports/${sportId}` : `/matches/${match.event_id}`;

    const renderFixedMarketActions = (className?: string) => (
        <div
            className={cn('flex h-[70px] shrink-0 flex-col items-end justify-between', className)}
            style={{ width: MATCH_LIST_LAYOUT.RIGHT_COLUMN_WIDTH }}
        >
            <MatchPinOutlined className="relative z-20 size-4 shrink-0 text-filltext-ft-g" />
            {hiddenCount > 0 ? (
                <MarketCountAction count={hiddenCount} href={matchDetailHref} className="relative z-20" />
            ) : (
                <span className="h-[14px]" />
            )}
        </div>
    );

    const visibleSlots = columnMarkets
        .slice(0, Math.max(maxVisibleMarkets, 1))
        .map((market, index) => getVisibleMarketSlot(match, market, marketColumnWidths[index] ?? 0, isMobileLayout))
        .filter((marketSlot): marketSlot is VisibleMarketSlot => Boolean(marketSlot));

    if (visibleSlots.length === 0) {
        if (isMobileLayout) {
            return (
                <div className="flex h-[70px] w-full items-end pb-2.5">
                    <span className="truncate text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-2xs">
                        {t('liveMarketsBackSoon')}
                    </span>
                </div>
            );
        }

        return (
            <div className="flex h-[70px] w-full min-w-0 flex-row items-stretch" style={{ gap: MATCH_LIST_LAYOUT.GAP }}>
                <div className="flex min-w-0 flex-1 items-end pb-2.5">
                    <span className="truncate text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-2xs">
                        {t('liveMarketsBackSoon')}
                    </span>
                </div>
                {renderFixedMarketActions('ml-auto')}
            </div>
        );
    }

    const showScrollableDesktopMarkets = !isMobileLayout && visibleSlots.length > 1;
    const renderedSlots = showScrollableDesktopMarkets ? visibleSlots : visibleSlots.slice(0, maxVisibleMarkets);

    const renderMarketSlot = (slot: VisibleMarketSlot, sectionIsFlexible: boolean) => {
        return (
            <div
                key={getMarketGroupId(slot.market)}
                className={cn('flex min-w-0 flex-col justify-between', sectionIsFlexible ? 'flex-1' : 'shrink-0')}
                style={sectionIsFlexible ? undefined : { width: slot.width }}
            >
                <div className="flex h-4 min-w-0 items-center">
                    <span className="truncate text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-2xs">
                        {slot.market.name}
                    </span>
                </div>

                <div className="flex h-[var(--brand-odds-short-height,2rem)] min-w-0 items-center gap-2">
                    {slot.outcomes.map((outcome) =>
                        isMock ? (
                            <BetBtnShortBase
                                key={outcome.id}
                                outcome={outcome}
                                className="pointer-events-none relative z-20 cursor-default"
                            />
                        ) : (
                            <BetBtnShort
                                key={outcome.id}
                                oddsEntity={createOddsEntity(
                                    match,
                                    { sportId, tournamentId, categoryId, matchTitle },
                                    slot.market,
                                    slot.line,
                                    outcome,
                                )}
                                className="relative z-20"
                            />
                        ),
                    )}
                </div>
            </div>
        );
    };

    const renderMarketSlidesWithDividers = (sectionIsFlexible: boolean) =>
        renderedSlots.map((slot, index) => (
            <div
                key={getMarketGroupId(slot.market)}
                className={cn('flex min-w-0 items-stretch', sectionIsFlexible ? 'flex-1' : 'shrink-0')}
                style={{ gap: MATCH_LIST_LAYOUT.GAP }}
            >
                {renderMarketSlot(slot, sectionIsFlexible)}
                {index < renderedSlots.length - 1 && (
                    <div className="flex h-[70px] shrink-0 items-end justify-center">
                        <div className="h-[72px] w-px bg-[var(--brand-match-divider,var(--filltext-ft-c))]" />
                    </div>
                )}
            </div>
        ));

    if (showScrollableDesktopMarkets) {
        return (
            <ScrollableMarketSlots
                renderMarketSlidesWithDividers={renderMarketSlidesWithDividers}
                renderFixedMarketActions={renderFixedMarketActions}
            />
        );
    }

    return (
        <div className="flex h-[70px] w-full min-w-0 flex-row items-stretch" style={{ gap: MATCH_LIST_LAYOUT.GAP }}>
            {renderMarketSlidesWithDividers(maxVisibleMarkets <= 1)}
            {!isMobileLayout && renderFixedMarketActions('ml-auto')}
        </div>
    );
};
