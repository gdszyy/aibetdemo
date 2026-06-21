import { SportHome, SportHomeActive } from '@/components/icons';
import { CasinoCrashFilled } from '@/components/icons2/CasinoCrashFilled';
import { CasinoGameShowsFilled } from '@/components/icons2/CasinoGameShowsFilled';
import { CasinoHotFilled } from '@/components/icons2/CasinoHotFilled';
import { CasinoLiveCasinoFilled } from '@/components/icons2/CasinoLiveCasinoFilled';
import { CasinoNewGamesFilled } from '@/components/icons2/CasinoNewGamesFilled';
import { CasinoPublishersFilled } from '@/components/icons2/CasinoPublishersFilled';
import { CasinoSlotsFilled } from '@/components/icons2/CasinoSlotsFilled';
import { CasinoUgoFilled } from '@/components/icons2/CasinoUgoFilled';
import { GameFilled } from '@/components/icons2/GameFilled';

/** tag图标映射 */
const TAG_CODE_TO_ICON_V2: Partial<
    Record<
        /** tag code */
        string,
        typeof GameFilled
    >
> = {
    HOT: CasinoHotFilled,
    NEW: CasinoNewGamesFilled,
    SLOT: CasinoSlotsFilled,
    CASUAL: CasinoCrashFilled,
    LIVE_CASINO: CasinoLiveCasinoFilled,
    GAME_SHOW: CasinoGameShowsFilled,
    GAME_SHOWS: CasinoGameShowsFilled,
    EXCLUSIVE: CasinoUgoFilled,
    PUBLISHER: CasinoPublishersFilled,
};

/** 获取游戏tag的图标V2 */
export function getTagIconV2(tagCode: string): typeof GameFilled {
    return TAG_CODE_TO_ICON_V2[tagCode] ?? GameFilled;
}

/** Static lobby pill config */
export const LOBBY_FILTER = {
    key: 'lobby',
    labelKey: 'filter.lobby',
    icon: SportHome,
    activeIcon: SportHomeActive,
} as const;

export type BadgeVariant = 'dark' | 'red';

/** Badge config for special tag sections (Strategy Pattern) */
const TAG_BADGE_CONFIG: Record<string, { text: string; variant: BadgeVariant }> = {
    HOT: { text: 'HOT', variant: 'dark' },
    NEW: { text: 'NEW', variant: 'red' },
};

/** Get badge config for a tag_code, returns undefined if no badge */
export function getTagBadge(tagCode: string): { text: string; variant: BadgeVariant } | undefined {
    return TAG_BADGE_CONFIG[tagCode];
}

/** Tag codes that should render with larger featured cards in lobby view */
const TAG_FEATURED_CODES = new Set(['HOT', 'NEW']);

/** Whether a tag section should use featured (larger) card sizing */
export function isTagFeatured(tagCode: string): boolean {
    return TAG_FEATURED_CODES.has(tagCode);
}
