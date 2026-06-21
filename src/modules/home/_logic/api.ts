/**
 * Home module mock data and mock APIs
 *
 * Contains:
 * - Banner carousel data (promotions)
 */

import activityBannerAnniversaryBr from '@/assets/images/promotion/anniversary-br.png';
import activityBannerAnniversaryMx from '@/assets/images/promotion/anniversary-mx.png';

import activityBannerParlayBr from '@/assets/images/promotion/parlay-br.png';
import activityBannerParlayMx from '@/assets/images/promotion/parlay-mx.png';

import activityBannerRefundBr from '@/assets/images/promotion/refund-br.png';
import activityBannerRefundMx from '@/assets/images/promotion/refund-mx.png';

import type { BannerItem } from '@/components/banner-carousel';
import type { Locale } from '@/i18n';

/**
 * Mock banner data
 * Simulates real promotions and events
 */
type BannerMarket = 'br' | 'mx';

/**
 * Resolve banner market from locale.
 * App locales are constrained to `pt|es|en` in `src/i18n/locale/config.ts`
 */
const resolveMarketFromLocale = (locale: string | undefined): BannerMarket => {
    const marketByLocale: Record<Locale, BannerMarket> = {
        pt: 'br',
        en: 'mx', // English falls back to MX (Spanish) market
        es: 'mx',
    };

    const key = locale as Locale;
    return marketByLocale[key] ?? 'br';
};

/** Config for a locale-aware activity banner (desktop + mobile per market) */
interface ActivityBannerConfig {
    id: number;
    link?: string;
    desktop: Record<BannerMarket, { src: string }>;
    mobile: Record<BannerMarket, { src: string }>;
}

const ACTIVITY_BANNERS: Record<string, ActivityBannerConfig> = {
    anniversary: {
        id: 12,
        link: '/sports/promotions/first-deposit-bonus',
        desktop: {
            br: activityBannerAnniversaryBr,
            mx: activityBannerAnniversaryMx,
        },
        mobile: {
            br: activityBannerAnniversaryBr,
            mx: activityBannerAnniversaryMx,
        },
    },
    parlay: {
        id: 11,
        desktop: { br: activityBannerParlayBr, mx: activityBannerParlayMx },
        mobile: { br: activityBannerParlayBr, mx: activityBannerParlayMx },
    },
    refund: {
        id: 13,
        desktop: { br: activityBannerRefundBr, mx: activityBannerRefundMx },
        mobile: { br: activityBannerRefundBr, mx: activityBannerRefundMx },
    },
};

const buildActivityBanner = (market: BannerMarket, config: ActivityBannerConfig): BannerItem => ({
    id: config.id,
    bgColor: 'transparent',
    title: '',
    link: config.link,
    imageUrl: config.desktop[market].src,
    mobileImageUrl: config.mobile[market].src,
    type: 'event',
});

// Order matches Figma home banner row: anniversary → parlay → refund
const buildBanners = (market: BannerMarket): BannerItem[] => [
    buildActivityBanner(market, ACTIVITY_BANNERS.anniversary),
    buildActivityBanner(market, ACTIVITY_BANNERS.parlay),
    buildActivityBanner(market, ACTIVITY_BANNERS.refund),
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock: Get banner list
 * Market is resolved from locale: pt → br, es/en → mx
 */
export const mockGetBanners = async (ctx?: { queryKey?: readonly unknown[] }): Promise<BannerItem[]> => {
    await delay(200);
    const locale = typeof ctx?.queryKey?.[1] === 'string' ? (ctx.queryKey[1] as string) : undefined;
    const market = resolveMarketFromLocale(locale);
    return buildBanners(market);
};
