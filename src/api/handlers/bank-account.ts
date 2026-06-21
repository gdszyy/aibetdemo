import { userFetcher } from '@/api/client';
import type { BankAccount as Model } from '../models/bank-account';

export const ListBankAccountInterface = () => {
    return userFetcher.get<{
        list: Model[];
    }>(`/v2/bank/account`);
};

export const CreateBankAccountInterface = (
    params: Pick<Model, 'pay_platform' | 'account_type' | 'bank_code' | 'account_name' | 'account_no' | 'bank_name'> & {
        wallet_password: string;
    },
) => {
    return userFetcher.post<Pick<Model, 'id'>>(`/v2/bank/account`, params);
};

export const DeleteBankAccountInterface = (params: Pick<Model, 'id'> & { wallet_password: string }) => {
    return userFetcher.delete(`/v2/bank/account`, params);
};
