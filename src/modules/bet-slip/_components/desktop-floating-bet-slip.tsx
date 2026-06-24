'use client';

import { type CSSProperties, type FC, useEffect, useMemo, useState } from 'react';
import { BetType } from '@/api/models/cart';
import { Arrow } from '@/components/Arrow';
import { DoubleArrowUpThinOutlined } from '@/components/icons2/DoubleArrowUpThinOutlined';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
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
                <span className="block truncate text-body-md font-bold text-[var(--slip-dock-value-text,var(--neutral-white-h))]">
                    {BETBUS_FLOATING_TEXT.parlay} ({selectionCount})
                </span>
                <span className="block truncate text-auxiliary-md text-neutral-white-h/90">
                    {BETBUS_FLOATING_TEXT.odds} {displayOdds} / {selectionCount} {BETBUS_FLOATING_TEXT.selections}
                </span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-auxiliary-md font-bold text-[var(--slip-dock-value-text,var(--neutral-white-h))]">
                {expanded ? BETBUS_FLOATING_TEXT.hideSelections : BETBUS_FLOATING_TEXT.showSelections}
                <Arrow className="size-3" direction={expanded ? 'down' : 'up'} />
            </span>
        </button>
    );
};

const BetanoDesktopIdleRail: FC<{
    style: CSSProperties;
}> = ({ style }) => {
    return (
        <aside
            className="fixed right-0 bottom-0 z-30 hidden flex-col border-[color:var(--brand-match-card-border,var(--border-subtle))] border-l bg-[var(--brand-right-rail-bg,var(--surface-muted))] px-3 py-4 md:flex"
            style={{
                ...style,
                top: 'calc(var(--desktop-nav-height) + var(--header-strip-height))',
                width: 'var(--component-betano-right-rail-width,320px)',
            }}
            data-bet-slip-profile="betano-my-bets-panel"
            data-bet-slip-desktop="idle-rail"
        >
            <section className="rounded-[12px] border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--brand-match-card-bg,var(--surface-1))]">
                <div className="flex h-12 items-center justify-between border-[color:var(--brand-match-card-border,var(--border-subtle))] border-b px-3">
                    <span className="text-body-md font-bold text-[var(--brand-match-team-text,var(--filltext-ft-h))]">
                        MINHAS APOSTAS
                    </span>
                    <span className="rounded-full bg-[var(--brand-odds-bg,var(--surface-selected))] px-2 py-0.5 text-auxiliary-xs font-bold text-[var(--brand-match-muted,var(--filltext-ft-g))]">
                        0
                    </span>
                </div>
                <div className="flex h-10 items-center gap-2 border-[color:var(--brand-match-card-border,var(--border-subtle))] border-b px-2">
                    <span className="flex h-7 flex-1 items-center justify-center rounded-full bg-[var(--component-detail-tab-active-bg,#2a3046)] px-3 text-auxiliary-sm font-bold text-white">
                        Em aberto
                    </span>
                    <span className="flex h-7 flex-1 items-center justify-center rounded-full bg-[var(--brand-odds-bg,var(--surface-selected))] px-3 text-auxiliary-sm font-bold text-[var(--brand-match-muted,var(--filltext-ft-g))]">
                        Resolvidas
                    </span>
                </div>
                <div className="flex min-h-[132px] flex-col items-center justify-center gap-2 px-5 text-center">
                    <span className="text-body-sm font-bold text-[var(--brand-match-team-text,var(--filltext-ft-h))]">
                        Nao tem apostas em aberto
                    </span>
                    <span className="text-auxiliary-sm leading-5 text-[var(--brand-match-muted,var(--filltext-ft-g))]">
                        As selecoes adicionadas aparecem aqui assim que voce montar seu cupom.
                    </span>
                </div>
            </section>

            <section className="mt-3 rounded-[12px] border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--brand-match-card-bg,var(--surface-1))] p-3">
                <div className="text-body-md font-bold text-[var(--brand-match-team-text,var(--filltext-ft-h))]">
                    BetanIA
                </div>
                <div className="mt-1 text-auxiliary-sm leading-5 text-[var(--brand-match-muted,var(--filltext-ft-g))]">
                    Area reservada para recomendacoes e ofertas do painel direito Betano.
                </div>
            </section>
        </aside>
    );
};

const SuperbetDesktopEmptyRail: FC<{
    style: CSSProperties;
}> = ({ style }) => {
    return (
        <aside
            className="fixed z-30 hidden flex-col md:flex"
            style={{
                ...style,
                top: 'var(--component-slip-desktop-top,calc(var(--desktop-nav-height) + var(--header-strip-height) + 24px))',
                right: 'var(--component-slip-desktop-right,16px)',
                bottom: 'var(--component-slip-desktop-bottom,24px)',
                width: 'var(--component-slip-desktop-width,320px)',
            }}
            data-bet-slip-profile="superbet-empty-panel"
            data-bet-slip-desktop="empty-rail"
        >
            <section className="flex h-[var(--component-slip-empty-height,194px)] w-full flex-col overflow-hidden rounded-[var(--component-slip-desktop-radius,10px)] border border-[color:var(--slip-panel-border,var(--border-subtle))] bg-[var(--slip-panel-bg,var(--surface-1))] shadow-floating">
                <div className="flex h-12 items-center border-[color:var(--slip-panel-border,var(--border-subtle))] border-b bg-[var(--slip-header-bg,var(--surface-shell))] px-4">
                    <span className="text-body-md font-bold text-[var(--brand-match-team-text,var(--filltext-ft-h))]">
                        Cupom de apostas
                    </span>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
                    <span className="text-body-sm font-bold text-[var(--brand-match-team-text,var(--filltext-ft-h))]">
                        O cupom de apostas esta vazio.
                    </span>
                    <span className="text-auxiliary-sm leading-5 text-[var(--brand-match-muted,var(--filltext-ft-g))]">
                        As selecoes adicionadas aparecem aqui.
                    </span>
                </div>
            </section>
        </aside>
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
    const componentProfile = useThemeComponentProfile();
    const shouldShowCompactBar = betMode === BetType.Parlay && selectionCount > 1;
    const isBetanoDesktopDrawer = componentProfile.betSlip.desktopPlacement === 'bottom-right-drawer';
    const isRightRailPanel = componentProfile.betSlip.desktopPlacement === 'right-rail-panel';
    const desktopDrawerWidth =
        isBetanoDesktopDrawer || isRightRailPanel ? 'var(--component-slip-desktop-width,320px)' : DRAWER_WIDTH;
    const floatingStyle: CSSProperties = {
        ...slipSkin.style,
        ...componentProfile.style,
        width: desktopDrawerWidth,
        ...(isRightRailPanel
            ? {
                  top: 'var(--component-slip-desktop-top,calc(var(--desktop-nav-height) + var(--header-strip-height) + 24px))',
                  right: 'var(--component-slip-desktop-right,16px)',
                  bottom: 'var(--component-slip-desktop-bottom,24px)',
              }
            : {}),
    };

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

    if (selectionCount === 0 && componentProfile.betSlip.desktopIdle === 'my-bets-rail') {
        return <BetanoDesktopIdleRail style={{ ...slipSkin.style, ...componentProfile.style }} />;
    }

    if (selectionCount === 0 && componentProfile.betSlip.desktopIdle === 'empty-panel') {
        return <SuperbetDesktopEmptyRail style={{ ...slipSkin.style, ...componentProfile.style }} />;
    }

    if (!betSlipDrawerOpen || selectionCount === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                'fixed z-40 max-h-[calc(100vh-120px)]',
                isBetanoDesktopDrawer
                    ? 'bottom-[var(--component-slip-desktop-bottom,0px)] right-[var(--component-slip-desktop-right,16px)]'
                    : isRightRailPanel
                      ? ''
                      : 'right-[calc(51px+16px)] bottom-6',
                'flex flex-col items-end',
            )}
            data-testid="desktop-floating-bet-slip"
            data-bet-slip-profile={componentProfile.betSlip.profile}
            data-bet-slip-desktop={componentProfile.betSlip.desktop}
            data-energy-ball-target="betslip-panel"
            style={floatingStyle}
        >
            {shouldShowCompactBar && (
                <DesktopBetSlipCompactBar
                    selectionCount={selectionCount}
                    expanded={expanded}
                    onToggle={() => setExpanded((current) => !current)}
                />
            )}
            {(!shouldShowCompactBar || expanded) && (
                <BetSlipDrawer className={isRightRailPanel ? 'h-full' : 'max-h-[calc(100vh-120px)]'} />
            )}
        </div>
    );
};
