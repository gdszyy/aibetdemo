import type { FC, SVGProps } from 'react';
import {
    CasinoBonus as CasinoBonusIcon,
    FreeSpin as FreeSpinIcon,
    FreeSport as FreeSportIcon,
    SportBonus as SportBonusIcon,
} from '@/components/icons';
import type { TranslationKey } from '@/i18nV2/types';

// ─── Card configs (Strategy pattern) ────────────────────────────────

export interface BonusCardConfig {
    key: string;
    labelKey: TranslationKey<'transaction'>;
    SmallIcon: FC<SVGProps<SVGSVGElement>>;
    LargeIcon: FC<SVGProps<SVGSVGElement>>;
    isCurrency: boolean;
    /** Hover-only styles */
    hoverTextColor: string;
    hoverBorder: string;
    hoverShadow: string;
    hoverBadgeBg: string;
    hoverIconColor: string;
}

export const BONUS_CARDS: BonusCardConfig[] = [
    {
        key: 'sportBonus',
        labelKey: 'sportBonus',
        SmallIcon: SportBonusIcon,
        LargeIcon: SportBonusIcon,
        isCurrency: true,
        hoverTextColor: 'group-hover:text-auxiliary-blue',
        hoverBorder: 'hover:border-[#dceafe]',
        hoverShadow: 'hover:shadow-[0_4px_4px_0_#eff6ff]',
        hoverBadgeBg: 'group-hover:bg-[#dceafe]',
        hoverIconColor: 'group-hover:text-auxiliary-blue',
    },
    {
        key: 'casinoBonus',
        labelKey: 'casinoBonus',
        SmallIcon: CasinoBonusIcon,
        LargeIcon: CasinoBonusIcon,
        isCurrency: true,
        hoverTextColor: 'group-hover:text-brand-primary-0',
        hoverBorder: 'hover:border-brand-primary-2',
        hoverShadow: 'hover:shadow-[0_4px_4px_0_var(--brand-primary-1)]',
        hoverBadgeBg: 'group-hover:bg-brand-primary-2',
        hoverIconColor: 'group-hover:text-brand-primary-0',
    },
    {
        key: 'freeSport',
        labelKey: 'freeSport',
        SmallIcon: FreeSportIcon,
        LargeIcon: FreeSportIcon,
        isCurrency: false,
        hoverTextColor: 'group-hover:text-func-bonus',
        hoverBorder: 'hover:border-[#fef3c7]',
        hoverShadow: 'hover:shadow-[0_4px_4px_0_#fffbeb]',
        hoverBadgeBg: 'group-hover:bg-[#fef3c7]',
        hoverIconColor: 'group-hover:text-func-bonus',
    },
    {
        key: 'freeSpin',
        labelKey: 'freeSpin',
        SmallIcon: FreeSpinIcon,
        LargeIcon: FreeSpinIcon,
        isCurrency: false,
        hoverTextColor: 'group-hover:text-auxiliary-purple',
        hoverBorder: 'hover:border-[#f3e8ff]',
        hoverShadow: 'hover:shadow-[0_4px_4px_0_#faf5ff]',
        hoverBadgeBg: 'group-hover:bg-[#f3e8ff]',
        hoverIconColor: 'group-hover:text-auxiliary-purple',
    },
];

// ─── Animation config ───────────────────────────────────────────────

export const FLOW_TIMING = { duration: 500, easing: 'ease-out' } as const;
