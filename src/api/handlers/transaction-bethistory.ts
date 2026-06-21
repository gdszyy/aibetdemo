import { userFetcher } from '@/api/client';
import type { PageResponse } from '../lib/types';
import type { CasinoReportItem, GameReportItem, SportReportItem } from '../models/transaction-bethistory';

/** Page-based bet history query params (V2) */
export interface BetHistoryPageParams {
    currency_id: number;
    page_num: number;
    page_size: number;
    type?: 'all' | 'sport' | 'casino';
    provider?: string;
    game_type?: string;
    sport_type?: string;
    start_time?: string;
    end_time?: string;
}

/** Get mixed game report list for the All tab. */
export const GetGameReportInterface = (params: BetHistoryPageParams) =>
    userFetcher.get<PageResponse<GameReportItem>>('/v1/user/game/report', params);

/** Get sport report list for the Sport tab. */
export const GetSportReportInterface = (params: BetHistoryPageParams) =>
    userFetcher.get<PageResponse<SportReportItem>>('/v1/user/sport/report', params);

/** Get casino bet history (game service — separate from sport) */
export const GetCasinoBetHistoryInterface = (params: BetHistoryPageParams) =>
    userFetcher.get<PageResponse<CasinoReportItem>>('/v1/user/casino/report', params);
