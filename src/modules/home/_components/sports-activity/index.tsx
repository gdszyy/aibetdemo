'use client';

import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { AdPlacementType, type SportsBannerAdPlacement } from '@/api/models/ad-placement';
import { BannerCarousel, type BannerItem } from '@/components/banner-carousel';
import { adPlacementToBannerItem, useAdPlacementNavigation, useAdPlacements } from '@/modules/ad-placement';
import { BannerCountDown } from '@/modules/marketing/promotion/world-cup-league/leagues-banner/components/BannerCountDown';
import { cn } from '@/utils/common';

interface SportsActivityProps {
    className?: string;
}

const MockSportsActivityBanner: FunctionComponent = () => {
    const t = useTranslations('home');

    return (
        <div
            className="relative aspect-360/128 w-full overflow-hidden rounded-sm border border-[color:var(--brand-match-card-border,var(--border-subtle))] px-4 py-3 md:aspect-970/200 md:px-6 md:py-5"
            style={{
                background:
                    'linear-gradient(110deg, var(--brand-match-card-bg, #171a23) 0%, var(--brand-odds-bg, #202431) 58%, var(--brand-nav-active-underline, var(--brand-nav-active-bg, #ff1f32)) 100%)',
            }}
        >
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_45%,rgba(255,255,255,0.22),transparent_42%)]" />
            <div className="relative flex h-full max-w-[72%] flex-col justify-center gap-2">
                <span className="w-fit rounded-sm bg-[rgba(255,255,255,0.14)] px-2 py-1 text-auxiliary-2xs font-bold uppercase text-white">
                    {t('sportActivity.mockBadge')}
                </span>
                <div className="truncate text-title-lg font-bold text-white md:text-headline-lg">
                    {t('sportActivity.mockTitle')}
                </div>
                <p className="line-clamp-2 text-auxiliary-sm font-medium text-white/80 md:text-body-md">
                    {t('sportActivity.mockSubtitle')}
                </p>
            </div>
        </div>
    );
};

/** SPORTS ACTIVITY 模块 */
export const SportsActivity: FunctionComponent<SportsActivityProps> = ({ className }) => {
    const t = useTranslations('home');
    const navigate = useAdPlacementNavigation();

    const { data: adPlacementBanners = [] } = useAdPlacements({
        types: [AdPlacementType.SportsBanner],
    });
    const sportsAdPlacementBanners = adPlacementBanners.filter(
        (item): item is SportsBannerAdPlacement => item.activity_type === AdPlacementType.SportsBanner,
    );
    const banners = sportsAdPlacementBanners.map(adPlacementToBannerItem);
    const handleBannerClick = (banner: BannerItem) => {
        const item = sportsAdPlacementBanners.find((adPlacementBanner) => adPlacementBanner.id === banner.id);
        if (!item) return;

        navigate(item);
    };

    return (
        <div className={cn(className)}>
            <div className="mb-2 md:mb-4 max-md:text-title-lg max-md:font-roboto-flex max-md:variation-title md:text-headline-lg text-brand-primary-4 uppercase">
                {t('sportActivity.title')}
            </div>
            {/* 倒计时 */}
            <BannerCountDown />

            {banners.length > 0 ? (
                <BannerCarousel banners={banners} startIndex={0} onBannerClick={handleBannerClick} />
            ) : (
                <MockSportsActivityBanner />
            )}
        </div>
    );
};
