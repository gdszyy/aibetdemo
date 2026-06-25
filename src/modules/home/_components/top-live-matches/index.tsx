'use client';

import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type FC, Fragment, type MouseEvent, useMemo, useState } from 'react';
import { GetBestLiveMatchesInterface } from '@/api/handlers/matches';
import type { MarketGroup, MarketLine } from '@/api/models/market';
import type { MatchEvent, TournamentGroup } from '@/api/models/match-game';
import { BlockTitle2 } from '@/components/block-title-2';
import { CarouselNavButton } from '@/components/carousel-nav-button';
import { CarouselProgress } from '@/components/carousel-progress';
import { DetailLiveSwitch } from '@/components/icons';
import { LiveOutlined } from '@/components/icons2/LiveOutlined';
import { MatchCardLink } from '@/components/match-card-link';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { LSPORTS_SPORT_ID_BY_TYPE } from '@/constants/sports';
import { getSportConfig } from '@/constants/sports-config';
import { useCarousel } from '@/hooks/use-carousel';
import { useGameSubscription } from '@/hooks/use-game-subscription';
import { useIntentPrefetch } from '@/hooks/use-intent-prefetch';
import { useIsMobile } from '@/hooks/use-media-query';
import { useTopSports } from '@/hooks/use-sports';
import { Link } from '@/i18n';
import { BetBtnShort } from '@/modules/match/_components/bet-btn-short';
import { BetBtnShortBase } from '@/modules/match/_components/bet-btn-short-base';
import { MatchLiveMetaLine } from '@/modules/match/_components/match-live-meta-line';
import { useMatchListObserver } from '@/modules/match/_hooks/use-match-list-observer';
import { useMatchRowCount } from '@/modules/match/_hooks/use-match-row-count';
import { createOddsEntity } from '@/modules/match/_logic/odds-factory';
import { getVisibleMarketLines, shouldShowMatchInList } from '@/modules/match/_utils/match-utils';
import { createMockTournamentGroups, withTopLiveMockMarkets } from '@/modules/match/_utils/mock-match-data';
import { sortDetailMarketOutcomes } from '@/modules/match/_utils/outcome-sort';
import { cn } from '@/utils/common';

const TOP_LIVE_LIMIT = 12;
const TOP_LIVE_MARKET_LIMIT = 3;
const TOP_LIVE_SPORT_LIMIT = 5;
const TOP_LIVE_DEFAULT_SPORT_ID = LSPORTS_SPORT_ID_BY_TYPE.football;
// Enough mock cards to fill the PC row and overflow into horizontal scroll when
// no live suggestions are available (real data uses TOP_LIVE_LIMIT).
const TOP_LIVE_MOCK_CARD_COUNT = 6;
const CHAT_AVATARS = [
    '/static/generated/home-assets/avatars/sharp-player.svg',
    '/static/generated/home-assets/avatars/night-runner.svg',
    '/static/generated/home-assets/avatars/golden-guest.svg',
];

type TopLiveSport = {
    sport_id: string;
    name: string;
};

type TopLiveSuggestion = {
    group: TournamentGroup;
    match: MatchEvent;
    isMock?: boolean;
};

type DisplayMarket = {
    /** Market with visible+filtered lines (each line has >= 2 outcomes) */
    market: MarketGroup;
    /** Visible lines (>= 1); multi-line markets get the line switcher */
    lines: MarketLine[];
    /** Default selected line id (prefers is_main_line, else middle, else first) */
    mainLineId: number;
};

const FALLBACK_SPORTS: TopLiveSport[] = [
    { sport_id: LSPORTS_SPORT_ID_BY_TYPE.football, name: 'Futebol' },
    { sport_id: LSPORTS_SPORT_ID_BY_TYPE.tennis, name: 'Tenis' },
    { sport_id: LSPORTS_SPORT_ID_BY_TYPE['table-tennis'], name: 'Tenis de Mesa' },
    { sport_id: LSPORTS_SPORT_ID_BY_TYPE.basketball, name: 'Basquete' },
    { sport_id: LSPORTS_SPORT_ID_BY_TYPE.volleyball, name: 'Volei' },
];

const getSuggestions = (groups: TournamentGroup[]): TopLiveSuggestion[] =>
    groups.flatMap((group) => group.events.filter(shouldShowMatchInList).map((match) => ({ group, match })));

const markMockSuggestions = (groups: TournamentGroup[]): TopLiveSuggestion[] =>
    getSuggestions(groups).map((item) => ({ ...item, isMock: true }));

const getLineLabel = (line: MarketLine): string => {
    if (line.row?.trim()) return line.row.trim();
    if (!line.specifiers?.trim()) return '';

    const [, value] = line.specifiers.split('=');
    return value?.trim() ?? line.specifiers.trim();
};

const toDisplayMarket = (market: MarketGroup): DisplayMarket | null => {
    const lines = getVisibleMarketLines(market.lines, { marketId: market.id }).filter(
        (line) => line.outcomes.length >= 2,
    );
    if (lines.length === 0) return null;

    const mainLine = lines.find((line) => line.is_main_line) ?? lines[Math.floor(lines.length / 2)] ?? lines[0];
    return { market: { ...market, lines }, lines, mainLineId: mainLine.id };
};

/**
 * Fixed three-row layout per sport type:
 *   Row 1 — result / 1X2 (first / most-popular market)
 *   Row 2 — handicap or over/under (first multi-line market: a MarketGroup with >= 2 lines)
 *   Row 3 — dynamic market that shifts with match progress (next remaining market)
 */
const getDisplayMarkets = (match: MatchEvent): DisplayMarket[] => {
    const seen = new Set<string>();
    const candidates: DisplayMarket[] = [];

    for (const market of [...match.popularMarkets, ...match.markets]) {
        const key = `${market.id}:${market.name}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const displayMarket = toDisplayMarket(market);
        if (displayMarket) candidates.push(displayMarket);
    }

    if (candidates.length === 0) return [];

    const [resultMarket, ...rest] = candidates;
    const multiLineIndex = rest.findIndex((candidate) => candidate.lines.length >= 2);
    const handicapIndex = multiLineIndex >= 0 ? multiLineIndex : rest.length > 0 ? 0 : -1;
    const handicapMarket = handicapIndex >= 0 ? rest[handicapIndex] : undefined;
    const remaining = handicapIndex >= 0 ? rest.filter((_, index) => index !== handicapIndex) : rest;
    const dynamicMarket = remaining[0];

    return [resultMarket, handicapMarket, dynamicMarket]
        .filter((candidate): candidate is DisplayMarket => candidate !== undefined)
        .slice(0, TOP_LIVE_MARKET_LIMIT);
};

const SportSwitch: FC<{
    sports: TopLiveSport[];
    selectedSportId: string;
    onSelect: (sportId: string) => void;
}> = ({ onSelect, selectedSportId, sports }) => (
    <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1">
        {sports.map((sport) => {
            const sportConfig = getSportConfig(sport.sport_id);
            const Icon = sportConfig?.icon;
            const isActive = sport.sport_id === selectedSportId;

            return (
                <button
                    key={sport.sport_id}
                    type="button"
                    aria-label={sport.name}
                    title={sport.name}
                    onClick={() => onSelect(sport.sport_id)}
                    className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0',
                        isActive
                            ? 'border-brand-primary-0 bg-brand-primary-0 text-neutral-white-h'
                            : 'border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--brand-match-card-bg,var(--surface-1))] text-[var(--brand-match-muted,var(--filltext-ft-g))] hover:border-brand-primary-0 hover:text-brand-primary-0',
                    )}
                >
                    {Icon ? <Icon className="size-5" /> : <LiveOutlined className="size-5" />}
                </button>
            );
        })}
    </div>
);

const TopLiveSkeleton: FC<{ title: string }> = ({ title }) => (
    <section className="flex min-w-0 w-full flex-col gap-4">
        <BlockTitle2
            icon={LiveOutlined}
            iconClassName="text-brand-primary-0"
            title={title}
            titleClassName="uppercase"
        />
        <div className="flex gap-2">
            {FALLBACK_SPORTS.map((sport) => (
                <div key={sport.sport_id} className="size-10 animate-skeleton-pulse rounded-full bg-filltext-ft-c" />
            ))}
        </div>
        <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="h-[320px] w-full shrink-0 animate-skeleton-pulse rounded-[var(--brand-match-card-radius,12px)] bg-filltext-ft-b md:h-[360px] md:w-[402px]"
                />
            ))}
        </div>
    </section>
);

const DotSeparator: FC = () => (
    <span className="mx-1 size-1 shrink-0 rounded-full bg-[var(--brand-match-muted,var(--filltext-ft-e))]" />
);

const TeamName: FC<{ name: string }> = ({ name }) => (
    <span className="line-clamp-2 min-w-0 text-center text-body-md font-semibold text-[var(--brand-match-team-text,var(--filltext-ft-h))] md:text-body-lg">
        {name}
    </span>
);

const TeamLogo: FC<{ logo?: string; name: string; tone: 'home' | 'away' }> = ({ logo, name, tone }) => (
    <span
        className={cn(
            'relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-title-sm font-bold text-white',
            tone === 'home' ? 'bg-brand-primary-0' : 'bg-auxiliary-blue',
        )}
    >
        {logo ? (
            <Image src={logo} alt="" width={48} height={48} className="size-full object-contain" />
        ) : (
            name.charAt(0).toUpperCase()
        )}
    </span>
);

const TeamSide: FC<{ logo?: string; name: string; tone: 'home' | 'away' }> = ({ logo, name, tone }) => (
    <div className="flex min-w-0 flex-col items-center gap-2">
        <TeamLogo logo={logo} name={name} tone={tone} />
        <TeamName name={name} />
    </div>
);

const LeagueLogo: FC<{ logo?: string }> = ({ logo }) => {
    if (!logo) return null;

    return (
        <span className="relative mr-1 flex size-4 shrink-0 items-center justify-center">
            <Image src={logo} alt="" width={16} height={16} className="size-full object-contain" />
        </span>
    );
};

const stopLinkNavigation = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
};

const TopLiveMarketRow: FC<{
    displayMarket: DisplayMarket;
    group: TournamentGroup;
    isMock: boolean;
    match: MatchEvent;
}> = ({ displayMarket, group, isMock, match }) => {
    const { lines, mainLineId, market } = displayMarket;
    const matchTitle = `${match.home_competitor.name} vs ${match.away_competitor.name}`;
    const [selectedLineId, setSelectedLineId] = useState(mainLineId);

    const { line: selectedLine, outcomes } = useMemo(() => {
        const line = lines.find((candidate) => candidate.id === selectedLineId) ?? lines[0];
        return { line, outcomes: sortDetailMarketOutcomes(market.id, line.outcomes).slice(0, 3) };
    }, [lines, market.id, selectedLineId]);

    const showSwitcher = lines.length >= 2;
    const lineLabel = getLineLabel(selectedLine);

    return (
        <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex min-w-0 items-center justify-between gap-2">
                <span className="truncate text-auxiliary-sm font-semibold text-[var(--brand-match-league-text,var(--filltext-ft-h))]">
                    {market.name}
                </span>
                {showSwitcher ? (
                    <div
                        className="-mr-1 flex min-w-0 shrink items-center gap-1.5 overflow-x-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        onClick={stopLinkNavigation}
                    >
                        {lines.map((line) => {
                            const isActive = line.id === selectedLineId;
                            return (
                                <button
                                    key={line.id}
                                    type="button"
                                    onClick={(event) => {
                                        stopLinkNavigation(event);
                                        setSelectedLineId(line.id);
                                    }}
                                    className={cn(
                                        'flex h-8 min-w-11 shrink-0 items-center justify-center rounded-[var(--component-detail-tab-radius,999px)] border border-[color:var(--brand-match-card-border,var(--border-subtle))] px-3 text-auxiliary-sm font-semibold tabular-nums transition-colors',
                                        isActive
                                            ? '[background:var(--component-detail-tab-active-bg,var(--odds-selected-bg))] text-[var(--component-detail-tab-active-text,var(--odds-selected-text))]'
                                            : 'bg-[var(--brand-odds-bg,var(--surface-1))] text-[var(--brand-match-muted,var(--filltext-ft-g))] hover:bg-[var(--brand-odds-hover-bg,var(--surface-2))] hover:text-[var(--brand-match-team-text,var(--filltext-ft-h))]',
                                    )}
                                >
                                    {getLineLabel(line) || '—'}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    lineLabel && (
                        <span className="shrink-0 rounded-full bg-[var(--brand-odds-bg,var(--surface-selected))] px-2 py-0.5 text-auxiliary-2xs text-[var(--brand-match-muted,var(--filltext-ft-g))] tabular-nums">
                            {lineLabel}
                        </span>
                    )
                )}
            </div>
            <div className="flex min-w-0 gap-2" onClick={stopLinkNavigation}>
                {outcomes.map((outcome) =>
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
                                market,
                                selectedLine,
                                outcome,
                            )}
                        />
                    ),
                )}
            </div>
        </div>
    );
};

const TopLiveCard: FC<TopLiveSuggestion> = ({ group, isMock = false, match }) => {
    const t = useTranslations('matches.hotLeagueMatchCarousel');
    const componentProfile = useThemeComponentProfile();
    const displayMarkets = useMemo(() => getDisplayMarkets(match), [match]);
    const { data: rowCount } = useMatchRowCount(match.event_id, !isMock);
    const isMobile = useIsMobile();
    const matchHref = isMock ? `/sports/${group.sport_id}` : `/matches/${match.event_id}`;
    // 悬停 / 触摸 / 聚焦卡片时预取详情路由，消除点击跳转的冷导航卡顿。
    const detailLinkIntent = useIntentPrefetch(matchHref);
    const metaTrail = [group.category_name, group.tournament_name].filter((label) => label?.trim());
    const hiddenMarketCount = Math.max((rowCount ?? match.live_market_count ?? 0) - displayMarkets.length, 0);

    if (displayMarkets.length === 0) return null;

    return (
        <MatchCardLink
            href={matchHref}
            scroll={true}
            {...detailLinkIntent}
            className="group/topLive relative block min-h-[320px] w-full shrink-0 rounded-[var(--brand-match-card-radius,12px)] border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--brand-match-card-bg,var(--surface-1))] p-3 text-left shadow-[var(--brand-match-card-shadow,var(--style-card-shadow))] transition-colors [--brand-odds-short-height:48px] hover:bg-[var(--brand-match-card-hover-bg,var(--surface-2))] md:min-h-[360px] md:w-[402px]"
            data-brand-match-card=""
            data-match-card-profile={componentProfile.matchCard.profile}
            data-match-card-layout={componentProfile.matchCard.listLayout}
            data-match-card-interaction={componentProfile.matchCard.interaction}
            data-odds-profile={componentProfile.oddsButton.profile}
            data-odds-layout="stacked"
            style={componentProfile.style}
        >
            <div className="flex min-h-[296px] min-w-0 flex-col gap-3 md:min-h-[336px]">
                <div className="flex h-5 min-w-0 items-center overflow-hidden whitespace-nowrap text-auxiliary-xs text-[var(--brand-match-muted,var(--filltext-ft-g))]">
                    <LeagueLogo logo={group.tournament_logo} />
                    {metaTrail.map((label, index) => (
                        <Fragment key={`${match.event_id}-${label}`}>
                            {index > 0 && <DotSeparator />}
                            <span className="truncate">{label}</span>
                        </Fragment>
                    ))}
                </div>

                <div className="relative rounded-[calc(var(--brand-match-card-radius,12px)-2px)] border border-[color:var(--brand-match-divider,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-selected))] px-3 py-4">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-func-win-solid px-2 py-0.5 text-auxiliary-2xs font-semibold text-neutral-white-h">
                        <MatchLiveMetaLine
                            sportId={group.sport_id}
                            matchStatus={match.match_status}
                            matchClock={match.match_clock}
                            matchClockOffset={match.match_clock_offset}
                            className="h-auto text-auxiliary-2xs text-neutral-white-h [&_svg]:hidden [&_.bg-func-win]:bg-neutral-white-h"
                        />
                    </div>
                    <div className="grid min-h-[96px] grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <TeamSide logo={match.home_competitor.logo} name={match.home_competitor.name} tone="home" />
                        <div className="flex min-w-[68px] flex-col items-center gap-1">
                            <DetailLiveSwitch className="size-5 text-brand-primary-0" />
                            <div className="rounded-sm bg-[var(--brand-match-card-bg,var(--surface-1))] px-2.5 py-1 text-title-md font-bold text-[var(--brand-match-team-text,var(--filltext-ft-h))] tabular-nums">
                                {match.home_competitor.score} - {match.away_competitor.score}
                            </div>
                        </div>
                        <TeamSide logo={match.away_competitor.logo} name={match.away_competitor.name} tone="away" />
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
                    {displayMarkets.slice(0, isMobile ? 3 : TOP_LIVE_MARKET_LIMIT).map((displayMarket) => (
                        <TopLiveMarketRow
                            key={`${displayMarket.market.id}:${displayMarket.market.name}`}
                            displayMarket={displayMarket}
                            group={group}
                            isMock={isMock}
                            match={match}
                        />
                    ))}
                </div>

                <div className="mt-auto flex flex-col gap-2 border-t border-[color:var(--brand-match-divider,var(--border-subtle))] pt-3">
                    <div className="flex min-w-0 items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                            <div className="flex shrink-0 -space-x-1.5">
                                {CHAT_AVATARS.map((avatar) => (
                                    <span
                                        key={avatar}
                                        className="relative flex size-5 items-center justify-center overflow-hidden rounded-full border border-[color:var(--brand-match-card-bg,var(--surface-1))] bg-[var(--brand-odds-bg,var(--surface-selected))]"
                                    >
                                        <Image
                                            src={avatar}
                                            alt=""
                                            width={20}
                                            height={20}
                                            className="size-full object-cover"
                                        />
                                    </span>
                                ))}
                            </div>
                            <span className="truncate text-auxiliary-xs text-[var(--brand-match-muted,var(--filltext-ft-g))]">
                                {t('chatPrompt')}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }}
                            className="shrink-0 rounded-full bg-[var(--brand-odds-bg,var(--surface-selected))] px-3 py-1 text-auxiliary-xs font-semibold text-brand-primary-0 transition-colors hover:bg-[var(--brand-odds-hover-bg,var(--surface-2))]"
                        >
                            {t('chatCta')}
                        </button>
                    </div>
                    <div className="flex h-4 items-center justify-between">
                        <span className="truncate text-auxiliary-2xs text-[var(--brand-match-muted,var(--filltext-ft-g))]">
                            {group.sport_name}
                        </span>
                        {hiddenMarketCount > 0 && (
                            <span className="text-auxiliary-2xs font-semibold text-brand-primary-0 tabular-nums">
                                +{hiddenMarketCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </MatchCardLink>
    );
};

export const TopLiveMatches: FC = () => {
    const t = useTranslations('matches.hotLeagueMatchCarousel');
    const title = t('liveTitle');
    const viewAllLabel = t('viewAll');
    const topSports = useTopSports();
    const sportOptions = useMemo(() => {
        const sports = topSports.length > 0 ? topSports : FALLBACK_SPORTS;
        const withIcons = sports.filter((sport) => getSportConfig(sport.sport_id));
        return withIcons.slice(0, TOP_LIVE_SPORT_LIMIT);
    }, [topSports]);
    const [selectedSportId, setSelectedSportId] = useState<string>(TOP_LIVE_DEFAULT_SPORT_ID);
    const requestSportId = sportOptions.some((sport) => sport.sport_id === selectedSportId)
        ? selectedSportId
        : sportOptions[0]?.sport_id || TOP_LIVE_DEFAULT_SPORT_ID;
    const queryKey = useMemo(() => ['top-live-matches', requestSportId, TOP_LIVE_LIMIT], [requestSportId]);

    const { data: tournamentGroups = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => GetBestLiveMatchesInterface({ sport_id: requestSportId, limit: TOP_LIVE_LIMIT }),
        staleTime: 30 * 1000,
        placeholderData: [],
    });

    const suggestions = useMemo(() => getSuggestions(tournamentGroups), [tournamentGroups]);
    const mockSuggestions = useMemo(
        () =>
            markMockSuggestions(createMockTournamentGroups('live', requestSportId, TOP_LIVE_MOCK_CARD_COUNT)).map(
                (suggestion) => ({
                    ...suggestion,
                    match: withTopLiveMockMarkets(suggestion.match),
                }),
            ),
        [requestSportId],
    );
    const displaySuggestions = suggestions.length > 0 ? suggestions : mockSuggestions;
    const eventIds = useMemo(() => suggestions.map((item) => item.match.event_id), [suggestions]);

    useGameSubscription(eventIds);
    useMatchListObserver({ eventIds, queryKey });

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { align: 'start', containScroll: 'trimSnaps', slidesToScroll: 1, dragFree: false },
        [WheelGesturesPlugin()],
    );
    const { enable, selectedIndex, snapCount, canScrollPrev, canScrollNext, scrollPrev, scrollNext, scrollTo } =
        useCarousel(emblaApi);

    if (isLoading) {
        return <TopLiveSkeleton title={title} />;
    }

    if (displaySuggestions.length === 0) {
        return null;
    }

    return (
        <section className="flex min-w-0 w-full flex-col gap-4">
            <BlockTitle2
                icon={LiveOutlined}
                iconClassName="text-brand-primary-0"
                title={title}
                titleClassName="uppercase"
                right={
                    <Link
                        href="/sports-live"
                        className="rounded-full px-3 py-1 text-body-sm font-semibold text-brand-primary-0 transition-colors hover:bg-[var(--brand-odds-hover-bg,var(--surface-selected))]"
                    >
                        {viewAllLabel}
                    </Link>
                }
            />

            <SportSwitch sports={sportOptions} selectedSportId={requestSportId} onSelect={setSelectedSportId} />

            <div ref={emblaRef} className="min-w-0 w-full overflow-hidden">
                <div className="flex gap-4">
                    {displaySuggestions.map((item) => (
                        <TopLiveCard
                            key={item.match.event_id}
                            group={item.group}
                            match={item.match}
                            isMock={item.isMock}
                        />
                    ))}
                </div>
            </div>

            <div className={cn('relative', enable ? 'block' : 'hidden')}>
                <div className="w-[80%] md:w-1/2 mx-auto">
                    <CarouselProgress snapCount={snapCount} selectedIndex={selectedIndex} onClick={scrollTo} />
                </div>
                <div className="hidden md:block h-full absolute right-0 -top-1/2 translate-y-1/2">
                    <CarouselNavButton
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                        onPrevClick={scrollPrev}
                        onNextClick={scrollNext}
                    />
                </div>
            </div>
        </section>
    );
};
