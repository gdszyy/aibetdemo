import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { LogoutInterface } from '@/api/handlers/passport';
import { Toast } from '@/components/toast';
import { useSessionStore } from '@/stores/session-store';

/**
 * Logout
 */
export const useLogout = () => {
    const t = useTranslations('auth');
    const tCommon = useTranslations('common');

    const signOut = useSessionStore((state) => state.signOut);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const logoutAction = useMutation({
        mutationFn: async () => {
            return LogoutInterface();
        },
    });

    const logout = () => {
        setConfirmVisible(true);
    };

    const handleConfirm = async () => {
        await logoutAction.mutateAsync();
        await Toast.success(t('logout.success'), { id: 'logout-success' });
        setConfirmVisible(false);
        await signOut();
        window.location.reload();
    };

    const handleCancel = () => {
        setConfirmVisible(false);
    };

    return {
        logout,
        logoutConfirmProps: {
            visible: confirmVisible,
            loading: logoutAction.isPending,
            title: t('logout.confirm'),
            confirmText: t('logout.confirmBtn'),
            cancelText: tCommon('dialog.cancelBtnText'),
            onConfirm: handleConfirm,
            onCancel: handleCancel,
        },
    };
};
