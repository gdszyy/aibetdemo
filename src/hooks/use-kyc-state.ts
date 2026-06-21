import { useTranslations } from 'next-intl';
import { UserKycStatus } from '@/api/models/user';
import { Toast } from '@/components/toast';
import { config } from '@/constants/config';
import { useIsLogin, useUser } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';

/** kyc拦截提示 */
export const useKycRequiredToast = () => {
    const t = useTranslations('user');
    const user = useUser();
    const isLogin = useIsLogin();

    const checkKycRequired = (params?: {
        /** 忽略kyc检查的开关 */
        ignoreSwitch?: boolean;
    }): boolean => {
        if (!isLogin) {
            useUIStore.getState().openLoginModal();
            return false;
        }

        // 如果关闭了kyc验证，且忽略了该开关验证
        if (config.disableKycVerify && !params?.ignoreSwitch) {
            return true;
        }

        if (user?.kyc_status !== UserKycStatus.Success) {
            Toast.error(t('kyc.completeFirst'), { id: 'kyc-required' });
            return false;
        }

        return true;
    };

    return { checkKycRequired };
};
