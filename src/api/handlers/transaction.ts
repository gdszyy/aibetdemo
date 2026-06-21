import { userFetcher } from '@/api/client';
import type { PageResponse } from '../lib/types';
import type {
    BalanceListItemProps,
    BalanceListParams,
    BalanceListResponse,
    BonusWithdrawBody,
    BonusWithdrawResponse,
    MainEfficientBalanceParams,
    MainEfficientBalanceResponse,
    ScrollPageResponse,
    TotalBetWinParams,
    TotalBetWinResponse,
    TransactionsListItemProps,
    TransactionsListPageParams,
    TransactionsListParams,
    TransactionsListResponse,
    TransferOrderItemProps,
    TransferOrderListParams,
} from '../models/transaction';

export const GetBalanceListInterface = (params: BalanceListParams) => {
    return userFetcher.get<BalanceListResponse>(`/v1/account/bonus/list`, params);
};

/** Get balance list with page-based pagination */
export const GetBalanceListPageInterface = (params: BalanceListParams) => {
    return userFetcher.get<PageResponse<BalanceListItemProps>>(`/v1/account/bonus/list`, params);
};

export const GetTransactionsListInterface = (params: TransactionsListParams) => {
    return userFetcher.get<TransactionsListResponse>(`/v1/account/transaction/history`, params);
};

/** Get transactions list with page-based pagination */
export const GetTransactionsListPageInterface = (params: TransactionsListPageParams) => {
    return userFetcher.get<PageResponse<TransactionsListItemProps>>(`/v1/account/transaction/history`, params);
};

export const GetTotalBetWinInterface = (params: TotalBetWinParams) => {
    return userFetcher.get<TotalBetWinResponse>(`/v1/account/total/betwin`, params);
};

export const GetMainEfficientBalanceInterface = (params: MainEfficientBalanceParams) => {
    return userFetcher.get<MainEfficientBalanceResponse>(`/v1/main/efficient/balance`, params);
};

export const PostBonusWithdrawInterface = (body: BonusWithdrawBody) => {
    return userFetcher.post<BonusWithdrawResponse | null>(`/v1/bonus/withdraw`, body);
};

/** Get transfer order list (cursor-based, /v1/account/transaction/order) */
export const GetTransferOrderListInterface = (params: TransferOrderListParams) =>
    userFetcher.get<ScrollPageResponse<TransferOrderItemProps>>('/v1/account/transaction/order', params);
