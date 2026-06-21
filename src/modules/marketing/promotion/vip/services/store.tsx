'use client';

import { create } from 'zustand';
import {
    GetUserVipInfoInterface,
    GetVipLevelInfoInterface,
    GetVipTierInfoInterface,
    GetVipTierRewardsInterface,
} from '@/api/handlers/vip';
import type { InterfaceResponse } from '@/api/lib/types';
import type { VipLevelInfo, VipTierInfo, VipTierRewards } from '@/api/models/vip';
import type { RegionCode } from '@/i18n';
import { useRegionStore } from '@/stores/region-store';

interface VipBaseInfoStore {
    /** 活动id */
    activityId: number;
    /** 段位信息 */
    tierInfo: VipTierInfo[];
    /** 段位权益信息 */
    tierRewards: VipTierRewards[];
    /** 等级信息 */
    levelInfo: VipLevelInfo[];
    /** 用户VIP信息 */
    userVipInfo: InterfaceResponse<typeof GetUserVipInfoInterface> | null;
    /** 段位权益是否加载中 */
    tierRewardsLoading: boolean;
    /** 段位权益是否初始化 */
    tierRewardsInitialized: boolean;
    /** 段位权益错误信息 */
    tierRewardsError: Error | null;
    /** 等级信息是否加载中 */
    levelInfoLoading: boolean;
    /** 等级信息是否初始化 */
    levelInfoInitialized: boolean;
    /** 等级信息错误 */
    levelInfoError: Error | null;

    /** 获取 VIP 段位和等级信息 */
    fetchVipBaseInfo: () => Promise<void>;
    /** 获取 VIP 等级信息 */
    fetchVipLevelInfo: () => Promise<void>;
    /** 获取 VIP 段位权益信息 */
    fetchVipTierRewards: () => Promise<void>;
    /** 获取用户VIP信息 */
    fetchUserVipInfo: () => Promise<void>;
}

let pendingVipTierRewardsPromise: Promise<void> | null = null;
let pendingVipLevelInfoPromise: Promise<void> | null = null;

/** VIP 活动 ID：按当前区域返回对应活动配置 */
const getVipActivityId = (): number => {
    const regionCode = useRegionStore.getState().regionCode;

    // TODO: 临时通过环境变量配置 VIP 活动 ID，后续改为后台配置或接口下发。
    const vipActivityIdByRegion: Record<RegionCode, number> = {
        BR: Number(process.env.NEXT_PUBLIC_ACTIVITY_VIP_ID_BR),
        MX: Number(process.env.NEXT_PUBLIC_ACTIVITY_VIP_ID_MX),
    };

    return vipActivityIdByRegion[regionCode];
};

/**
 * VIP store
 */
export const useVipBaseInfoStore = create<VipBaseInfoStore>((set, get) => ({
    activityId: getVipActivityId(),
    tierInfo: [],
    tierRewards: [],
    levelInfo: [],
    userVipInfo: null,
    tierRewardsLoading: false,
    tierRewardsInitialized: false,
    tierRewardsError: null,
    levelInfoLoading: false,
    levelInfoInitialized: false,
    levelInfoError: null,
    fetchUserVipInfo: async () => {
        const data = await GetUserVipInfoInterface({ activityId: get().activityId });
        set({ userVipInfo: data });
    },

    fetchVipLevelInfo: async () => {
        if (pendingVipLevelInfoPromise) {
            return pendingVipLevelInfoPromise;
        }

        set({ levelInfoLoading: true, levelInfoError: null });

        pendingVipLevelInfoPromise = (async () => {
            try {
                const levelInfo = await GetVipLevelInfoInterface({ activityId: get().activityId });

                set({
                    levelInfo,
                    levelInfoInitialized: true,
                });
            } catch (error) {
                const nextError = error instanceof Error ? error : new Error('Failed to fetch VIP level info.');
                set({ levelInfoError: nextError });
                throw nextError;
            } finally {
                set({ levelInfoLoading: false });
                pendingVipLevelInfoPromise = null;
            }
        })();

        return pendingVipLevelInfoPromise;
    },
    fetchVipTierRewards: async () => {
        if (pendingVipTierRewardsPromise) {
            return pendingVipTierRewardsPromise;
        }

        set({ tierRewardsLoading: true, tierRewardsError: null });

        pendingVipTierRewardsPromise = (async () => {
            try {
                const tierRewards = await GetVipTierRewardsInterface({ activityId: get().activityId });

                set({
                    tierRewards,
                    tierRewardsInitialized: true,
                });
            } catch (error) {
                const nextError = error instanceof Error ? error : new Error('Failed to fetch VIP tier rewards.');
                set({ tierRewardsError: nextError });
                throw nextError;
            } finally {
                set({ tierRewardsLoading: false });
                pendingVipTierRewardsPromise = null;
            }
        })();

        return pendingVipTierRewardsPromise;
    },
    fetchVipBaseInfo: async () => {
        const [tierInfo] = await Promise.all([
            GetVipTierInfoInterface({ activityId: get().activityId }),
            // GetVipLevelInfoInterface({ activityId: get().activityId }),
        ]);
        set({
            tierInfo,
            // levelInfo,
        });
    },
}));
