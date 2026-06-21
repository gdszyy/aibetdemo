import { paymentFetcher } from '@/api/client';
import type { Deposit } from '@/api/models/deposit';

/** Create deposit */
export const CreateDepositInterface = (params: {
    /** 渠道 */
    pay_platform: string;
    /** Deposit amount (unit: yuan) */
    amount: number;
    /** Success callback URL */
    success_url: string;
    /** Failure callback URL */
    fail_url: string;
    /** Promo code (optional) */
    first_recharge_code?: string;
}) => {
    return paymentFetcher.post<{
        /** Order number */
        order_no: string;
        /** Payment QR code */
        qr_code: string;
        /** Payment URL */
        pay_url: string;
        /** Order expiration timestamp */
        order_expired: number;
    }>(`/v2/payin/order`, params);
};

/** Query order */
export const GetDepositInterface = (params: {
    /** Order number */
    order_no: string;
}) => {
    return paymentFetcher.get<Deposit>(`/v1/payin/${params.order_no}`);
};

/** 支付渠道 */
export const ListChannelInterface = () => {
    return paymentFetcher.get<
        {
            /** pay_channel_id */
            id: number;
            /** pay code */
            platform: string;
            merchant_id: number;
            deposit_min: number;
            deposit_max: number;
        }[]
    >(`/v1/payment/channel/deposit`);
};
