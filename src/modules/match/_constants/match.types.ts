import type { LineStatus, OutcomeModel } from '@/api/models/market';

export interface OddsEntity {
    eventId: string;
    eventIdType: string;
    /** 赛事阶段，1 表示赛前；来自购物车、推荐卡或本地 check 接口。 */
    matchStatus?: number;
    line: string;
    tournamentId: string;
    /** 地区 ID，用于活动规则 region_id 匹配。 */
    categoryId?: string;
    isOutright?: boolean;
    title: string;
    marketId: number;
    marketName: string;
    productRaw: string;
    productId: string;
    specifiers: string;
    outcome: OutcomeModel;
    sportId?: string;
    sportName?: string;
    lineStatus?: LineStatus;
    /** Data timestamp */
    timestamp: number;
}
