export enum PlaceBetStatus {
    Normal = 'Normal',
    Locked = 'Locked',
    Exception = 'Exception',
}

/** localStorage storage keys */
export const STORAGE_KEYS = {
    /** Single mode stake amounts */
    SINGLE_STAKES: 'single-stakes',
    /** Parlay mode stake amount */
    PARLAY_STAKE: 'parlay-stake',
    /** Mobile stake keypad remember toggle */
    REMEMBER_STAKE: 'bet-slip-remember-stake',
    /** 购物车单关/串关模式（全局，不区分用户） */
    BET_MODE: 'bet-slip-bet-mode',
} as const;
