import { create } from 'zustand';
import type { MenuCategory, MenuSport, MenuTournament } from '@/api/models/menu';
import { type BaseNode, CategoryNode, RootNode, SportNode, TournamentNode } from './node';

interface TreeStore {
    root: RootNode;
    activedKeyList: Set<string>;
    activeSportId: string | null;
    activeTournamentId: string | null;
    setSportsData: (data: MenuSport[]) => void;
    setCategoryData: (key: string, data: MenuCategory[]) => void;
    setTournamentData: (key: string, data: MenuTournament[]) => void;
    setCategoryAndTournament: (key: string, categoryData: MenuCategory[], tournamentData: MenuTournament[]) => void;
    appendTournamentData: (key: string, data: MenuTournament[]) => void;
    setActivedNodes: (nodes: Set<BaseNode>) => void;
    setActiveSportId: (sportId: string | null) => void;
    setActiveTournamentId: (tournamentId: string | null) => void;
}

// TODO 写的真复杂，需要简化
export const useTreeStore = create<TreeStore>((set) => ({
    root: new RootNode(),
    activedKeyList: new Set<string>(),
    activeSportId: null,
    activeTournamentId: null,
    setActiveSportId: (sportId) => set({ activeSportId: sportId }),
    setActiveTournamentId: (tournamentId) => set({ activeTournamentId: tournamentId }),
    setSportsData: (data) => {
        set((state) => {
            const sportNodes = data.map((item) => {
                const sportNode = new SportNode(item.sport_id);
                sportNode.name = item.name;
                sportNode.id = item.sport_id;
                return sportNode;
            });
            state.root.setChildren([...sportNodes]);
            return { root: state.root.clone() };
        });
    },
    setCategoryData: (key, data) => {
        set((state) => {
            const sportNode = state.root.children.find((node) => node.key === key);
            if (!sportNode) {
                console.warn('[store] setCategoryData: sportNode not found for key', key);
                return state;
            }
            const categoryNodes = data.map((category) => {
                const categoryNode = new CategoryNode(category.category_id, category.sport_id);
                categoryNode.name = category.name;
                categoryNode.id = category.id;
                categoryNode.count = category.match_count;
                return categoryNode;
            });
            sportNode.setChildren(categoryNodes);

            const clonedSportNode = sportNode.clone();
            return { root: clonedSportNode.root() };
        });
    },
    setTournamentData: (key, data) => {
        set((state) => {
            const node = state.root.findNode(key);
            if (!node) {
                console.warn('[store] setTournamentData: node not found for key', key);
                return state;
            }
            const tournamentNodes = data.map((tournament) => {
                const tournamentNode = new TournamentNode(
                    tournament.tournament_id,
                    tournament.category_id,
                    tournament.sport_id,
                );
                tournamentNode.name = tournament.name;
                tournamentNode.id = tournament.id;
                tournamentNode.count = tournament.match_count;
                tournamentNode.is_top = tournament.is_top;
                return tournamentNode;
            });
            node.setChildren(tournamentNodes);
            const clonedNode = node.clone();
            return { root: clonedNode.root() };
        });
    },
    setCategoryAndTournament: (key: string, categoryData, tournamentData) => {
        set((state) => {
            const sportNode = state.root.children.find((node) => node.key === key);
            if (!sportNode) {
                console.warn('[store] setCategoryAndTournament: sportNode not found for key', key);
                return state;
            }

            const tournamentNodes = tournamentData.map((tournament) => {
                const tournamentNode = new TournamentNode(
                    tournament.tournament_id,
                    tournament.category_id,
                    tournament.sport_id,
                );
                tournamentNode.name = tournament.name;
                tournamentNode.id = tournament.id;
                tournamentNode.count = tournament.match_count;
                tournamentNode.is_top = tournament.is_top;
                return tournamentNode;
            });

            const categoryNodes = categoryData.map((category) => {
                const categoryNode = new CategoryNode(category.category_id, category.sport_id);
                categoryNode.name = category.name;
                categoryNode.id = category.id;
                categoryNode.count = category.match_count;
                return categoryNode;
            });
            const children = [...tournamentNodes, ...categoryNodes];
            sportNode.setChildren(children);

            const clonedSportNode = sportNode.clone();
            return { root: clonedSportNode.root() };
        });
    },
    appendTournamentData: (key: string, data) => {
        set((state) => {
            const categoryNode = state.root.findNode(key) as CategoryNode;
            if (!categoryNode) {
                console.warn(`Category node with key ${key} not found`);
                return state;
            }

            if (data.length === 0) {
                return state;
            }

            if (data[data.length - 1].id === categoryNode.lastChild?.id) {
                return state;
            }

            const tournamentNodes = data.map((tournament) => {
                const tournamentNode = new TournamentNode(
                    tournament.tournament_id,
                    tournament.category_id,
                    tournament.sport_id,
                );
                tournamentNode.name = tournament.name;
                tournamentNode.id = tournament.id;
                tournamentNode.count = tournament.match_count;
                tournamentNode.is_top = tournament.is_top;
                return tournamentNode;
            });
            categoryNode.concatChildren(tournamentNodes);

            const clonedNode = categoryNode.clone();
            return { root: clonedNode.root() };
        });
    },
    setActivedNodes: (nodes: Set<BaseNode>) => {
        set({ activedKeyList: new Set(Array.from(nodes).map((n) => n.key)) });
    },
}));

export const useChildActive = (sportNode: SportNode) => {
    return useTreeStore((state) => state.activeSportId === sportNode.sport_id);
};
export const useActive = (node: BaseNode) => {
    return useTreeStore((state) => state.activedKeyList.has(node.key));
};
