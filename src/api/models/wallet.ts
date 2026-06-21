/** Wallet */
interface Model {
    id: number;
    /** Currency */
    currency_id: number;
    /** Currency type ID - wallet ID */
    currency_type_id: number;
    /** Amount */
    amount: number;
    /** Frozen amount */
    freeze_amount: number;
    /** Withdrawal limit */
    withdraw_limit: number;
    /** Remaining amount */
    remaining_amount: number;
    /** Created at */
    created_at: number;
}

export interface Balance {
    main: string;
    total: string;
    cash_bonus: string;
    free_spin: string;
    free_sport: string;
    sport_bonus: string;
}

export type { Model as Wallet };
