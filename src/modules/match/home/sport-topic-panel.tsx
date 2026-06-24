'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type FC, useMemo, useState } from 'react';
import { GetBestMatchesInterface } from '@/api/handlers/matches';
import {
    GetMenuCategoriesInterface,
    GetMenuHotTournamentsInterface,
    GetMenuTournamentsInterface,
} from '@/api/handlers/menu';
import type { MatchEvent, TournamentGroup } from '@/api/models/match-game';
import type { MenuCategory } from '@/api/models/menu';
import { Arrow } from '@/components/Arrow';
import { CupFilled } from '@/components/icons';
import { ClockOutlined } from '@/components/icons2/ClockOutlined';
import { StarFilled } from '@/components/icons2/StarFilled';
import { Loading } from '@/components/loading/loading';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { getSportConfig } from '@/constants/sports-config';
import { useGameSubscription } from '@/hooks/use-game-subscription';
import { Link } from '@/i18n';
import { useLiveStatusSuffix } from '@/modules/match/_hooks/use-live-status-suffix';
import { useMatchListObserver } from '@/modules/match/_hooks/use-match-list-observer';
import { shouldShowMatchInList } from '@/modules/match/_utils/match-utils';
import { HotLeagueMatchCard } from '@/modules/match/home/hot-league-match-carousel/match-card';
import { useSportNavMode } from '@/stores/layout-experiment-store';
import { cn } from '@/utils/common';

const LETTERS = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
const FEATURED_MATCH_LIMIT = 8;

type TopicTab = 'matches' | 'futures';
type SuggestionItem = {
    group: TournamentGroup;
    match: MatchEvent;
};

const chipBase =
    'flex h-6.5 min-w-18 items-center justify-center rounded-full px-3 text-auxiliary-md transition-colors';

const firstLetter = (name: string): string => {
    const ch = name.trim().charAt(0).toUpperCase();
    return /[A-Z]/.test(ch) ? ch : '#';
};

const getSuggestions = (groups: TournamentGroup[]): SuggestionItem[] =>
    groups.flatMap((group) => group.events.filter(shouldShowMatchInList).map((match) => ({ group, match })));

const TopicTabs: FC<{
    active: TopicTab;
    onChange: (tab: TopicTab) => void;
    matchesLabel: string;
    futuresLabel: string;
}> = ({ active, onChange, matchesLabel, futuresLabel }) => {
    const componentProfile = useThemeComponentProfile();
    const isBetano = componentProfile.homeRecommend.profile === 'betano-ticket-feed';
    const tabs: { key: TopicTab; label: string }[] = [
        { key: 'matches', label: matchesLabel },
        { key: 'futures', label: futuresLabel },
    ];

    return (
        <div
            className={cn(
                'flex h-11 items-end gap-6 border-filltext-ft-c border-b px-3 md:px-4',
                isBetano &&
                    'mx-3 mt-2 h-10 items-center gap-1 rounded-[var(--component-topic-hero-radius)] border border-[var(--component-topic-tabs-border)] bg-[var(--component-topic-tabs-bg)] p-1 md:mx-4',
            )}
        >
            {tabs.map((tab) => {
                const selected = active === tab.key;
                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onChange(tab.key)}
                        className={cn(
                            'flex h-11 cursor-pointer flex-col items-center justify-center',
                            isBetano && 'h-8 rounded px-3',
                        )}
                    >
                        <span
                            className={cn(
                                'whitespace-nowrap text-body-lg transition-colors',
                                selected ? 'font-bold text-filltext-ft-h' : 'text-filltext-ft-f',
                                isBetano && 'text-body-sm',
                            )}
                        >
                            {tab.label}
                        </span>
                        <span
                            className={cn(
                                'mt-2 flex h-0.5 w-full min-w-9 rounded bg-brand-primary-0',
                                isBetano && 'mt-1',
                            )}
                        >
                            <span
                                className={cn(
                                    'h-full w-full rounded bg-brand-primary-0',
                                    selected ? 'opacity-100' : 'opacity-0',
                                )}
                            />
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

const SportTopicHero: FC<{
    sportId: string;
    title: string;
    totalMatches: number;
    totalCompetitions: number;
}> = ({ sportId, title, totalMatches, totalCompetitions }) => {
    const t = useTranslations('matches');
    const componentProfile = useThemeComponentProfile();
    const isBetano = componentProfile.homeRecommend.profile === 'betano-ticket-feed';
    const sportConfig = getSportConfig(sportId);
    const HeroIcon = sportConfig?.shadowIcon ?? sportConfig?.icon;

    if (isBetano) {
        return (
            <div
                data-topic-hero-profile={componentProfile.homeRecommend.profile}
                className="mx-3 mt-3 min-h-[var(--component-topic-hero-min-height)] rounded-[var(--component-topic-hero-radius)] border border-[var(--component-topic-hero-border)] bg-[var(--component-topic-hero-bg)] px-3 py-3 md:mx-4 md:px-4"
            >
                <div className="flex h-full min-h-[68px] items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-brand-primary-0/20 bg-brand-primary-0/10 text-brand-primary-0">
                            {HeroIcon && <HeroIcon className="size-6" />}
                        </span>
                        <div className="min-w-0">
                            <h1 className="truncate text-title-md font-bold text-filltext-ft-h md:text-title-lg">
                                {title}
                            </h1>
                            <p className="mt-0.5 truncate text-auxiliary-md text-filltext-ft-f">
                                {t('topicPage.heroSubtitle')}
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
                        <span className="rounded border border-[var(--component-topic-card-border)] bg-surface-2 px-2.5 py-1 text-auxiliary-md font-bold text-filltext-ft-h">
                            {t('topicPage.matchCount', { count: totalMatches })}
                        </span>
                        <span className="hidden rounded border border-[var(--component-topic-card-border)] bg-surface-2 px-2.5 py-1 text-auxiliary-md font-bold text-filltext-ft-g sm:inline-flex">
                            {t('topicPage.competitionCount', { count: totalCompetitions })}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-[128px] overflow-hidden bg-[linear-gradient(120deg,#055a29_0%,#087a35_52%,#0a4d27_100%)] px-4 py-4 md:min-h-[156px] md:px-6">
            <div className="relative z-10 flex h-full flex-col justify-between gap-5">
                <div className="flex items-center gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-neutral-white-h/14 text-neutral-white-h ring-1 ring-neutral-white-h/20">
                        {HeroIcon && <HeroIcon className="size-7" />}
                    </span>
                    <div className="min-w-0">
                        <h1 className="truncate text-title-lg font-bold text-neutral-white-h md:text-display-sm">
                            {title}
                        </h1>
                        <p className="mt-1 text-body-sm text-neutral-white-h/74">{t('topicPage.heroSubtitle')}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="rounded bg-neutral-white-h/12 px-3 py-1 text-auxiliary-md font-bold text-neutral-white-h">
                        {t('topicPage.matchCount', { count: totalMatches })}
                    </span>
                    <span className="rounded bg-neutral-white-h/12 px-3 py-1 text-auxiliary-md font-bold text-neutral-white-h">
                        {t('topicPage.competitionCount', { count: totalCompetitions })}
                    </span>
                </div>
            </div>
            <div className="absolute right-2 bottom-[-42px] text-neutral-white-h/12 md:right-8 md:bottom-[-52px]">
                {HeroIcon && <HeroIcon className="size-36 md:size-48" />}
            </div>
            <div className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(circle_at_70%_36%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_62%_80%,rgba(0,0,0,0.28),transparent_44%)]" />
        </div>
    );
};

const FeaturedMatches: FC<{
    sportId: string;
    enabled: boolean;
    fallbackTitle: string;
}> = ({ sportId, enabled, fallbackTitle }) => {
    const t = useTranslations('matches');
    const queryKey = useMemo(() => ['topic-featured-matches', sportId, FEATURED_MATCH_LIMIT], [sportId]);
    const { data: groups = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => GetBestMatchesInterface({ sport_id: sportId, limit: FEATURED_MATCH_LIMIT }),
        enabled,
        staleTime: 30 * 1000,
        placeholderData: [],
    });

    const suggestions = useMemo(() => getSuggestions(groups), [groups]);
    const eventIds = useMemo(() => suggestions.map((item) => item.match.event_id), [suggestions]);

    useGameSubscription(eventIds);
    useMatchListObserver({ eventIds: [], queryKey });

    if (isLoading) {
        return (
            <div className="flex h-[150px] items-center justify-center rounded bg-surface-1">
                <Loading className="size-5" variant="color-red" />
            </div>
        );
    }

    if (suggestions.length === 0) {
        return (
            <div className="flex h-20 items-center justify-center rounded bg-surface-1 px-4 text-body-sm text-filltext-ft-f">
                {t('noMatchesAvailable')}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-3 md:px-4">
                <StarFilled className="size-4 text-accent-warm" />
                <h2 className="text-body-md font-bold uppercase text-filltext-ft-h">{fallbackTitle}</h2>
            </div>
            <div className="hidden-scrollbar overflow-x-auto px-3 md:px-4">
                <div className="flex w-max gap-3 pb-1">
                    {suggestions.map(({ group, match }) => (
                        <HotLeagueMatchCard key={match.event_id} group={group} match={match} variant="upcoming" />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TimeWindowSelector: FC<{
    value: '12h' | '24h' | null;
    onChange: (value: '12h' | '24h' | null) => void;
}> = ({ value, onChange }) => {
    const t = useTranslations('matches');

    return (
        <div className="px-3 md:px-4">
            <h3 className="mb-3 text-title-sm font-bold text-filltext-ft-h">{t('topicPage.upcomingMatches')}</h3>
            <div className="grid gap-2 md:grid-cols-2">
                {(['12h', '24h'] as const).map((window) => (
                    <button
                        key={window}
                        type="button"
                        onClick={() => onChange(value === window ? null : window)}
                        className={cn(
                            'flex h-[74px] items-center gap-3 rounded border px-4 text-left transition-colors',
                            value === window
                                ? 'border-brand-primary-0 bg-surface-2 text-filltext-ft-h'
                                : 'border-neutral-white-c bg-surface-1 text-filltext-ft-g',
                        )}
                    >
                        <ClockOutlined className="size-5 shrink-0 text-brand-primary-0" />
                        <span className="text-body-md font-bold">
                            {window === '12h' ? t('topicPage.next12h') : t('topicPage.next24h')}
                        </span>
                    </button>
                ))}
            </div>
            {value && <p className="mt-1 text-auxiliary-md text-filltext-ft-f">{t('topicPage.timeFilterNote')}</p>}
        </div>
    );
};

const CountryAccordion: FC<{ sportId: string; category: MenuCategory; liveSuffix: string; futures?: boolean }> = ({
    sportId,
    category,
    liveSuffix,
    futures = false,
}) => {
    const [open, setOpen] = useState(false);
    const { data: leagues = [], isLoading } = useQuery({
        queryKey: ['topic-tournaments', sportId, category.category_id],
        queryFn: () => GetMenuTournamentsInterface({ sport_id: sportId, cate_id: category.category_id }),
        enabled: open,
    });

    return (
        <div className="border-filltext-ft-d/25 border-b last:border-b-0">
            {/* 地区（父级）行：字母头像 + 加粗名称 + 数量徽章 + 圆形箭头。
                展开时整行抬升到 surface-2 并加左侧品牌色导引条，使其明显区别于下方联赛子项。 */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                    'relative flex h-13 w-full cursor-pointer items-center gap-3 px-3 transition-colors md:px-4',
                    open ? 'bg-surface-2' : 'bg-surface-1 hover:bg-surface-2/60',
                    open &&
                        "before:absolute before:top-2 before:bottom-2 before:left-0 before:w-[3px] before:rounded-r-sm before:bg-brand-primary-0 before:content-['']",
                )}
            >
                <span
                    className={cn(
                        'inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-auxiliary-sm font-bold uppercase transition-colors',
                        open ? 'bg-brand-primary-0/15 text-brand-primary-0' : 'bg-surface-3 text-filltext-ft-f',
                    )}
                >
                    {firstLetter(category.name)}
                </span>
                <span className="min-w-0 flex-1 truncate text-left text-body-md font-bold text-filltext-ft-h">
                    {category.name}
                </span>
                <span
                    className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-auxiliary-sm font-bold transition-colors',
                        open ? 'bg-brand-primary-0/15 text-brand-primary-0' : 'bg-surface-3 text-filltext-ft-f',
                    )}
                >
                    {category.match_count}
                </span>
                <span
                    className={cn(
                        'inline-flex size-5 shrink-0 items-center justify-center rounded-full transition-colors',
                        open ? 'bg-brand-primary-0/15' : 'bg-surface-3',
                    )}
                >
                    <Arrow
                        className={cn('size-2.5', open ? 'text-brand-primary-0' : 'text-filltext-ft-f')}
                        direction={open ? 'up' : 'down'}
                    />
                </span>
            </button>

            {/* 联赛（子级）区：整体缩进 + 左侧导引轨，行更矮、字号更小、配奖杯图标，
                明确从属于上方地区，建立清晰的两级层级。 */}
            {open && (
                <div className="bg-surface-1 px-3 pb-3 md:px-4">
                    <div className="ml-3 border-filltext-ft-d/40 border-l pl-3">
                        {isLoading ? (
                            <div className="flex h-12 items-center justify-center">
                                <Loading className="size-4" variant="color-red" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-0.5 md:grid-cols-2">
                                {leagues.map((league) => (
                                    <Link
                                        key={league.tournament_id}
                                        href={
                                            futures
                                                ? `/leagues/${league.tournament_id}/outright${liveSuffix}`
                                                : `/leagues/${league.tournament_id}${liveSuffix}`
                                        }
                                        className="group/league flex h-9 items-center gap-2 rounded-xs px-2 text-body-sm text-filltext-ft-g transition-colors hover:bg-surface-2 hover:text-filltext-ft-h"
                                    >
                                        <CupFilled className="size-4 shrink-0 text-filltext-ft-e transition-colors group-hover/league:text-brand-primary-0" />
                                        <span className="min-w-0 flex-1 truncate">{league.name}</span>
                                        <span className="shrink-0 text-auxiliary-md text-filltext-ft-f">
                                            {league.match_count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

interface SportTopicPanelProps {
    sportId: string;
}

export const SportTopicPanel: FC<SportTopicPanelProps> = ({ sportId }) => {
    const navMode = useSportNavMode();
    const t = useTranslations('matches');
    const componentProfile = useThemeComponentProfile();
    const isBetano = componentProfile.homeRecommend.profile === 'betano-ticket-feed';
    const liveSuffix = useLiveStatusSuffix();
    const [activeLetter, setActiveLetter] = useState<string | null>(null);
    const [timeWindow, setTimeWindow] = useState<'12h' | '24h' | null>(null);
    const [activeTab, setActiveTab] = useState<TopicTab>('matches');
    const enabled = navMode === 'topic';

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['topic-categories', sportId],
        queryFn: () => GetMenuCategoriesInterface({ sport_id: sportId }),
        enabled,
    });
    const { data: hot = [] } = useQuery({
        queryKey: ['topic-hot', sportId],
        queryFn: () => GetMenuHotTournamentsInterface({ sport_id: sportId }),
        enabled,
    });

    const availableLetters = useMemo(
        () => new Set(categories.map((category) => firstLetter(category.name))),
        [categories],
    );
    const filteredCategories = useMemo(
        () =>
            activeLetter ? categories.filter((category) => firstLetter(category.name) === activeLetter) : categories,
        [categories, activeLetter],
    );
    const sportTitle = useMemo(
        () => sportId.replace(/[-_]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
        [sportId],
    );
    const totalMatches = useMemo(
        () => categories.reduce((sum, category) => sum + (category.match_count ?? 0), 0),
        [categories],
    );

    if (!enabled) {
        return null;
    }

    const isFutures = activeTab === 'futures';

    return (
        <section
            data-topic-shell-profile={componentProfile.homeRecommend.profile}
            style={isBetano ? componentProfile.style : undefined}
            className={cn(
                'mb-6 flex flex-col overflow-hidden rounded-sm bg-filltext-ft-b',
                isBetano &&
                    'overflow-visible rounded-[var(--component-topic-shell-radius)] bg-[var(--component-topic-shell-bg)] pb-2',
            )}
        >
            <SportTopicHero
                sportId={sportId}
                title={sportTitle}
                totalMatches={totalMatches}
                totalCompetitions={categories.length}
            />
            <TopicTabs
                active={activeTab}
                onChange={setActiveTab}
                matchesLabel={t('topicPage.matchesTab')}
                futuresLabel={t('topicPage.futuresTab')}
            />

            <div className="flex flex-col gap-6 py-4">
                {!isFutures && (
                    <>
                        <FeaturedMatches
                            sportId={sportId}
                            enabled={enabled}
                            fallbackTitle={t('topicPage.featuredMatches')}
                        />
                        <TimeWindowSelector value={timeWindow} onChange={setTimeWindow} />
                    </>
                )}

                {isFutures && (
                    <div className="px-3 md:px-4">
                        <div className="rounded bg-surface-1 px-4 py-3">
                            <h3 className="text-title-sm font-bold text-filltext-ft-h">
                                {t('topicPage.futuresTitle')}
                            </h3>
                            <p className="mt-1 text-body-sm text-filltext-ft-f">{t('topicPage.futuresHint')}</p>
                        </div>
                    </div>
                )}

                {hot.length > 0 && (
                    <div className="px-3 md:px-4">
                        <h3 className="mb-2 text-body-md font-bold text-filltext-ft-h">
                            {isFutures ? t('topicPage.popularFutures') : t('topicPage.popular')}
                        </h3>
                        <div className="grid grid-cols-2 gap-px overflow-hidden rounded bg-filltext-ft-d/35 md:grid-cols-3">
                            {hot.map((tournament) => (
                                <Link
                                    key={tournament.tournament_id}
                                    href={
                                        isFutures
                                            ? `/leagues/${tournament.tournament_id}/outright${liveSuffix}`
                                            : `/leagues/${tournament.tournament_id}${liveSuffix}`
                                    }
                                    className="flex h-10 items-center justify-between bg-surface-1 px-4 text-body-sm text-filltext-ft-g transition-colors hover:bg-surface-2 hover:text-filltext-ft-h"
                                >
                                    <span className="min-w-0 flex-1 truncate">{tournament.name}</span>
                                    <Arrow className="size-3 shrink-0 text-filltext-ft-e" direction="right" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="px-3 md:px-4">
                    <h3 className="mb-2 text-body-md font-bold text-filltext-ft-h">{t('topicPage.allCompetitions')}</h3>
                    <div className="grid grid-cols-4 gap-3 md:grid-cols-11">
                        <button
                            type="button"
                            onClick={() => setActiveLetter(null)}
                            className={cn(
                                chipBase,
                                'px-2',
                                activeLetter === null
                                    ? 'border border-brand-primary-0 bg-neutral-white-c font-bold text-filltext-ft-h'
                                    : 'bg-surface-1 text-filltext-ft-g',
                            )}
                        >
                            {t('all')}
                        </button>
                        {LETTERS.map((letter) => {
                            const has = availableLetters.has(letter);
                            return (
                                <button
                                    key={letter}
                                    type="button"
                                    disabled={!has}
                                    onClick={() => setActiveLetter(letter)}
                                    className={cn(
                                        chipBase,
                                        activeLetter === letter &&
                                            'border border-brand-primary-0 bg-neutral-white-c font-bold text-filltext-ft-h',
                                        activeLetter !== letter && has && 'bg-surface-1 text-filltext-ft-g',
                                        !has && 'bg-surface-1 text-filltext-ft-e',
                                    )}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col overflow-hidden rounded px-3 md:px-4">
                    {isLoading ? (
                        <div className="flex h-20 items-center justify-center">
                            <Loading className="size-5" variant="color-red" />
                        </div>
                    ) : (
                        filteredCategories.map((category) => (
                            <CountryAccordion
                                key={category.category_id}
                                sportId={sportId}
                                category={category}
                                liveSuffix={liveSuffix}
                                futures={isFutures}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};
