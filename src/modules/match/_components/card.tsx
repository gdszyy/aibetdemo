'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type FC, Fragment, useMemo } from 'react';
import type { MarketColumns, MatchEvent } from '@/api/models/match-game';
import { MatchStatus } from '@/api/models/match-game';
import { MatchBroadcastFilled } from '@/components/icons2/MatchBroadcastFilled';
import { MatchPinOutlined } from '@/components/icons2/MatchPinOutlined';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { ConditionalTooltip } from '@/components/tooltip';
import { useIntentPrefetch } from '@/hooks/use-intent-prefetch';
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
    /** Tournament logo from parent TournamentGroup */
    tournamentLogo?: string;
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

const MatchTrail: FC<{ labels: string[]; logo?: string }> = ({ labels, logo }) => {
    const visibleLabels = labels.filter((label) => label.trim());

    return (
        <div className="flex h-4 max-w-full items-center overflow-hidden whitespace-nowrap">
            {logo && (
                <span className="relative mr-1 flex size-4 shrink-0 items-center justify-center">
                    <Image src={logo} alt="" width={16} height={16} className="size-full object-contain" />
                </span>
            )}
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

const TeamLogo: FC<{ logo?: string; name: string; tone: 'home' | 'away' }> = ({ logo, name, tone }) => (
    <span
        className={cn(
            'relative flex size-[18px] shrink-0 items-center justify-center overflow-hidden rounded-full text-[10px] font-bold text-white',
            tone === 'home' ? 'bg-brand-primary-0' : 'bg-auxiliary-blue',
        )}
    >
        {logo ? (
            <Image src={logo} alt="" width={18} height={18} className="size-full object-contain" />
        ) : (
            name.charAt(0).toUpperCase()
        )}
    </span>
);

const TeamIdentity: FC<{ logo?: string; name: string; strong?: boolean; tone: 'home' | 'away' }> = ({
    logo,
    name,
    strong = false,
    tone,
}) => (
    <div className="flex min-w-0 items-center gap-1.5">
        <TeamLogo logo={logo} name={name} tone={tone} />
        <TeamName name={name} strong={strong} />
    </div>
);

const MatchInfo: FC<{
    match: MatchEvent;
    sportId: string;
    trailLabels: string[];
    trailLogo?: string;
    isMobileLayout: boolean;
}> = ({ match, sportId, trailLabels, trailLogo, isMobileLayout }) => {
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
            <MatchTrail labels={trailLabels} logo={trailLogo} />

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
                            <TeamIdentity
                                logo={match.home_competitor.logo}
                                name={match.home_competitor.name}
                                strong={homeIsLeading}
                                tone="home"
                            />
                        </div>
                        <div className="flex h-[18px] min-w-0 items-center justify-between gap-3">
                            <TeamIdentity
                                logo={match.away_competitor.logo}
                                name={match.away_competitor.name}
                                strong={awayIsLeading}
                                tone="away"
                            />
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
    tournamentLogo,
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
    const componentProfile = useThemeComponentProfile();

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
    // 悬停 / 触摸 / 聚焦卡片时预取详情路由，消除点击跳转的冷导航卡顿。
    const detailLinkIntent = useIntentPrefetch(matchDetailHref);

    if (!shouldShowMatchInList(matchData)) return null;
    if (hideZeroMarketCount && batchMarketCount === 0) return null;

    const desktopVisibleMarketCount = orderedMarkets.filter((market) => (market?.lines.length ?? 0) > 0).length;
    const hiddenCount = Math.max(totalMarketCount - desktopVisibleMarketCount, 0);
    const mobileHiddenCount = Math.max(totalMarketCount - (firstLine ? 1 : 0), 0);
    const useStackedMatchLayout = componentProfile.matchCard.useStackedMobileOdds && isMobileLayout;
    const useStackedLayout = isMobileLayout || useStackedMatchLayout;

    if (componentProfile.matchCard.profile === 'superbet-promo-card') {
        const superbetHiddenCount = Math.max(totalMarketCount - (firstMarket ? 1 : 0), 0);
        const isLive = matchData.status === MatchStatus.Live;
        const homeIsLeading = isLive && matchData.home_competitor.score > matchData.away_competitor.score;
        const awayIsLeading = isLive && matchData.away_competitor.score > matchData.home_competitor.score;
        const periodScoreMode = isMobileLayout ? PeriodScoreDisplayMode.MobileList : PeriodScoreDisplayMode.FullPeriods;
        const showOnlyTotalScore = isMobileLayout && (isBasketballSport(sportId) || isRugbySport(sportId));
        const renderSuperbetStatus = () =>
            isLive ? (
                <MatchLiveMetaLine
                    sportId={sportId}
                    matchStatus={matchData.match_status}
                    matchClock={matchData.match_clock}
                    matchClockOffset={matchData.match_clock_offset}
                />
            ) : (
                <UpcomingMetaLine startTime={matchData.start_time} />
            );
        const renderSuperbetOdds = () => (
            <div
                className="relative z-20 flex h-[var(--brand-odds-short-height,32px)] min-w-0 items-center gap-2"
                onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                }}
            >
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
                {superbetHiddenCount > 0 && (
                    <MarketCountAction
                        count={superbetHiddenCount}
                        href={matchDetailHref}
                        className="relative z-20 shrink-0"
                    />
                )}
            </div>
        );

        return (
            <article
                className={cn(
                    'group/card relative flex w-full flex-col overflow-hidden rounded-[var(--brand-match-card-radius,10px)] p-3 transition-[background-color,box-shadow,transform]',
                    'border border-[color:var(--brand-match-card-border,var(--border-subtle))] [background:var(--brand-match-card-bg,var(--surface-1))] [box-shadow:var(--brand-match-card-shadow,var(--style-card-shadow))]',
                    'hover:[background:var(--brand-match-card-hover-bg,var(--interactive-card-hover-bg))] hover:[transform:var(--component-match-card-hover-transform,none)]',
                    isMobileLayout
                        ? 'min-h-[var(--component-superbet-mobile-card-min-height,148px)] gap-2'
                        : 'min-h-[var(--component-superbet-promo-card-min-height,160px)] gap-3',
                    className,
                )}
                data-brand-match-card=""
                data-match-card-profile={componentProfile.matchCard.profile}
                data-match-card-layout={
                    isMobileLayout
                        ? componentProfile.matchCard.mobileListLayout
                        : componentProfile.matchCard.desktopListLayout
                }
                data-match-card-interaction={componentProfile.matchCard.interaction}
                data-odds-profile={componentProfile.oddsButton.profile}
                data-odds-layout="superbet-promo-row"
                {...detailLinkIntent}
                style={componentProfile.style}
            >
                <Link
                    href={matchDetailHref}
                    scroll={true}
                    className="absolute inset-0 z-10 rounded-[var(--brand-match-card-radius,10px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0"
                >
                    <span className="sr-only">{matchTitle}</span>
                </Link>

                <div className="flex min-h-[var(--component-superbet-card-header-height,24px)] min-w-0 items-start justify-between gap-2">
                    <MatchTrail labels={trailLabels} logo={tournamentLogo} />
                    <span className="relative z-20 shrink-0 rounded-full bg-[var(--brand-odds-bg,var(--surface-selected))] px-2 py-0.5 text-[var(--slip-accent,var(--brand-primary-0))] text-auxiliary-2xs font-bold uppercase tracking-normal">
                        Criar Aposta
                    </span>
                </div>

                <div className="flex min-h-[64px] min-w-0 items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex h-4 min-w-0 items-center">{renderSuperbetStatus()}</div>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex h-[18px] min-w-0 items-center justify-between gap-2">
                                <TeamIdentity
                                    logo={matchData.home_competitor.logo}
                                    name={matchData.home_competitor.name}
                                    strong={homeIsLeading}
                                    tone="home"
                                />
                            </div>
                            <div className="flex h-[18px] min-w-0 items-center justify-between gap-2">
                                <TeamIdentity
                                    logo={matchData.away_competitor.logo}
                                    name={matchData.away_competitor.name}
                                    strong={awayIsLeading}
                                    tone="away"
                                />
                                {!isLive && (
                                    <MatchBroadcastFilled className="relative z-20 size-4 shrink-0 text-[var(--brand-match-muted,var(--filltext-ft-f))]" />
                                )}
                            </div>
                        </div>
                    </div>

                    {isLive && (
                        <PeriodScoreTable
                            homeCells={getSportPeriodScoreCells({
                                periodScores: matchData.period_score,
                                side: 'home',
                                total: matchData.home_competitor.score,
                                opponentTotal: matchData.away_competitor.score,
                                matchStatus: matchData.status,
                                sportId,
                                mode: periodScoreMode,
                                showOnlyTotal: showOnlyTotalScore,
                            })}
                            awayCells={getSportPeriodScoreCells({
                                periodScores: matchData.period_score,
                                side: 'away',
                                total: matchData.away_competitor.score,
                                opponentTotal: matchData.home_competitor.score,
                                matchStatus: matchData.status,
                                sportId,
                                mode: periodScoreMode,
                                showOnlyTotal: showOnlyTotalScore,
                            })}
                            className="shrink-0"
                        />
                    )}
                </div>

                <div className="h-px w-full bg-[var(--brand-match-divider,var(--filltext-ft-c))]" />
                {renderSuperbetOdds()}
            </article>
        );
    }

    if (componentProfile.matchCard.profile === 'betano-ticket-row') {
        const betanoHiddenCount = Math.max(totalMarketCount - (firstMarket ? 1 : 0), 0);
        const isLive = matchData.status === MatchStatus.Live;
        const homeIsLeading = isLive && matchData.home_competitor.score > matchData.away_competitor.score;
        const awayIsLeading = isLive && matchData.away_competitor.score > matchData.home_competitor.score;
        const renderBetanoStatus = () =>
            isLive ? (
                <MatchLiveMetaLine
                    sportId={sportId}
                    matchStatus={matchData.match_status}
                    matchClock={matchData.match_clock}
                    matchClockOffset={matchData.match_clock_offset}
                />
            ) : (
                <UpcomingMetaLine startTime={matchData.start_time} />
            );

        if (!isMobileLayout) {
            return (
                <article
                    className={cn(
                        'group/card relative flex min-h-[var(--component-betano-desktop-match-row-height,74px)] w-full items-center overflow-hidden rounded-[var(--brand-match-card-radius,12px)] px-3 py-2 transition-[background-color,box-shadow,transform]',
                        'border border-[color:var(--brand-match-card-border,var(--border-subtle))] [background:var(--brand-match-card-bg,var(--surface-1))] [box-shadow:var(--brand-match-card-shadow,none)]',
                        'hover:[background:var(--brand-match-card-hover-bg,var(--interactive-card-hover-bg))] hover:[transform:var(--component-match-card-hover-transform,none)]',
                        className,
                    )}
                    data-brand-match-card=""
                    data-match-card-profile={componentProfile.matchCard.profile}
                    data-match-card-layout={componentProfile.matchCard.desktopListLayout}
                    data-match-card-interaction={componentProfile.matchCard.interaction}
                    data-odds-profile={componentProfile.oddsButton.profile}
                    data-odds-layout="betano-desktop-row"
                    {...detailLinkIntent}
                    style={componentProfile.style}
                >
                    <Link
                        href={matchDetailHref}
                        scroll={true}
                        className="absolute inset-0 z-10 rounded-[var(--brand-match-card-radius,12px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0"
                    >
                        <span className="sr-only">{matchTitle}</span>
                    </Link>

                    <div
                        className="flex shrink-0 flex-col items-start justify-center gap-1 pr-3"
                        style={{ width: 'var(--component-betano-desktop-time-column-width,86px)' }}
                    >
                        {renderBetanoStatus()}
                    </div>

                    <div className="h-12 w-px shrink-0 bg-[var(--brand-match-divider,var(--filltext-ft-c))]" />

                    <div className="flex min-w-0 flex-1 items-center gap-3 pl-3">
                        <div
                            className="flex min-w-0 shrink-0 flex-col justify-center gap-1"
                            style={{ width: 'var(--component-betano-desktop-team-column-width,390px)' }}
                        >
                            <div className="flex h-[18px] min-w-0 items-center gap-2">
                                <TeamIdentity
                                    logo={matchData.home_competitor.logo}
                                    name={matchData.home_competitor.name}
                                    strong={homeIsLeading}
                                    tone="home"
                                />
                            </div>
                            <div className="flex h-[18px] min-w-0 items-center gap-2">
                                <TeamIdentity
                                    logo={matchData.away_competitor.logo}
                                    name={matchData.away_competitor.name}
                                    strong={awayIsLeading}
                                    tone="away"
                                />
                            </div>
                        </div>

                        {isLive && (
                            <PeriodScoreTable
                                homeCells={getSportPeriodScoreCells({
                                    periodScores: matchData.period_score,
                                    side: 'home',
                                    total: matchData.home_competitor.score,
                                    opponentTotal: matchData.away_competitor.score,
                                    matchStatus: matchData.status,
                                    sportId,
                                    mode: PeriodScoreDisplayMode.FullPeriods,
                                })}
                                awayCells={getSportPeriodScoreCells({
                                    periodScores: matchData.period_score,
                                    side: 'away',
                                    total: matchData.away_competitor.score,
                                    opponentTotal: matchData.home_competitor.score,
                                    matchStatus: matchData.status,
                                    sportId,
                                    mode: PeriodScoreDisplayMode.FullPeriods,
                                })}
                                className="shrink-0"
                            />
                        )}

                        <div
                            className="relative z-20 ml-auto flex h-[var(--brand-odds-short-height,36px)] min-w-[280px] max-w-[388px] flex-1 items-center gap-2"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }}
                        >
                            {firstLine && firstMarket ? (
                                firstLineOutcomes.map((outcome) =>
                                    isMock ? (
                                        <BetBtnShortBase
                                            key={outcome.id}
                                            outcome={outcome}
                                            className="pointer-events-none relative z-20 max-w-[124px] cursor-default"
                                        />
                                    ) : (
                                        <BetBtnShort
                                            key={outcome.id}
                                            className="relative z-20 max-w-[124px]"
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

                        <div className="relative z-20 flex w-14 shrink-0 items-center justify-end gap-1">
                            {betanoHiddenCount > 0 && (
                                <MarketCountAction count={betanoHiddenCount} href={matchDetailHref} />
                            )}
                            <MatchPinOutlined className="size-4 shrink-0 text-[var(--brand-match-muted,var(--filltext-ft-g))]" />
                        </div>
                    </div>
                </article>
            );
        }

        return (
            <article
                className={cn(
                    'group/card relative flex h-[var(--component-betano-mobile-match-card-height,130px)] w-full flex-col gap-2 overflow-hidden rounded-[var(--brand-match-card-radius,12px)] bg-surface-1 p-2 transition-[background-color,box-shadow,transform]',
                    'border border-[color:var(--brand-match-card-border,var(--border-subtle))] [background:var(--brand-match-card-bg,var(--surface-1))] [box-shadow:var(--brand-match-card-shadow,none)]',
                    'hover:[background:var(--brand-match-card-hover-bg,var(--interactive-card-hover-bg))] hover:[transform:var(--component-match-card-hover-transform,none)]',
                    className,
                )}
                data-brand-match-card=""
                data-match-card-profile={componentProfile.matchCard.profile}
                data-match-card-layout={componentProfile.matchCard.mobileListLayout}
                data-match-card-interaction={componentProfile.matchCard.interaction}
                data-odds-profile={componentProfile.oddsButton.profile}
                data-odds-layout="betano-mobile-card"
                {...detailLinkIntent}
                style={componentProfile.style}
            >
                <Link
                    href={matchDetailHref}
                    scroll={true}
                    className="absolute inset-0 z-10 rounded-[var(--brand-match-card-radius,12px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0"
                >
                    <span className="sr-only">{matchTitle}</span>
                </Link>

                <div className="flex h-4 min-w-0 items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1">{renderBetanoStatus()}</div>
                    <div className="relative z-20 flex shrink-0 items-center gap-2">
                        <MatchPinOutlined className="size-4 text-[var(--brand-match-muted,var(--filltext-ft-g))]" />
                    </div>
                </div>

                <div className="flex min-h-[56px] min-w-0 items-center gap-2">
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex h-[18px] min-w-0 items-center justify-between gap-2">
                            <TeamIdentity
                                logo={matchData.home_competitor.logo}
                                name={matchData.home_competitor.name}
                                strong={homeIsLeading}
                                tone="home"
                            />
                        </div>
                        <div className="flex h-[18px] min-w-0 items-center justify-between gap-2">
                            <TeamIdentity
                                logo={matchData.away_competitor.logo}
                                name={matchData.away_competitor.name}
                                strong={awayIsLeading}
                                tone="away"
                            />
                            {matchData.status !== MatchStatus.Live && (
                                <MatchBroadcastFilled className="relative z-20 size-4 shrink-0 text-[var(--brand-match-muted,var(--filltext-ft-f))]" />
                            )}
                        </div>
                        <MatchTrail labels={trailLabels} logo={tournamentLogo} />
                    </div>

                    {matchData.status === MatchStatus.Live && (
                        <PeriodScoreTable
                            homeCells={getSportPeriodScoreCells({
                                periodScores: matchData.period_score,
                                side: 'home',
                                total: matchData.home_competitor.score,
                                opponentTotal: matchData.away_competitor.score,
                                matchStatus: matchData.status,
                                sportId,
                                mode: isMobileLayout
                                    ? PeriodScoreDisplayMode.MobileList
                                    : PeriodScoreDisplayMode.FullPeriods,
                                showOnlyTotal: isMobileLayout && (isBasketballSport(sportId) || isRugbySport(sportId)),
                            })}
                            awayCells={getSportPeriodScoreCells({
                                periodScores: matchData.period_score,
                                side: 'away',
                                total: matchData.away_competitor.score,
                                opponentTotal: matchData.home_competitor.score,
                                matchStatus: matchData.status,
                                sportId,
                                mode: isMobileLayout
                                    ? PeriodScoreDisplayMode.MobileList
                                    : PeriodScoreDisplayMode.FullPeriods,
                                showOnlyTotal: isMobileLayout && (isBasketballSport(sportId) || isRugbySport(sportId)),
                            })}
                            className="shrink-0"
                        />
                    )}
                </div>

                <div
                    className="relative z-20 flex h-[var(--brand-odds-short-height,36px)] min-w-0 items-center gap-1.5"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                >
                    {firstLine && firstMarket ? (
                        firstLineOutcomes.map((outcome) =>
                            isMock ? (
                                <BetBtnShortBase
                                    key={outcome.id}
                                    outcome={outcome}
                                    className="pointer-events-none cursor-default"
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
                    {betanoHiddenCount > 0 && (
                        <MarketCountAction
                            count={betanoHiddenCount}
                            href={matchDetailHref}
                            className="relative z-20 shrink-0"
                        />
                    )}
                </div>
            </article>
        );
    }

    return (
        <article
            className={cn(
                'group/card relative w-full overflow-hidden rounded-[var(--brand-match-card-radius,4px)] bg-surface-1 transition-[background-color,box-shadow,transform]',
                'border border-[color:var(--brand-match-card-border,var(--border-subtle))] [background:var(--brand-match-card-bg,var(--surface-1))] [box-shadow:var(--brand-match-card-shadow,var(--style-card-shadow))]',
                'hover:[background:var(--brand-match-card-hover-bg,var(--interactive-card-hover-bg))] hover:[transform:var(--component-match-card-hover-transform,none)] md:hover:[box-shadow:var(--interactive-card-hover-shadow,var(--brand-match-card-shadow,var(--style-card-shadow)))]',
                useStackedMatchLayout
                    ? 'flex flex-col gap-1.5 px-3 py-2.5'
                    : useStackedLayout
                      ? 'flex flex-col gap-2 p-3'
                      : 'flex items-end gap-4 px-3 py-2.5',
                className,
            )}
            data-brand-match-card=""
            data-match-card-profile={componentProfile.matchCard.profile}
            data-match-card-layout={componentProfile.matchCard.listLayout}
            data-match-card-interaction={componentProfile.matchCard.interaction}
            data-odds-profile={componentProfile.oddsButton.profile}
            data-odds-layout={useStackedMatchLayout ? 'stacked' : undefined}
            {...detailLinkIntent}
            style={componentProfile.style}
        >
            <Link
                href={matchDetailHref}
                scroll={true}
                className="absolute inset-0 z-10 rounded-[var(--brand-match-card-radius,4px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0"
            >
                <span className="sr-only">{matchTitle}</span>
            </Link>
            {useStackedLayout ? (
                <>
                    <div className="flex min-w-0 items-start gap-2">
                        <MatchInfo
                            match={matchData}
                            sportId={sportId}
                            trailLabels={trailLabels}
                            trailLogo={tournamentLogo}
                            isMobileLayout={isMobileLayout}
                        />
                        <MatchPinOutlined className="relative z-20 size-4 shrink-0 text-filltext-ft-g" />
                    </div>

                    <div className="h-px w-full bg-[var(--brand-match-divider,var(--filltext-ft-c))]" />

                    <div
                        className={cn(
                            'flex h-[var(--brand-odds-short-height,2rem)] min-w-0 items-center',
                            useStackedMatchLayout ? 'gap-2' : 'gap-4',
                        )}
                    >
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
                            trailLogo={tournamentLogo}
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
