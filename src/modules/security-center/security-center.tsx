'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
    GetUserBindingsInterface,
    SendUserPasswordCodeInterface,
    SendWalletPasswordCodeInterface,
    SetUserPasswordInterface,
    SetWalletPasswordInterface,
} from '@/api/handlers/user';
import type { ErrorReject, InterfaceRequest } from '@/api/lib/types';
import { Button } from '@/components/button/button';
import { ArrowDown } from '@/components/icons';
import { Modal } from '@/components/modal/modal';
import { Toast } from '@/components/toast';
import {
    type PasswordSettingCheckData,
    passwordSettingCheckKey,
    usePasswordSettingCheck,
} from '@/hooks/use-password-setting-check';
import { useRouter } from '@/i18n';
import { cn } from '@/utils/common';
import { PasswordSetupMode, PasswordsForms, PasswordType } from './_components/passwords-forms';

const panels: PasswordType[] = [PasswordType.User, PasswordType.Wallet];
const userBindingsQueryKey = ['security-center', 'user-bindings'] as const;

/**
 * Security center - user/wallet password management
 */
export const SecurityCenter: FunctionComponent = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const t = useTranslations('user');
    const titles = useMemo(
        () => ({
            user: t('securityCenter.userTitle'),
            wallet: t('securityCenter.walletTitle'),
        }),
        [t],
    );

    const [expandedPanel, setExpandedPanel] = useState<PasswordType | null>(null);
    const passwordSetting = usePasswordSettingCheck();
    const [setupMode, setSetupMode] = useState<PasswordSettingCheckData>(passwordSetting);
    const [mobileBindConfirmOpen, setMobileBindConfirmOpen] = useState(false);
    const { data: bindings } = useQuery({
        queryKey: userBindingsQueryKey,
        queryFn: GetUserBindingsInterface,
    });

    const [msgId, setMsgId] = useState<Record<PasswordType, string>>({
        [PasswordType.User]: '',
        [PasswordType.Wallet]: '',
    });

    const handleToggle = (type: PasswordType): void => {
        setExpandedPanel((prev) => (prev === type ? null : type));
    };

    const handleGetCode = async (type: PasswordType): Promise<void> => {
        const currentBindings =
            bindings ??
            (await queryClient.fetchQuery({
                queryKey: userBindingsQueryKey,
                queryFn: GetUserBindingsInterface,
            }));

        if (!currentBindings?.mobile) {
            setMobileBindConfirmOpen(true);
            return Promise.reject(new Error('Mobile phone is not linked'));
        }

        const request = type === PasswordType.User ? SendUserPasswordCodeInterface : SendWalletPasswordCodeInterface;

        return new Promise((resolve, reject) => {
            request()
                .then(({ msgId }) => {
                    setMsgId((prev) => ({ ...prev, [type]: msgId }));
                    resolve(void 0);
                })
                .catch((error: ErrorReject) => {
                    Toast.error(error?.message, { id: 'security-center' });
                    reject();
                });
        });
    };

    const handleSubmit = async (type: PasswordType, data: { newPwd: string; oldPwd?: string; otp?: string }) => {
        const request = (
            type === PasswordType.User ? SetUserPasswordInterface : SetWalletPasswordInterface
        ) as typeof SetUserPasswordInterface;
        const params = (
            type === PasswordType.User
                ? {
                      user_password: data.newPwd,
                      old_user_password: data.oldPwd,
                  }
                : {
                      wallet_password: data.newPwd,
                      old_wallet_password: data.oldPwd,
                  }
        ) as InterfaceRequest<typeof SetUserPasswordInterface>;

        return request({
            ...params,
            code: data.otp,
            msgId: msgId[type],
        })
            .then(() => {
                Toast.success(t('securityCenter.successTip'), { id: 'security-center' });
                setSetupMode((prev) => ({ ...prev, [type]: PasswordSetupMode.Reset }));
                const cacheField = type === PasswordType.User ? 'user_password_isnew' : 'wallet_password_isnew';
                queryClient.setQueryData(
                    passwordSettingCheckKey(),
                    (prev: { user_password_isnew: boolean; wallet_password_isnew: boolean } | undefined) =>
                        prev ? { ...prev, [cacheField]: false } : prev,
                );
            })
            .catch((error: ErrorReject) => {
                Toast.error(error?.message, { id: 'security-center' });
            })
            .finally(() => {
                setMsgId((prev) => ({ ...prev, [type]: '' }));
            });
    };

    useEffect(() => {
        setSetupMode(passwordSetting);
    }, [passwordSetting]);

    return (
        <>
            <div className="account-card w-full gap-4 flex flex-col">
                {panels.map((panelType) => {
                    const isExpanded = expandedPanel === panelType;
                    const panelTitle = titles[panelType];

                    return (
                        <div key={panelType}>
                            <button
                                type="button"
                                onClick={() => handleToggle(panelType)}
                                className={cn(
                                    'flex w-full items-center justify-between cursor-pointer rounded-sm h-10 px-4 text-left bg-filltext-ft-a hover:text-filltext-ft-g',
                                    isExpanded ? 'text-brand-red' : 'text-filltext-ft-e',
                                )}
                            >
                                <span className="text-body-md">{panelTitle}</span>
                                <ArrowDown
                                    className={cn(
                                        'size-3 transition-transform duration-200 ease-in-out',
                                        isExpanded && 'rotate-180',
                                    )}
                                />
                            </button>

                            {isExpanded && (
                                <PasswordsForms
                                    type={panelType}
                                    mode={setupMode[panelType]}
                                    onSubmit={(data) => handleSubmit(panelType, data)}
                                    onGetCode={() => handleGetCode(panelType)}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <Modal
                visible={mobileBindConfirmOpen}
                onClose={() => setMobileBindConfirmOpen(false)}
                closeButton={false}
                withBg={false}
            >
                <div className="w-[calc(100vw-2rem)] max-w-[435px] rounded-md bg-surface-raised p-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-title-md text-filltext-ft-h">{t('securityCenter.mobileUnboundTitle')}</p>
                        <p className="text-body-md text-filltext-ft-f">{t('securityCenter.mobileUnboundTip')}</p>
                    </div>
                    <div className="flex justify-end gap-2.5">
                        <Button
                            variant="secondary"
                            onClick={() => setMobileBindConfirmOpen(false)}
                            className="flex-1 h-10"
                        >
                            {t('securityCenter.mobileUnboundCancel')}
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setMobileBindConfirmOpen(false);
                                router.push('/account/profile');
                            }}
                            className="flex-1 h-10"
                        >
                            {t('securityCenter.mobileUnboundConfirm')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
