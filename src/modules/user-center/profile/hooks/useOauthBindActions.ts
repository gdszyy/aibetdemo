'use client';

import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { BindOAuthInterface, UnbindOAuthInterface } from '@/api/handlers/user';
import type { ErrorReject } from '@/api/lib/types';
import { getRejectError } from '@/api/lib/utils';
import type { OAuthProvider } from '@/api/models/user';
import { Toast } from '@/components/toast';
import { getFirebaseOAuthIdToken, isFirebaseOAuthUserCancelledError } from '@/libs/oauth';
import { userBindQueryKey } from './useUserBindActions';

interface OauthBindActions {
    /** 绑定第三方账号操作。 */
    bindAction: UseMutationResult<void, ErrorReject, OAuthProvider>;
    /** 解绑第三方账号操作。 */
    unbindAction: UseMutationResult<void, ErrorReject, OAuthProvider>;
}

/** 将 Firebase 与 API 错误转成本地化提示。 */
const getOAuthErrorMessage = (error: unknown, fallbackMessage: string): string => {
    const errorCode = error instanceof Error ? Reflect.get(error, 'code') : undefined;
    if (typeof errorCode === 'string' && errorCode.startsWith('auth/')) {
        return fallbackMessage;
    }

    if (error instanceof Error && error.message) {
        return getRejectError(error as ErrorReject) || fallbackMessage;
    }

    return fallbackMessage;
};

/** 个人资料页第三方账号绑定与解绑操作。 */
export const useOauthBindActions = (): OauthBindActions => {
    const t = useTranslations('user');
    const queryClient = useQueryClient();

    const bindAction = useMutation<void, ErrorReject, OAuthProvider>({
        mutationFn: async (provider: OAuthProvider): Promise<void> => {
            const idToken = await getFirebaseOAuthIdToken(provider);
            await BindOAuthInterface({ provider, id_token: idToken });
        },
        onSuccess: async (): Promise<void> => {
            await queryClient.invalidateQueries({ queryKey: userBindQueryKey() });
            await Toast.success(t('profilePage.binding.oauthBindSuccess'), { id: 'bind-oauth-submit' });
        },
        onError: (error: ErrorReject): void => {
            if (isFirebaseOAuthUserCancelledError(error)) {
                Toast.info(t('profilePage.binding.oauthCancelled'), { id: 'bind-oauth-cancelled' }).catch(
                    () => undefined,
                );
                return;
            }

            Toast.error(getOAuthErrorMessage(error, t('profilePage.binding.oauthFailed')), {
                id: 'bind-oauth-submit',
            });
        },
    });

    const unbindAction = useMutation<void, ErrorReject, OAuthProvider>({
        mutationFn: async (provider: OAuthProvider): Promise<void> => {
            await UnbindOAuthInterface({ provider });
        },
        onSuccess: async (): Promise<void> => {
            await queryClient.invalidateQueries({ queryKey: userBindQueryKey() });
            await Toast.success(t('profilePage.binding.oauthUnbindSuccess'), { id: 'unbind-oauth-submit' });
        },
        onError: (error: ErrorReject): void => {
            Toast.error(getOAuthErrorMessage(error, t('profilePage.binding.oauthFailed')), {
                id: 'unbind-oauth-submit',
            });
        },
    });

    return { bindAction, unbindAction };
};
