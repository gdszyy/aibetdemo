'use client';

import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures';
import { useTranslations } from 'next-intl';
import { type FunctionComponent, useEffect, useMemo, useState } from 'react';
import { GetRecommendCardsInterface } from '@/api/handlers/recommend-card';
import { type RecommendCard, RecommendCardType } from '@/api/models/recommend-card';
import { CarouselNavButton } from '@/components/carousel-nav-button';
import { CarouselProgress } from '@/components/carousel-progress';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { useSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { useCarousel } from '@/hooks/use-carousel';
import { cn } from '@/utils/common';
import { ACTIVE_STATUS, CARD_SELECTION_LIMIT, Card, QUERY_KEY, Sheet, useOddsObserver } from './recommend-card';
import { getRecommendCardSkin, getRecommendSectionSkin } from './recommend-card/skin';
import { useUniformRecommendCardHeights } from './recommend-card/use-uniform-card-heights';
import { getRecommendCardQualifiedSelections } from './recommend-card/utils';

const SUPER_ODD_TYPE_ALIASES = ['2', 'super_odd', 'super-odd', 'superodd', 'super_odds', 'super-odds', 'superodds'];

const normalizeRecommendCardType = (value: unknown): string | null => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    return String(value).trim().toLowerCase();
};

const isSuperOddCard = (card: RecommendCard): boolean => {
    const values = [card.type, card.card_type, card.recommend_type, card.activity_type];
    const normalizedValues = values.map(normalizeRecommendCardType).filter((value): value is string => Boolean(value));

    return normalizedValues.some((value) => SUPER_ODD_TYPE_ALIASES.includes(value));
};

const createMockSelection = (index: number, title: string): RecommendCard['json_list'][number] => ({
    event_id: `mock-event-${index}`,
    event_id_type: 'match',
    match_status: 0,
    product: '3',
    product_raw: 'prematch',
    market_id: `mock-market-${index}`,
    specifiers: '',
    specifiers_status: 1,
    timestamp: Date.now(),
    outcome_id: `mock-outcome-${index}`,
    outcome_odds: (1.65 + index * 0.18).toFixed(2),
    outcome_active: 1,
    outcome_line: '',
    outcome_name: index % 2 === 0 ? 'Home' : 'Over',
    outcome_name_alias: index % 2 === 0 ? 'Home' : 'Over 2.5',
    title,
    market_name: index % 2 === 0 ? 'Match Winner' : 'Total Goals',
    home_competitor_name: title.split(' vs ')[0] ?? 'Home',
    away_competitor_name: title.split(' vs ')[1] ?? 'Away',
    sport_id: '6046',
    category_id: '1',
    tournament_id: 'mock-tournament',
});

const createMockCard = (id: number, type: RecommendCardType, title: string, matches: string[]): RecommendCard => ({
    id,
    type,
    title,
    activity_id: 0,
    legs: [],
    json_list: matches.map((match, index) => createMockSelection(id * 10 + index, match)),
    country_id: 0,
    country_code: 'mock',
    delisted_reason: '',
    status: ACTIVE_STATUS,
    version: 1,
    delisted_at: null,
    created_at: 0,
    updated_at: 0,
});

const MOCK_RECOMMEND_CARDS: RecommendCard[] = [
    createMockCard(9002, RecommendCardType.SuperOdd, 'Tonight SuperOdd Boost', ['Portugal vs Croatia', 'France vs USA']),
    createMockCard(9003, RecommendCardType.SuperOdd, 'Champions Night Combo', [
        'Real Madrid vs Bayern',
        'Man City vs PSG',
        'Inter vs Arsenal',
    ]),
    createMockCard(9004, RecommendCardType.SuperOdd, 'Premier League Special', [
        'Liverpool vs Chelsea',
        'Tottenham vs Newcastle',
    ]),
    createMockCard(9005, RecommendCardType.SuperOdd, 'Brasileirão Boost', [
        'Flamengo vs Palmeiras',
        'Corinthians vs São Paulo',
        'Grêmio vs Internacional',
        'Fluminense vs Botafogo',
    ]),
    createMockCard(9006, RecommendCardType.SuperOdd, 'La Liga Multi', [
        'Barcelona vs Atlético',
        'Sevilla vs Valencia',
        'Villarreal vs Betis',
    ]),
    createMockCard(9007, RecommendCardType.SuperOdd, 'Serie A Mega Boost', [
        'Juventus vs Napoli',
        'Milan vs Roma',
        'Lazio vs Atalanta',
        'Fiorentina vs Torino',
        'Bologna vs Udinese',
    ]),
    createMockCard(9008, RecommendCardType.SuperOdd, 'Weekend Acca', ['Ajax vs PSV', 'Porto vs Benfica']),
];

const isMockRecommendCard = (card: RecommendCard): boolean => card.country_code === 'mock';

const getRecommendSectionClassName = (layout: 'board-rail' | 'promo-rail' | 'ticket-feed'): string => {
    if (layout === 'promo-rail') {
        return 'gap-5';
    }

    if (layout === 'ticket-feed') {
        return 'gap-3';
    }

    return 'gap-4';
};

const getRecommendHeaderClassName = (layout: 'board-rail' | 'promo-rail' | 'ticket-feed'): string => {
    if (layout === 'promo-rail') {
        return 'items-center gap-3';
    }

    if (layout === 'ticket-feed') {
        return 'items-center gap-2 border-b border-[color:var(--brand-match-divider,var(--border-subtle))] pb-3';
    }

    return 'items-center gap-2';
};

const getRecommendTitleClassName = (layout: 'board-rail' | 'promo-rail' | 'ticket-feed'): string => {
    if (layout === 'promo-rail') {
        return 'text-2xl md:text-3xl';
    }

    if (layout === 'ticket-feed') {
        return 'text-xl md:text-2xl';
    }

    return 'text-xl md:text-2xl';
};

const getRecommendViewportClassName = (layout: 'board-rail' | 'promo-rail' | 'ticket-feed'): string => {
    if (layout === 'promo-rail') {
        return 'mt-6.5';
    }

    if (layout === 'ticket-feed') {
        return 'mt-3';
    }

    return 'mt-4';
};

interface RecommendCardsSectionProps {
    cards: RecommendCard[];
    title: string;
    badgeLabel: string;
}

const RecommendCardsSection: FunctionComponent<RecommendCardsSectionProps> = ({ cards, title, badgeLabel }) => {
    const t = useTranslations('matches');
    const schemeMeta = useSchemeMeta();
    const componentProfile = useThemeComponentProfile();
    const recommendProfile = componentProfile.homeRecommend;
    const cardSkin = getRecommendCardSkin(schemeMeta.brand);
    const skinConfig = getRecommendSectionSkin(cardSkin, schemeMeta.mode);
    const [sheetCard, setSheetCard] = useState<RecommendCard | null>(null);
    const cardIds = useMemo(() => cards.map((card) => String(card.id)), [cards]);
    const { uniformHeight, setCardWrapperRef } = useUniformRecommendCardHeights(cardIds);
    const hasSingleCard = cards.length === 1;

    const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true }, [WheelGesturesPlugin()]);
    const { enable, selectedIndex, snapCount, canScrollPrev, canScrollNext, scrollPrev, scrollNext, scrollTo } =
        useCarousel(emblaApi);

    useEffect(() => {
        if (!sheetCard) return;

        const currentCard = cards.find((card) => card.id === sheetCard.id);
        setSheetCard(currentCard ?? null);
    }, [cards, sheetCard]);

    return (
        <>
            <section
                className={cn(
                    'flex min-w-0 w-full flex-col',
                    getRecommendSectionClassName(recommendProfile.sectionLayout),
                )}
                data-home-recommend-profile={recommendProfile.profile}
                data-home-recommend-layout={recommendProfile.sectionLayout}
                data-home-recommend-interaction={recommendProfile.interaction}
            >
                <div
                    className={cn(
                        'relative overflow-visible',
                        skinConfig.rootClassName,
                        recommendProfile.sectionLayout === 'promo-rail' && 'px-4 pb-4',
                        recommendProfile.sectionLayout === 'ticket-feed' && 'px-3 pb-3',
                    )}
                    data-recommend-card-skin={cardSkin}
                    style={{ ...skinConfig.rootStyle, ...componentProfile.style }}
                >
                    <div className={cn('flex', getRecommendHeaderClassName(recommendProfile.sectionLayout))}>
                        <span className={cn('h-6 w-1.5 shrink-0 rounded-full', skinConfig.titleAccentClassName)} />
                        <div
                            className={cn(
                                'font-black uppercase',
                                recommendProfile.sectionLayout !== 'ticket-feed' && 'italic',
                                getRecommendTitleClassName(recommendProfile.sectionLayout),
                                skinConfig.titleClassName,
                            )}
                        >
                            {title}
                        </div>
                    </div>
                    <div
                        className={cn(
                            'min-w-0 w-full overflow-hidden',
                            getRecommendViewportClassName(recommendProfile.sectionLayout),
                        )}
                        ref={emblaRef}
                    >
                        <div className="flex items-stretch gap-[var(--component-recommend-gap,12px)] flex-nowrap">
                            {cards.map((card) => {
                                const displaySelectionCount = getRecommendCardQualifiedSelections(
                                    card.json_list,
                                    null,
                                ).length;

                                return (
                                    <div
                                        key={card.id}
                                        ref={setCardWrapperRef(String(card.id))}
                                        className={cn(
                                            'flex h-full shrink-0 snap-start',
                                            hasSingleCard && 'w-full md:w-auto',
                                        )}
                                        style={
                                            uniformHeight
                                                ? { height: uniformHeight, minHeight: uniformHeight }
                                                : undefined
                                        }
                                    >
                                        <Card
                                            card={card}
                                            rule={null}
                                            isUniformHeightReady={Boolean(uniformHeight)}
                                            badgeLabel={badgeLabel}
                                            skin={cardSkin}
                                            mode={schemeMeta.mode}
                                            showMoreLabel={t('showMore', {
                                                count: Math.max(displaySelectionCount - CARD_SELECTION_LIMIT, 0),
                                            })}
                                            onShowMore={() => setSheetCard(card)}
                                            fullWidthOnMobile={hasSingleCard}
                                            className={skinConfig.cardClassName}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className={cn('mt-4 relative', enable ? 'block' : 'hidden')}>
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

            {sheetCard && (
                <Sheet
                    open={sheetCard !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSheetCard(null);
                        }
                    }}
                    card={sheetCard}
                    rule={null}
                    badgeLabel={badgeLabel}
                    skin={cardSkin}
                    mode={schemeMeta.mode}
                    onAdded={() => setSheetCard(null)}
                />
            )}
        </>
    );
};

/** 首页推荐区：仅展示 SuperOdd 卡片。 */
export const ParlayBoost: FunctionComponent = () => {
    const t = useTranslations('matches');
    const tCommon = useTranslations('common');
    const { data: recommendCards = [] } = useQuery<RecommendCard[]>({
        queryKey: QUERY_KEY,
        queryFn: GetRecommendCardsInterface,
        staleTime: 60 * 1000,
        retry: false,
    });

    const superOddCards = useMemo(() => {
        const sourceCards = [...recommendCards, ...MOCK_RECOMMEND_CARDS];
        return sourceCards.filter(
            (card) => card.status === ACTIVE_STATUS && card.json_list.length > 0 && isSuperOddCard(card),
        );
    }, [recommendCards]);

    const observedCards = useMemo(() => superOddCards.filter((card) => !isMockRecommendCard(card)), [superOddCards]);
    useOddsObserver(observedCards);

    if (!superOddCards.length) {
        return null;
    }

    return (
        <RecommendCardsSection
            cards={superOddCards}
            title={t('superOdd.title')}
            badgeLabel={tCommon('recommendCardBadge.superOdd')}
        />
    );
};
