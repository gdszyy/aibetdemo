'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { Link } from '@/i18n';
import { WORLD_CUP_LEAGUE_ID } from '@/modules/marketing/promotion/world-cup-league/constants';
import type { OddsEntity } from '@/modules/match';
import { BettingOption } from '../BettingOption';

/** 推荐投注选项列表属性。 */
interface BettingOptionsProps {
    /** 按接口顺序展示的冠军投注项。 */
    oddsEntities: OddsEntity[];
}

/** 支持鼠标和触摸拖拽的推荐投注选项列表。 */
export const BettingOptions: FC<BettingOptionsProps> = ({ oddsEntities }) => {
    const t = useTranslations('promotionWorldCupLeague.worldCupLeagueBanner');
    const [bettingOptionsRef] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: true,
    });

    return (
        <div className="px-2 pt-2 pb-2 max-md:bg-surface-1 max-md:px-0 max-md:pb-0">
            <div className="mb-1 flex items-center justify-between">
                <h3
                    className="w-fit bg-clip-text text-title-lg font-roboto-flex text-transparent max-md:hidden"
                    style={{ backgroundImage: 'linear-gradient(0deg, #FFC750 19.67%, #FFF6E0 79.51%)' }}
                >
                    {t('topBettingOptions')}
                </h3>
                <Link
                    href={`/leagues/${WORLD_CUP_LEAGUE_ID}/outright`}
                    className="ml-auto hidden cursor-pointer text-body-lg text-brand-primary-0 max-md:block"
                >
                    {t('viewAll')}
                </Link>
            </div>
            <div ref={bettingOptionsRef} className="cursor-grab overflow-hidden select-none active:cursor-grabbing">
                <div className="flex gap-4 max-md:gap-2">
                    {oddsEntities.map((oddsEntity) => (
                        <BettingOption key={oddsEntity.outcome.id} oddsEntity={oddsEntity} betNowLabel={t('betNow')} />
                    ))}
                </div>
            </div>
        </div>
    );
};
