import type { StaticImageData } from 'next/image';
import type { FC } from 'react';
import type { CasinoGameLobby } from '@/api/models/casino';
import { Game, NavLive, NavLiveCasino, SportsEvents } from '@/components/icons';
import type { TranslationKey } from '@/i18nV2/types';
import { checkIsCasinoActive, checkIsSportsActive, checkIsSportsLiveActive } from '@/libs/navigation';

export interface NavMenuItem {
    key: string;
    /** i18n key under 'common' namespace (for static items) */
    labelKey?: TranslationKey<'common'>;
    /** Direct label text (for API-driven items, no i18n) */
    label?: string;
    link: string;
    icon?: FC<{ className?: string }>;
    /** Active-state icon variant. If absent, icon uses brand color via CSS */
    activeIcon?: FC<{ className?: string }>;
    isActive?: (path: string, searchParams?: URLSearchParams) => boolean;
    /** only icon menu item  */
    imageUrl?: string | StaticImageData;
}

const checkIsTransmisionActive = (path: string) => path.startsWith('/sports/transmision');
const checkIsMyBetsActive = (path: string) => path.startsWith('/sports/my-bets');
const checkIsSportsHomeActive = (path: string) =>
    checkIsSportsActive(path) && !checkIsTransmisionActive(path) && !checkIsMyBetsActive(path);

/** Fixed menu item — always present */
export const FIXED_NAV_ITEMS: NavMenuItem[] = [
    {
        key: 'sport',
        label: 'Deportes',
        link: '/sports',
        icon: SportsEvents,
        isActive: checkIsSportsHomeActive,
    },
    {
        key: 'sport-live',
        label: 'En Vivo',
        link: '/sports-live',
        icon: NavLive,
        isActive: checkIsSportsLiveActive,
    },
    // ⚠️ MOCK/占位：直播（Transmisión）入口，仅占位页，布局后续再改
    {
        key: 'transmision',
        label: 'Transmisión',
        link: '/sports/transmision',
        icon: NavLive,
        isActive: checkIsTransmisionActive,
    },
    // Mis Apuestas（我的投注）一级入口 → 现有战绩/交易页
    {
        key: 'mybets',
        label: 'Mis Apuestas',
        link: '/sports/my-bets',
        isActive: checkIsMyBetsActive,
    },
];

type IconPair = { icon: FC<{ className?: string }>; activeIcon?: FC<{ className?: string }> };

/** Strategy pattern: lobby_code → icon pair (active variant optional) */
const LOBBY_ICON_MAP: Record<string, IconPair> = {
    LIVE_CASINO: { icon: NavLiveCasino },
};

const DEFAULT_LOBBY_ICON: IconPair = { icon: Game };

/** Resolve icon pair from lobby_code */
// TODO 不需要casino图标了，应该删除掉
function getLobbyIcons(lobbyCode: string): IconPair {
    return LOBBY_ICON_MAP[lobbyCode] ?? DEFAULT_LOBBY_ICON;
}

/** Convert lobby API data to nav menu items (desktop — one per lobby) */
export function lobbiesToNavItems(lobbies: CasinoGameLobby[]): NavMenuItem[] {
    const primaryCasinoLobbyId = (lobbies.find((lobby) => lobby.lobby_code !== 'LIVE') ?? lobbies[0])?.id;

    return lobbies.map((lobby) => {
        const { icon, activeIcon } = getLobbyIcons(lobby.lobby_code);
        return {
            key: `casino-${lobby.id}`,
            label: lobby.lobby_name,
            link: `/casino/${lobby.id}`,
            icon,
            activeIcon,
            isActive: (path: string, searchParams?: URLSearchParams) => {
                if (!checkIsCasinoActive(path)) return false;

                // Game detail page — match by lobby_id search param
                if (path.startsWith('/casino/game/')) {
                    const lobbyId = searchParams?.get('lobby_id');
                    return lobbyId ? lobby.id === Number(lobbyId) : lobby.id === primaryCasinoLobbyId;
                }

                // Shared casino routes (category/promotions/root) — highlight primary lobby
                if (path === '/casino' || path.startsWith('/casino/promotions')) {
                    return lobby.id === primaryCasinoLobbyId;
                }

                return path === `/casino/${lobby.id}`;
            },
        };
    });
}

/** Single Casino nav item (mobile — links to first lobby or /casino fallback) */
// TODO 应该全局维护第一个game lobby list，和第一个lobby
export function getCasinoNavItem(lobbies: CasinoGameLobby[]): NavMenuItem {
    const firstLobby = lobbies[0];
    const { icon, activeIcon } = firstLobby ? getLobbyIcons(firstLobby.lobby_code) : DEFAULT_LOBBY_ICON;
    return {
        key: 'casino',
        labelKey: 'mainMenu.casino',
        link: firstLobby ? `/casino/${firstLobby.id}` : '/casino',
        icon,
        activeIcon,
        isActive: checkIsCasinoActive,
    };
}
