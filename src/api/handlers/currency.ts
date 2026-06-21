import { userFetcher } from '@/api/client';
import type { Currency } from '@/api/models/currency';

/** Get currency list */
export const GetListCurrencyInterface = () => {
    return userFetcher.get<{ list: Currency[] }>(`/v1/currency`);
};
