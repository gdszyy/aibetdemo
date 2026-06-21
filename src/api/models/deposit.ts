import type { CreateUpdateInfo } from './common';

/** Order status */
enum OrderStatus {
    /** Created successfully */
    Created = 1,
    /** Platform order succeeded */
    PfOrderSuccess = 2,
    /** Platform order failed */
    PfOrderFailed = 3,
}

/** Deposit order */
interface Model extends Pick<CreateUpdateInfo, 'created_at' | 'updated_at'> {
    /** Primary key */
    id: number;
    /** Currency */
    currency_id: number;
    /** Currency type ID - wallet ID */
    currency_type_id: number;
    /** Merchant order number */
    order_no: string;
    /** Order amount in cents (e.g. 199.00 yuan) */
    order_price: number;
    /** Product code */
    order_pay_code: string;
    /** Order status */
    order_status: OrderStatus;
    /** System time when notification was received (unix timestamp in seconds) */
    order_notice_time: number;
    /** User ID */
    user_id: number;
    /** User IP */
    user_ip: string;
    // TODO: Unconfirmed
    /** Additional params (JSON string) */
    attach: Partial<Record<string, string>>;
    /** Channel: epay */
    pay_channel: string;
    /** Platform order number */
    pf_order_no: string;
    /** Platform payment URL */
    pf_pay_url: string;
    /** Platform payment QR code */
    pf_qr_code: string;
    /** Platform actual payment amount in cents */
    pf_real_price: number;
    /** Platform fee in cents */
    pf_fee: number;
    // TODO: Unconfirmed
    /** Platform payer info (JSON string) */
    pf_player: Partial<Record<string, string>>;
    /** Platform payment failure reason */
    pf_remark: string;
    /** CMS manual operation reason */
    cms_remark: string;
}

export { OrderStatus as DepositOrderStatus };
export type { Model as Deposit };
