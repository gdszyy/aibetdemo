import { uofFetcher } from '@/api/client';
import { normalizeMarketGroups } from '@/api/models/market';
import type { WorldCupChampionship } from '@/api/models/promotion-world-cup-league';

/** 标准化世界杯冠军盘，过滤不可展示的盘口与投注项。 */
const normalizeWorldCupChampionship = (response: WorldCupChampionship): WorldCupChampionship => ({
    ...response,
    markets: normalizeMarketGroups(response.markets),
});

/** 获取世界杯冠军盘。 */
export const GetWorldCupChampionshipInterface = (): Promise<WorldCupChampionship> => {
    return uofFetcher.get<WorldCupChampionship>('/v1/fifa-world-cup/championship').then(normalizeWorldCupChampionship);
};
