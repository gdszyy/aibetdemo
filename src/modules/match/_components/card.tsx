'use client';

import { useTranslations } from 'next-intl';
import { type FC, Fragment, useMemo } from 'react';
import type { MarketColumns, MatchEvent } from '@/api/models/match-game';
import { MatchStatus } from '@/api/models/match-game';
import { MatchBroadcastFilled } from '@/components/icons2/MatchBroadcastFilled';
import { MatchPinOutlined } from '@/components/icons2/MatchPinOutlined';
import { ConditionalTooltip } from '@/components/tooltip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { Link } from '@/i18n';
import { MATCH_LIST_LAYOUT } from '@/modules/match/_constants/constants';
import { useMatchRowCount } from '@/modules/match/_hooks/use-match-row-count';
import {
    getSportPeriodScoreCells,
    getVisibleMarketLines,
    isBasketballSport,
    isRugbySport,
    PeriodScoreDisplayMode,
    shouldShowMatchInList,
} from '@/modules/match/_utils/match-utils';
import { sortDetailMarketOutcomes } from '@/modules/match/_utils/outcome-sort';
import { cn } from '@/utils/common';
import { createOddsEntity } from '../_logic/odds-factory';
import { BetBtnShort } from './bet-btn-short';
import { BetBtnShortBase } from './bet-btn-short-base';
import { MarketCountAction } from './market-count-action';
import { MatchLiveMetaLine } from './match-live-meta-line';
import { OddsColumns } from './odds-columns';
import { PeriodScoreTable } from './period-score-table';

type CardProps = {
    /** Match event info + markets from API */
    match: MatchEvent;
    /** Sport ID from parent TournamentGroup */
    sportId: string;
    /** Sport name from parent TournamentGroup */
    sportName: string;
    /** Category name from parent TournamentGroup */
    categoryName: string;
    /** Category ID from parent TournamentGroup */
    categoryId: string;
    /** Tournament ID from parent TournamentGroup */
    tournamentId: string;
    /** Tournament name from parent TournamentGroup */
    tournamentName: string;
    /** From parent: 0-3 based on container width */
    maxVisibleMarkets: number;
    /** Whether mobile compact layout is active */
    isMobileLayout?: boolean;
    /** Header market IDs from TournamentGroup — columns render in this order */
    columnMarkets: MarketColumns;
    /** Column widths aligned to marketIds */
    marketColumnWidths: number[];
    /** Whether this card should fetch row count itself or only consume parent-prefetched cache */
    fetchRowCount?: boolean;
    /** sports-live：market count 为 0 时不渲染 */
    hideZeroMarketCount?: boolean;
    /** Optional className for root row container */
    className?: string;
    isMock?: boolean;
};

const DotSeparator: FC = () => (
    <svg
        className="size-3 shrink-0 text-[var(--brand-match-muted,var(--filltext-ft-d))]"
        viewBox="0 0 12 12"
        fill="none"
    >
        <path
            d="M8 6C8 6.56 7.80667 7.03333 7.42 7.42C7.03333 7.80667 6.56 8 6 8C5.44 8 4.96667 7.80667 4.58 7.42C4.19333 7.03333 4 6.56 4 6C4 5.44 4.19333 4.96667 4.58 4.58C4.96667 4.19333 5.44 4 6 4C6.56 4 7.03333 4.19333 7.42 4.58C7.80667 4.96667 8 5.44 8 6Z"
            fill="currentColor"
        />
    </svg>
);

const MatchTrail: FC<{ labels: string[] }> = ({ labels }) => {
    const visibleLabels = labels.filter((label) => label.trim());

    return (
        <div className="flex h-4 max-w-full items-center overflow-hidden whitespace-nowrap">
            {visibleLabels.map((label, index) => (
                <Fragment key={`${label}-${visibleLabels.slice(0, index).join('>')}`}>
                    {index > 0 && <DotSeparator />}
                    <ConditionalTooltip content={label} side="top">
                        <span className="min-w-0 truncate text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-2xs">
                            {label}
                        </span>
                    </ConditionalTooltip>
                </Fragment>
            ))}
        </div>
    );
};

const UpcomingMetaLine: FC<{ startTime: number }> = ({ startTime }) => {
    const { formatRelativeShortDate, formatShortTime } = useIntlFormatter();
    const startDate = new Date(startTime * 1000);
    const dateLabel = formatRelativeShortDate(startDate).toLocaleLowerCase();

    return (
        <span className="h-4 truncate text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-xs">
            {dateLabel}, {formatShortTime(startDate)}
        </span>
    );
};

const TeamName: FC<{ name: string; strong?: boolean }> = ({ name, strong = false }) => (
    <ConditionalTooltip content={name} side="top">
        <span
            className={cn(
                'min-w-0 truncate text-[var(--brand-match-team-text,var(--filltext-ft-h))] text-body-sm',
                strong && 'text-body-lg',
            )}
        >
            {name}
        </span>
    </ConditionalTooltip>
);

const MatchInfo: FC<{
    match: MatchEvent;
    sportId: string;
    trailLabels: string[];
    isMobileLayout: boolean;
}> = ({ match, sportId, trailLabels, isMobileLayout }) => {
    const isLive = match.status === MatchStatus.Live;
    const homeIsLeading = isLive && match.home_competitor.score > match.away_competitor.score;
    const awayIsLeading = isLive && match.away_competitor.score > match.home_competitor.score;
    const periodScoreMode = isMobileLayout ? PeriodScoreDisplayMode.MobileList : PeriodScoreDisplayMode.FullPeriods;
    const showOnlyTotalScore = isMobileLayout && (isBasketballSport(sportId) || isRugbySport(sportId));
    const homeScoreCells = getSportPeriodScoreCells({
        periodScores: match.period_score,
        side: 'home',
        total: match.home_competitor.score,
        opponentTotal: match.away_competitor.score,
        matchStatus: match.status,
        sportId,
        mode: periodScoreMode,
        showOnlyTotal: showOnlyTotalScore,
    });
    const awayScoreCells = getSportPeriodScoreCells({
        periodScores: match.period_score,
        side: 'away',
        total: match.away_competitor.score,
        opponentTotal: match.home_competitor.score,
        matchStatus: match.status,
        sportId,
        mode: periodScoreMode,
        showOnlyTotal: showOnlyTotalScore,
    });
    const showPeriodColumns = isLive;
    const visibleHomeScoreCells = showPeriodColumns ? homeScoreCells : [];
    const visibleAwayScoreCells = showPeriodColumns ? awayScoreCells : [];

    return (
        <div className="flex min-w-0 flex-1 flex-col gap-2 overflow-hidden">
            <MatchTrail labels={trailLabels} />

            <div className="flex h-[70px] min-w-0 items-center justify-between gap-3">
                <div className="flex h-full min-w-0 flex-1 flex-col gap-2.5">
                    <div className="flex h-4 min-w-0 items-center">
                        {isLive ? (
                            <MatchLiveMetaLine
                                sportId={sportId}
                                matchStatus={match.match_status}
                                matchClock={match.match_clock}
                                matchClockOffset={match.match_clock_offset}
                            />
                        ) : (
                            <UpcomingMetaLine startTime={match.start_time} />
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex h-[18px] min-w-0 items-center justify-between gap-3">
                            <TeamName name={match.home_competitor.name} strong={homeIsLeading} />
                        </div>
                        <div className="flex h-[18px] min-w-0 items-center justify-between gap-3">
                            <TeamName name={match.away_competitor.name} strong={awayIsLeading} />
                            {!isLive && (
                                <MatchBroadcastFilled className="relative z-20 size-4 shrink-0 text-filltext-ft-f" />
                            )}
                        </div>
                    </div>
                </div>
                {showPeriodColumns && (
                    <PeriodScoreTable homeCells={visibleHomeScoreCells} awayCells={visibleAwayScoreCells} />
                )}
            </div>
        </div>
    );
};

/**
 * Match Card for Hot Matches List
 */
export const Card: FC<CardProps> = ({
    match,
    sportId,
    sportName,
    categoryName,
    categoryId,
    tournamentId,
    tournamentName,
    maxVisibleMarkets,
    isMobileLayout = false,
    columnMarkets,
    marketColumnWidths,
    fetchRowCount = true,
    hideZeroMarketCount = false,
    className,
    isMock = false,
}) => {
    const t = useTranslations('matches');

    const { data: batchMarketCount } = useMatchRowCount(match.event_id, fetchRowCount && !isMock);
    const matchData = match;

    const matchTitle = useMemo(
        () => `${matchData.home_competitor.name} vs ${matchData.away_competitor.name}`,
        [matchData],
    );
    const trailLabels = useMemo(
        () => [sportName, categoryName, tournamentName],
        [categoryName, sportName, tournamentName],
    );
    const totalMarketCount = batchMarketCount ?? matchData.live_market_total ?? matchData.live_market_count ?? 0;
    const matchMarkets = matchData.markets;

    const orderedMarkets = useMemo(() => {
        if (!matchMarkets) return [];

        return columnMarkets.map((market) => {
            const marketData = matchMarkets.find((m) => `${m.id}` === market.id);
            if (!marketData) return null;

            return { ...marketData, lines: getVisibleMarketLines(marketData.lines, { marketId: marketData.id }) };
        });
    }, [columnMarkets, matchMarkets]);

    const firstMarket = orderedMarkets[0] && orderedMarkets[0].lines.length > 0 ? orderedMarkets[0] : null;
    const firstLine = firstMarket?.lines?.[0] ?? null;
    const firstLineOutcomes = useMemo(
        () => (firstLine && firstMarket ? sortDetailMarketOutcomes(firstMarket.id, firstLine.outcomes) : []),
        [firstLine, firstMarket],
    );
    const matchDetailHref = isMock ? `/sports/${sportId}` : `/matches/${matchData.event_id}`;

    if (!shouldShowMatchInList(matchData)) return null;
    if (hideZeroMarketCount && batchMarketCount === 0) return null;

    const desktopVisibleMarketCount = orderedMarkets.filter((market) => (market?.lines.length ?? 0) > 0).length;
    const hiddenCount = Math.max(totalMarketCount - desktopVisibleMarketCount, 0);
    const mobileHiddenCount = Math.max(totalMarketCount - (firstLine ? 1 : 0), 0);

    return (
        <article
            className={cn(
                'group/card relative w-full overflow-hidden rounded-sm bg-surface-1 transition-[background-color,box-shadow,transform]',
                'border border-[color:var(--brand-match-card-border,var(--border-subtle))] [background:var(--brand-match-card-bg,var(--surface-1))] [box-shadow:var(--brand-match-card-shadow,var(--style-card-shadow))]',
                'hover:[background:var(--brand-match-card-hover-bg,var(--interactive-card-hover-bg))] md:hover:[box-shadow:var(--interactive-card-hover-shadow,var(--brand-match-card-shadow,var(--style-card-shadow)))]',
                isMobileLayout ? 'flex flex-col gap-2 p-3' : 'flex items-end gap-4 px-3 py-2.5',
                className,
            )}
            data-brand-match-card=""
        >
            <Link
                href={matchDetailHref}
                scroll={true}
                className="absolute inset-0 z-10 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0"
            >
                <span className="sr-only">{matchTitle}</span>
            </Link>
            {isMobileLayout ? (
                <>
                    <div className="flex min-w-0 items-start gap-2">
                        <MatchInfo
                            match={matchData}
                            sportId={sportId}
                            trailLabels={trailLabels}
                            isMobileLayout={isMobileLayout}
                        />
                        <MatchPinOutlined className="relative z-20 size-4 shrink-0 text-filltext-ft-g" />
                    </div>

                    <div className="h-px w-full bg-[var(--brand-match-divider,var(--filltext-ft-c))]" />

                    <div className="flex h-8 min-w-0 items-center gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                            {firstLine && firstMarket ? (
                                firstLineOutcomes.map((outcome) =>
                                    isMock ? (
                                        <BetBtnShortBase
                                            key={outcome.id}
                                            outcome={outcome}
                                            className="pointer-events-none relative z-20 cursor-default"
                                        />
                                    ) : (
                                        <BetBtnShort
                                            key={outcome.id}
                                            className="relative z-20"
                                            oddsEntity={createOddsEntity(
                                                {
                                                    event_id: matchData.event_id,
                                                    event_id_type: matchData.event_id_type,
                                                },
                                                { sportId, tournamentId, categoryId, matchTitle },
                                                firstMarket,
                                                firstLine,
                                                outcome,
                                            )}
                                        />
                                    ),
                                )
                            ) : (
                                <span className="truncate text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-2xs">
                                    {t('liveMarketsBackSoon')}
                                </span>
                            )}
                        </div>
                        {mobileHiddenCount > 0 && (
                            <MarketCountAction
                                count={mobileHiddenCount}
                                href={matchDetailHref}
                                className="relative z-20 shrink-0"
                            />
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="shrink-0" style={{ width: MATCH_LIST_LAYOUT.COMPETITOR_CONTENT_WIDTH }}>
                        <MatchInfo
                            match={matchData}
                            sportId={sportId}
                            trailLabels={trailLabels}
                            isMobileLayout={isMobileLayout}
                        />
                    </div>

                    <div className="flex h-[98px] shrink-0 items-end justify-center">
                        <div className="h-[72px] w-px bg-[var(--brand-match-divider,var(--filltext-ft-c))]" />
                    </div>

                    <div className="flex h-[70px] min-w-0 flex-1 items-stretch">
                        <OddsColumns
                            match={matchData}
                            sportId={sportId}
                            categoryId={categoryId}
                            tournamentId={tournamentId}
                            matchTitle={matchTitle}
                            maxVisibleMarkets={maxVisibleMarkets}
                            isMobileLayout={isMobileLayout}
                            columnMarkets={columnMarkets}
                            marketColumnWidths={marketColumnWidths}
                            hiddenCount={hiddenCount}
                            isMock={isMock}
                        />
                    </div>
                </>
            )}
        </article>
    );
};
