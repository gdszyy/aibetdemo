import type { TranslationKey } from '@/i18nV2/types';

/** Tab types for transaction page — values are URL-friendly slugs used as searchParams */
export enum TransactionTab {
    BALANCE = 'balance',
    TRANSACTIONS = 'transactions',
    BET_HISTORY = 'bet-history',
    TRANSFER_ORDER = 'transfer-order',
}

/** i18n key mapping for each tab (used for dynamic document.title) */
export const TRANSACTION_TAB_LABEL_KEYS: Record<TransactionTab, TranslationKey<'transaction'>> = {
    [TransactionTab.BALANCE]: 'tabsBalance',
    [TransactionTab.TRANSACTIONS]: 'tabsTransactions',
    [TransactionTab.BET_HISTORY]: 'tabsBetHistory',
    [TransactionTab.TRANSFER_ORDER]: 'tabsTransferOrder',
};

export const CURRENCY_ID_TYPE_BONUS = 1;

export type fromType = 'sportBonus' | 'casinoBonus' | 'freeSpin' | 'freeSport' | 'totalBetWin';
