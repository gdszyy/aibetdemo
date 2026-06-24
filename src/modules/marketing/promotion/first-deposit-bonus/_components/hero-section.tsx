'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { isRechargeCodeActive } from '@/api/handlers/recharge-code';
import { Button } from '@/components/button/button';
import { Clock } from '@/components/icons';
import { APP_NAME } from '@/constants';
import { UserCenterMenu } from '@/constants/user-center';
import { useAccountNavigator } from '@/hooks/use-account-navigator';
import { useFirstRechargeCode, useRechargeCodeStore } from '@/hooks/use-recharge-code';
import { useRegionConfig } from '@/i18nV2';
import { useIsLogin } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { HERO_IMAGE } from '../../_constants/promotion-data';
import { useAmount } from '../../_utils/useAmount';
import { useFirstRechargeTotalReward } from '../services/use-first-recharge';

const HeroValiditySkeleton = ({ placeholder }: { placeholder: string }) => (
    <div className="relative flex items-center gap-2 bg-surface-1/60 backdrop-blur-sm border border-filltext-ft-b rounded-full px-5 py-2.5">
        <Clock className="invisible size-4 shrink-0" />
        <span className="invisible text-auxiliary-sm text-filltext-ft-g">{placeholder}</span>

        <div className="pointer-events-none absolute inset-0 flex items-center gap-2 px-5 py-2.5">
            <div className="size-4 shrink-0 animate-skeleton-pulse rounded-full bg-filltext-ft-d/35" />
            <div className="h-4 flex-1 animate-skeleton-pulse rounded bg-filltext-ft-d/35" />
        </div>
    </div>
);

export const HeroSection: FunctionComponent = () => {
    const t = useTranslations('promotionFirstDepositBonus');
    const isLogin = useIsLogin();
    const openLoginModal = useUIStore((s) => s.openLoginModal);
    const accountNavigator = useAccountNavigator();

    const promotionItem = useFirstRechargeCode();

    const isLoading = useRechargeCodeStore((s) => s.loading);

    const isActive = promotionItem ? isRechargeCodeActive([promotionItem]) : false;

    const handleCTA = () => {
        if (!isLogin) {
            openLoginModal();
            return;
        }
        accountNavigator.open(UserCenterMenu.DEPOSIT);
    };

    const regionConfig = useRegionConfig();

    const formatAmount = useAmount();
    const totalReward = useFirstRechargeTotalReward();
    const amount = formatAmount(totalReward || 0);

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat(regionConfig?.regionCode || '', {
            timeZone: regionConfig?.timezone || '',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(date);
    };

    return (
        <section className="relative w-full overflow-hidden">
            {/* Desktop: left text + right image | Mobile: image on top, text below */}
            <div className="max-w-(--main-content-max-width) mx-auto w-full flex flex-col @5xl:flex-row @5xl:items-center @5xl:gap-4 px-4 @lg:px-6 @5xl:px-8">
                {/* Left: Text content */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.25 }}
                    className="flex flex-col items-start text-left @5xl:flex-1 @5xl:min-w-0 order-2 @5xl:order-1"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 text-auxiliary-md px-3 py-1 rounded-full mb-3 shadow-sm tracking-wider bg-brand-red text-white">
                        {t('hero.badge', { appName: APP_NAME.toUpperCase() })}
                    </div>

                    {/* Title */}
                    <h1 className="text-headline-md @5xl:text-headline-lg leading-tight mb-2 text-filltext-ft-h">
                        {t('hero.title')}
                    </h1>

                    {/* Max amount */}
                    <div className="flex items-baseline gap-1.5 mb-1.5">
                        <span className="text-body-sm text-filltext-ft-f">{t('hero.amountPrefix')}</span>
                        <span className="text-headline-lg text-brand-red">
                            {t('hero.amount', {
                                amount,
                            })}
                        </span>
                        <span className="text-body-lg @lg:text-title-sm text-brand-red">{t('hero.amountSuffix')}</span>
                    </div>

                    <p className="text-auxiliary-sm @lg:text-body-sm text-filltext-ft-f max-w-[500px]">
                        {t('hero.subtitle', { amount })}
                    </p>

                    {/* CTA or Validity — show deposit button when active, show time when upcoming */}
                    <div className="mt-3 mb-2 flex flex-wrap items-stretch gap-4">
                        <div className="flex flex-col items-start gap-2">
                            {isLoading ? (
                                <HeroValiditySkeleton placeholder={''} />
                            ) : (
                                !!promotionItem?.start_time && (
                                    <div className="flex items-center gap-2 bg-surface-1/60 backdrop-blur-sm border border-filltext-ft-b rounded-full px-5 py-2.5">
                                        <Clock className="size-4 text-brand-red shrink-0" />
                                        <span className="text-auxiliary-sm text-filltext-ft-g">
                                            {t('hero.validityLabel')}: {formatTime(new Date(promotionItem.start_time))}
                                            {' - '}
                                            {formatTime(new Date(promotionItem.end_time))} ({regionConfig?.timezoneUTC})
                                        </span>
                                    </div>
                                )
                            )}
                            {isActive && (
                                <Button
                                    className="px-8 rounded-full shadow-[0_4px_8px_0_var(--brand-primary-3)] active:scale-[0.98]"
                                    onClick={handleCTA}
                                >
                                    {t('cta')}
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Right: Hero image */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="@5xl:flex-[1.6] @5xl:min-w-0 order-1 @5xl:order-2 mb-2 @5xl:mb-0"
                >
                    <div
                        style={{
                            maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 80%)',
                            WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 80%)',
                        }}
                    >
                        <Image
                            src={HERO_IMAGE}
                            alt={`${APP_NAME} 5° Aniversario`}
                            width={1920}
                            height={800}
                            priority
                            className="w-full h-auto"
                            placeholder="blur"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
