'use client';

import { type FC, useEffect, useMemo, useState } from 'react';
import { BetType } from '@/api/models/cart';
import { Arrow } from '@/components/Arrow';
import { DoubleArrowUpThinOutlined } from '@/components/icons2/DoubleArrowUpThinOutlined';
import { useSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { DRAWER_WIDTH } from '@/modules/bet-slip/_constants/constants';
import { getParlayOddsEligibleSelections, safeMultiply } from '@/modules/bet-slip/_utils';
import { getBetSlipSkin } from '@/modules/bet-slip/_utils/slip-skin';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { formatOddsByFormat } from '@/utils/odds-format';
import { useParlayConflicts, useParlayNonCompliantSelectionIds } from '../cart/_hooks/use-parlay-selection-map';
import { BetSlipDrawer } from '../slip/bet-slip-drawer';
import { useAllSelections, useSelectionCount } from '../stores/bet-slip-store';

const BETBUS_FLOATING_TEXT = {
    parlay: 'Parlay',
    selections: 'Selecciones',
    showSelections: 'Mostrar Selecciones',
    hideSelections: 'Ocultar Selecciones',
    odds: 'Cuota',
} as const;

const DesktopBetSlipCompactBar: FC<{
    selectionCount: number;
    expanded: boolean;
    onToggle: () => void;
}> = ({ selectionCount, expanded, onToggle }) => {
    const selections = useAllSelections();
    const oddsFormat = useOddsFormat();
    const conflictedSelectionIds = useParlayConflicts();
    const nonCompliantSelectionIds = useParlayNonCompliantSelectionIds();
    const eligibleSelections = useMemo(
        () => getParlayOddsEligibleSelections(selections, conflictedSelectionIds, nonCompliantSelectionIds),
        [conflictedSelectionIds, nonCompliantSelectionIds, selections],
    );
    const parlayOdds = useMemo(
        () => eligibleSelections.map((selection) => selection.outcome.odds).reduce(safeMultiply, 1),
        [eligibleSelections],
    );
    const displayOdds = eligibleSelections.length >= 2 ? formatOddsByFormat(parlayOdds, oddsFormat) : '0.00';

    return (
        <button
            type="button"
            onClick={onToggle}
            className={cn(
                'mb-2 flex h-13 w-full cursor-pointer items-center gap-3 rounded-sm border border-[color:var(--slip-panel-border,var(--border-subtle))] px-3 text-left shadow-floating',
                '[background:var(--slip-dock-bg,var(--dock-bar-bg))] transition-colors hover:[background:var(--slip-dock-hover-bg,var(--dock-bar-hover-bg))]',
            )}
            aria-expanded={expanded}
        >
            <span className="flex size-8 shrink-0 items-center justify-center rounded bg-[var(--slip-dock-action-bg,var(--brand-primary-0))] text-[var(--slip-cta-text,var(--on-brand))]">
                <DoubleArrowUpThinOutlined className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block truncate text-body-md font-bold text-filltext-ft-h">
                    {BETBUS_FLOATING_TEXT.parlay} ({selectionCount})
                </span>
                <span className="block truncate text-auxiliary-md text-filltext-ft-f">
                    {BETBUS_FLOATING_TEXT.odds} {displayOdds} / {selectionCount} {BETBUS_FLOATING_TEXT.selections}
                </span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-auxiliary-md font-bold text-[var(--slip-accent,var(--brand-primary-0))]">
                {expanded ? BETBUS_FLOATING_TEXT.hideSelections : BETBUS_FLOATING_TEXT.showSelections}
                <Arrow className="size-3" direction={expanded ? 'down' : 'up'} />
            </span>
        </button>
    );
};

export const DesktopFloatingBetSlip: FC = () => {
    const selectionCount = useSelectionCount();
    const betSlipDrawerOpen = useUIStore((s) => s.betSlipDrawerOpen);
    const openBetSlipDrawer = useUIStore((s) => s.openBetSlipDrawer);
    const betMode = useBetCartStore((state) => state.betMode);
    const [expanded, setExpanded] = useState(true);
    const schemeMeta = useSchemeMeta();
    const slipSkin = getBetSlipSkin(schemeMeta);
    const shouldShowCompactBar = betMode === BetType.Parlay && selectionCount > 1;

    useEffect(() => {
        if (selectionCount > 0) {
            openBetSlipDrawer();
        }
    }, [openBetSlipDrawer, selectionCount]);

    useEffect(() => {
        if (selectionCount <= 1 || betMode !== BetType.Parlay) {
            setExpanded(true);
            return;
        }

        setExpanded(false);
    }, [betMode, selectionCount]);

    if (!betSlipDrawerOpen || selectionCount === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                'fixed right-[calc(51px+16px)] bottom-6 z-40 max-h-[calc(100vh-120px)]',
                'flex flex-col items-end',
            )}
            data-testid="desktop-floating-bet-slip"
            data-energy-ball-target="betslip-panel"
            style={{ ...slipSkin.style, width: DRAWER_WIDTH }}
        >
            {shouldShowCompactBar && (
                <DesktopBetSlipCompactBar
                    selectionCount={selectionCount}
                    expanded={expanded}
                    onToggle={() => setExpanded((current) => !current)}
                />
            )}
            {(!shouldShowCompactBar || expanded) && <BetSlipDrawer className="max-h-[calc(100vh-120px)]" />}
        </div>
    );
};
