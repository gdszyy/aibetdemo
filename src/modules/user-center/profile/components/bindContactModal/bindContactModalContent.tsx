'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type FC, useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    BindEmailInterface,
    BindMobileInterface,
    SendBindEmailCodeInterface,
    SendBindMobileCodeInterface,
} from '@/api/handlers/user';
import type { ErrorReject } from '@/api/lib/types';
import { getRejectError } from '@/api/lib/utils';
import { BtnWithCountdown, type BtnWithCountdownRef } from '@/components/btn-with-countdown/btn-with-countdown';
import { Button } from '@/components/button/button';
import { FormInput } from '@/components/form-input/form-input';
import { Modal } from '@/components/modal/modal';
import { Toast } from '@/components/toast';
import { useIsDesktop } from '@/hooks/use-media-query';
import { CountryFlag, normalizePhone } from '@/i18n';
import { useRegionCode, useRegionConfig } from '@/stores/region-store';
import { userBindQueryKey } from '../../hooks/useUserBindActions';
import type { BindContactType } from './types';

interface BindContactModalContentProps {
    /** 弹窗是否打开。 */
    visible: boolean;
    /** 当前绑定类型。 */
    type: BindContactType;
    /** 关闭弹窗。 */
    onClose: () => void;
}

interface BindContactFormValues {
    /** 待绑定邮箱或手机号。 */
    account: string;
    /** 验证码。 */
    code: string;
}

/** 绑定联系方式弹窗内容，按绑定类型初始化对应表单校验。 */
export const BindContactModalContent: FC<BindContactModalContentProps> = ({ visible, type, onClose }) => {
    const t = useTranslations('user');
    const tCommon = useTranslations('common');
    const queryClient = useQueryClient();
    const countdownRef = useRef<BtnWithCountdownRef | null>(null);
    const { phoneCode, phonePattern } = useRegionConfig();
    const isDesktop = useIsDesktop();
    const regionCode = useRegionCode();

    const formSchema = useMemo(() => {
        const mobileSchema = phonePattern
            ? z
                  .string()
                  .nonempty(t('profilePage.binding.mobileRequired'))
                  .refine((value) => phonePattern.test(normalizePhone(value)), {
                      message: t('profilePage.binding.mobileInvalid'),
                  })
            : z.string().nonempty(t('profilePage.binding.mobileRequired'));

        return z.object({
            account:
                type === 'email'
                    ? z
                          .string()
                          .nonempty(t('profilePage.binding.emailRequired'))
                          .email(t('profilePage.binding.emailInvalid'))
                    : mobileSchema,
            code: z
                .string()
                .nonempty(t('profilePage.binding.codeRequired'))
                .regex(/^\d+$/, t('profilePage.binding.codeInvalid')),
        });
    }, [phonePattern, t, type]);

    const formMethods = useForm<BindContactFormValues>({
        resolver: zodResolver(formSchema),
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            account: '',
            code: '',
        },
    });

    const getCodeAction = useMutation<void, ErrorReject, void>({
        mutationFn: async (): Promise<void> => {
            const valid = await formMethods.trigger('account');
            if (!valid) {
                return;
            }

            const account = formMethods.getValues('account');
            const mobile = `+${phoneCode}${normalizePhone(account)}`;
            try {
                if (type === 'email') {
                    await SendBindEmailCodeInterface({ email: account });
                } else {
                    await SendBindMobileCodeInterface({ account: mobile });
                }
                countdownRef.current?.start();
                await Toast.success(t('profilePage.binding.codeSent'), { id: 'bind-contact-code' });
            } catch (error) {
                Toast.error(getRejectError(error as ErrorReject), { id: 'bind-contact-code' });
            }
        },
    });

    const bindAction = useMutation<void, ErrorReject, BindContactFormValues>({
        mutationFn: async (values: BindContactFormValues): Promise<void> => {
            try {
                if (type === 'email') {
                    await BindEmailInterface({ email: values.account, code: values.code });
                } else {
                    await BindMobileInterface({
                        mobile: `+${phoneCode}${normalizePhone(values.account)}`,
                        code: values.code,
                    });
                }
                await queryClient.invalidateQueries({ queryKey: userBindQueryKey() });
                await Toast.success(t('profilePage.binding.bindSuccess'), { id: 'bind-contact-submit' });
                onClose();
            } catch (error) {
                Toast.error(getRejectError(error as ErrorReject), { id: 'bind-contact-submit' });
            }
        },
    });

    const handleClose = (): void => {
        if (bindAction.isPending || getCodeAction.isPending) {
            return;
        }
        onClose();
    };

    useEffect(() => {
        if (!visible) {
            formMethods.reset();
        }
    }, [formMethods, visible]);

    const title = type === 'email' ? t('profilePage.binding.emailTitle') : t('profilePage.binding.mobileTitle');

    return (
        <Modal visible={visible} onClose={handleClose} withBg={false} maskClosable={false} closeButton={isDesktop}>
            <FormProvider {...formMethods}>
                <form
                    className="w-105 max-w-[calc(100vw-2rem)] rounded-md bg-surface-raised px-6 py-8 flex flex-col gap-6"
                    onSubmit={formMethods.handleSubmit((values) => bindAction.mutate(values))}
                >
                    <h3 className="text-title-md text-filltext-ft-h text-center">{title}</h3>
                    <div className="flex flex-col gap-4">
                        <FormInput
                            name="account"
                            label={
                                type === 'email'
                                    ? t('profilePage.binding.emailLabel')
                                    : t('profilePage.binding.mobileLabel')
                            }
                            fieldProps={{
                                autoComplete: type === 'email' ? 'email' : 'tel',
                                inputMode: type === 'email' ? 'email' : 'tel',
                                maxLength: type === 'email' ? 254 : 20,
                                placeholder:
                                    type === 'email'
                                        ? t('profilePage.binding.emailPlaceholder')
                                        : t('profilePage.binding.mobilePlaceholder'),
                                addonBefore:
                                    type === 'mobile' ? (
                                        <div className="h-full flex items-center gap-2 select-none shrink-0 relative pl-4">
                                            <CountryFlag code={regionCode} className="size-5 rounded-xs shrink-0" />
                                            <span className="text-body-md text-filltext-ft-g select-none shrink-0">
                                                +{phoneCode}
                                            </span>
                                            <div className="h-8 w-px shrink-0 bg-filltext-ft-d" />
                                        </div>
                                    ) : undefined,
                            }}
                        />
                        <FormInput
                            name="code"
                            label={t('profilePage.binding.codeLabel')}
                            fieldProps={{
                                autoComplete: 'one-time-code',
                                inputMode: 'numeric',
                                maxLength: 8,
                                placeholder: t('profilePage.binding.codePlaceholder'),
                                addonAfter: (
                                    <div className="px-4">
                                        <BtnWithCountdown
                                            ref={countdownRef}
                                            text={t('profilePage.binding.getCode')}
                                            countdownTime={60}
                                            onClick={getCodeAction.mutate}
                                            disabled={getCodeAction.isPending}
                                        />
                                    </div>
                                ),
                            }}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            className="flex-1 h-10 min-w-20"
                            onClick={handleClose}
                            disabled={bindAction.isPending || getCodeAction.isPending}
                        >
                            {tCommon('dialog.cancelBtnText')}
                        </Button>
                        <Button type="submit" className="flex-1 h-10 min-w-20" loading={bindAction.isPending}>
                            {tCommon('dialog.confirmBtnText')}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};
