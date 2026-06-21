'use client';

import { useTranslations } from 'next-intl';
import { type FC, Fragment, useMemo } from 'react';
import type { MarketGroup, MarketLine, OutcomeModel } from '@/api/models/market';
import { type MatchEvent, MatchStatus, type TournamentGroup } from '@/api/models/match-game';
import { MatchBroadcastFilled } from '@/components/icons2/MatchBroadcastFilled';
import { ConditionalTooltip } from '@/components/tooltip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useIsMobile } from '@/hooks/use-media-query';
import { Link } from '@/i18n';
import { BetBtnShort } from '@/modules/match/_components/bet-btn-short';
import { BetBtnShortBase } from '@/modules/match/_components/bet-btn-short-base';
import { MarketCountAction } from '@/modules/match/_components/market-count-action';
import { MatchLiveMetaLine } from '@/modules/match/_components/match-live-meta-line';
import { PeriodScoreTable } from '@/modules/match/_components/period-score-table';
import { useMatchRowCount } from '@/modules/match/_hooks/use-match-row-count';
import { createOddsEntity } from '@/modules/match/_logic/odds-factory';
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
import type { HotLeagueMatchCarouselVariant } from './types';

interface HotLeagueMatchCardProps {
    group: TournamentGroup;
    isMock?: boolean;
    match: MatchEvent;
    variant: HotLeagueMatchCarouselVariant;
}

type PrimaryMarket = {
    market: MarketGroup;
    line: MarketLine;
    outcomes: OutcomeModel[];
};

const getPrimaryMarket = (match: MatchEvent): PrimaryMarket | null => {
    const market = match.popularMarkets[0] ?? match.markets[0];
    if (!market) return null;

    const lines = getVisibleMarketLines(market.lines, { marketId: market.id });
    const preferredLine = lines.find((line) => line.outcomes.length >= 3) ?? lines[0];
    if (!preferredLine) return null;

    return {
        market: { ...market, lines },
        line: preferredLine,
        outcomes: sortDetailMarketOutcomes(market.id, preferredLine.outcomes).slice(0, 3),
    };
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

const TeamName: FC<{ name: string; strong?: boolean }> = ({ name, strong = false }) => (
    <ConditionalTooltip content={name} side="top">
        <span
            className={cn(
                'truncate text-[var(--brand-match-team-text,var(--filltext-ft-h))] text-body-sm',
                strong && 'text-body-lg',
            )}
        >
            {name}
        </span>
    </ConditionalTooltip>
);

const MarketOfferText: FC = () => {
    const t = useTranslations('matches');

    return (
        <span className="truncate text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-2xs">
            {t('liveMarketsBackSoon')}
        </span>
    );
};

export const HotLeagueMatchCard: FC<HotLeagueMatchCardProps> = ({ group, isMock = false, match, variant }) => {
    const t = useTranslations('matches.hotLeagueMatchCarousel');
    const isMobile = useIsMobile();
    const { formatRelativeShortDate, formatShortTime } = useIntlFormatter();
    const primaryMarket = useMemo(() => getPrimaryMarket(match), [match]);
    const { data: batchMarketCount } = useMatchRowCount(match.event_id, !isMock);
    const marketTotal = batchMarketCount ?? 0;
    const displayedMarketCount = primaryMarket ? 1 : 0;
    const hiddenMarketCount = Math.max(marketTotal - displayedMarketCount, 0);
    const startDate = new Date(match.start_time * 1000);
    const dateLabel = formatRelativeShortDate(startDate).toLocaleLowerCase();
    const matchTitle = `${match.home_competitor.name} vs ${match.away_competitor.name}`;
    const isLive = match.status === MatchStatus.Live;
    const isLiveVariant = variant === 'live';
    const metaTrail = [group.sport_name, group.category_name, group.tournament_name].filter((label) => label?.trim());
    const showMarketOffer = !primaryMarket;
    const matchDetailHref = isMock ? `/sports/${group.sport_id}` : `/matches/${match.event_id}`;
    const periodScoreMode = isMobile ? PeriodScoreDisplayMode.MobileList : PeriodScoreDisplayMode.FullPeriods;
    const showOnlyTotalScore = isMobile && (isBasketballSport(group.sport_id) || isRugbySport(group.sport_id));
    const homeScoreCells = getSportPeriodScoreCells({
        periodScores: match.period_score,
        side: 'home',
        total: match.home_competitor.score,
        opponentTotal: match.away_competitor.score,
        matchStatus: match.status,
        sportId: group.sport_id,
        mode: periodScoreMode,
        showOnlyTotal: showOnlyTotalScore,
    });
    const awayScoreCells = getSportPeriodScoreCells({
        periodScores: match.period_score,
        side: 'away',
        total: match.away_competitor.score,
        opponentTotal: match.home_competitor.score,
        matchStatus: match.status,
        sportId: group.sport_id,
        mode: periodScoreMode,
        showOnlyTotal: showOnlyTotalScore,
    });
    const isLiveScoreVisible = isLiveVariant || isLive;
    const hasPeriodScore = homeScoreCells.some((cell) => cell.key !== 'total');
    const showPeriodScore = isLiveScoreVisible && hasPeriodScore;
    const showInlineScore = isLiveScoreVisible && !showPeriodScore;
    const showFallbackIcon = !isLive && !showPeriodScore;

    if (!shouldShowMatchInList(match)) return null;

    return (
        <Link
            href={matchDetailHref}
            scroll={true}
            className={cn(
                'block w-full min-w-0 shrink-0 rounded-sm border border-[color:var(--brand-match-card-border,var(--border-subtle))] p-2 transition-colors [background:var(--brand-match-card-bg,var(--surface-1))] [box-shadow:var(--brand-match-card-shadow,var(--style-card-shadow))] hover:[background:var(--brand-match-card-hover-bg,var(--surface-2))] md:w-[256px]',
                'h-[130px]',
            )}
            data-brand-match-card=""
        >
            <div className="flex h-full flex-col gap-1.5">
                <div className="flex h-4 min-w-0 items-center justify-center overflow-hidden whitespace-nowrap text-[var(--brand-match-muted,var(--filltext-ft-e))] text-auxiliary-2xs">
                    {metaTrail.map((label, index) => (
                        <Fragment key={`${match.event_id}-${label}`}>
                            {index > 0 && <DotSeparator />}
                            <span className="truncate">{label}</span>
                        </Fragment>
                    ))}
                </div>

                <div className="flex h-[54px] items-center gap-3">
                    <div className="flex h-full min-w-0 flex-1 flex-col gap-1.5">
                        <div className="flex h-4 min-w-0 items-center text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-xs font-light">
                            {isLive ? (
                                <MatchLiveMetaLine
                                    sportId={group.sport_id}
                                    matchStatus={match.match_status}
                                    matchClock={match.match_clock}
                                    matchClockOffset={match.match_clock_offset}
                                />
                            ) : (
                                <span className="truncate">{`${dateLabel}, ${formatShortTime(startDate)}`}</span>
                            )}
                        </div>

                        <div className={cn('flex flex-col gap-2', isLiveVariant ? 'h-[46px]' : 'h-11')}>
                            <div className="flex h-[18px] min-w-0 items-center justify-between gap-3">
                                <TeamName name={match.home_competitor.name} strong={isLiveVariant || isLive} />
                                {showInlineScore && (
                                    <span className="w-7 shrink-0 text-center text-[var(--brand-match-team-text,var(--filltext-ft-h))] text-body-lg tabular-nums">
                                        {match.home_competitor.score}
                                    </span>
                                )}
                            </div>
                            <div className="flex h-[18px] min-w-0 items-center justify-between gap-3">
                                <TeamName name={match.away_competitor.name} />
                                {showInlineScore ? (
                                    <span className="w-7 shrink-0 text-center text-[var(--brand-match-muted,var(--filltext-ft-g))] text-body-sm tabular-nums">
                                        {match.away_competitor.score}
                                    </span>
                                ) : showFallbackIcon ? (
                                    <MatchBroadcastFilled className="size-4 shrink-0 text-filltext-ft-f" />
                                ) : null}
                            </div>
                        </div>
                    </div>
                    {showPeriodScore && (
                        <PeriodScoreTable homeCells={homeScoreCells} awayCells={awayScoreCells} className="shrink-0" />
                    )}
                </div>

                <div className="mt-auto h-px bg-[var(--brand-match-divider,var(--filltext-ft-d))]" />

                <div className="flex h-8 items-center gap-2">
                    <div
                        className="flex min-w-0 flex-1 gap-2"
                        onClick={
                            primaryMarket
                                ? (event) => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                  }
                                : undefined
                        }
                    >
                        {showMarketOffer ? (
                            <MarketOfferText />
                        ) : primaryMarket ? (
                            primaryMarket.outcomes.map((outcome) =>
                                isMock ? (
                                    <BetBtnShortBase
                                        key={outcome.id}
                                        outcome={outcome}
                                        className="pointer-events-none cursor-default"
                                    />
                                ) : (
                                    <BetBtnShort
                                        key={outcome.id}
                                        oddsEntity={createOddsEntity(
                                            {
                                                event_id: match.event_id,
                                                event_id_type: match.event_id_type,
                                            },
                                            {
                                                sportId: group.sport_id,
                                                tournamentId: group.tournament_id,
                                                categoryId: group.category_id,
                                                matchTitle,
                                            },
                                            primaryMarket.market,
                                            primaryMarket.line,
                                            outcome,
                                        )}
                                    />
                                ),
                            )
                        ) : null}
                    </div>
                    {batchMarketCount !== undefined && (
                        <MarketCountAction
                            count={hiddenMarketCount > 0 ? hiddenMarketCount : marketTotal}
                            href={matchDetailHref}
                            className="shrink-0"
                        />
                    )}
                    <span className="sr-only">{t('exploreMarkets')}</span>
                </div>
            </div>
        </Link>
    );
};
