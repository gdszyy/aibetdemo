'use client';

import { transform } from 'lodash-es';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GetMatchStatusInterface } from '@/api/handlers/app';

/**
 * App Info Store state
 */
interface AppInfoState {
    /** 比赛小状态文案字典，依赖于language,x-source */
    matchStatusDict: Record<
        /** sport id */
        string,
        Record<
            /** 小状态 */
            number,
            /** 文案 */
            string
        >
    > | null;
    /** 更新比赛消状态 */
    dispatchMatchStatusDict: () => Promise<void>;
}

/**
 * App Info Store
 * Stores application information including match status mappings
 */
export const useAppInfoStore = create<AppInfoState>()(
    persist(
        (set) => ({
            matchStatusDict: null,
            // TODO x-source, language 切换后应该重新获取该接口
            dispatchMatchStatusDict: async () => {
                return GetMatchStatusInterface()
                    .then((res) => {
                        set({
                            matchStatusDict: transform(
                                res,
                                (acc, item) => {
                                    item.sport_ids.forEach((sportId) => {
                                        if (!acc[sportId]) {
                                            acc[sportId] = {};
                                        }
                                        acc[sportId][item.id] = item.description;
                                    });
                                },
                                {} as NonNullable<AppInfoState['matchStatusDict']>,
                            ),
                        });
                    })
                    .catch((error) => {
                        console.error('❌ Failed to fetch app info:', error);
                    });
            },
        }),
        {
            // TODO 应该统一维护 cache key name
            name: 'store/app-info',
            // partialize: (s) => {
            //     console.debug('==a', s);
            //     return {
            //         matchStatusDict: s.matchStatusDict,
            //     };
            // },
        },
    ),
);

/**
 * 获取比赛消状态的文案
 */
export const useMatchStatusStr = (sportId: string, matchStatus: number, defaultStr = ''): string => {
    const dict = useAppInfoStore((state) => state.matchStatusDict);

    if (matchStatus === undefined) {
        return defaultStr;
    }

    return dict?.[sportId]?.[matchStatus] || defaultStr;
};
