import { paymentFetcher } from '@/api/client';
import type { Withdraw } from '@/api/models/withdraw';

/** Create withdrawal */
export const CreateWithdrawInterface = (params: {
    /** User-selected bank account ID */
    bank_account_id: number;
    /** Withdrawal amount (unit: yuan) */
    amount: number;
    /** Wallet password */
    wallet_password?: string;
}) => {
    return paymentFetcher.post<{
        /** Order number */
        order_no: string;
    }>(`/v2/payout/order`, params);
};

/** Query order */
export const GetWithdrawInterface = (params: {
    /** Order number */
    order_no: string;
}) => {
    return paymentFetcher.get<Withdraw>(`/v1/payout/${params.order_no}`);
};

/** 提现渠道 */
export const ListChannelInterface = () => {
    return paymentFetcher.get<
        {
            /** pay code */
            platform: string;
            options: {
                /** pay_channel_id */
                id: number;
                account_type: string;
                bank_code: string;
                withdraw_min: number;
                withdraw_max: number;
            }[];
        }[]
    >(`/v1/payment/channel/withdraw`);
};

/** 提现流水 */
export const GetTurnoverInterface = () => {
    return paymentFetcher.get<{
        /** 已产生流水 */
        total_turnover: number;
        /** 总需流水 */
        total_deposit: number;
    }>('/v1/user/statistics');
};
