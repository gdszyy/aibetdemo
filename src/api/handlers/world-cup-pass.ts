import { activityFetcher } from '@/api/client';
import type {
    WorldCupPassClaimRequest,
    WorldCupPassClaimResponse,
    WorldCupPassInfo,
    WorldCupPassInfoRequest,
    WorldCupPassUnlockPremiumRequest,
    WorldCupPassUnlockPremiumResponse,
} from '@/api/models/world-cup-pass';

/** 获取 World Cup Pass 首页信息接口 */
export const GetWorldCupPassInfoInterface = (params: WorldCupPassInfoRequest) => {
    return activityFetcher.post<WorldCupPassInfo>('/h5/worldCupPass/info', params);
};

/** 领取 World Cup Pass 奖励接口 */
export const ClaimWorldCupPassRewardInterface = (params: WorldCupPassClaimRequest) => {
    return activityFetcher.post<WorldCupPassClaimResponse>('/h5/worldCupPass/claim', params);
};

/** 解锁高级 World Cup Pass 接口 */
export const UnlockWorldCupPassPremiumInterface = (params: WorldCupPassUnlockPremiumRequest) => {
    return activityFetcher.post<WorldCupPassUnlockPremiumResponse>('/h5/worldCupPass/unlock', params);
};
