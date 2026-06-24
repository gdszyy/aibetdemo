import { AdPlacementJumpType, type BannerAdPlacement } from '@/api/models/ad-placement';
import type { BannerItem } from '@/components/banner-carousel';
import type { Scheme } from '@/components/theme-provider/theme-provider';
import {
    type BannerMarket,
    type GlassBannerKey,
    getGlassActivityBannerImage,
    isGlassBannerScheme,
} from '@/modules/home/_logic/glass-activity-banners';

interface AdPlacementToBannerItemOptions {
    scheme?: Scheme;
    market?: BannerMarket;
}

const normalizeCampaignText = (value: string | undefined): string =>
    (value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[_-]+/g, ' ');

const resolveGlassBannerKey = (item: BannerAdPlacement): GlassBannerKey | null => {
    const text = normalizeCampaignText(
        [
            item.activity_name,
            item.data.title,
            item.data.jump_target,
            item.data.desktop_image,
            item.data.mobile_image,
        ].join(' '),
    );

    if (/(parlay|combo|combos|combinad|mais ganhos|mas ganas)/.test(text)) return 'parlay';
    if (/(refund|dinheiro de volta|0 a 0|brasileirao|liga mx|cashback)/.test(text)) return 'refund';
    if (/(anniversary|first deposit|deposito|deposit|recompensa|reward|12[.,]?000|12000)/.test(text)) {
        return 'anniversary';
    }

    return null;
};

const resolveGlassBannerImage = (item: BannerAdPlacement, options: AdPlacementToBannerItemOptions) => {
    if (!isGlassBannerScheme(options.scheme)) return null;

    const key = resolveGlassBannerKey(item);
    if (!key) return null;

    return getGlassActivityBannerImage(options.scheme, key, options.market ?? 'br');
};

/**
 * Adapts backend ad-placement banner data to the shared BannerCarousel model.
 */
export const adPlacementToBannerItem = (
    item: BannerAdPlacement,
    options: AdPlacementToBannerItemOptions = {},
): BannerItem => {
    const glassImage = resolveGlassBannerImage(item, options);

    return {
        id: item.id,
        bgColor: 'transparent',
        title: item.data.title || item.activity_name,
        link: item.data.jump_type === AdPlacementJumpType.None ? undefined : item.data.jump_target,
        imageUrl: glassImage ?? item.data.desktop_image ?? '',
        mobileImageUrl: glassImage ?? item.data.mobile_image ?? item.data.desktop_image ?? '',
        type: 'promotion',
    };
};
