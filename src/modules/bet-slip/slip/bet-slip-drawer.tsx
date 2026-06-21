'use client';

import { type FC, useState } from 'react';
import { CartStatus } from '@/api/models/cart';
import { useSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { useIsDesktop } from '@/hooks/use-media-query';
import { DRAWER_SHELL_WIDTH, DRAWER_WIDTH } from '@/modules/bet-slip/_constants/constants';
import { getBetSlipSkin } from '@/modules/bet-slip/_utils/slip-skin';
import { cn } from '@/utils/common';
import { Cart } from '../cart/cart';
import { useCartStatus, useSelectionCount } from '../stores/bet-slip-store';
import { Open } from '../ticket/open';
import { Settlement } from '../ticket/settlement';
import { BetSlipDrawerContext } from './context';
import { SlipTabs, type SlipTabType } from './slip-tabs';

export interface BetSlipDrawerProps {
    /** Custom class name */
    className?: string;
}

/**
 * Bet slip drawer component.
 *
 * Integrates SlipTabs, StakeCard list, and SlipFooter.
 * Layout: top tabs + middle selections list + bottom toolbar.
 *
 * Features:
 * - Reads data directly from betSlipStore
 * - Uses safe arithmetic to avoid floating-point precision issues
 * - Supports login state validation
 * - Supports odds change / locked state display
 */
export const BetSlipDrawer: FC<BetSlipDrawerProps> = ({ className }) => {
    // Bet slip selection count
    const selectionCount = useSelectionCount();
    const cartStatus = useCartStatus();
    const isLocked = cartStatus === CartStatus.Locked;

    // Tab and mode state
    const [activeTab, setActiveTab] = useState<SlipTabType>('slip');

    // Drawer hover state
    const [isHovered, setIsHovered] = useState(false);

    const isDesktop = useIsDesktop();
    const schemeMeta = useSchemeMeta();
    const slipSkin = getBetSlipSkin(schemeMeta);

    const handleTabChange = (nextTab: SlipTabType) => {
        setActiveTab(nextTab);
    };

    return (
        // TODO 这个组件下的布局是💩⛰️，能跑就先别改！！！！！！！！
        <BetSlipDrawerContext.Provider value={{ isHovered }}>
            <div
                className={cn(
                    'flex flex-col items-center transition-all duration-200',
                    !isDesktop && 'gap-0 bg-transparent',
                    isLocked && 'pointer-events-none',
                    className,
                )}
                data-testid="bet-slip-drawer"
                data-bet-slip-brand={slipSkin.brand}
                style={{
                    ...slipSkin.style,
                    width: isDesktop ? DRAWER_WIDTH : undefined,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Top tab area */}
                <div
                    className={cn(
                        'shrink-0 overflow-hidden',
                        isDesktop &&
                            activeTab === 'slip' &&
                            'relative before:absolute before:inset-x-0 before:bottom-0 before:h-1/2 before:bg-page-bg before:content-[""]',
                        !isDesktop && 'w-full bg-[var(--slip-footer-bg,var(--mobile-sheet-bg))]',
                        isLocked && 'opacity-50',
                    )}
                    style={{ width: isDesktop ? DRAWER_SHELL_WIDTH : undefined }}
                >
                    <div
                        className={cn(
                            'relative overflow-hidden border-b border-[color:var(--slip-panel-border,var(--border-subtle))] bg-[var(--slip-header-bg,var(--surface-shell))] shadow-none',
                            isDesktop &&
                                'rounded-sm border border-[color:var(--slip-panel-border,var(--border-subtle))]',
                        )}
                    >
                        <SlipTabs
                            value={activeTab}
                            onChange={handleTabChange}
                            selectionCount={selectionCount}
                            className="h-12"
                        />
                    </div>
                </div>

                {isDesktop ? (
                    <div
                        className={cn(
                            'relative flex min-h-0 flex-col items-center',
                            activeTab === 'slip' ? 'flex-none' : 'flex-1',
                        )}
                        style={{ width: DRAWER_SHELL_WIDTH }}
                    >
                        {/* Middle selections list */}
                        {/* Slip Tab — StakeCard list */}
                        {activeTab === 'slip' && (
                            <div className="relative flex min-h-0 w-full flex-none flex-col rounded-b-sm bg-[var(--slip-shell-bg,var(--page-bg))]">
                                <Cart />
                            </div>
                        )}

                        {/* Open Tab — Pending tickets */}
                        {activeTab === 'open' && <Open />}

                        {/* Settled Tab — Won/Lost/Void tickets */}
                        {activeTab === 'settled' && <Settlement />}
                    </div>
                ) : (
                    <div className="relative flex min-h-0 w-full flex-1 bg-[var(--slip-shell-bg,var(--mobile-sheet-inner-bg))]">
                        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 overflow-hidden bg-[var(--slip-shell-bg,var(--mobile-sheet-inner-bg))]" />
                        <div className="relative flex min-h-0 flex-1 flex-col">
                            {activeTab === 'slip' && <Cart />}
                            {activeTab === 'open' && <Open />}
                            {activeTab === 'settled' && <Settlement />}
                        </div>
                    </div>
                )}
            </div>
        </BetSlipDrawerContext.Provider>
    );
};
