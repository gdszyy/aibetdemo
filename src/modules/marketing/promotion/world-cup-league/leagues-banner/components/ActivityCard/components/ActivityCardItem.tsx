'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';
import ChampionIcon from '../assets/champion.png';
import { type ActivityCardItemProps, type ActivityCardVariant, GOLD_BUTTON_BG, GOLD_ODDS_BG } from '../constants';

interface CardContentProps {
    titleH5?: string;
    title: string;
    variant?: ActivityCardVariant;
}

const CARD_VARIANT_STYLES: Record<
    ActivityCardVariant,
    {
        tag: string;
        border: string;
        content: string;
        title: string;
        desc: string;
        button: string;
        mobileOverlay: string;
    }
> = {
    champion: {
        tag: 'border-[#FFEDA1] bg-[rgba(255,237,161,0.08)]',
        border: 'from-[rgba(0,90,19,0)] via-[rgba(255,237,161,0.35)] to-[#FFDA8A]',
        content: 'justify-start',
        title: 'text-headline-sm',
        desc: 'max-w-2/3',
        button: '',
        mobileOverlay: 'bg-linear-to-r from-[rgba(0,0,0,0.26)] to-transparent',
    },
    pass: {
        tag: 'border-[#9FF5FF] bg-[rgba(159,245,255,0.1)]',
        border: 'from-[#61F0FF] via-[rgba(255,255,255,0.2)] to-[#FFDB81]',
        content: 'justify-center',
        title: 'text-headline-sm',
        desc: 'max-w-[58%]',
        button: 'shadow-[0_0_16px_rgba(255,219,129,0.35)]',
        mobileOverlay: 'bg-linear-to-r from-[rgba(0,45,64,0.4)] to-transparent',
    },
    mission: {
        tag: 'border-[#B7FF8D] bg-[rgba(183,255,141,0.1)]',
        border: 'from-[#B7FF8D] via-[rgba(255,237,161,0.22)] to-[#4FE27A]',
        content: 'justify-end',
        title: 'text-title-xl',
        desc: 'max-w-[62%]',
        button: 'shadow-[0_0_14px_rgba(79,226,122,0.32)]',
        mobileOverlay: 'bg-linear-to-r from-[rgba(0,56,28,0.45)] to-transparent',
    },
    reward: {
        tag: 'border-[#FFB4F1] bg-[rgba(255,180,241,0.1)]',
        border: 'from-[#FFB4F1] via-[rgba(255,237,161,0.24)] to-[#FFDA8A]',
        content: 'justify-between',
        title: 'text-title-xl',
        desc: 'max-w-[60%]',
        button: 'shadow-[0_0_14px_rgba(255,180,241,0.3)]',
        mobileOverlay: 'bg-linear-to-r from-[rgba(54,0,44,0.45)] to-transparent',
    },
};

const getVariantStyle = (variant?: ActivityCardVariant) => CARD_VARIANT_STYLES[variant ?? 'champion'];

export const CardContentH5: FC<CardContentProps> = ({ titleH5, title, variant }) => {
    const t = useTranslations('promotionWorldCupLeague');
    const style = getVariantStyle(variant);

    if (!titleH5) {
        return (
            <div
                className={cn('bg-clip-text text-md leading-5 text-transparent font-semibold', style.title)}
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
    const { title, titleH5, imageUrl, imageH5Url, link, variant } = item;
    const style = getVariantStyle(variant);

    return (
        <div className={cn('h-full w-full', className)} key={title}>
            <div className="w-full h-full rounded-sm overflow-hidden">
                <Link className={cn('flex w-full h-full shrink-0 items-center')} href={link}>
                    <div
                        className={cn(
                            'relative flex min-h-18 w-full flex-col items-start overflow-hidden rounded-sm px-3 py-2',
                            style.content,
                        )}
                        style={{
                            backgroundImage: `url(${(imageH5Url ?? imageUrl).src})`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                        }}
                    >
                        <div className={cn('absolute inset-0', style.mobileOverlay)} />
                        <div className="relative z-1">
                            <CardContentH5 title={title} titleH5={titleH5} variant={variant} />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

/** 世界杯活动卡片项，统一卡片高度并让按钮区域稳定贴底。 */
export const ActivityCardItemDesktop: FC<ActivityCardItemProps> = ({ item, className }) => {
    const { tag, title, imageUrl, link, desc, variant } = item;
    const t = useTranslations('promotionWorldCupLeague');
    const style = getVariantStyle(variant);

    return (
        <div className={cn('h-full w-full', className)} key={title}>
            <div
                className={cn(
                    'mb-2 inline-block rounded-sm border px-4 py-1 font-poppins font-bold text-neutral-white-h text-sm leading-4.5',
                    style.tag,
                )}
            >
                {tag}
            </div>
            <div className="w-full overflow-hidden rounded-md">
                <Link className={cn('flex w-full h-full shrink-0 items-center')} href={link}>
                    <div className={cn('min-h-12 w-full p-px h-full bg-linear-to-r', style.border)}>
                        <div
                            className={cn(
                                'ml-[0.5px] flex min-h-44 w-full flex-col items-start overflow-hidden rounded-md p-4',
                                style.content,
                            )}
                            style={{
                                backgroundImage: `url(${imageUrl.src})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                            }}
                        >
                            <h2
                                className={cn('bg-clip-text text-transparent font-semibold', style.title)}
                                style={{
                                    backgroundImage: GOLD_ODDS_BG,
                                    filter: 'drop-shadow(0 4px 0 #371600)',
                                }}
                            >
                                {title}
                            </h2>
                            <span
                                className={cn(
                                    'mt-2 h-[54px] overflow-hidden text-body-sm text-neutral-white-h italic font-medium [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]',
                                    style.desc,
                                )}
                            >
                                {desc}
                            </span>
                            <div className="mt-3">
                                <button
                                    type="button"
                                    className={cn(
                                        'cursor-pointer rounded-sm border border-transparent text-neutral-black-h mt-1 h-8 min-w-22 px-4 text-body-md font-bold',
                                        style.button,
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

export const ActivityCardItem: FC<ActivityCardItemProps> = ({ item, className }) => {
    return (
        <div className={cn('h-full', className)}>
            <ActivityCardItemDesktop className="block max-md:hidden" item={item} />
            <ActivityCardItemH5 className="hidden max-md:block" item={item} />
        </div>
    );
};
