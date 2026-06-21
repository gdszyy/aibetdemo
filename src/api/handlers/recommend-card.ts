import { uofFetcher } from '@/api/client';
import type { RecommendCard } from '@/api/models/recommend-card';

/** 获取首页推荐串关加赔卡片，未登录也可访问。 */
export const GetRecommendCardsInterface = (): Promise<RecommendCard[]> => {
    return uofFetcher.get<RecommendCard[]>('/v1/event/recommend-card', undefined, {
        withAuth: false,
    });
};
