import { userFetcher } from '@/api/client';

/** Get merchant aggregated limit range
 * @param currency_id Currency ID
 */
export const GetMerchantAggregationLimitRangeInterface = (params: { currency_id: number }) => {
    return userFetcher.get<{
        /** Minimum deposit limit */
        deposit_min: number;
        /** Maximum deposit limit */
        deposit_max: number;
        /** Minimum withdrawal limit */
        withdraw_min: number;
        /** Maximum withdrawal limit */
        withdraw_max: number;
    }>(`/v1/currency/limit`, params);
};
