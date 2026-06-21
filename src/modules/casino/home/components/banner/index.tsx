'use client';

import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { AdPlacementType, type CasinoBannerAdPlacement } from '@/api/models/ad-placement';
import { BannerCarousel, type BannerItem } from '@/components/banner-carousel';
import { adPlacementToBannerItem, useAdPlacementNavigation, useAdPlacements } from '@/modules/ad-placement';

export const Banner: FunctionComponent = () => {
    const t = useTranslations('casino');
    const navigate = useAdPlacementNavigation();
    const { data: adPlacementBanners = [] } = useAdPlacements({
        types: [AdPlacementType.CasinoBanner],
    });
    const casinoAdPlacementBanners = adPlacementBanners.filter(
        (item): item is CasinoBannerAdPlacement => item.activity_type === AdPlacementType.CasinoBanner,
    );
    const banners = casinoAdPlacementBanners.map(adPlacementToBannerItem);
    const handleBannerClick = (banner: BannerItem) => {
        const item = casinoAdPlacementBanners.find((adPlacementBanner) => adPlacementBanner.id === banner.id);
        if (!item) return;

        navigate(item);
    };

    if (!banners.length) {
        return null;
    }

    return (
        <div>
            <div className="mb-2 md:mb-4 max-md:text-title-lg max-md:font-roboto-flex max-md:variation-title md:text-headline-lg text-brand-primary-4 uppercase">
                {t('banner.title')}
            </div>
            <BannerCarousel banners={banners} variant="single" onBannerClick={handleBannerClick} />
        </div>
    );
};
