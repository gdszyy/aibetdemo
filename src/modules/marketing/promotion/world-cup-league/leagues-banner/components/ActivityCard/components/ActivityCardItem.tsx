'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';
import ChampionIcon from '../assets/champion.png';
import { type ActivityCardItemProps, GOLD_BUTTON_BG, GOLD_ODDS_BG } from '../constants';

interface CardContentProps {
    titleH5?: string;
    title: string;
}

export const CardContentH5: FC<CardContentProps> = ({ titleH5, title }) => {
    const t = useTranslations('promotionWorldCupLeague');

    if (!titleH5) {
        return (
            <div
                className="bg-clip-text text-md leading-5 text-transparent font-semibold"
                style={{
                    backgroundImage: 'linear-gradient(0deg, #FFC750 58.6%, #FFF6E0 79.51%)',
                    filter: 'drop-shadow(0 2px 0 #371600)',
                }}
            >
                {title}
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center gap-1">
                <Image
                    src={ChampionIcon}
                    alt={t('worldCupLeagueBanner.championIconAlt')}
                    quality={100}
                    width={5}
                    className={cn('w-5 shrink-0')}
                />
                <h4
                    className="bg-clip-text text-lg leading-6 text-transparent font-semibold"
                    style={{
                        backgroundImage: GOLD_ODDS_BG,
                        filter: 'drop-shadow(0 4px 0 #371600)',
                    }}
                >
                    {titleH5}
                </h4>
            </div>
            <div
                className="bg-clip-text text-[10px] text-transparent font-semibold"
                style={{
                    backgroundImage: GOLD_ODDS_BG,
                    filter: 'drop-shadow(0 4px 0 #371600)',
                }}
            >
                {t('worldCupLeagueBanner.championPanelSuffix')}
            </div>
        </>
    );
};

/** 世界杯活动卡片项 h5，统一卡片高度并让按钮区域稳定贴底。 */
export const ActivityCardItemH5: FC<ActivityCardItemProps> = ({ item, className }) => {
    const { title, titleH5, imageUrl, link } = item;

    return (
        <div className={cn(' h-full w-full', className)} key={title}>
            <div className="w-full h-full rounded-sm overflow-hidden">
                <Link className={cn('flex w-full h-full shrink-0 items-center')} href={link}>
                    <div
                        className="flex min-h-14 w-full flex-col items-start overflow-hidden px-3 rounded-sm justify-center"
                        style={{
                            backgroundImage: `url(${imageUrl.src})`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                        }}
                    >
                        <CardContentH5 title={title} titleH5={titleH5} />
                    </div>
                </Link>
            </div>
        </div>
    );
};

/** 世界杯活动卡片项，统一卡片高度并让按钮区域稳定贴底。 */
export const ActivityCardItemDesktop: FC<ActivityCardItemProps> = ({ item, className }) => {
    const { tag, title, imageUrl, link, desc } = item;
    const t = useTranslations('promotionWorldCupLeague');

    return (
        <div className={cn('h-full w-full', className)} key={title}>
            <div className="mb-2 inline-block text-neutral-white-h text-sm font-poppins font-bold leading-4.5 px-4 py-1 rounded-sm border border-[#FFEDA1]">
                {tag}
            </div>
            <div className="w-full overflow-hidden rounded-md">
                <Link className={cn('flex w-full h-full shrink-0 items-center')} href={link}>
                    <div className="min-h-12 w-full p-px h-full bg-linear-to-r from-[rgba(0,90,19,0)] to-[#FFDA8A]">
                        <div
                            className="ml-[0.5px] flex min-h-12 w-full flex-col items-start overflow-hidden rounded-md p-4"
                            style={{
                                backgroundImage: `url(${imageUrl.src})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                            }}
                        >
                            <h2
                                className="bg-clip-text text-headline-sm text-transparent font-semibold"
                                style={{
                                    backgroundImage: GOLD_ODDS_BG,
                                    filter: 'drop-shadow(0 4px 0 #371600)',
                                }}
                            >
                                {title}
                            </h2>
                            <span className="mt-2 h-[54px] max-w-2/3 overflow-hidden text-body-sm italic text-neutral-white-h font-medium [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                                {desc}
                            </span>
                            <div className="mt-3">
                                <button
                                    type="button"
                                    className={cn(
                                        'cursor-pointer rounded-sm border border-transparent text-neutral-black-h mt-1 h-8 min-w-22 px-4 text-body-md font-bold',
                                        className,
                                    )}
                                    style={{ background: GOLD_BUTTON_BG }}
                                >
                                    {t('worldCupLeagueBanner.joinNow')}
                                </button>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export const ActivityCardItem: FC<ActivityCardItemProps> = ({ item }) => {
    return (
        <>
            <ActivityCardItemDesktop className="block max-md:hidden" item={item} />
            <ActivityCardItemH5 className="hidden max-md:block" item={item} />
        </>
    );
};
