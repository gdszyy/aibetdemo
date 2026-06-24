'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { RegionCode } from '@/i18n';
import { useRegionCode } from '@/i18nV2';
import WorldCupPass from './assets/world-cup-pass.png';
import WorldCupPassH5 from './assets/world-cup-pass-h5.png';
import { ActivityCardItem } from './components/ActivityCardItem';
import { type ActivityCardType, FIRST_CARD_IMG_H5, FIRST_CARD_IMGS } from './constants';

/** 世界杯活动卡片组，展示冠军盘活动与通行证活动入口。 */
export const ActivityCard: FC = () => {
    const region = useRegionCode();
    const t = useTranslations('promotionWorldCupLeague');

    const regionCode: RegionCode = region === 'BR' || region === 'MX' ? region : 'BR';

    const getFirstCard = (): ActivityCardType[] => {
        if (!regionCode) return [];

        const titles: Record<RegionCode, string> = {
            MX: t('worldCupLeagueBanner.mexicoChampionPanel'),
            BR: t('worldCupLeagueBanner.brazilChampionPanel'),
        };
        const labelDesc: Record<RegionCode, string> = {
            MX: t('worldCupLeagueBanner.supportMexico'),
            BR: t('worldCupLeagueBanner.supportBrazil'),
        };
        const countryDesc: Record<RegionCode, string> = {
            MX: t('worldCupLeagueBanner.mexico'),
            BR: t('worldCupLeagueBanner.brazil'),
        };

        return [
            {
                tag: t('worldCupLeagueBanner.featuredEvent'),
                title: titles[regionCode],
                titleH5: countryDesc[regionCode],
                desc: labelDesc[regionCode],
                imageUrl: FIRST_CARD_IMGS[regionCode],
                imageH5Url: FIRST_CARD_IMG_H5[regionCode],
                link: '/sports/promotions/champion-handicap',
                variant: 'champion',
            },
        ];
    };

    const ACTIVITY_CARDS: ActivityCardType[] = [
        ...getFirstCard(),
        {
            tag: t('worldCupLeagueBanner.featuredEvent'),
            title: t('worldCupLeagueBanner.worldCupPass'),
            desc: t('worldCupLeagueBanner.worldCupPassDescription'),
            imageUrl: WorldCupPass,
            imageH5Url: WorldCupPassH5,
            link: '/sports/promotions/world-cup-2026-pass',
            variant: 'pass',
        },
        {
            tag: t('worldCupLeagueBanner.limitedEvent'),
            title: t('worldCupLeagueBanner.dailyMission'),
            desc: t('worldCupLeagueBanner.dailyMissionDescription'),
            imageUrl: WorldCupPass,
            imageH5Url: WorldCupPassH5,
            link: '/sports/promotions/world-cup-2026-pass',
            variant: 'mission',
        },
        {
            tag: t('worldCupLeagueBanner.hotEvent'),
            title: t('worldCupLeagueBanner.fanRewards'),
            desc: t('worldCupLeagueBanner.fanRewardsDescription'),
            imageUrl: FIRST_CARD_IMGS[regionCode],
            imageH5Url: FIRST_CARD_IMG_H5[regionCode],
            link: '/sports/promotions/champion-handicap',
            variant: 'reward',
        },
    ];

    const hasOverflowCards = ACTIVITY_CARDS.length > 1;

    return (
        <section className="rounded-lg border border-[#FFEDA1] bg-[#012300] p-4 max-md:border-none max-md:bg-transparent max-md:p-0">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 max-md:hidden">
                {ACTIVITY_CARDS.map((item) => {
                    return <ActivityCardItem item={item} key={`${item.variant}-${item.title}`} />;
                })}
            </div>
            <div className="hidden-scrollbar hidden snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-1 max-md:flex">
                {ACTIVITY_CARDS.map((item) => {
                    return (
                        <ActivityCardItem
                            className="min-w-[80%] flex-[0_0_80%] snap-start"
                            item={item}
                            key={`${item.variant}-${item.title}-mobile`}
                        />
                    );
                })}
            </div>
            {hasOverflowCards && (
                <div className="mt-2 hidden items-center justify-end gap-1 text-[10px] font-medium text-[#FFEAB0] max-md:flex">
                    <span>{t('worldCupLeagueBanner.swipeForMore')}</span>
                    <span aria-hidden="true">-&gt;</span>
                </div>
            )}
        </section>
    );
};
