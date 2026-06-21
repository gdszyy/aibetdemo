'use client';

import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures';
import { keyBy } from 'lodash-es';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type FunctionComponent, useMemo } from 'react';
import { GetAllHotTournamentsInterface } from '@/api/handlers/menu';
import type { InterfaceResponse } from '@/api/lib/types';
import { BlockTitle2 } from '@/components/block-title-2';
import { CarouselMask } from '@/components/carousel-mask';
import { CarouselNavButton } from '@/components/carousel-nav-button';
import { CarouselProgress2 } from '@/components/carousel-progress-2';
import { CupOutlined } from '@/components/icons2/CupOutlined';
import { getSportConfig } from '@/constants/sports-config';
import { useCarousel } from '@/hooks/use-carousel';
import { useTopSports } from '@/hooks/use-sports';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';
import imageGlobal from './assets/global.png';

type Tournament = InterfaceResponse<typeof GetAllHotTournamentsInterface>[0];

// 循环使用的背景色
const BACKGROUND_COLORS = [
    'linear-gradient(90deg, #E57D1D 0%, #DF9A14 100%)',
    'linear-gradient(90deg, #213146 0%, #1A2A41 100%)',
    'linear-gradient(90deg, #3C6B40 0%, #182A19 100%)',
    'linear-gradient(90deg, #0078AC 0%, #6499BB 100%)',
];

const Main: FunctionComponent<{ datas: Tournament[] }> = ({ datas }) => {
    const t = useTranslations('matches');

    const topSports = useTopSports();
    const topSportMap = useMemo(() => {
        const s = keyBy(
            topSports.map((v) => {
                return { ...v, config: getSportConfig(v.sport_id) };
            }),
            'sport_id',
        );
        return s;
    }, [topSports]);

    const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true }, [WheelGesturesPlugin()]);
    const { enable, selectedIndex, snapCount, canScrollPrev, canScrollNext, scrollPrev, scrollNext, scrollTo } =
        useCarousel(emblaApi);

    return (
        <div>
            <BlockTitle2
                title={t('hotLeagues.title')}
                titleClassName="uppercase"
                icon={CupOutlined}
                iconClassName="text-brand-primary-0"
            />
            <div className="mt-4 overflow-hidden relative" ref={emblaRef}>
                <div className="flex items-center gap-3 flex-nowrap">
                    {datas.map((v, k) => {
                        const sport = topSportMap[v.sport_id];
                        const Icon = sport?.config?.icon;

                        return (
                            <Link
                                key={v.tournament_id}
                                className={cn('shrink-0 w-36 h-16.5 rounded-sm', 'relative p-3')}
                                style={{
                                    background: BACKGROUND_COLORS[k % BACKGROUND_COLORS.length],
                                }}
                                href={`/leagues/${v.tournament_id}`}
                            >
                                <div className="flex items-center gap-x-2">
                                    <Image className="w-4" src={imageGlobal} alt="" />
                                    <span className="flex-1 overflow-hidden ellipsis text-auxiliary-sm text-neutral-white-h">
                                        {sport?.name}
                                    </span>
                                </div>
                                <span className="mt-2 max-w-full text-neutral-white-h text-body-lg ellipsis">
                                    {v.tournament_name}
                                </span>
                                {Icon ? (
                                    <Icon className="absolute -top-2 -right-5 size-20 text-neutral-white-d" />
                                ) : null}
                            </Link>
                        );
                    })}
                </div>
                {enable && (
                    <CarouselMask
                        className="hidden md:block"
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                    />
                )}
            </div>

            <div className={cn('mt-4 relative', enable ? 'block' : 'hidden')}>
                <div className="w-[80%] md:w-1/2 mx-auto">
                    <CarouselProgress2 snapCount={snapCount} selectedIndex={selectedIndex} onClick={scrollTo} />
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
        </div>
    );
};

/** 
热门联赛模块
// 复用现有热门联赛配置，至少准备 5–6 组渐变配色循环使用。每种体育类型使用对应的ICON背景，每个联赛使用不同的渐变色背景；
 */
interface HotLeaguesProps {
    sportId?: string;
}

export const HotLeagues: FunctionComponent<HotLeaguesProps> = ({ sportId }) => {
    const { data: datas = [] } = useQuery({
        queryKey: ['menuTournaments', 'hot', sportId],
        queryFn: () => GetAllHotTournamentsInterface({ sport_id: sportId }),
        placeholderData: [],
        staleTime: Number.MAX_SAFE_INTEGER,
    });

    if (!datas?.length) {
        return null;
    }

    return <Main datas={datas} />;
};
