'use client';

import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'ahooks';
import { keyBy, uniqBy } from 'lodash-es';
import { useSearchParams } from 'next/navigation';
import {
    type ContextType,
    createContext,
    type Dispatch,
    type FunctionComponent,
    type PropsWithChildren,
    type SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    GetCasinoGameLobbiesV2Interface,
    type GetCasinoGameMerchantsInterface,
    GetCasinoGamesV2Interface,
    GetCasinoGameTagsInterface,
} from '@/api/handlers/casino';
import type { InterfaceResponse } from '@/api/lib/types';
import type { CasinoGame } from '@/api/models/casino';
import { CasinoActions, generateQueryKey, ModuleKeys } from '@/constants/query-keys';

type Merchant = InterfaceResponse<typeof GetCasinoGameMerchantsInterface>[0];
type Lobby = InterfaceResponse<typeof GetCasinoGameLobbiesV2Interface>[0];
type Tag = InterfaceResponse<typeof GetCasinoGameTagsInterface>[0];
type Game = CasinoGame & {
    tag_id: number;
};

type ListMode = Partial<Record<'lobby' | 'tag' | 'merchant' | 'keyword', boolean>>;
type GamesByTagId = Record<
    /** tag id */
    number,
    {
        tag: Tag;
        games: Game[];
    }
>;

const PageStoreContext = createContext(
    {} as {
        /** 列表渲染模式 */
        listMode: ListMode;
        lobby: Lobby | null;
        tags: Tag[];
        /** 选中的tag */
        activeTag: Tag | null;
        /** 筛选后的游戏列表 */
        filterGames: {
            key: string;
            title: string;
            tag?: Tag;
            games: Game[];
        }[];
        /** 页面数据是否仍在加载中 */
        isPageLoading: boolean;
        /** 搜索的merchant */
        selectedMerchant: Merchant | null;
        setSelectedMerchant: Dispatch<SetStateAction<Merchant | null>>;
        /** 搜索的关键词 */
        searchKeyword: string;
        setSearchKeyword: Dispatch<SetStateAction<string>>;
    },
);

export function usePageStore() {
    return useContext(PageStoreContext);
}

export type PageStoreType = ContextType<typeof PageStoreContext>;

/** 页面公用状态 */
export const PageStore: FunctionComponent<PropsWithChildren<{ lobbyId: string }>> = ({
    children,
    lobbyId: originLobbyId,
}) => {
    const searchParams = useSearchParams();
    const lobbyId = Number(originLobbyId);
    const activeTagId = searchParams.get('tag_id');

    const [listMode, setListMode] = useState<ListMode>({});

    /** lobby list */
    const { data: lobbies = [], isPending: isLobbiesLoading } = useQuery({
        queryKey: generateQueryKey(ModuleKeys.CASINO, CasinoActions.LOBBIES),
        queryFn: GetCasinoGameLobbiesV2Interface,
        placeholderData: [],
    });
    /** lobby */
    const lobby = lobbies.find((v) => v.id === lobbyId);
    const currentLobbyId = lobby?.id;

    /** tags */
    const { data: tags = [], isPending: isTagsLoading } = useQuery({
        queryKey: generateQueryKey(ModuleKeys.CASINO, CasinoActions.TAGS, { lobbyId: currentLobbyId }),
        queryFn: () => {
            if (!currentLobbyId) {
                throw new Error('Casino lobby id is required');
            }

            return GetCasinoGameTagsInterface(currentLobbyId);
        },
        enabled: Boolean(currentLobbyId),
        initialData: [],
    });

    /** tag和游戏列表 */
    const { data: gamesByTagId = {}, isPending: isGamesLoading } = useQuery({
        queryKey: generateQueryKey(ModuleKeys.CASINO, CasinoActions.GAMES_BY_TAGS, {
            tagIds: tags.map((v) => v.id),
        }),
        queryFn: () => {
            return GetCasinoGamesV2Interface(tags.map((v) => v.id)).then((res) => {
                const map: GamesByTagId = {};
                const tagsMap = keyBy(tags, 'id');

                res.forEach((v) => {
                    map[v.tag_id] = {
                        tag: tagsMap[v.tag_id],
                        games: v.game_list?.map((v1) => ({ ...v1, tag_id: v.tag_id })) || [],
                    };
                });

                return map;
            });
        },
        enabled: Boolean(tags.length),
        initialData: {},
    });

    const [filterGames, setFilterGames] = useState<PageStoreType['filterGames']>([]);
    const isPageLoading = isLobbiesLoading || isTagsLoading || isGamesLoading;

    /** 选中的tag */
    const [activeTag, setActiveTag] = useState<PageStoreType['activeTag']>(null);
    useEffect(() => {
        if (activeTagId) {
            setActiveTag(tags.find((v) => v.id === Number(activeTagId)) || null);
        } else {
            setActiveTag(null);
        }
    }, [activeTagId, tags]);

    /** 搜索的merchant */
    const [selectedMerchant, setSelectedMerchant] = useState<PageStoreType['selectedMerchant']>(null);

    /** 搜索的关键词 */
    const [searchKeyword, setSearchKeyword] = useState<PageStoreType['searchKeyword']>('');
    const searchKeywordLower = useMemo(() => searchKeyword.toLowerCase(), [searchKeyword]);
    const debounceKeyword = useDebounce(searchKeywordLower, { wait: 500 });

    // 更新list mode
    useEffect(() => {
        const newListMode: typeof listMode = {
            lobby: !activeTag,
            tag: Boolean(activeTag),
            merchant: Boolean(selectedMerchant),
            keyword: Boolean(debounceKeyword),
        };
        setListMode((prev) => ({ ...prev, ...newListMode }));
    }, [activeTag, debounceKeyword, selectedMerchant]);

    // 筛选游戏
    useEffect(() => {
        // console.debug('==listMode', listMode);

        let filterDatas: typeof filterGames = [];

        if (listMode.lobby) {
            filterDatas = tags.map((v) => {
                return {
                    key: v.id.toString(),
                    title: v.tag_name,
                    tag: v,
                    games: gamesByTagId[v.id]?.games || [],
                };
            });
        } else if (listMode.tag && activeTag) {
            const v = activeTag;
            filterDatas = [
                {
                    key: v.id.toString(),
                    title: v.tag_name,
                    games: gamesByTagId[v.id]?.games || [],
                },
            ];
        }

        if (listMode.merchant && Boolean(selectedMerchant)) {
            filterDatas = [
                {
                    key: selectedMerchant?.oc_platform || '',
                    title: selectedMerchant?.name || '',
                    games: uniqBy(
                        filterDatas
                            .flatMap((v) => v.games)
                            ?.filter((v) => v.oc_platform === selectedMerchant?.oc_platform) || [],
                        'id',
                    ),
                },
            ];
        }

        if (listMode.keyword) {
            filterDatas = filterDatas.map((v) => {
                return { ...v, games: v.games.filter((v1) => v1.name.toLowerCase().includes(debounceKeyword)) };
            });
        }

        setFilterGames(filterDatas);
    }, [
        listMode.lobby,
        tags,
        gamesByTagId,
        listMode.tag,
        activeTag,
        listMode.merchant,
        selectedMerchant?.name,
        listMode.keyword,
        selectedMerchant?.oc_platform,
        listMode,
        selectedMerchant,
        debounceKeyword,
    ]);

    return (
        <PageStoreContext.Provider
            value={{
                listMode,
                lobby: lobby || null,
                tags: tags || [],
                filterGames,
                isPageLoading,
                activeTag,
                selectedMerchant,
                setSelectedMerchant,
                searchKeyword,
                setSearchKeyword,
            }}
        >
            {children}
        </PageStoreContext.Provider>
    );
};
