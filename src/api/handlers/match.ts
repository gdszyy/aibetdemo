import { type FetchOptions, uofFetcher } from '@/api/client';
import type { CartItemOutcome } from '@/api/models/cart';
import type { LineStatus, OutcomeNameBatchItem, OutcomeNameBatchResponseItem } from '@/api/models/market';
import { normalizeMarketGroups } from '../models/market';
import type { MatchWithMarkets } from '../models/match';

// Match detail
/** Match market list query params */
export type MatchMarketsQueryParams = {
    /** e.g: sr:match:65919704 */
    event_id: string;
};

export interface SpecifierStatusCheckItem {
    event_id: string;
    event_id_type: string;
    /** 赛事阶段，1 表示赛前。 */
    match_status: number;
    product: string;
    product_raw: string;
    market_id: string;
    specifiers: string;
    specifiers_status: LineStatus;
    timestamp: number;
    outcome_id: string;
    outcome_odds: string;
    outcome_active: number;
    outcome_line: string;
    /** 地区 ID，对应活动规则 region_id。 */
    category_id?: string;
}

export const PostLocalCartInterface = (params: CartItemOutcome[]) => {
    return uofFetcher.post<SpecifierStatusCheckItem[]>(`/v1/match/market/specifier/status/check`, params);
};

/** 批量获取 WS 新增投注项的展示名称 */
export const PostOutcomeNameBatchInterface = (params: OutcomeNameBatchItem[]) => {
    return uofFetcher.post<OutcomeNameBatchResponseItem[]>(`/v1/outcome/name/batch`, params);
};

const normalizeMatchWithMarkets = (match: MatchWithMarkets): MatchWithMarkets => ({
    ...match,
    markets: normalizeMarketGroups(match.markets),
});

const getMatchById = (eventId: string, options?: FetchOptions) => {
    return uofFetcher.get<MatchWithMarkets>(`/v1/match/${eventId}`, undefined, options);
};

/** Get match detail and market list */
export const GetMatchInterface = (params: MatchMarketsQueryParams, options?: FetchOptions) => {
    return getMatchById(params.event_id, options).then(normalizeMatchWithMarkets);
};
