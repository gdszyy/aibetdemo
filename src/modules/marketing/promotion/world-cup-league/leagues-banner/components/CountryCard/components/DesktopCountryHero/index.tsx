import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { DoubleArrow } from '@/components/DoubleArrow';
import type { RegionCode } from '@/i18n';
import { Link } from '@/i18n';
import { WORLD_CUP_LEAGUE_ID } from '@/modules/marketing/promotion/world-cup-league/constants';
import type { OddsEntity } from '@/modules/match';
import { GOLD_ODDS_GRADIENT, getCountryCardRegionConfig } from '../../constants';
import { formatChampionshipOdds } from '../../utils';
import { BetNowButton } from '../BetNowButton';
import { ChampionMarketTitle } from '../ChampionMarketTitle';

/** PC 国家冠军盘主视觉属性。 */
interface DesktopCountryHeroProps {
    /** 当前站点地区。 */
    regionCode: RegionCode;
    /** 当前地区对应的冠军投注项。 */
    oddsEntity: OddsEntity;
}

/** PC 国家冠军盘主视觉。 */
export const DesktopCountryHero: FC<DesktopCountryHeroProps> = ({ regionCode, oddsEntity }) => {
    const t = useTranslations('promotionWorldCupLeague.worldCupLeagueBanner');
    const regionConfig = getCountryCardRegionConfig(regionCode);
    const countryName = t(regionConfig.countryNameKey);
    const translationValues = { countryName };

    return (
        <div
            className="absolute top-4 right-2 bottom-0 left-2 rounded-t-md p-px max-md:hidden"
            style={{ background: 'linear-gradient(360deg, rgba(0, 90, 19, 0) 0%, #007A1A 100%)' }}
        >
            <div
                className="relative h-full overflow-hidden rounded-t-md"
                style={{ background: 'linear-gradient(180deg, #092C06 0%, rgba(30, 146, 21, 0) 100%)' }}
            >
                <Image
                    src={regionConfig.flagImage}
                    alt={countryName}
                    className="absolute bottom-1 left-11.25 h-47 w-auto object-contain"
                    priority
                />
                <Image
                    src={regionConfig.roleImage}
                    alt=""
                    className="absolute right-22 top-0 h-75 w-auto object-contain"
                    priority
                />

                <div className="absolute inset-y-0 left-53.25 flex flex-col items-center pt-3 text-center">
                    <ChampionMarketTitle title={t('championMarket', translationValues)} />
                    <p className="mt-1 font-poppins font-normal text-neutral-white-h">{t('currentOdds')}</p>
                    <strong
                        className="mt-1 bg-clip-text text-headline-lg text-transparent"
                        style={{
                            backgroundImage: GOLD_ODDS_GRADIENT,
                            filter: 'drop-shadow(0 4px 0 #371600)',
                        }}
                    >
                        {formatChampionshipOdds(oddsEntity.outcome.odds)}
                    </strong>
                    <BetNowButton
                        oddsEntity={oddsEntity}
                        className="mt-1 h-8 min-w-22 px-4 text-body-md"
                        label={t('betNow')}
                    />
                    <p className="mt-2 font-poppins font-normal text-[12px] text-neutral-white-h/55">
                        {t('lossesCovered', translationValues)}
                    </p>
                </div>

                <Link
                    href={`/leagues/${WORLD_CUP_LEAGUE_ID}/outright`}
                    className="absolute top-4 right-4 flex cursor-pointer items-center gap-2 text-body-sm text-neutral-white-h"
                >
                    {t('viewAll')}
                    <DoubleArrow className="size-3" direction="right" />
                </Link>
            </div>
            <div
                className="absolute right-6 bottom-0 left-6 h-0.5"
                style={{
                    background: 'linear-gradient(90deg, rgba(9, 76, 7, 0) 0%, #048D00 50%, rgba(9, 76, 7, 0) 100%)',
                }}
            />
        </div>
    );
};
