'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import type { MarketGroup } from '@/api/models/market';
import type { MarketChip } from '@/api/models/match-game';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { cn } from '@/utils/common';

/** Chip value representing "All" (no specifier filter) */
const ALL_CHIP_VALUE = null;

type ChipSurface = 'default' | 'detail';
type ChipButtonState = 'selected' | 'default';

const CHIP_SURFACE_CLASS: Record<
    ChipSurface,
    {
        group: string;
        button: string;
        state: Record<ChipButtonState, string>;
    }
> = {
    default: {
        group: 'flex items-start gap-4',
        button: 'flex items-center justify-center px-4 py-2 rounded-lg transition-colors',
        state: {
            selected: 'bg-surface-1 text-brand-primary-0',
            default: 'bg-filltext-ft-b cursor-pointer text-filltext-ft-f hover:bg-surface-1 hover:text-filltext-ft-g',
        },
    },
    detail: {
        group: 'flex items-start gap-4 overflow-x-auto hidden-scrollbar',
        button: 'flex h-8 min-w-[70px] items-center justify-center rounded-sm px-4 transition-colors',
        state: {
            selected:
                '[background:var(--odds-selected-bg)] text-(--odds-selected-text) hover:[background:var(--odds-selected-hover-bg)]',
            default: 'bg-surface-1 text-filltext-ft-f hover:bg-filltext-ft-c hover:text-filltext-ft-h',
        },
    },
} as const;

type ChipValue = number | typeof ALL_CHIP_VALUE;

interface ChipItem {
    id: ChipValue;
    label: string;
    marketIds: number[] | null;
}

interface ChipsProps {
    /** Chip definitions scoped to the selected tab */
    chips?: MarketChip[];
    /** Markets already filtered by current tab */
    filteredMarkets: MarketGroup[];
    /** Reset chip selection when tab changes without remounting siblings */
    resetKey?: number | null;
    surface?: ChipSurface;
    /** Render prop: receives (chipButtons, displayedMarkets) */
    children: (chipButtons: ReactNode, displayedMarkets: MarketGroup[]) => ReactNode;
}

/**
 * Self-contained chip (period filter) component.
 *
 * Uses chip config from the selected tab, manages selected chip state,
 * derives visible chip items from the filtered markets, applies the
 * chip filter, and provides both its UI and the resulting
 * displayed markets to the parent via render prop.
 *
 * Resets chip selection when the active tab changes.
 */
export const Chips: FC<ChipsProps> = ({ chips, filteredMarkets, resetKey, surface = 'default', children }) => {
    const t = useTranslations('matches');
    const componentProfile = useThemeComponentProfile();
    const [selectedChipValue, setSelectedChipValue] = useState<ChipValue>(ALL_CHIP_VALUE);
    const surfaceClasses = CHIP_SURFACE_CLASS[surface];
    const isDetailPill = surface === 'detail' && componentProfile.marketCard.headerTreatment === 'pill';

    useEffect(() => {
        if (resetKey === undefined) return;
        setSelectedChipValue(ALL_CHIP_VALUE);
    }, [resetKey]);

    // ─── Chip items: use the selected tab chip config and hide empty chips ───
    const chipItems = useMemo<ChipItem[]>(() => {
        if (!chips?.length || filteredMarkets.length === 0) return [];

        const visibleMarketIds = new Set(filteredMarkets.map((market) => market.id));
        const visibleChips = chips.filter((chip) => chip.market_id.some((marketId) => visibleMarketIds.has(marketId)));

        if (visibleChips.length === 0) return [];

        return [
            { id: ALL_CHIP_VALUE, label: t('all'), marketIds: null },
            ...visibleChips.map((chip) => ({
                id: chip.id,
                label: chip.chip_name,
                marketIds: chip.market_id,
            })),
        ];
    }, [chips, filteredMarkets, t]);

    // ─── Displayed markets: apply chip filter on top of tab filter ───
    const displayedMarkets = useMemo(() => {
        const selectedChip = chipItems.find((chip) => chip.id === selectedChipValue);

        if (!selectedChip || selectedChip.marketIds === null) return filteredMarkets;

        return filteredMarkets.filter((market) => selectedChip.marketIds?.includes(market.id));
    }, [chipItems, filteredMarkets, selectedChipValue]);

    // ─── Chip buttons UI ───
    const chipButtons =
        chipItems.length > 0 ? (
            <div className={surfaceClasses.group}>
                {chipItems.map((chip) => {
                    const buttonState: ChipButtonState = selectedChipValue === chip.id ? 'selected' : 'default';

                    return (
                        <button
                            key={chip.id ?? chip.label}
                            type="button"
                            onClick={() => setSelectedChipValue(chip.id)}
                            className={cn(
                                surfaceClasses.button,
                                isDetailPill &&
                                    'min-w-0 rounded-[var(--component-detail-tab-radius,999px)] border border-[color:var(--brand-match-card-border,var(--border-subtle))]',
                                isDetailPill
                                    ? buttonState === 'selected'
                                        ? 'bg-[var(--component-detail-tab-active-bg,var(--odds-selected-bg))] text-[var(--component-detail-tab-active-text,var(--odds-selected-text))] hover:bg-[var(--brand-odds-selected-hover-bg,var(--odds-selected-hover-bg))]'
                                        : 'bg-[var(--brand-odds-bg,var(--surface-1))] text-[var(--brand-match-muted,var(--filltext-ft-f))] hover:bg-[var(--brand-odds-hover-bg,var(--surface-2))] hover:text-[var(--brand-match-team-text,var(--filltext-ft-h))]'
                                    : surfaceClasses.state[buttonState],
                            )}
                        >
                            <span className="text-auxiliary-md leading-3.5 text-center whitespace-nowrap">
                                {chip.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        ) : null;

    return <>{children(chipButtons, displayedMarkets)}</>;
};
