import { activityFetcher } from '@/api/client';
import type { GetChampionHandicapInfoResp } from '@/api/models/champion-handicap';

/** 获取冠军盘活动信息 */
export const GetChampionHandicapInfoInterface = (): Promise<GetChampionHandicapInfoResp> => {
    return activityFetcher.post<GetChampionHandicapInfoResp>(`/h5/worldCupChampion/info`);
};

/** 参与冠军盘活动 */
export const JoinChampionHandicapInterface = (): Promise<unknown> => {
    return activityFetcher.post(`/h5/worldCupChampion/join`);
};
