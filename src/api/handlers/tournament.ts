import { uofFetcher } from '@/api/client';
import { type MarketGroup, normalizeMarketGroups } from '@/api/models/market';

export interface TournamentMarkets {
    timestamp: number;
    season_id: string;
    season_name: string;
    markets: MarketGroup[];
}

export interface OutrightMarketEvent {
    event_id: string;
    event_id_type: string;
    markets: MarketGroup[];
}

export type OutrightMarketsResponse = OutrightMarketEvent[];

const normalizeTournamentMarkets = (response: TournamentMarkets): TournamentMarkets => ({
    ...response,
    markets: normalizeMarketGroups(response.markets),
});

const normalizeOutrightMarkets = (response: OutrightMarketsResponse): OutrightMarketsResponse =>
    response.map((event) => ({
        ...event,
        markets: normalizeMarketGroups(event.markets),
    }));

export const GetTournamentMarketsInterface = (params: { tournament_id: string }) => {
    return uofFetcher.get<TournamentMarkets>(`/v1/season/market`, params).then(normalizeTournamentMarkets);
};

export const GetOutrightMarketsInterface = (params: {
    sport_id?: string;
    category_id?: string;
    tournament_id?: string;
}) => {
    return uofFetcher.get<OutrightMarketsResponse>(`/v1/outright`, params).then(normalizeOutrightMarkets);
};
