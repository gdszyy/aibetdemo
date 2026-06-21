'use client';

import Image from 'next/image';
import { type FC, useMemo } from 'react';
import { useRegionCode } from '@/i18nV2';
import { WORLD_CUP_LEAGUE_ID } from '../../../constants';
import { useWorldCupChampionship } from '../../_hooks/use-world-cup-championship';
import cardBg from './assets/card_bg.png';
import { BettingOptions } from './components/BettingOptions';
import { DesktopCountryHero } from './components/DesktopCountryHero';
import { MobileCountryHero } from './components/MobileCountryHero';
import { BETTING_OPTION_COUNT, getCountryCardRegionConfig } from './constants';
import { getWorldCupChampionshipOddsEntities } from './utils';

/** 世界杯冠军盘卡片加载占位，避免异步数据回来后挤压页面滚动位置。 */
const CountryCardPlaceholder: FC = () => {
    return (
        <section className="overflow-hidden rounded-md bg-green-950 max-md:overflow-visible max-md:rounded-sm max-md:bg-surface-1 max-md:p-2">
            <div className="h-52.5 animate-skeleton-pulse rounded-t-md bg-filltext-ft-d/20 max-md:h-33 max-md:rounded-sm" />
            <div className="px-2 pt-2 pb-2 max-md:px-0 max-md:pb-0">
                <div className="mb-1 h-6 w-44 animate-skeleton-pulse rounded bg-filltext-ft-d/20 max-md:ml-auto max-md:h-5 max-md:w-16" />
                <div className="flex gap-4 overflow-hidden max-md:gap-2">
                    {Array.from({ length: BETTING_OPTION_COUNT }, (_, index) => (
                        <div
                            key={index.toString()}
                            className="h-40 min-w-0 flex-[0_0_calc((100%-64px)/5)] animate-skeleton-pulse rounded-sm bg-filltext-ft-d/20 max-md:h-17 max-md:flex-[0_0_72px]"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

/** 世界杯联赛页的国家冠军盘卡片。 */
export const CountryCard: FC = () => {
    const regionCode = useRegionCode();
    const { data: championship } = useWorldCupChampionship();
    const oddsEntities = useMemo(
        () =>
            championship && WORLD_CUP_LEAGUE_ID
                ? getWorldCupChampionshipOddsEntities(championship, WORLD_CUP_LEAGUE_ID)
                : [],
        [championship],
    );

    if (!regionCode || !championship || !WORLD_CUP_LEAGUE_ID) return <CountryCardPlaceholder />;

    const regionConfig = getCountryCardRegionConfig(regionCode);
    const countryOddsEntity = oddsEntities.find((entity) => entity.outcome.name === regionConfig.outcomeName);
    const bettingOptionOddsEntities = oddsEntities
        .filter((entity) => entity.outcome.name !== regionConfig.outcomeName)
        .slice(0, BETTING_OPTION_COUNT);

    if (!countryOddsEntity) return <CountryCardPlaceholder />;

    return (
        <section className="overflow-hidden rounded-md bg-green-950 max-md:overflow-visible max-md:rounded-sm max-md:bg-surface-1 max-md:p-2">
            <div className="relative h-52.5 overflow-hidden rounded-t-md max-md:h-33 max-md:overflow-visible max-md:rounded-sm max-md:border-0">
                <Image
                    src={cardBg}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 0px, 100vw"
                    className="object-cover max-md:hidden"
                />
                <DesktopCountryHero regionCode={regionCode} oddsEntity={countryOddsEntity} />
                <MobileCountryHero regionCode={regionCode} oddsEntity={countryOddsEntity} />
            </div>
            <BettingOptions oddsEntities={bettingOptionOddsEntities} />
        </section>
    );
};
