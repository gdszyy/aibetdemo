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

/** Withdrawal order */
interface Model extends Pick<CreateUpdateInfo, 'created_at' | 'updated_at'> {
    /** Primary key */
    id: number;
    /** Currency */
    currency_id: number;
    /** Currency type ID - wallet ID */
    currency_type_id: number;
    /** Merchant order number */
    order_no: string;
    /** Order amount in cents (e.g. 256.00 yuan) */
    order_price: number;
    /** User ID */
    user_id: number;
    /** User IP */
    user_ip: string;
    /** Product code */
    order_pay_code: string;
    /** Order status */
    order_status: OrderStatus;
    /** System time when platform notification was received (unix timestamp in seconds) */
    order_notice_time: number;
    /** Payout account number */
    account_no: string;
    /** Payout account holder name */
    account_name: string;
    /** Bank code */
    bank_code: string;
    /** Payout account ID number */
    identify_num: string;
    // TODO: Unconfirmed
    /** Additional params (JSON string) */
    attach: Partial<Record<string, string>>;
    /** Channel: epay */
    pay_channel: string;
    /** Platform order number */
    pf_order_no: string;
    /** Platform fee in cents */
    pf_fee: number;
    /** Platform failure reason */
    pf_remark: string;
    /** CMS manual operation reason */
    cms_remark: string;
}

export { OrderStatus as WithdrawOrderStatus };
export type { Model as Withdraw };
