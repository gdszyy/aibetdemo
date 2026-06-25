'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type FC, Fragment, useMemo } from 'react';
import type { MarketGroup, MarketLine, OutcomeModel } from '@/api/models/market';
import { type MatchEvent, MatchStatus, type TournamentGroup } from '@/api/models/match-game';
import { MatchBroadcastFilled } from '@/components/icons2/MatchBroadcastFilled';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { ConditionalTooltip } from '@/components/tooltip';
import { useIntentPrefetch } from '@/hooks/use-intent-prefetch';
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
                'min-w-0 truncate leading-[18px] text-[var(--brand-match-team-text,var(--filltext-ft-h))] text-body-sm',
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

const LeagueLogo: FC<{ logo?: string; name: string }> = ({ logo, name }) => {
    if (!logo) return null;

    return (
        <span className="relative mr-1 flex size-4 shrink-0 items-center justify-center">
            <Image src={logo} alt={name} width={16} height={16} className="size-full object-contain" />
        </span>
    );
};

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
    const componentProfile = useThemeComponentProfile();
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
    const tournamentLogo = group.tournament_logo;
    const metaTrail = [group.sport_name, group.category_name, group.tournament_name].filter((label) => label?.trim());
    const showMarketOffer = !primaryMarket;
    const matchDetailHref = isMock ? `/sports/${group.sport_id}` : `/matches/${match.event_id}`;
    // 悬停 / 触摸 / 聚焦卡片时预取详情路由，消除点击跳转的冷导航卡顿。
    const detailLinkIntent = useIntentPrefetch(matchDetailHref);
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
    const useStackedOddsLayout = componentProfile.matchCard.useStackedMobileOdds && isMobile;
    const isBetanoRecommendCard = componentProfile.homeRecommend.profile === 'betano-ticket-feed';
    const isSuperbetRecommendCard = componentProfile.homeRecommend.profile === 'superbet-promo-rail';

    if (!shouldShowMatchInList(match)) return null;

    if (isBetanoRecommendCard) {
        return (
            <Link
                href={matchDetailHref}
                scroll={true}
                className={cn(
                    'block h-[146px] w-[min(var(--component-recommend-card-width,344px),calc(100vw-24px))] min-w-0 shrink-0 rounded-[var(--component-recommend-card-radius,var(--brand-match-card-radius,12px))] border border-[color:var(--brand-match-card-border,var(--border-subtle))] p-2.5 transition-[background-color,border-color,transform] [background:var(--brand-match-card-bg,var(--surface-1))] hover:border-[color:var(--brand-primary-0)] hover:[background:var(--brand-match-card-hover-bg,var(--surface-2))] hover:[transform:var(--component-match-card-hover-transform,none)] md:w-[var(--component-recommend-card-width,344px)]',
                )}
                data-brand-match-card=""
                data-home-recommend-card-profile={componentProfile.homeRecommend.profile}
                data-home-recommend-card-density={componentProfile.homeRecommend.cardDensity}
                data-home-recommend-selection-layout={componentProfile.homeRecommend.selectionLayout}
                data-home-recommend-interaction={componentProfile.homeRecommend.interaction}
                {...detailLinkIntent}
                data-match-card-profile={componentProfile.matchCard.profile}
                data-odds-profile={componentProfile.oddsButton.profile}
                style={componentProfile.style}
            >
                <div className="flex h-full flex-col gap-2">
                    <div className="flex h-4 min-w-0 items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1">
                            {isLive ? (
                                <MatchLiveMetaLine
                                    sportId={group.sport_id}
                                    matchStatus={match.match_status}
                                    matchClock={match.match_clock}
                                    matchClockOffset={match.match_clock_offset}
                                />
                            ) : (
                                <span className="truncate text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-xs">
                                    {`${dateLabel}, ${formatShortTime(startDate)}`}
                                </span>
                            )}
                        </div>
                        <span className="shrink-0 rounded bg-[var(--brand-odds-bg,var(--surface-2))] px-1.5 text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-2xs">
                            {primaryMarket?.market.name ?? t('exploreMarkets')}
                        </span>
                    </div>

                    <div className="flex min-h-0 flex-1 items-center gap-2">
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex h-[18px] min-w-0 items-center justify-between gap-2">
                                <TeamIdentity
                                    logo={match.home_competitor.logo}
                                    name={match.home_competitor.name}
                                    strong={isLiveVariant || isLive}
                                    tone="home"
                                />
                                {showInlineScore && (
                                    <span className="w-7 shrink-0 text-right text-[var(--brand-match-team-text,var(--filltext-ft-h))] text-body-lg tabular-nums">
                                        {match.home_competitor.score}
                                    </span>
                                )}
                            </div>
                            <div className="flex h-[18px] min-w-0 items-center justify-between gap-2">
                                <TeamIdentity
                                    logo={match.away_competitor.logo}
                                    name={match.away_competitor.name}
                                    tone="away"
                                />
                                {showInlineScore ? (
                                    <span className="w-7 shrink-0 text-right text-[var(--brand-match-muted,var(--filltext-ft-g))] text-body-sm tabular-nums">
                                        {match.away_competitor.score}
                                    </span>
                                ) : showFallbackIcon ? (
                                    <MatchBroadcastFilled className="size-4 shrink-0 text-[var(--brand-match-muted,var(--filltext-ft-f))]" />
                                ) : null}
                            </div>
                            <div className="flex h-4 min-w-0 items-center overflow-hidden whitespace-nowrap text-[var(--brand-match-muted,var(--filltext-ft-g))] text-auxiliary-2xs">
                                <LeagueLogo logo={tournamentLogo} name={group.tournament_name} />
                                {metaTrail.map((label, index) => (
                                    <Fragment key={`${match.event_id}-betano-${label}`}>
                                        {index > 0 && <DotSeparator />}
                                        <span className="truncate">{label}</span>
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                        {showPeriodScore && (
                            <PeriodScoreTable
                                homeCells={homeScoreCells}
                                awayCells={awayScoreCells}
                                className="shrink-0"
                            />
                        )}
                    </div>

                    <div
                        className="relative z-20 flex h-[var(--brand-odds-short-height,36px)] min-w-0 items-center gap-1.5"
                        data-odds-layout="ticket"
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
    }

    return (
        <Link
            href={matchDetailHref}
            scroll={true}
            className={cn(
                'group/card block w-full min-w-0 shrink-0 rounded-[var(--brand-match-card-radius,4px)] border border-[color:var(--brand-match-card-border,var(--border-subtle))] p-2 transition-[background-color,box-shadow,transform] [background:var(--brand-match-card-bg,var(--surface-1))] [box-shadow:var(--brand-match-card-shadow,var(--style-card-shadow))] hover:[background:var(--brand-match-card-hover-bg,var(--surface-2))] hover:[transform:var(--component-match-card-hover-transform,none)] md:w-[256px]',
                isSuperbetRecommendCard
                    ? 'h-[var(--component-superbet-promo-card-min-height,160px)] md:w-[min(var(--component-recommend-card-width,390px),calc(100vw-24px))] md:p-3'
                    : useStackedOddsLayout
                      ? 'h-[156px]'
                      : 'h-[152px]',
            )}
            data-brand-match-card=""
            data-match-card-profile={componentProfile.matchCard.profile}
            data-match-card-layout={componentProfile.matchCard.listLayout}
            data-match-card-interaction={componentProfile.matchCard.interaction}
            {...detailLinkIntent}
            data-odds-profile={componentProfile.oddsButton.profile}
            data-odds-layout={
                isSuperbetRecommendCard ? 'superbet-promo-row' : useStackedOddsLayout ? 'stacked' : undefined
            }
            style={componentProfile.style}
        >
            <div className="flex h-full flex-col gap-1.5">
                <div
                    className={cn(
                        'flex h-4 min-w-0 items-center overflow-hidden whitespace-nowrap text-[var(--brand-match-muted,var(--filltext-ft-e))] text-auxiliary-2xs',
                        isSuperbetRecommendCard ? 'justify-between gap-2' : 'justify-center',
                    )}
                >
                    <div className="flex min-w-0 items-center overflow-hidden">
                        <LeagueLogo logo={tournamentLogo} name={group.tournament_name} />
                        {metaTrail.map((label, index) => (
                            <Fragment key={`${match.event_id}-${label}`}>
                                {index > 0 && <DotSeparator />}
                                <span className="truncate">{label}</span>
                            </Fragment>
                        ))}
                    </div>
                    {isSuperbetRecommendCard && (
                        <span className="shrink-0 rounded-full bg-[var(--brand-odds-bg,var(--surface-selected))] px-2 py-0.5 text-[var(--slip-accent,var(--brand-primary-0))] font-bold uppercase">
                            Criar Aposta
                        </span>
                    )}
                </div>

                <div className="flex h-[68px] items-center gap-3">
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
                                <TeamIdentity
                                    logo={match.home_competitor.logo}
                                    name={match.home_competitor.name}
                                    strong={isLiveVariant || isLive}
                                    tone="home"
                                />
                                {showInlineScore && (
                                    <span className="w-7 shrink-0 text-center text-[var(--brand-match-team-text,var(--filltext-ft-h))] text-body-lg tabular-nums">
                                        {match.home_competitor.score}
                                    </span>
                                )}
                            </div>
                            <div className="flex h-[18px] min-w-0 items-center justify-between gap-3">
                                <TeamIdentity
                                    logo={match.away_competitor.logo}
                                    name={match.away_competitor.name}
                                    tone="away"
                                />
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

                <div className="flex h-[var(--brand-odds-short-height,2rem)] items-center gap-2">
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
