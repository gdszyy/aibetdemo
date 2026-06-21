'use client';

import { StorageEnum } from '@/constants';
import { useKycRequiredToast } from '@/hooks/use-kyc-state';
import { usePathname } from '@/i18n';
import { useUIStore } from '@/stores/ui-store';

interface UseOpenDepositModalResult {
    /** 打开充值弹层。 */
    openDepositModal: () => void;
}

/** 统一处理充值入口的路由守卫与 KYC 校验。 */
export const useOpenDepositModal = (): UseOpenDepositModalResult => {
    const pathname = usePathname();
    const { checkKycRequired } = useKycRequiredToast();

    const openDepositModal = (): void => {
        if (pathname.startsWith('/account/deposit')) {
            return;
        }

        if (!checkKycRequired()) {
            return;
        }

        const { betSlipDrawerOpen } = useUIStore.getState();
        if (betSlipDrawerOpen) {
            window.localStorage.setItem(StorageEnum.PostDepositAutoOpenBetSlip, 'true');
        }

        useUIStore.getState().openDepositModal();
    };

    return { openDepositModal };
};
