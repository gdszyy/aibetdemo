import { type FetchOptions, uofFetcher } from '@/api/client';
import { normalizeMarketGroups } from '@/api/models/market';
import type {
    BreadcrumbQueryParams,
    BreadcrumbResponse,
    HomeBestMatchesQueryParams,
    HomeBestMatchesResponse,
    HotMatchesQueryParams,
    HotMatchesResponse,
    LiveMatchCountQueryParams,
    LiveMatchCountResponse,
    MarketChipResponse,
    MarketTabQueryParams,
    MarketTabResponse,
    MatchEvent,
    MatchEventResponse,
    MatchRowBatchCountQueryParams,
    MatchRowBatchCountResponse,
    SearchMatchesQueryParams,
    SearchMatchesResponse,
    TournamentGroup,
} from '../models/match-game';

const normalizeMatchEvent = (event: MatchEventResponse): MatchEvent => ({
    ...event,
    markets: normalizeMarketGroups(event.markets),
    popularMarkets: normalizeMarketGroups(event.popularMarkets),
    live_market_count: event.live_market_count ?? 0,
    market_ids: event.market_ids ?? null,
});

const normalizeTournamentGroup = (group: TournamentGroup): TournamentGroup => ({
    ...group,
    events: group.events.map(normalizeMatchEvent),
});

const deriveMarketColumns = (events: MatchEvent[]): TournamentGroup['market_columns'] => {
    const columns = new Map<string, TournamentGroup['market_columns'][number]>();

    events.forEach((event) => {
        event.markets.forEach((market) => {
            const id = String(market.id);
            if (columns.has(id)) return;

            columns.set(id, {
                id,
                name: market.name,
                outcome_count: market.lines[0]?.outcomes.length,
            });
        });
    });

    return Array.from(columns.values());
};

/** 首页最佳比赛：每条 API 记录单独成组，保持后端 list 顺序，不按联赛合并。 */
const normalizeHomeBestMatchesResponse = (response: HomeBestMatchesResponse): TournamentGroup[] =>
    (response?.list ?? []).map((match) => {
        const event = normalizeMatchEvent(match);

        return {
            sport_id: match.sport_id,
            sport_name: match.sport_name,
            category_id: match.category_id,
            category_name: match.category_name,
            tournament_id: match.tournament_id,
            tournament_name: match.tournament_name,
            tournament_logo: match.tournament_logo,
            market_columns: deriveMarketColumns([event]),
            events: [event],
        };
    });

/**
 * Get hot matches by sport ID
 * Returns matches organized by popular tournaments based on configuration
 */
export const GetHotMatchesInterface = (params: HotMatchesQueryParams) => {
    return uofFetcher
        .get<HotMatchesResponse>(`/v1/match/hot`, params)
        .then((response) => response?.map(normalizeTournamentGroup) ?? []);
};

/**
 * Get best live matches for the home carousel
 */
export const GetBestLiveMatchesInterface = (params: HomeBestMatchesQueryParams) => {
    return uofFetcher.get<HomeBestMatchesResponse>(`/v1/match/ao-vivo`, params).then(normalizeHomeBestMatchesResponse);
};

/**
 * Get best upcoming matches for the home carousel
 */
export const GetBestMatchesInterface = (params: HomeBestMatchesQueryParams) => {
    return uofFetcher
        .get<HomeBestMatchesResponse>(`/v1/match/melhores-partidas`, params)
        .then(normalizeHomeBestMatchesResponse);
};

/**
 * 批量获取直播赛事数量。
 * 返回 sport_id 到直播赛事数量的映射。
 */
export const PostLiveMatchCountInterface = (params: LiveMatchCountQueryParams) => {
    return uofFetcher.post<LiveMatchCountResponse>(`/v1/match/live/count`, params);
};

/**
 * Search matches by sport detail
 * Returns matches filtered by sport, category, tournament, status, and time range
 * Supports pagination with cursor and limit
 */
export const SearchMatchesInterface = (params: SearchMatchesQueryParams) => {
    return uofFetcher.get<SearchMatchesResponse>(`/v1/match/search`, params).then((response) => ({
        ...response,
        list: response.list.map(normalizeTournamentGroup),
    }));
};

/**
 * Get match detail page breadcrumb
 * Returns sport / category / tournament / competitor names for breadcrumb navigation
 */
export const GetBreadcrumbInterface = (params: BreadcrumbQueryParams, options?: FetchOptions) => {
    return uofFetcher.get<BreadcrumbResponse>(`/v1/menu/breadcrumb`, params, options);
};

/**
 * Get market tab grouping for a sport
 * Used for detail page categorization
 */
export const GetMarketTabsInterface = (params: MarketTabQueryParams) => {
    return uofFetcher
        .get<MarketTabResponse>(`/v1/match/market/tab`, params)
        .then((response) => [...response].sort((a, b) => a.sorted - b.sorted));
};

/**
 * Get market chip (period filter) configuration
 * Returns chip names with optional template placeholders for period filtering
 *
 * // TODO 删除？
 */
export const GetMarketChipInterface = (params: MarketTabQueryParams) => {
    return uofFetcher.get<MarketChipResponse>(`/v1/match/market/chip`, params);
};

/**
 * Get batch market row count for multiple matches
 * Returns a map of event_id -> market row key array; use .length for total count
 */
export const PostMatchRowBatchCountInterface = (params: MatchRowBatchCountQueryParams) => {
    return uofFetcher.post<MatchRowBatchCountResponse>(`/v1/match/row/batch/count`, params);
};
