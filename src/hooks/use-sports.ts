import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GetMenuSportsInterface, GetTopSportsInterface } from '@/api/handlers/menu';
import type { MenuSport } from '@/api/models/menu';
import { CacheKey } from '@/constants/cache';

/**
 * sports
 * top sports, all sports, hot sports 的数据，都应该放在这里
 */
export const useSports = create<{ allSports: MenuSport[]; topSports: MenuSport[] }>()(
    persist(
        (set) => {
            const dispatchData = async () => {
                const [allSports, topSports] = await Promise.all([GetMenuSportsInterface(), GetTopSportsInterface()]);
                set({ allSports, topSports });
            };

            dispatchData();

            return {
                allSports: [],
                topSports: [],
            };
        },
        {
            name: CacheKey.UseSports,
        },
    ),
);

/** all sports */
export const useAllSports = () => {
    return useSports((s) => s.allSports);
};

/** top sports */
export const useTopSports = () => {
    return useSports((s) => s.topSports);
};
