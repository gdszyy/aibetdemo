import { useQuery } from '@tanstack/react-query';
import {
    GetCasinoGameLobbiesV2Interface,
    GetCasinoGamesV2Interface,
    GetCasinoGameTagsInterface,
} from '@/api/handlers/casino';
import type { CasinoGame, CasinoGameLobby, CasinoGameTag } from '@/api/models/casino';

export interface HotCasinoGamesResult {
    lobby: CasinoGameLobby;
    tag: CasinoGameTag;
    games: CasinoGame[];
}

/**
 * 拉取热门 casino 游戏：取第一个 lobby 的第一个 tag 下的游戏列表（带真实封面 logo_url）。
 * 供首页推荐模块与 casino 热门模块共用，避免重复 fetch 逻辑。
 */
export const useHotCasinoGames = () => {
    return useQuery({
        queryKey: ['casino', 'hotGames'],
        queryFn: async (): Promise<HotCasinoGamesResult | null> => {
            const lobbies = await GetCasinoGameLobbiesV2Interface();
            const lobby = lobbies?.[0];
            if (!lobby) {
                return null;
            }

            const tags = await GetCasinoGameTagsInterface(lobby.id);
            const tag = tags?.[0];
            if (!tag) {
                return null;
            }

            const lists = await GetCasinoGamesV2Interface([tag.id]);
            const games = lists.find((v) => v.tag_id === Number(tag.id))?.game_list || [];

            return { lobby, tag, games };
        },
        staleTime: 60 * 60 * 1000,
    });
};
