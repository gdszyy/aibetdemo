import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { RegionCode } from '@/i18n';
import { BetActionButton, type OddsEntity } from '@/modules/match';
import mobileCardBg from '../../assets/m_card_bg.png';
import { getCountryCardRegionConfig } from '../../constants';
import { formatChampionshipOdds } from '../../utils';
import { ChampionMarketTitle } from '../ChampionMarketTitle';

/** 移动端国家冠军盘主视觉属性。 */
interface MobileCountryHeroProps {
    /** 当前站点地区。 */
    regionCode: RegionCode;
    /** 当前地区对应的冠军投注项。 */
    oddsEntity: OddsEntity;
}

/** 移动端国家冠军盘主视觉。 */
export const MobileCountryHero: FC<MobileCountryHeroProps> = ({ regionCode, oddsEntity }) => {
    const t = useTranslations('promotionWorldCupLeague.worldCupLeagueBanner');
    const regionConfig = getCountryCardRegionConfig(regionCode);
    const countryName = t(regionConfig.countryNameKey);
    const translationValues = { countryName };

    return (
        <div className="relative hidden h-full max-md:flex">
            <div className="relative w-[52%] h-27 rounded-sm bg-red-500 flex items-center justify-center mt-6.25">
                <Image
                    src={mobileCardBg}
                    alt=""
                    priority
                    sizes="180px, 108px"
                    className="object-cover w-full h-full rounded-sm"
                />
                <Image
                    src={regionConfig.flagImage}
                    alt={countryName}
                    className="absolute left-1.25 h-24 w-auto object-contain"
                    priority
                />
                <Image
                    src={regionConfig.roleImage}
                    alt=""
                    className="absolute -right-2 bottom-0 h-28.5 w-auto object-contain"
                    priority
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-center justify-center bg-surface-1 px-2 text-center mt-6.25">
                <h2 className="text-title-sm text-neutral-black-h">{t('mobileTitle', translationValues)}</h2>
                <strong className="mt-0.5 text-headline-sm text-orange-400">
                    {formatChampionshipOdds(oddsEntity.outcome.odds)}
                </strong>
                <BetActionButton
                    oddsEntity={oddsEntity}
                    className="mt-0.5 h-6 min-w-21 cursor-pointer rounded-full bg-brand-primary-0 px-3 text-auxiliary-md text-on-brand"
                >
                    {t('placeBet')}
                </BetActionButton>
                <p className="mt-1 text-[7px] font-poppins text-neutral-black-e">
                    {t('lossesCovered', translationValues)}
                </p>
            </div>
            <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center rounded-full bg-green-700 px-2 py-0.5 whitespace-nowrap">
                <ChampionMarketTitle size="mobile" title={t('championMarket', translationValues)} />
            </div>
        </div>
    );
};
