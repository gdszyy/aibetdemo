import { useQuery } from '@tanstack/react-query';
import { type FunctionComponent, useMemo } from 'react';
import { GetCasinoGameMerchantsInterface } from '@/api/handlers/casino';
import { Select } from '@/components/select/select';
import { useCommonTranslations } from '@/hooks/use-translations';
import { cn } from '@/utils/common';
import { usePageStore } from './page-store';

const ALL_VALUE = '______all_xJ2zp123_dg_____';

/** 商家平台筛选器 */
export const MerchantFilterH5: FunctionComponent = () => {
    const tCommon = useCommonTranslations();
    const { selectedMerchant, setSelectedMerchant } = usePageStore();

    const { data: merchantsData = [] } = useQuery({
        queryKey: ['casino', 'merchants'],
        queryFn: GetCasinoGameMerchantsInterface,
        placeholderData: [],
    });

    const merchants = useMemo(() => {
        const options = merchantsData.map((m) => ({ label: m.name, value: m.oc_platform }));
        options.unshift({ label: tCommon('action.all'), value: ALL_VALUE });
        return options;
    }, [merchantsData, tCommon]);

    return (
        <div className={cn('flex-1 shrink-0')}>
            <Select
                className="h-10 rounded-sm bg-surface-1 hover:bg-surface-1 data-[state=open]:bg-surface-1 "
                options={merchants}
                value={selectedMerchant?.oc_platform || ALL_VALUE}
                onValueChange={(e) => {
                    if (!e || e === ALL_VALUE) {
                        setSelectedMerchant(null);
                    } else {
                        setSelectedMerchant(merchantsData.find((v) => v.oc_platform === e) || null);
                    }
                }}
            ></Select>
        </div>
    );
};
