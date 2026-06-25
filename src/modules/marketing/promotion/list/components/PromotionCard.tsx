'use client';

import Image, { type StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { PromoClock } from '@/components/icons';
import { DoubleArrowRightOutlined } from '@/components/icons2/DoubleArrowRightOutlined';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';
import Fire from '../assets/fire.gif';

export interface PromotionCardItem {
    /** 卡片唯一标识 */
    id: string;
    /** 所属活动分类 */
    category: 'sport' | 'casino';
    /** 卡片标题 */
    title: string;
    /** 卡片描述 */
    description: string;
    /** 是否展示热门标签 */
    isHot: boolean;
    /** 活动状态 */
    status: 'active' | 'upcoming' | 'ended';
    /** 活动时间是否仍在加载 */
    isCampaignTimeLoading: boolean;
    /** 活动起始日期 */
    startDate: string;
    /** 活动结束日期 */
    endDate: string;
    /** 卡片背景图 */
    image: string | StaticImageData;
    /** 卡片背景图（移动端） */
    imageH5: string | StaticImageData;
    /** 活动详情页路径 */
    href?: string;
}

interface PromotionCardProps {
    /** 卡片展示数据 */
    promotion: PromotionCardItem;
}

const HotCard: FC<{ isHot: boolean; title: string }> = ({ isHot, title }) =>
    isHot ? (
        <span className="inline-flex items-center rounded-xs bg-brand-primary-4 gap-0.5 pl-1 pr-2 py-0.5 text-auxiliary-md uppercase text-on-brand">
            <Image preload className="w-4 h-4" src={Fire.src} alt="Hot" width={16} height={16} /> {title}
        </span>
    ) : (
        <span />
    );

/** 促销活动预览卡片。 */
export const PromotionCard: FC<PromotionCardProps> = ({ promotion }) => {
    const t = useTranslations('promotion');
    const PROMOTION_STATUS_KEY_MAP = {
        active: t('list.status.active'),
        upcoming: t('list.status.upcoming'),
        ended: t('list.status.ended'),
    };

    const campaignTimeMeta = promotion.isCampaignTimeLoading ? (
        <>
            <span className="h-3 w-14 animate-skeleton-pulse rounded-xs bg-filltext-ft-d/35" />
            <span>|</span>
            <span className="h-3 w-28 animate-skeleton-pulse rounded-xs bg-filltext-ft-d/35" />
        </>
    ) : (
        <>
            <span>{PROMOTION_STATUS_KEY_MAP[promotion.status]}</span>
            <span>|</span>
            <span>
                {promotion.startDate} ~ {promotion.endDate}
            </span>
        </>
    );

    const card = (
        <article className="relative overflow-hidden rounded-md">
            {/* 移动端 */}
            <div className="relative aspect-359/220 overflow-hidden rounded-md @md:hidden">
                <Image
                    preload
                    src={promotion.imageH5}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 100vw"
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-linear-to-b from-neutral-black-b via-transparent to-neutral-black-h" />
                <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-end gap-3 p-4">
                        <HotCard isHot={promotion.isHot} title={t('list.hot')} />
                    </div>

                    <div className="flex flex-col gap-5 p-4 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,#000000_100%)]">
                        <div className="flex flex-col gap-2">
                            <div>
                                <h2 className="text-title-md text-neutral-white-h">{promotion.title}</h2>
                                <p className="text-body-sm text-neutral-white-h">{promotion.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-auxiliary-sm text-neutral-white-f">
                                <PromoClock className="size-4 shrink-0" />
                                {campaignTimeMeta}
                            </div>
                        </div>

                        <button
                            type="button"
                            className="inline-flex w-full items-center justify-center rounded-full bg-brand-primary-0 px-4 py-1.5 text-auxiliary-md text-on-brand"
                        >
                            {t('list.joinNow')}
                        </button>
                    </div>
                </div>
            </div>

            {/* PC */}
            <div className="relative hidden aspect-477/220 overflow-hidden rounded-md @md:block">
                <Image
                    preload
                    src={promotion.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-neutral-black-b via-transparent to-neutral-black-h" />
                <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-end gap-3 p-4">
                        <HotCard isHot={promotion.isHot} title={t('list.hot')} />
                    </div>
                    {/*TODO #000000 应该使用变量var(--neutral-black-h) */}
                    <div className="p-4 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,#000000_100%)]">
                        <div
                            className={cn(
                                'flex flex-col gap-5 pt-4',
                                'transition-transform duration-300 ease-out group-hover:-translate-y-4',
                            )}
                        >
                            <div className="flex flex-col gap-2">
                                <div>
                                    <h2 className="text-title-md text-neutral-white-h">{promotion.title}</h2>
                                    <p className="text-body-sm text-neutral-white-h">{promotion.description}</p>
                                </div>
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-2 text-auxiliary-sm text-neutral-white-f">
                                        <PromoClock className="size-4 shrink-0" />
                                        {campaignTimeMeta}
                                    </div>
                                    <button
                                        type="button"
                                        className="inline-flex gap-1 w-fit items-center rounded-full bg-brand-primary-0 px-3 py-1.5 text-auxiliary-md text-on-brand hover:bg-brand-primary-4 cursor-pointer transition-colors"
                                    >
                                        {t('list.joinNow')}
                                        <DoubleArrowRightOutlined className="ml-0 w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:ml-1 group-hover:w-3 group-hover:opacity-100" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );

    return (
        <Link href={promotion.href ?? '#'} className="group block">
            {card}
        </Link>
    );
};
