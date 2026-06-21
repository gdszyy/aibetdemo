'use client';

import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type FunctionComponent, useEffect, useMemo, useState } from 'react';
import { GetRecommendCardsInterface } from '@/api/handlers/recommend-card';
import type { ParlayBoostRule } from '@/api/models/parlay-boost';
import { type RecommendCard, RecommendCardType } from '@/api/models/recommend-card';
import { CarouselNavButton } from '@/components/carousel-nav-button';
import { CarouselProgress } from '@/components/carousel-progress';
import { useSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { useCarousel } from '@/hooks/use-carousel';
import { useParlayBoostRule } from '@/hooks/use-parlay-boost-rule';
import { cn } from '@/utils/common';
import imageFlash from './assets/flash.png';
import { ACTIVE_STATUS, CARD_SELECTION_LIMIT, Card, QUERY_KEY, Sheet, useOddsObserver } from './recommend-card';
import { getRecommendCardSkin, getRecommendSectionSkin } from './recommend-card/skin';
import { useUniformRecommendCardHeights } from './recommend-card/use-uniform-card-heights';
import { getRecommendCardParlayBoostPreview, getRecommendCardQualifiedSelections } from './recommend-card/utils';

type RecommendCardTypeValue = RecommendCardType.ParlayBoost | RecommendCardType.SuperOdd | RecommendCardType.FollowBet;

interface RecommendCardsSectionConfig {
    type: RecommendCardTypeValue;
    title: string;
    badgeLabel: string;
    rule: ParlayBoostRule | null;
}

interface RecommendCardsSectionProps extends RecommendCardsSectionConfig {
    cards: RecommendCard[];
}

const RECOMMEND_CARD_TYPE_ALIASES: Record<RecommendCardTypeValue, string[]> = {
    [RecommendCardType.ParlayBoost]: ['1', 'parlay_boost', 'parlay-boost', 'parlayboost', 'boost'],
    [RecommendCardType.SuperOdd]: ['2', 'super_odd', 'super-odd', 'superodd', 'super_odds', 'super-odds', 'superodds'],
    [RecommendCardType.FollowBet]: [
        '3',
        'follow_bet',
        'follow-bet',
        'followbet',
        'follow_order',
        'follow-order',
        'copy_bet',
        'copy-bet',
        'copybet',
    ],
};

const normalizeRecommendCardType = (value: unknown): string | null => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    return String(value).trim().toLowerCase();
};

const getRecommendCardType = (card: RecommendCard): RecommendCardTypeValue => {
    const values = [card.type, card.card_type, card.recommend_type, card.activity_type];
    const normalizedValues = values.map(normalizeRecommendCardType).filter((value): value is string => Boolean(value));

    for (const [type, aliases] of Object.entries(RECOMMEND_CARD_TYPE_ALIASES)) {
        if (normalizedValues.some((value) => aliases.includes(value))) {
            return Number(type) as RecommendCardTypeValue;
        }
    }

    return RecommendCardType.ParlayBoost;
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
    createMockCard(9001, RecommendCardType.ParlayBoost, 'World Cup Power Parlay', [
        'Brazil vs Mexico',
        'Spain vs Japan',
        'Argentina vs Denmark',
    ]),
    createMockCard(9002, RecommendCardType.SuperOdd, 'Tonight SuperOdd Boost', [
        'Portugal vs Croatia',
        'France vs USA',
    ]),
    createMockCard(9003, RecommendCardType.FollowBet, 'Expert Follow Card', [
        'England vs Korea Republic',
        'Germany vs Morocco',
        'Netherlands vs Chile',
    ]),
];

const isMockRecommendCard = (card: RecommendCard): boolean => card.country_code === 'mock';

const RecommendCardsSection: FunctionComponent<RecommendCardsSectionProps> = ({
    cards,
    rule,
    title,
    badgeLabel,
    type,
}) => {
    const t = useTranslations('matches');
    const schemeMeta = useSchemeMeta();
    const cardSkin = getRecommendCardSkin(schemeMeta.brand);
    const skinConfig = getRecommendSectionSkin(cardSkin, schemeMeta.mode);
    const [sheetCard, setSheetCard] = useState<RecommendCard | null>(null);
    const cardIds = useMemo(() => cards.map((card) => String(card.id)), [cards]);
    const { uniformHeight, setCardWrapperRef } = useUniformRecommendCardHeights(cardIds);
    const hasSingleCard = cards.length === 1;
    const isParlayBoost = type === RecommendCardType.ParlayBoost;
    const sectionRule = isParlayBoost ? rule : null;

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
            <section className="flex min-w-0 w-full flex-col gap-4">
                <div
                    className={cn('relative overflow-hidden', skinConfig.rootClassName)}
                    data-recommend-card-skin={cardSkin}
                    style={
                        cardSkin === 'superbet'
                            ? {
                                  background:
                                      'linear-gradient(180deg, #FFAF53 0%, #FFE200 32%, rgba(239, 241, 242, 0.00) 84%)',
                              }
                            : undefined
                    }
                >
                    <div className="flex items-center gap-2">
                        <span className={cn('h-6 w-1.5 shrink-0 rounded-full', skinConfig.titleAccentClassName)} />
                        <div className={cn('text-2xl font-black italic uppercase', skinConfig.titleClassName)}>
                            {title}
                        </div>
                    </div>
                    {skinConfig.showLightning && (
                        <Image className="absolute right-2 -top-8 w-20" src={imageFlash} loading="eager" alt="" />
                    )}
                    <div className="mt-6.5 min-w-0 w-full overflow-hidden" ref={emblaRef}>
                        <div className="flex items-stretch gap-3 flex-nowrap">
                            {cards.map((card) => {
                                const displaySelectionCount = getRecommendCardQualifiedSelections(
                                    card.json_list,
                                    sectionRule,
                                ).length;

                                return (
                                    <div
                                        key={card.id}
                                        ref={setCardWrapperRef(String(card.id))}
                                        className={cn('flex h-full shrink-0', hasSingleCard && 'w-full md:w-auto')}
                                        style={
                                            uniformHeight
                                                ? { height: uniformHeight, minHeight: uniformHeight }
                                                : undefined
                                        }
                                    >
                                        <Card
                                            card={card}
                                            rule={sectionRule}
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
                    rule={sectionRule}
                    badgeLabel={badgeLabel}
                    skin={cardSkin}
                    mode={schemeMeta.mode}
                    onAdded={() => setSheetCard(null)}
                />
            )}
        </>
    );
};

export const ParlayBoost: FunctionComponent = () => {
    const t = useTranslations('matches');
    const tCommon = useTranslations('common');
    const { data: recommendCards = [] } = useQuery<RecommendCard[]>({
        queryKey: QUERY_KEY,
        queryFn: GetRecommendCardsInterface,
        staleTime: 60 * 1000,
        retry: false,
    });
    const { data: parlayBoostRule = null } = useParlayBoostRule();

    const observableCards = useMemo(() => {
        const sourceCards = [...recommendCards, ...MOCK_RECOMMEND_CARDS];
        return sourceCards.filter((card) => card.status === ACTIVE_STATUS && card.json_list.length > 0);
    }, [recommendCards]);
    const sectionConfigs = useMemo<RecommendCardsSectionConfig[]>(
        () => [
            {
                type: RecommendCardType.ParlayBoost,
                title: t('parlayBoost.title'),
                badgeLabel: tCommon('parlayBoostBadge.boost'),
                rule: parlayBoostRule,
            },
            {
                type: RecommendCardType.SuperOdd,
                title: t('superOdd.title'),
                badgeLabel: tCommon('recommendCardBadge.superOdd'),
                rule: null,
            },
            {
                type: RecommendCardType.FollowBet,
                title: t('followBet.title'),
                badgeLabel: tCommon('recommendCardBadge.followBet'),
                rule: null,
            },
        ],
        [parlayBoostRule, t, tCommon],
    );
    const visibleSections = useMemo(() => {
        return sectionConfigs
            .map((section) => {
                const cards = observableCards.filter((card) => {
                    if (getRecommendCardType(card) !== section.type) {
                        return false;
                    }

                    if (section.type !== RecommendCardType.ParlayBoost) {
                        return true;
                    }

                    if (isMockRecommendCard(card)) {
                        return true;
                    }

                    return getRecommendCardParlayBoostPreview(card, parlayBoostRule).currentTier !== undefined;
                });

                return { ...section, cards };
            })
            .filter((section) => section.cards.length > 0);
    }, [observableCards, parlayBoostRule, sectionConfigs]);
    const observedCards = useMemo(
        () => observableCards.filter((card) => !isMockRecommendCard(card)),
        [observableCards],
    );
    useOddsObserver(observedCards);

    if (!visibleSections.length) {
        return null;
    }

    return (
        <>
            {visibleSections.map((section) => (
                <RecommendCardsSection
                    key={section.type}
                    type={section.type}
                    title={section.title}
                    badgeLabel={section.badgeLabel}
                    cards={section.cards}
                    rule={section.rule}
                />
            ))}
        </>
    );
};
