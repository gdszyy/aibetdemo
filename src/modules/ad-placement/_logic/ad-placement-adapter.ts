import { AdPlacementJumpType, type BannerAdPlacement } from '@/api/models/ad-placement';
import type { BannerItem } from '@/components/banner-carousel';

/**
 * 将广告位 Banner 数据适配为共享 BannerCarousel 的数据结构。
 *
 * 广告位接口使用 activity_name/data 字段，共享轮播组件使用 BannerItem。
 * 这里隔离字段差异，让首页和 Casino 页面可以继续复用已有 BannerCarousel。
 */
export const adPlacementToBannerItem = (item: BannerAdPlacement): BannerItem => ({
    id: item.id,
    bgColor: 'transparent',
    title: item.data.title || item.activity_name,
    link: item.data.jump_type === AdPlacementJumpType.None ? undefined : item.data.jump_target,
    imageUrl: item.data.desktop_image ?? '',
    mobileImageUrl: item.data.mobile_image ?? item.data.desktop_image ?? '',
    type: 'promotion',
});
