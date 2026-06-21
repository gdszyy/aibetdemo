'use client';

import { useTranslations } from 'next-intl';
import { type FC, useEffect, useState } from 'react';
import { GetKycEnabledInterface, GetWebKycUrl } from '@/api/handlers/user-kyc';
import type { ErrorReject } from '@/api/lib/types';
import { UserKycStatus } from '@/api/models/user';
import { Toast } from '@/components/toast';
import { useSessionStore, useUser } from '@/stores/session-store';
import { KYCForm } from './kyc-form';
import { KYCStepChip } from './kyc-step-chip';
import { KYCVerifyResult } from './kyc-verify-result';

enum KYCStep {
    UNDEFINED = 0,
    FORM,
    VERIFY,
    THIRD,
}

/**
 * KYC Verification Component
 * Handles the KYC verification flow including form submission and result display
 */
export const KYCVerify: FC = () => {
    const [step, setStep] = useState<KYCStep>(KYCStep.FORM);
    const t = useTranslations('user');
    const [kycConfigEnabled, setKycConfigEnabled] = useState<boolean>(false);
    const [kycConfigLoading, setKycConfigLoading] = useState<boolean>(true);
    const updateSession = useSessionStore((state) => state.update);

    const user = useUser();

    // Derive currentStep and verifyResultStatus from step and user status
    const currentStep = step === KYCStep.VERIFY ? 2 : 1;
    const verifyResultStatus = user?.kyc_status || UserKycStatus.Unverified;

    const handleStartKYC = () => {
        if (kycConfigLoading) {
            return;
        }

        if (kycConfigEnabled) {
            GetWebKycUrl()
                .then((data) => {
                    window.location.href = data.kyc_url;
                })
                .catch((error: ErrorReject) => {
                    Toast.error(error?.message, { id: 'kyc-submit' });
                });
        } else {
            updateSession()
                .then(() => {
                    Toast.success(t('kyc.thirdSuccess'), { id: 'kyc-submit' });
                })
                .catch((error: ErrorReject) => {
                    Toast.error(error?.message, { id: 'kyc-submit' });
                });
        }
    };

    useEffect(() => {
        setKycConfigLoading(true);
        GetKycEnabledInterface()
            .then((res) => {
                setKycConfigEnabled(res.kyc_enabled);
            })
            .catch((error: ErrorReject) => {
                setKycConfigEnabled(false);
                // silent failed
                throw new Error(error?.message || 'kyc configLoadError');
            })
            .finally(() => {
                setKycConfigLoading(false);
            });
    }, []);

    useEffect(() => {
        if (user?.kyc_status === UserKycStatus.Pending || user?.kyc_status === UserKycStatus.Success) {
            setStep(KYCStep.VERIFY);
        }
    }, [user?.kyc_status]);

    return (
        <div className="account-card w-full flex flex-col gap-y-4 h-full">
            {/* Title */}
            <section className="flex flex-col gap-0.5">
                <p className="text-title-sm">{t('kyc.title')}</p>
                <p className="text-auxiliary-sm text-brand-red py-1">{t('kyc.kycRequired')}</p>
            </section>
            <KYCStepChip currentStep={currentStep} className="min-h-fit" />
            {/* Content */}
            {step === KYCStep.FORM && <KYCForm onNext={handleStartKYC} />}
            {step === KYCStep.VERIFY && <KYCVerifyResult status={verifyResultStatus} />}
        </div>
    );
};
