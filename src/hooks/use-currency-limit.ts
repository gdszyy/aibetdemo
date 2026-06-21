import { useQuery } from '@tanstack/react-query';

import { GetMerchantAggregationLimitRangeInterface } from '@/api/handlers/merchant';
import { generateQueryKey, MerchantActions, ModuleKeys } from '@/constants/query-keys';
import { useCurrencyId } from './use-wallet';

const DEFAULT_MIN = 5;
const DEFAULT_MAX = 50000;

type CurrencyType = 'deposit' | 'withdraw';
/**
 * Fetch currency deposit/withdrawal limits
 * @returns
 */
export const useCurrencyLimit = (type: CurrencyType) => {
    const currencyId = useCurrencyId() ?? 0;

    const queryResult = useQuery({
        queryKey: generateQueryKey(ModuleKeys.MERCHANT, MerchantActions.LIMIT, currencyId),
        queryFn: async () => {
            const res = await GetMerchantAggregationLimitRangeInterface({
                currency_id: currencyId,
            });
            return res;
        },
        enabled: currencyId > 0,
    });

    return {
        min:
            type === 'deposit'
                ? queryResult.data?.deposit_min || DEFAULT_MIN
                : queryResult.data?.withdraw_min || DEFAULT_MIN,
        max:
            type === 'deposit'
                ? queryResult.data?.deposit_max || DEFAULT_MAX
                : queryResult.data?.withdraw_max || DEFAULT_MAX,
    };
};
