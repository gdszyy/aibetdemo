import { create } from 'zustand';
import { GetListCurrencyInterface } from '@/api/handlers/currency';
import { GetBalanceInterface } from '@/api/handlers/wallet';
import type { Currency } from '@/api/models/currency';
import { StorageEnum } from '@/constants';
import { config } from '@/constants/config';
import type { CurrencyCode } from '@/i18nV2';
import { FALLBACK_CURRENCY_CODE, useRegionConfig, useRegionIntlLocale } from '@/i18nV2/store';
import { useRegionStore } from '@/stores/region-store';
import { useSessionStore } from '@/stores/session-store';

/** Cache key for the user-selected current currency code */
const LOGIN_CURRENCY_KEY = StorageEnum.UserCurrency;

// Throttle mechanism for dispatchBalance() function
let lastBalanceUpdateTime = 0;
let pendingBalancePromise: Promise<number> | null = null;
const BALANCE_THROTTLE_MS = 2000; // Prevent calls within 2 seconds

/**
 * Get default currency based on current region config.
 * Falls back to first available currency if region default not found.
 */
const getDefaultCurrency = (): Promise<Currency | null> => {
    const { defaultCurrency } = useRegionStore.getState().config;
    return GetListCurrencyInterface().then(({ list }) => {
        return list.find((v) => v.currency_name === defaultCurrency) || list[0] || null;
    });
};

/** Read cached currency from localStorage synchronously to prevent symbol flash on page load */
const getInitialCurrency = (): Currency | null => {
    if (typeof window === 'undefined') return null;
    try {
        const cached = window.localStorage.getItem(LOGIN_CURRENCY_KEY);
        const parsed = cached ? JSON.parse(cached) : null;
        return parsed?.currency_id ? parsed : null;
    } catch {
        return null;
    }
};

/** Wallet and Currency */
export const useWallet = create<{
    /**
     * 当前货币码
     * @deprecated 不要直接使用该数据，应该使用 useCurrencyCode 来获取当前货币码
     * */
    currencyCode: CurrencyCode;
    setCurrencyCode: (payload: CurrencyCode) => void;
    /** User-selected currency */
    // TODO 应当作废，使用 currencyCode
    currency: Currency | null;
    /** Set user currency (reads region from regionStore) */
    // TODO 应当作废，使用 currencyCode
    dispatchCurrency: () => Promise<void>;

    /** Current total wallet balance (Main + Bonus) */
    totalBalance: number;
    /** Current main wallet balance (Withdrawable) */
    mainBalance: number;
    /** Current bonus wallet balance */
    sportBonus: number;
    casinoBonus: number;
    freeSpin: number;
    freeSport: number;
    /** Fetch current total wallet balance */
    dispatchBalance: () => Promise<number>;
}>((set, get) => {
    return {
        currencyCode: null as unknown as CurrencyCode,
        setCurrencyCode: (payload: CurrencyCode) => {
            set({ currencyCode: payload });
        },
        currency: getInitialCurrency(),
        dispatchCurrency: async () => {
            const isLogin = Boolean(useSessionStore.getState().data?.user?.uid);

            if (isLogin) {
                const res = await getDefaultCurrency();
                set({ currency: res });
                await window.localStorage.setItem(LOGIN_CURRENCY_KEY, JSON.stringify(res));
            } else {
                const currencyCache = window.localStorage.getItem(LOGIN_CURRENCY_KEY);
                const parsed = (currencyCache ? JSON.parse(currencyCache) : null) as Currency | null;
                // Invalidate stale cache that has old field names
                if (parsed && !parsed.currency_id) {
                    window.localStorage.removeItem(LOGIN_CURRENCY_KEY);
                    set({ currency: null });
                } else {
                    set({ currency: parsed });
                }
            }
        },

        totalBalance: 0,
        mainBalance: 0,
        sportBonus: 0,
        casinoBonus: 0,
        freeSpin: 0,
        freeSport: 0,
        dispatchBalance: async () => {
            const now = Date.now();

            // If there's a pending balance call, return that promise
            if (pendingBalancePromise) {
                if (config.isDev) console.log('[WalletStore] Reusing pending balance call');
                return pendingBalancePromise;
            }

            // If called too soon after last update, return cached balance
            if (now - lastBalanceUpdateTime < BALANCE_THROTTLE_MS) {
                if (config.isDev) console.log('[WalletStore] Skipping balance update');
                return get().totalBalance;
            }

            if (config.isDev) console.log('[WalletStore] Making balance API call');
            lastBalanceUpdateTime = now;

            // Create the promise and store it
            pendingBalancePromise = (async () => {
                try {
                    const { total, main, cash_bonus, free_spin, free_sport, sport_bonus } = await GetBalanceInterface();
                    set({
                        totalBalance: Number(total || 0),
                        mainBalance: Number(main || 0),
                        sportBonus: Number(sport_bonus || 0),
                        casinoBonus: Number(cash_bonus || 0),
                        freeSpin: Number(free_spin || 0),
                        freeSport: Number(free_sport || 0),
                    });
                    return Number(total || 0);
                } catch (error) {
                    console.error('Failed to fetch balance', error);
                    return get().totalBalance;
                } finally {
                    // Clear pending promise after completion
                    pendingBalancePromise = null;
                }
            })();

            return pendingBalancePromise;
        },
    };
});

/** 总余额 */
export const useWalletTotalBalance = () => {
    return useWallet((s) => s.totalBalance);
};

/** main余额 */
export const useWalletMainBalance = () => {
    return useWallet((s) => s.mainBalance);
};

/** 触发所有余额更新 */
export const useWalletDispatchBalance = () => {
    return useWallet((s) => s.dispatchBalance);
};

/** User-selected currency code */
export const useCurrencyCode = (): CurrencyCode => {
    const userCurrencyCode = useWallet((s) => s.currencyCode);
    const guestCurrencyCode = useRegionConfig()?.currencyCode;
    return userCurrencyCode || guestCurrencyCode || FALLBACK_CURRENCY_CODE;
};

/** 获取货币的符号 */
export const useCurrencySymbol = (
    options?: Partial<{
        locale: string;
        currencyCode: CurrencyCode;
    }> &
        Intl.NumberFormatOptions,
): string => {
    const globalLocale = useRegionIntlLocale();
    const globalCurrencyCode = useCurrencyCode();

    const locale = options?.locale || globalLocale;
    const currencyCode = options?.currencyCode || globalCurrencyCode;

    const symbol = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'narrowSymbol',
        ...options,
    })
        .formatToParts(0)
        .find((part) => part.type === 'currency')?.value;
    return symbol || '';
};

/** User-selected currency id */
export const useCurrencyId = (): number => {
    const currency = useWallet((s) => s.currency);
    return currency?.currency_id || 0;
};
