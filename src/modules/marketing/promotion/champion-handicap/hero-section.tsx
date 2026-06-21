'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { FC } from 'react';
import { ArrowRight, PromoChampionHandicapClock } from '@/components/icons';
import { APP_NAME } from '@/constants';
import { Link } from '@/i18n';
import { useRegionCode } from '@/stores/region-store';
import { useUser } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import heroBg from '../_images/champion-handicap-hero-bg.png';
import heroBgMobile from '../_images/champion-handicap-hero-bg-mobile.png';
import { getChampionHandicapRegionConfig, useChampionHandicapTranslationValues } from './_constants/region';
import { formatChampionHandicapHeroValidity } from './_utils/time';

interface ChampionHandicapHeroSectionProps {
    isJoin: boolean;
    isJoining: boolean;
    isEventActive: boolean;
    onJoin: () => void;
}

export const ChampionHandicapHeroSection: FC<ChampionHandicapHeroSectionProps> = ({
    isJoin,
    isJoining,
    isEventActive,
    onJoin,
}) => {
    const t = useTranslations('promotion');
    const user = useUser();
    const openLoginModal = useUIStore((s) => s.openLoginModal);
    const locale = useLocale();
    const regionCode = useRegionCode();
    const regionConfig = getChampionHandicapRegionConfig(regionCode);
    const translationValues = useChampionHandicapTranslationValues();
    const validityText = formatChampionHandicapHeroValidity(
        locale,
        t('championHandicap.hero.validityLabel'),
        regionCode,
    );

    return (
        <section className="relative w-full overflow-hidden bg-surface-1 max-w-[1000px]">
            {/* 桌面背景 */}
            <Image
                src={heroBg}
                alt=""
                fill
                className="pointer-events-none hidden object-cover object-center md:block"
                aria-hidden
                priority
            />

            {/* 移动端背景 */}
            <Image
                src={heroBgMobile}
                alt=""
                fill
                className="pointer-events-none block object-cover object-top md:hidden"
                aria-hidden
                priority
            />

            {/* 内容区域 */}
            <div className="relative mx-auto flex w-full max-w-[1000px] flex-col gap-10 px-4 pt-21 pb-4 min-h-[476px] md:max-h-[500px] md:flex-row md:items-center md:gap-0 md:px-0 md:py-0">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                    className="z-5 flex flex-col items-center text-center md:order-1 md:min-w-0 md:items-start md:text-left p-0 md:p-10"
                >
                    {/* 标题卡片 */}
                    <div className="mb-4 w-full rounded-sm bg-surface-1 p-4 md:mb-6 md:max-w-[530px] h-full">
                        <div className="flex w-full items-stretch gap-1">
                            <div className="w-1 shrink-0 rounded-full bg-func-win" />
                            <div className="flex min-w-0 flex-1 flex-col items-center md:gap-1">
                                <p className="text-headline-sm text-[16px] text-func-win md:text-headline-lg whitespace-nowrap">
                                    {t('championHandicap.hero.exclusive')}
                                </p>
                                <p className="text-[10px] text-filltext-ft-h leading-[18px] font-poppins md:text-[16px] md:leading-[18px]">
                                    {t('championHandicap.hero.planName', translationValues)}
                                </p>
                            </div>
                            <div className="w-1 shrink-0 rounded-full bg-func-win" />
                        </div>
                    </div>

                    {/* 金额区域 */}
                    <div className="flex w-full flex-col items-center gap-2 md:items-start">
                        <p className="text-2xl leading-[22px] font-semibold text-filltext-ft-h md:text-size-[36px]">
                            {t('championHandicap.hero.maximumPayout')}
                        </p>
                        <div className="flex items-end gap-1">
                            <span className="text-[40px] font-bold leading-none md:text-[66px] text-[#D4AF37]">
                                {t('championHandicap.hero.amount', translationValues)}
                            </span>
                            <span className="pb-1 text-body-lg font-bold text-[#1E293B] md:pb-2 md:text-headline-lg">
                                {t('championHandicap.hero.currency', translationValues)}
                            </span>
                        </div>
                        <p className="text-body-sm text-filltext-ft-g md:max-w-[650px] whitespace-pre-line md:text-left">
                            {t('championHandicap.hero.description', translationValues)}
                        </p>
                    </div>

                    {/* 按钮组 */}
                    <div className="mt-6 flex w-full flex-row gap-4 md:mt-10">
                        <button
                            type="button"
                            disabled={isJoin || isJoining || !isEventActive}
                            onClick={() => {
                                if (!user) {
                                    openLoginModal();
                                } else {
                                    onJoin();
                                }
                            }}
                            className={cn(
                                'h-10 flex-1 rounded-full px-4 text-body-lg md:text-title-md md:min-w-[180px] md:flex-none',
                                isJoin || !isEventActive
                                    ? 'bg-filltext-ft-a text-filltext-ft-g cursor-default'
                                    : 'bg-brand-red text-white',
                            )}
                        >
                            {isJoin ? t('championHandicap.cta.joined') : t('championHandicap.cta.joinNow')}
                        </button>
                        <Link
                            href="/sports"
                            className="group flex items-center justify-center gap-1 h-10 flex-1 rounded-full border border-filltext-ft-h bg-surface-1 px-4 text-body-lg md:text-title-md text-filltext-ft-h shadow-sm md:min-w-[180px] md:flex-none hover:bg-filltext-ft-h hover:text-white"
                        >
                            {t('championHandicap.cta.goToBet')}
                            <ArrowRight className="size-4 text-filltext-ft-h shrink-0 group-hover:text-white" />
                        </Link>
                    </div>

                    <p className="mt-6 flex items-start gap-1 text-left text-body-md text-filltext-ft-e md:mt-10">
                        <PromoChampionHandicapClock className="mt-0.5 size-3.5 shrink-0 text-filltext-ft-e" />
                        {validityText}
                    </p>
                </motion.div>

                {/* 桌面奖杯图 */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="hidden md:order-2 md:flex md:flex-1 md:min-w-0 absolute right-0 top-0 h-full"
                >
                    <Image
                        src={regionConfig.heroImage}
                        alt={t('championHandicap.metadata.title', { appName: APP_NAME })}
                        width={1024}
                        height={1024}
                        priority
                        // image-position right移动60px 放大1.1
                        className="mx-auto h-auto w-full max-w-[505px] translate-x-17"
                        placeholder="blur"
                    />
                </motion.div>
            </div>
        </section>
    );
};
