import type { FC } from 'react';
import {
    CasinoBaccarat,
    CasinoBlackjack,
    CasinoGameShows,
    CasinoLiveCasino,
    CasinoMyBets,
    CasinoNewGames,
    CasinoRecent,
    CasinoRoulette,
    CasinoSlots,
    CasinoUgo,
} from '@/components/icons';
import { FavoriteOutlined } from '@/components/icons2/FavoriteOutlined';
import { PromotionOutlined } from '@/components/icons2/PromotionOutlined';
import type { TranslationKey } from '@/i18nV2/types';

export interface CasinoSidebarItem {
    key: string;
    /** i18n key under 'casino' namespace */
    labelKey: TranslationKey<'casino'>;
    icon?: FC<{ className?: string }>;
    /** Group header — items with same group are visually grouped */
    group?: string;
    link: string;
    comingSoon?: boolean;
}

export const CASINO_SIDEBAR_ITEMS: CasinoSidebarItem[] = [
    // Top section (Kept)
    {
        key: 'promotions',
        labelKey: 'sidebar.promotions',
        icon: PromotionOutlined,
        link: '/casino/promotions',
        comingSoon: false,
    },
    {
        key: 'favorite',
        labelKey: 'sidebar.favorite',
        icon: FavoriteOutlined,
        link: '/casino/favorite',
        comingSoon: true,
    },
    { key: 'recent', labelKey: 'sidebar.recentGames', icon: CasinoRecent, link: '/casino/recent', comingSoon: true },
    { key: 'my-bets', labelKey: 'sidebar.myBets', icon: CasinoMyBets, link: '/casino/my-bets', comingSoon: true },

    // Games section (All items now Coming Soon as per green box)
    {
        key: 'only-on-goto',
        labelKey: 'sidebar.onlyOnGoto',
        icon: CasinoUgo,
        group: 'Games',
        link: '#',
        comingSoon: true,
    },
    {
        key: 'new-releases',
        labelKey: 'sidebar.newReleases',
        icon: CasinoNewGames,
        group: 'Games',
        link: '#',
        comingSoon: true,
    },
    {
        key: 'slots',
        labelKey: 'sidebar.slots',
        icon: CasinoSlots,
        group: 'Games',
        link: '#',
        comingSoon: true,
    },
    {
        key: 'live-casino',
        labelKey: 'sidebar.liveCasino',
        icon: CasinoLiveCasino,
        group: 'Games',
        link: '#',
        comingSoon: true,
    },
    {
        key: 'game-shows',
        labelKey: 'sidebar.gameShows',
        icon: CasinoGameShows,
        group: 'Games',
        link: '#',
        comingSoon: true,
    },
    {
        key: 'blackjack',
        labelKey: 'sidebar.blackjack',
        icon: CasinoBlackjack,
        group: 'Games',
        link: '#',
        comingSoon: true,
    },
    {
        key: 'baccarat',
        labelKey: 'sidebar.baccarat',
        icon: CasinoBaccarat,
        group: 'Games',
        link: '#',
        comingSoon: true,
    },
    {
        key: 'roulette',
        labelKey: 'sidebar.roulette',
        icon: CasinoRoulette,
        group: 'Games',
        link: '#',
        comingSoon: true,
    },

    // Bottom section (Commented out as per previous red box instruction)
    /*
    {
        key: 'publishers',
        labelKey: 'sidebar.publishers',
        icon: CasinoPublishers,
        link: '/casino/publishers',
        comingSoon: true,
    },
    {
        key: 'vip-club',
        labelKey: 'sidebar.vipClub',
        icon: CasinoVipClub,
        link: '/casino/vip-club',
        comingSoon: true,
    },
    */
];
