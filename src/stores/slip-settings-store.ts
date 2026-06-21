'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OddsChangePolicy } from '@/api/models/cart';
import type { OddsFormat } from '@/utils/odds-format';

const DEFAULT_QUICK_BUY_AMOUNTS = [10, 50, 100] as const;

export type SlipSettingsGuideSection = 'quickBuy';

/**
 * Bet Slip Settings Store state
 */
interface SlipSettingsState {
    /** Odds format */
    oddsFormat: OddsFormat;
    /** Odds change policy */
    oddsChangePolicy: OddsChangePolicy;
    /** Quick buy amount list */
    quickBuyAmounts: number[];
    /** Whether quick buy values were customized by the user */
    hasCustomizedQuickBuyAmounts: boolean;
    /** Whether the quick buy guide was dismissed */
    quickBuyGuideDismissed: boolean;
    /** Whether settings panel is open */
    isSettingsOpen: boolean;
    /** Target settings section to focus */
    focusedSettingsSection: SlipSettingsGuideSection | null;
    /** Focus request nonce to re-trigger scrolling/highlight */
    settingsFocusRequestNonce: number;
    /** Set odds format */
    setOddsFormat: (format: OddsFormat) => void;
    /** Set odds change policy */
    setOddsChangePolicy: (policy: OddsChangePolicy) => void;
    /** Set quick buy amounts */
    setQuickBuyAmounts: (amounts: number[]) => void;
    /** Mark a settings section as customized */
    markGuideSectionCustomized: (section: SlipSettingsGuideSection) => void;
    /** Dismiss a guide tooltip */
    dismissGuide: (section: SlipSettingsGuideSection) => void;
    /** Set settings panel open state */
    setSettingsOpen: (isOpen: boolean) => void;
    /** Open settings panel and focus a specific section */
    openSettingsSection: (section: SlipSettingsGuideSection) => void;
}

/**
 * Bet Slip Settings Store
 *
 * Manages user bet slip preferences:
 * - Odds format (Decimal/American/Fractional)
 * - Odds change acceptance policy
 * - Quick buy amounts
 *
 * Persisted to localStorage via persist middleware
 */
export const useSlipSettingsStore = create<SlipSettingsState>()(
    persist(
        (set) => ({
            oddsFormat: 'decimal',
            oddsChangePolicy: OddsChangePolicy.None,
            quickBuyAmounts: [...DEFAULT_QUICK_BUY_AMOUNTS],
            hasCustomizedQuickBuyAmounts: false,
            quickBuyGuideDismissed: false,
            isSettingsOpen: false,
            focusedSettingsSection: null,
            settingsFocusRequestNonce: 0,

            setOddsFormat: (format) => set({ oddsFormat: format }),
            setOddsChangePolicy: (policy) => set({ oddsChangePolicy: policy }),
            setQuickBuyAmounts: (amounts) => set({ quickBuyAmounts: amounts }),
            markGuideSectionCustomized: () => set({ hasCustomizedQuickBuyAmounts: true }),
            dismissGuide: () => set({ quickBuyGuideDismissed: true }),
            setSettingsOpen: (isOpen) =>
                set((state) => ({
                    isSettingsOpen: isOpen,
                    focusedSettingsSection: isOpen ? state.focusedSettingsSection : null,
                })),
            openSettingsSection: (section) =>
                set((state) => ({
                    isSettingsOpen: true,
                    focusedSettingsSection: section,
                    settingsFocusRequestNonce: state.settingsFocusRequestNonce + 1,
                })),
        }),
        {
            name: 'slip-settings',
            partialize: (state) => ({
                oddsFormat: state.oddsFormat,
                oddsChangePolicy: state.oddsChangePolicy,
                quickBuyAmounts: state.quickBuyAmounts,
                hasCustomizedQuickBuyAmounts: state.hasCustomizedQuickBuyAmounts,
                quickBuyGuideDismissed: state.quickBuyGuideDismissed,
            }),
        },
    ),
);

/**
 * Get current odds format
 */
export const useOddsFormat = () => {
    return useSlipSettingsStore((state) => state.oddsFormat);
};
