import { useQuery } from '@tanstack/react-query';
import type { AdPlacementType } from '@/api/models/ad-placement';
import { AdPlacementQueryKeys } from '../_constants/ad-placement-query-keys';
import { getAdPlacementConfig } from '../_logic/ad-placement-service';

interface UseAdPlacementsOptions {
    types: AdPlacementType[];
    enabled?: boolean;
}

/**
 * 读取常驻广告配置并按广告位类型过滤。
 *
 * 所有常驻广告位共用同一个 config query，组件只传自己关心的类型。
 * 这样 Banner、顶部公告和侧边栏不会重复请求接口，也能共享 React Query 缓存。
 */
export const useAdPlacements = ({ types, enabled = true }: UseAdPlacementsOptions) => {
    return useQuery({
        queryKey: AdPlacementQueryKeys.config(),
        queryFn: getAdPlacementConfig,
        enabled,
        select: (items) => items.filter((item) => types.includes(item.activity_type)),
        staleTime: 60 * 1000,
        placeholderData: [],
    });
};
