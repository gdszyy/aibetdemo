export interface ScrollPageResponse<T> {
    list: T[];
    next_cursor: string;
}

export interface BalanceListItemProps {
    id: number;
    user_id: number;
    currency_id: number;
    currency_type_id: number;
    currency_type_name: string;
    withdraw_limit: string;
    withdraw_max: string;
    balance: string;
    balance_frozen: string;
    status: number;
    product_name: string;
    reward_amount: string;
    valid_from: number;
    valid_to: number;
    created_at: number;
    updated_at: number;
    is_withdraw: boolean;
    effective_amount: string;
    main_effective_amount: string;
    progress: string;
}

export interface TransactionsListItemProps {
    id: number;
    user_id: number;
    currency_id: number;
    currency_type_id: number;
    currency_type_name: string; // currency type
    amount: string; // amount
    before_balance: string;
    after_balance: string; // total balance
    order_type: number;
    order_type_name: string; // transaction type
    order_id: string; // orderNo
    source_type: number;
    remark: string; // notice
    created_at: string;
    status_text?: string; // status display text
}

export interface TransactionsListPageParams {
    currency_id: number;
    page: number;
    page_size: number;
    order_type?: string;
    currency_type?: string;
    start_time?: string;
    end_time?: string;
}

export type SORT = 'valid_to' | 'progress' | 'default';

// Parameter types
export interface TotalBetWinParams {
    currency_id: number;
}

export interface MainEfficientBalanceParams {
    currency_id: number;
}

export interface BalanceListParams {
    currency_id: number;
    currency_type_id?: number;
    sort: SORT;
    cursor?: string;
    limit?: number;
    /** Page-based pagination */
    page?: number;
    page_size?: number;
}

export interface TransactionsListParams {
    currency_id: number;
    cursor: string;
    limit?: number;
    order_type?: string;
    currency_type?: string;
    start_time?: string;
    end_time?: string;
}

export interface MainEfficientBalanceResponse {
    main_effective_amount: string;
    since: number;
    since_utc: string;
}

export interface AccountBalanceResponse {
    total: string;
    main: string;
    bonus: string;
    cash_bonus: string;
    spin: string;
    sport: string;
}

export interface TotalBetWinResponse {
    total_bet: string;
    total_settled: string;
    total_win: string;
}

export type BalanceListResponse = ScrollPageResponse<BalanceListItemProps>;
export type TransactionsListResponse = ScrollPageResponse<TransactionsListItemProps>;

export interface BonusWithdrawBody {
    bonus_id: number;
}

export interface BonusWithdrawResponse {
    withdraw_order_id: number;
}

/** Page-based pagination response (for new endpoints) */
// export interface PageResponse<T> {
//     list: T[];
//     total: number;
//     page: number;
//     page_size: number;
// }

/** Transfer Order list item (real API: /v1/account/transaction/order) */
export interface TransferOrderItemProps {
    user_id: string;
    created_at: string;
    order_id: string;
    order_type: string;
    amount: string;
    order_status: string;
}

/** Transfer Order cursor-based query params */
export interface TransferOrderListParams {
    currency_id: number;
    cursor?: string;
    limit?: number;
    order_status?: string;
    order_type?: string;
    start_time?: string;
    /** 区间结束时间戳，配合 start_time 查询转账订单。 */
    end_time?: string;
}
