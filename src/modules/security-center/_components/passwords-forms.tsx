'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from 'ahooks';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';
import { BtnWithCountdown, type BtnWithCountdownRef } from '@/components/btn-with-countdown/btn-with-countdown';
import { Button } from '@/components/button/button';
import { FormInput } from '@/components/form-input/form-input';
import { FormPassword } from '@/components/form-password/form-password';
import { PasswordSetupMode, PasswordType } from '@/constants/security';
import { pwdVerify } from '@/utils/verifies';
import { NewPasswordInput } from './new-password-input/new-password-input';
// Re-export from shared location for backwards compatibility within this module
export { PasswordType, PasswordSetupMode };

interface PasswordFormProps {
    type: PasswordType;
    mode: PasswordSetupMode;
    onSubmit: (data: { newPwd: string; oldPwd?: string; otp?: string }) => Promise<void>;
    onGetCode?: () => Promise<void>;
}

/**
 * New/old password and verification code form component
 */
export const PasswordsForms: FC<PasswordFormProps> = ({ type, mode, onSubmit, onGetCode }) => {
    const t = useTranslations('user');
    const locale = useMemo(
        () => ({
            newPwd: t('securityCenter.newPwdTitle'),
            newPwdPlaceholder: t('securityCenter.newPwdPlaceholder'),
            oldPwd: t('securityCenter.oldPwdTitle'),
            oldPwdPlaceholder: t('securityCenter.oldPwdPlaceholder'),
            otp: t('securityCenter.otp'),
            otpPlaceholder: t('securityCenter.otpPlaceholder'),
            getCode: t('securityCenter.getCodeText'),
            button: t('securityCenter.buttonText'),
            pwdVerifyError: t('securityCenter.pwdVerifyError'),
            otpError: t('securityCenter.otpError'),
        }),
        [t],
    );
    const defaultValues = useMemo(
        () => (mode === PasswordSetupMode.First ? { newPwd: '', otp: '' } : { newPwd: '', oldPwd: '' }),
        [mode],
    );
    const countdownRef = useRef<BtnWithCountdownRef | null>(null);

    // Dynamically create schema based on mode
    const createPasswordSchema = () => {
        const baseSchema = z.object({
            newPwd: z.string(),
        });

        if (mode === PasswordSetupMode.First) {
            return baseSchema.extend({
                otp: z.string().min(6, locale.otpError).max(8, locale.otpError),
            });
        }

        return baseSchema.extend({
            oldPwd: z
                .string()
                .nonempty(locale.pwdVerifyError)
                .refine((val) => pwdVerify(val).result, {
                    message: locale.pwdVerifyError,
                }),
        });
    };

    const PasswordFormSchema = createPasswordSchema();
    type FormValues = z.infer<typeof PasswordFormSchema>;

    const formMethods = useForm<FormValues>({
        resolver: zodResolver(PasswordFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues,
    });

    const handleFormSubmit = async (data: FormValues): Promise<void> => {
        // Manually trigger validation for all fields
        const isNewPwdValid = pwdVerify(data.newPwd).result; //await formMethods.trigger('newPwd');

        let isOtherFieldValid = true;
        if (mode === PasswordSetupMode.First) {
            isOtherFieldValid = await formMethods.trigger('otp');
        } else {
            isOtherFieldValid = await formMethods.trigger('oldPwd');
        }

        // Prevent submission if validation fails
        if (!isNewPwdValid || !isOtherFieldValid) {
            return;
        }

        await onSubmit(data);
        formMethods.reset();
    };

    const [codePendding, codePenddingAction] = useBoolean(false);

    const handleGetCode = async (): Promise<void> => {
        // Validate new password field first
        const isNewPwdValid = pwdVerify(formMethods.getValues('newPwd')).result; //await formMethods.trigger('newPwd');
        if (!isNewPwdValid) return;

        codePenddingAction.setTrue();
        onGetCode?.()
            .finally(() => {
                codePenddingAction.setFalse();
            })
            .then(() => {
                countdownRef.current?.start();
            })
            .catch(() => {
                // 发送失败时由上层统一展示错误提示，这里只阻止倒计时启动。
            });
    };

    return (
        <FormProvider {...formMethods}>
            <form key={formMethods.formState.submitCount} onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
                <div className="w-full flex flex-col gap-4 mt-2">
                    {/* New password input */}
                    <NewPasswordInput label={locale.newPwd} placeholder={locale.newPwdPlaceholder} />
                    {/* Render different input based on mode */}
                    {mode === PasswordSetupMode.First ? (
                        // First-time setup: show OTP input
                        <div className="flex flex-col gap-1 px-4 ">
                            <label className="text-auxiliary-sm" htmlFor={`security-${type}-otp`}>
                                {locale.otp}
                            </label>
                            <FormInput
                                name="otp"
                                fieldProps={{
                                    placeholder: locale.otpPlaceholder,
                                    addonAfter: (
                                        <BtnWithCountdown
                                            ref={countdownRef}
                                            text={locale.getCode}
                                            countdownTime={60}
                                            onClick={handleGetCode}
                                            disabled={codePendding}
                                            className="px-4"
                                        />
                                    ),
                                }}
                            />
                        </div>
                    ) : (
                        // Reset: show old password input
                        <div className="flex flex-col gap-1 px-4  ">
                            <FormPassword
                                label={locale.oldPwd}
                                name="oldPwd"
                                fieldProps={{
                                    placeholder: locale.oldPwdPlaceholder,
                                }}
                            />
                        </div>
                    )}

                    {/* Submit button */}
                    <Button
                        loading={formMethods.formState.isSubmitting}
                        type="submit"
                        className="mt-2"
                        variant="primary"
                        block
                    >
                        {locale.button}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
