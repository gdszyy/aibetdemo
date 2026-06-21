import { useQuery } from '@tanstack/react-query';
import { GetUserPasswordCheckInterface } from '@/api/handlers/user';
import { generateQueryKey, ModuleKeys, PasswordCheckAction } from '@/constants/query-keys';
import { PasswordSetupMode, PasswordType } from '@/constants/security';

export type PasswordSettingCheckData = {
    [PasswordType.User]: PasswordSetupMode;
    [PasswordType.Wallet]: PasswordSetupMode;
};
type CheckResult = Record<keyof PasswordSettingCheckData, PasswordSetupMode>;

/** Query key for user/wallet password setting status */
export const passwordSettingCheckKey = () =>
    generateQueryKey(ModuleKeys.SECURITY_CENTER, PasswordCheckAction.PASSWORD_HAS_SETTING_CHECK);

/**
 * Get user/wallet password setting status
 */
export const usePasswordSettingCheck = () => {
    // TODO 改成 zustand
    const { data } = useQuery({
        queryKey: passwordSettingCheckKey(),
        queryFn: GetUserPasswordCheckInterface,
    });

    if (!data) {
        return {
            [PasswordType.User]: PasswordSetupMode.Undefined,
            [PasswordType.Wallet]: PasswordSetupMode.Undefined,
        } as CheckResult;
    }

    return {
        [PasswordType.User]: data.user_password_isnew ? PasswordSetupMode.First : PasswordSetupMode.Reset,
        [PasswordType.Wallet]: data.wallet_password_isnew ? PasswordSetupMode.First : PasswordSetupMode.Reset,
    } as CheckResult;
};
