import { gameFetcher } from '@/api/client';
import type {
    CasinoGame,
    CasinoGameLobby,
    CasinoGameMerchant,
    CasinoGameTag,
    CasinoGameType,
} from '@/api/models/casino';

/**
 * Get casino lobbies.
 */
export const GetCasinoGameLobbiesV2Interface = async (): Promise<CasinoGameLobby[]> => {
    return gameFetcher.get<CasinoGameLobby[]>('/v2/oc/game/lobby');
};

/**
 * Get tags for a lobby.
 */
export const GetCasinoGameTagsInterface = async (lobbyId: number): Promise<CasinoGameTag[]> => {
    return gameFetcher.get<CasinoGameTag[]>('/v1/oc/game/tag', { lobby_id: lobbyId });
};

/**
 * Get casino game merchants/providers.
 */
export const GetCasinoGameMerchantsInterface = async (): Promise<CasinoGameMerchant[]> => {
    return gameFetcher.get<CasinoGameMerchant[]>('/v1/oc/game/merchant');
};

/**
 * Get casino game types.
 */
export const GetCasinoGameTypesInterface = async (): Promise<CasinoGameType[]> => {
    return gameFetcher.get<CasinoGameType[]>('/v1/oc/game/type');
};

/**
 * Get games filtered by tag ID.
 */
export const GetCasinoGamesV2Interface = async (tagIds: (number | string)[]) => {
    return gameFetcher.get<
        {
            tag_id: number;
            game_list: CasinoGame[];
        }[]
    >('/v2/oc/game/list', { tag_ids: tagIds.join(',') });
};

/** 游戏详情 */
export const GetCasinoGameInterface = async (id: CasinoGame['id']) => {
    return gameFetcher.get<CasinoGame>(`/v1/oc/game/detail`, { id });
};

/** 启动游戏V2 */
export const LaunchGameV2Interface = async (
    params: Pick<CasinoGame, 'id'> & {
        return_url?: string;
    },
) => {
    return gameFetcher.post<{
        /** 游戏资源类型 */
        game_type:
            | ''
            /** 网址 */
            | 'url'
            /** html代码 */
            | 'html';
        /** Full game URL with session token */
        game_url?: string;
        /** html代码 */
        game_html?: string;
    }>('/v2/games/launch', params);
};

/** 检查游戏是否可以启动 */
export const CheckGameLaunchInterface = async (params: Pick<CasinoGame, 'id'>) => {
    return gameFetcher.get<{
        canLaunch: boolean;
    }>('/v1/oc/game/check', params);
};
