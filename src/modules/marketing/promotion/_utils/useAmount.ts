import { useCallback } from 'react';
import { useCurrencyCode } from '@/hooks/use-wallet';
import { useRegionIntlLocale } from '@/i18nV2/store';
import { formatCurrency } from '@/utils/intl-formatter';

/** 奖励 */
export const useAmount = () => {
    const currencyCode = useCurrencyCode();
    const intlLocale = useRegionIntlLocale();

    const formatAmount = useCallback(
        (value: number) => {
            return formatCurrency(value, intlLocale, currencyCode, {
                currencyDisplay: 'code',
            });
        },
        [currencyCode, intlLocale],
    );

    return formatAmount;
};
