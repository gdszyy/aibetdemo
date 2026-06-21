import { activityFetcher } from '@/api/client';
import type {
    GetActivityStatusRes,
    GetUserVipResp,
    VipBetSettleRes,
    VipLevelInfo,
    VipRewardClaimRes,
    VipRewardsRes,
    VipTierInfo,
    VipTierRewards,
} from '@/api/models/vip';

interface BaseParam {
    /** 活动id */
    activityId: number;
    /** deprecated 用户id -- 这里不传，让接口方自己从token中获取 */
    // userId?: string;
}

/** 获取 VIP 活动状态 */
export const GetVipActivityStatusInterface = (params: BaseParam): Promise<GetActivityStatusRes> => {
    return activityFetcher.post<GetActivityStatusRes>('/h5/event/get_activity_status', params);
};

interface VipBetSettleRequest extends BaseParam {
    /** 来源类型：1SPORTS/2CASINO */
    sourceType: number;
    /** 业务单号（幂等键） */
    bizId: string;
    /** 产品类型 */
    productType?: number;
    /** 游戏类型 */
    gameType?: number;
    /** 投注金额 */
    betAmount: number;
    /** 有效流水 */
    validAmount: number;
    /** 用户标签 */
    tags: string[];
    /** 设备id */
    deviceId: string;
    /** 是否kyc */
    isKYC: number;
    /** ip地址 */
    ip: string;
}

export interface VipRewardClaimRequest extends BaseParam {
    /** 奖励类型 */
    rewradType: number;
}

/** 获取 VIP 段位信息 */
export const GetVipTierInfoInterface = (params: BaseParam) => {
    return activityFetcher.post<VipTierInfo[]>(`/h5/vip/tierInfo`, params);
};

/** 获取 VIP 段位权益信息 */
export const GetVipTierRewardsInterface = (params: BaseParam) => {
    return activityFetcher.post<VipTierRewards[]>(`/h5/vip/tierRewards`, params);
};

/** 获取 VIP 等级信息 */
export const GetVipLevelInfoInterface = (params: BaseParam) => {
    return activityFetcher.post<VipLevelInfo[]>(`/h5/vip/levelInfo`, params);
};

/** VIP 流水上报 */
export const VipBetSettleInterface = (params: VipBetSettleRequest) => {
    return activityFetcher.post<VipBetSettleRes>(`/h5/vip/bet_settle`, params);
};

/** 领取 VIP 奖励 */
export const VipRewardClaimInterface = (params: VipRewardClaimRequest) => {
    return activityFetcher.post<VipRewardClaimRes>(`/h5/vip/reward/claim`, params);
};

/** 查询上周 VIP 奖励 */
export const VipRewardsInterface = (params: BaseParam) => {
    return activityFetcher.post<VipRewardsRes>(`/h5/vip/rewards`, params);
};

/** 获取用户 VIP 信息 */
export const GetUserVipInfoInterface = (params: BaseParam) => {
    return activityFetcher.post<GetUserVipResp>(`/h5/vip/userInfo`, params);
};
