import { usePasswordSettingCheck } from '@/hooks/use-password-setting-check';
import { PasswordSetupMode, PasswordType } from '@/modules/security-center/_components/passwords-forms';

export const WALLET_PASSWORD_CHECK_QUERY_KEY = 'walletPasswordCheck';

/** Check if wallet password has been set */
export const useWalletPasswordCheck = (): boolean => {
    const data = usePasswordSettingCheck();
    return data?.[PasswordType.Wallet] === PasswordSetupMode.Reset || false;
};
