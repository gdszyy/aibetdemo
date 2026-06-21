import { userFetcher } from '@/api/client';
import type { Balance } from '@/api/models/wallet';

/** Get user wallet balance */
export const GetBalanceInterface = () => {
    return userFetcher.get<Balance>(`/v1/account/balance`);
};
