import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GetMenuSportsInterface, GetTopSportsInterface } from '@/api/handlers/menu';
import type { MenuSport } from '@/api/models/menu';
import { CacheKey } from '@/constants/cache';

interface SportsState {
    allSports: MenuSport[];
    topSports: MenuSport[];
    /** 客户端按需拉取一次（已发起过则跳过）；不会被持久化。 */
    ensureLoaded: () => void;
}

/**
 * 跨消费方去重标记（模块级，不进 persist）。
 * 整页加载时模块重新求值会复位为 false，因此每次冷启动仍会刷新一次数据；
 * 软导航期间保持 true，避免多个消费方重复发请求。
 */
let sportsFetchStarted = false;

/**
 * sports
 * top sports, all sports, hot sports 的数据，都应该放在这里。
 *
 * 拉取从「模块加载即发」改为「按需 + 去重」：原先在 store 初始化里直接 dispatchData()，
 * 会在模块被导入时触发，且 SSR 期间也会在服务端白跑一次（结果用不到）。
 * 现改为由 useAllSports / useTopSports 在客户端 useEffect 里调用 ensureLoaded，
 * 靠 sportsFetchStarted 去重，只在真正用到时于客户端拉一次。
 * 对外 API（useAllSports / useTopSports）保持不变，消费方无需改动。
 */
export const useSports = create<SportsState>()(
    persist(
        (set) => ({
            allSports: [],
            topSports: [],
            ensureLoaded: () => {
                if (sportsFetchStarted) {
                    return;
                }
                sportsFetchStarted = true;

                Promise.all([GetMenuSportsInterface(), GetTopSportsInterface()])
                    .then(([allSports, topSports]) => {
                        set({ allSports, topSports });
                    })
                    .catch(() => {
                        // 拉取失败时复位，允许下次重试
                        sportsFetchStarted = false;
                    });
            },
        }),
        {
            name: CacheKey.UseSports,
        },
    ),
);

/** all sports */
export const useAllSports = () => {
    const ensureLoaded = useSports((s) => s.ensureLoaded);

    useEffect(() => {
        ensureLoaded();
    }, [ensureLoaded]);

    return useSports((s) => s.allSports);
};

/** top sports */
export const useTopSports = () => {
    const ensureLoaded = useSports((s) => s.ensureLoaded);

    useEffect(() => {
        ensureLoaded();
    }, [ensureLoaded]);

    return useSports((s) => s.topSports);
};
