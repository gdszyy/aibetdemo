'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { RegionCode } from '@/i18n';
import { useRegionCode } from '@/i18nV2';
import WorldCupPass from './assets/world-cup-pass.png';
import { ActivityCardItem } from './components/ActivityCardItem';
import { type ActivityCardType, FIRST_CARD_IMGS } from './constants';

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
                link: '/sports/promotions/champion-handicap',
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
            link: '/sports/promotions/world-cup-2026-pass',
        },
    ];

    return (
        <section className="grid grid-cols-2 gap-4 rounded-lg bg-[#012300] p-4 border border-[#FFEDA1] max-md:p-0 max-md:bg-transparent max-md:border-none max-md:gap-1">
            {ACTIVITY_CARDS.map((item) => {
                return <ActivityCardItem item={item} key={item.title} />;
            })}
        </section>
    );
};
