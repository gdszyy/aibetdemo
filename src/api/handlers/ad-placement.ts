import { userFetcher } from '@/api/client';
import type {
    AdPlacementActivityResponse,
    AdPlacementTriggeredResponse,
    GetTriggeredAdPlacementsParams,
} from '@/api/models/ad-placement';

/**
 * 获取广告位配置接口原始响应。
 *
 * api 层只负责发起接口请求并返回后端数据，不在这里过滤 status 或转换 jump_type。
 */
export const GetAdPlacementConfigInterface = async (): Promise<AdPlacementActivityResponse> => {
    return userFetcher.get<AdPlacementActivityResponse>('/v1/user/activity/config');
};

/**
 * 获取触发型广告接口原始响应。
 *
 * opportunity 直接透传后端，响应保持 popup/float_cards 的原始结构。
 */
export const GetTriggeredAdPlacementsInterface = async (
    params: GetTriggeredAdPlacementsParams,
): Promise<AdPlacementTriggeredResponse> => {
    return userFetcher.get<AdPlacementTriggeredResponse>('/v1/user/activity/trigger', {
        opportunity: params.opportunity,
    });
};

/**
 * 获取未登录触发型广告接口原始响应。
 */
export const GetGuestTriggeredAdPlacementsInterface = async (
    params: GetTriggeredAdPlacementsParams,
): Promise<AdPlacementTriggeredResponse> => {
    return userFetcher.get<AdPlacementTriggeredResponse>('/v1/guest/activity/trigger', {
        opportunity: params.opportunity,
    });
};
