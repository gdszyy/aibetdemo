import type { CreateUpdateInfo } from './common';

/** 用户银行卡 */
interface Model extends CreateUpdateInfo {
    id: number;
    pay_platform: string;
    account_type: string;
    account_no: string;
    bank_code: string;
    account_name: string;
    bank_name: string;
    identify_type: string;
    identify_num: string;
}

export type { Model as BankAccount };
