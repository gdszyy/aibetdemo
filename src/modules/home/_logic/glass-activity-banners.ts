import anniversaryBrGlassDark from '@/assets/images/promotion/ios26-glass/anniversary-br-glass-dark.png';
import anniversaryBrGlassLight from '@/assets/images/promotion/ios26-glass/anniversary-br-glass-light.png';
import anniversaryMxGlassDark from '@/assets/images/promotion/ios26-glass/anniversary-mx-glass-dark.png';
import anniversaryMxGlassLight from '@/assets/images/promotion/ios26-glass/anniversary-mx-glass-light.png';
import parlayBrGlassDark from '@/assets/images/promotion/ios26-glass/parlay-br-glass-dark.png';
import parlayBrGlassLight from '@/assets/images/promotion/ios26-glass/parlay-br-glass-light.png';
import parlayMxGlassDark from '@/assets/images/promotion/ios26-glass/parlay-mx-glass-dark.png';
import parlayMxGlassLight from '@/assets/images/promotion/ios26-glass/parlay-mx-glass-light.png';
import refundBrGlassDark from '@/assets/images/promotion/ios26-glass/refund-br-glass-dark.png';
import refundBrGlassLight from '@/assets/images/promotion/ios26-glass/refund-br-glass-light.png';
import refundMxGlassDark from '@/assets/images/promotion/ios26-glass/refund-mx-glass-dark.png';
import refundMxGlassLight from '@/assets/images/promotion/ios26-glass/refund-mx-glass-light.png';
import type { BannerItem } from '@/components/banner-carousel';
import { getSchemeMeta } from '@/components/theme-provider/scheme-meta';
import type { Scheme } from '@/components/theme-provider/theme-provider';

export type BannerMarket = 'br' | 'mx';
export type GlassBannerKey = 'anniversary' | 'parlay' | 'refund';
// Every glass scheme shows the activity banners: neon glass-light/-dark plus the LATAM
// glass-brasil / glass-mexico / glass-azul / glass-roxo × mode. Promo art only exists per
// mode, so LATAM schemes reuse the light/dark glass art bucket resolved from scheme-meta.
export type GlassScheme = Extract<Scheme, `glass-${string}`>;
type GlassBannerImageScheme = 'glass-light' | 'glass-dark';

const GLASS_BANNER_IMAGES = {
    'glass-light': {
        anniversary: { br: anniversaryBrGlassLight, mx: anniversaryMxGlassLight },
        parlay: { br: parlayBrGlassLight, mx: parlayMxGlassLight },
        refund: { br: refundBrGlassLight, mx: refundMxGlassLight },
    },
    'glass-dark': {
        anniversary: { br: anniversaryBrGlassDark, mx: anniversaryMxGlassDark },
        parlay: { br: parlayBrGlassDark, mx: parlayMxGlassDark },
        refund: { br: refundBrGlassDark, mx: refundMxGlassDark },
    },
} as const;

export const isGlassBannerScheme = (scheme: Scheme | undefined): scheme is GlassScheme =>
    scheme !== undefined && getSchemeMeta(scheme).brand === 'glass';

// LATAM glass schemes have no dedicated banner art; fall back to the light/dark bucket by mode.
const resolveGlassImageScheme = (scheme: GlassScheme): GlassBannerImageScheme =>
    getSchemeMeta(scheme).mode === 'dark' ? 'glass-dark' : 'glass-light';

export const getGlassActivityBannerImage = (scheme: GlassScheme, key: GlassBannerKey, market: BannerMarket) =>
    GLASS_BANNER_IMAGES[resolveGlassImageScheme(scheme)][key][market];

export const getGlassActivityBanners = (scheme: GlassScheme, market: BannerMarket): BannerItem[] => [
    {
        id: 12,
        bgColor: 'transparent',
        title: 'Anniversary rewards',
        link: '/sports/promotions/first-deposit-bonus',
        imageUrl: getGlassActivityBannerImage(scheme, 'anniversary', market),
        mobileImageUrl: getGlassActivityBannerImage(scheme, 'anniversary', market),
        type: 'event',
    },
    {
        id: 11,
        bgColor: 'transparent',
        title: 'Parlay boost',
        imageUrl: getGlassActivityBannerImage(scheme, 'parlay', market),
        mobileImageUrl: getGlassActivityBannerImage(scheme, 'parlay', market),
        type: 'event',
    },
    {
        id: 13,
        bgColor: 'transparent',
        title: 'Refund promotion',
        imageUrl: getGlassActivityBannerImage(scheme, 'refund', market),
        mobileImageUrl: getGlassActivityBannerImage(scheme, 'refund', market),
        type: 'event',
    },
];
