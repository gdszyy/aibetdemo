import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { GetKycTipsInterface, KycTipKey } from '@/api/handlers/user-kyc';
import { Toast } from '@/components/toast';
import { useUser } from '@/stores/session-store';

/**
 * 抓取用户kyc的状态并给出提示
 */
export const useKycTips = () => {
    const user = useUser();
    const tUser = useTranslations('user');
    const queryClient = useQueryClient();
    const queryKey = ['kycTips'] as const;

    // Fetch KYC tips using React Query
    const { data } = useQuery({
        queryKey,
        queryFn: GetKycTipsInterface,
        enabled: !!user, // Only run when user is logged in
        staleTime: Infinity, // Never refetch automatically
        gcTime: Infinity, // Keep in cache forever
        refetchOnMount: false, // Don't refetch on component mount
    });

    // Show toast when KYC tips data is available
    useEffect(() => {
        if (data?.should_show) {
            if (data.tip_key === KycTipKey.Pending) {
                Toast.loading(tUser('kyc.thirdPending'), { id: 'kyc-third-party' });
            } else if (data.tip_key === KycTipKey.Fail) {
                Toast.error(tUser('kyc.thirdFailed'), { id: 'kyc-third-party' });
            } else if (data.tip_key === KycTipKey.Success) {
                Toast.success(tUser('kyc.thirdSuccess'), { id: 'kyc-third-party' });
            }
            queryClient.setQueryData(queryKey, (prev: typeof data) => {
                if (!prev) return prev;
                return { ...prev, should_show: false };
            });
        }
    }, [data, tUser, queryClient, queryKey]);

    return { data };
};
