'use client';

import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { GetBestLiveMatchesInterface, GetBestMatchesInterface } from '@/api/handlers/matches';
import type { MatchEvent, TournamentGroup } from '@/api/models/match-game';
import { BlockTitle2 } from '@/components/block-title-2';
import { CarouselNavButton } from '@/components/carousel-nav-button';
import { CarouselProgress } from '@/components/carousel-progress';
import { DoubleArrowUpThinOutlined } from '@/components/icons2/DoubleArrowUpThinOutlined';
import { LiveOutlined } from '@/components/icons2/LiveOutlined';
import { useCarousel } from '@/hooks/use-carousel';
import { useGameSubscription } from '@/hooks/use-game-subscription';
import { useMatchListObserver } from '@/modules/match/_hooks/use-match-list-observer';
import { shouldShowMatchInList } from '@/modules/match/_utils/match-utils';
import { createMockTournamentGroups } from '@/modules/match/_utils/mock-match-data';
import { cn } from '@/utils/common';
import { HotLeagueMatchCard } from './match-card';
import { HotLeagueMatchCarouselSkeleton } from './skeleton';
import type { HotLeagueMatchCarouselVariant } from './types';

type SuggestionItem = {
    group: TournamentGroup;
    match: MatchEvent;
    isMock?: boolean;
};

const HOT_MATCHES_STALE_TIME = 30 * 1000;
const HOME_BEST_MATCHES_LIMIT = 20;

interface HotLeagueMatchCarouselProps {
    variant: HotLeagueMatchCarouselVariant;
    sportId?: string;
}

const getSuggestions = (groups: TournamentGroup[]): SuggestionItem[] =>
    groups.flatMap((group) => group.events.filter(shouldShowMatchInList).map((match) => ({ group, match })));

const markMockSuggestions = (groups: TournamentGroup[]): SuggestionItem[] =>
    getSuggestions(groups).map((item) => ({ ...item, isMock: true }));

export const HotLeagueMatchCarousel: FC<HotLeagueMatchCarouselProps> = ({ variant, sportId }) => {
    const t = useTranslations('matches.hotLeagueMatchCarousel');

    const requestSportId = sportId;
    const queryKey = useMemo(
        () => ['hot-league-match-carousel', variant, requestSportId, HOME_BEST_MATCHES_LIMIT],
        [variant, requestSportId],
    );

    const { data: tournamentGroups = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => {
            const params = requestSportId
                ? { sport_id: requestSportId, limit: HOME_BEST_MATCHES_LIMIT }
                : { limit: HOME_BEST_MATCHES_LIMIT };
            return variant === 'live' ? GetBestLiveMatchesInterface(params) : GetBestMatchesInterface(params);
        },
        staleTime: HOT_MATCHES_STALE_TIME,
        placeholderData: [],
    });

    const suggestions = useMemo(() => getSuggestions(tournamentGroups), [tournamentGroups]);
    const mockSuggestions = useMemo(
        () => markMockSuggestions(createMockTournamentGroups(variant, requestSportId)),
        [variant, requestSportId],
    );
    const displaySuggestions = suggestions.length > 0 ? suggestions : mockSuggestions;
    const eventIds = useMemo(() => suggestions.map((item) => item.match.event_id), [suggestions]);
    const title = t(variant === 'live' ? 'liveTitle' : 'upcomingTitle');
    const Icon = variant === 'live' ? LiveOutlined : DoubleArrowUpThinOutlined;
    const liveEventIds = variant === 'live' ? eventIds : [];

    useGameSubscription(eventIds);
    useMatchListObserver({ eventIds: liveEventIds, queryKey });

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { align: 'start', containScroll: 'trimSnaps', slidesToScroll: 1, dragFree: false },
        [WheelGesturesPlugin()],
    );
    const { enable, selectedIndex, snapCount, canScrollPrev, canScrollNext, scrollPrev, scrollNext, scrollTo } =
        useCarousel(emblaApi);

    if (isLoading) {
        return <HotLeagueMatchCarouselSkeleton title={title} variant={variant} />;
    }

    if (displaySuggestions.length === 0) {
        return null;
    }

    return (
        <section className="flex min-w-0 w-full flex-col gap-4">
            <BlockTitle2 icon={Icon} iconClassName="text-brand-primary-0" title={title} titleClassName="uppercase" />

            <div ref={emblaRef} className="min-w-0 w-full overflow-hidden">
                <div className="flex gap-4">
                    {displaySuggestions.map(({ group, isMock, match }) => (
                        <HotLeagueMatchCard
                            key={match.event_id}
                            group={group}
                            match={match}
                            variant={variant}
                            isMock={isMock}
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
