'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CreateKycInterface } from '@/api/handlers/user-kyc';
import type { ErrorReject } from '@/api/lib/types';
import { Button } from '@/components/button/button';
import { FormCheckbox } from '@/components/form-checkbox/form-checkbox';
import { FormErrorMessage } from '@/components/form-error-message/form-error-message';
import { FormInput } from '@/components/form-input/form-input';
import { Toast } from '@/components/toast';
import { getRegionByCode, verifyIdentityDocument } from '@/i18n';
import { useRegionCode, useRegionConfig } from '@/stores/region-store';
import { useSessionStore } from '@/stores/session-store';
import { createKYCFormSchema, type KYCFormValues } from './_schemas/kyc-form-schema';

export const KYCForm: FC<{ onNext: () => void }> = ({ onNext }) => {
    const t = useTranslations('user');
    const code = useRegionCode();
    const region = getRegionByCode(code);
    const regionConfig = useRegionConfig();
    const sessionData = useSessionStore((state) => state.data);

    // Create schema with localized messages
    const KYCFormSchema = useMemo(
        () =>
            createKYCFormSchema({
                idVerifyError: t('kyc.idError', { label: region?.idLabel }),
                policyNeedHint: t('kyc.policyNeedHint'),
                regionConfig,
            }),
        [t, regionConfig, region?.idLabel],
    );

    const formMethods = useForm<KYCFormValues>({
        resolver: zodResolver(KYCFormSchema),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: {
            idNumber: sessionData?.user.id_number || '',
            privacyPolicyAccepted: false,
            authPolicyAccepted: false,
        },
    });

    // Watch form fields to determine button text and state
    const { idNumber: idValue, privacyPolicyAccepted, authPolicyAccepted } = formMethods.watch();

    // Memoize expensive ID validation
    const isIdValid = useMemo(
        () => idValue && verifyIdentityDocument(idValue, regionConfig) && !formMethods.formState.errors.idNumber,
        [idValue, regionConfig, formMethods.formState.errors.idNumber],
    );

    const isFormReadyToSubmit = isIdValid && privacyPolicyAccepted && authPolicyAccepted;

    const onSubmit = (data: KYCFormValues) => {
        CreateKycInterface({ id_number: data.idNumber })
            .then(() => {
                onNext();
            })
            .catch((error: ErrorReject) => {
                Toast.error(error?.message, { id: 'kyc-form-error' });
            });
    };

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-4">
                    <p className="text-body-lg">{t('kyc.subTitle', { label: region?.idLabel })}</p>
                    <FormInput
                        name="idNumber"
                        fieldProps={{
                            type: 'text',
                            placeholder: t('kyc.inputPlaceholder', { label: region?.idLabel }),
                        }}
                    />
                    <FormCheckbox
                        name="privacyPolicyAccepted"
                        showError={false}
                        className="text-filltext-ft-g"
                        fieldProps={{
                            label: t('kyc.privacyPolicy'),
                        }}
                    />
                    <FormCheckbox
                        fieldProps={{
                            label: t('kyc.authPolicy'),
                        }}
                        name="authPolicyAccepted"
                        className="text-filltext-ft-g"
                        showError={false}
                    />
                    <FormErrorMessage
                        errMsg={
                            formMethods.formState.errors.privacyPolicyAccepted ||
                            formMethods.formState.errors.authPolicyAccepted
                        }
                    />
                </div>

                <Button
                    loading={formMethods.formState.isSubmitting}
                    type="submit"
                    className="mt-4"
                    variant="primary"
                    block
                    disabled={formMethods.formState.isSubmitting}
                >
                    {isFormReadyToSubmit ? t('kyc.startBtnText') : t('kyc.confirm')}
                </Button>
            </form>
        </FormProvider>
    );
};
