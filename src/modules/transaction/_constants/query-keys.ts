/**
 * Query keys for transaction module
 * Centralized cache key management for React Query
 */

export const TransactionQueryKeys = {
    /** Base key for all transaction queries */
    all: ['transaction'] as const,

    /** Balance list queries */
    balance: {
        all: ['transaction', 'balance'] as const,
        list: (currencyId: number, filter1: string) => ['transaction', 'balance', 'list', currencyId, filter1] as const,
    },

    /** Transactions list queries */
    transactions: {
        all: ['transaction', 'transactions'] as const,
        list: (currencyId: number, filter1: string, filter2: string) =>
            ['transaction', 'transactions', 'list', currencyId, filter1, filter2] as const,
    },

    /** History list queries */
    betHistory: {
        all: ['transaction', 'bot-history'] as const,
        list: (currencyId: number, filter1: string) =>
            ['transaction', 'bot-history', 'list', currencyId, filter1] as const,
    },
} as const;
