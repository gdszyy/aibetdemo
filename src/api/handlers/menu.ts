import { uofFetcher } from '@/api/client';
import type { MenuCategory, MenuSport, MenuTournament } from '@/api/models/menu';

/** Top Sports 一级菜单 体育类型 */
export const GetTopSportsInterface = () => {
    return uofFetcher.get<MenuSport[]>(`/v1/menu/sports/top`);
};

/** All Sports 一级菜单 体育类型 */
export const GetMenuSportsInterface = () => {
    return uofFetcher.get<MenuSport[]>(`/v1/menu/sports`);
};

/** Sports 二级菜单 地区 */
export const GetMenuCategoriesInterface = (params: { sport_id: string; start_id?: number }) => {
    return uofFetcher.get<MenuCategory[]>(`/v1/menu/category`, params);
};

/** Sports 三级菜单 联赛 */
export const GetMenuTournamentsInterface = (params: { sport_id: string; cate_id: string; start_id?: number }) => {
    return uofFetcher.get<MenuTournament[]>(`/v1/menu/tournament`, params);
};

/** Sports 热门联赛 */
export const GetMenuHotTournamentsInterface = (params: { sport_id: string; cate_id?: string }) => {
    return uofFetcher.get<MenuTournament[]>(`/v1/menu/hot-tournament`, params);
};

/** Sports 所有热门联赛 */
export const GetAllHotTournamentsInterface = (params?: { sport_id?: string }) => {
    return uofFetcher.get<
        {
            sport_id: string;
            sport_code: string;
            sport_name: string;
            category_id: string;
            category_name: string;
            tournament_id: string;
            tournament_name: string;
        }[]
    >(`/v1/tournament/hot`, params);
};
