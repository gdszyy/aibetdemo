'use client';

import Image, { type StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { UserKycStatus } from '@/api/models/user';
import kycPendingImg from '@/assets/images/kyc-pending.png';
import kycSuccessImg from '@/assets/images/kyc-success.png';

interface KYCVerifyResultProps {
    status: UserKycStatus;
}

type StatusConfig = {
    image: StaticImageData;
    messageKey: 'kyc.kycPending' | 'kyc.kycSuccess';
};

// Static configuration - no need for useMemo
const STATUS_CONFIGS: Record<UserKycStatus, StatusConfig> = {
    [UserKycStatus.Unverified]: {
        image: kycPendingImg,
        messageKey: 'kyc.kycPending',
    },
    [UserKycStatus.Pending]: {
        image: kycPendingImg,
        messageKey: 'kyc.kycPending',
    },
    [UserKycStatus.Success]: {
        image: kycSuccessImg,
        messageKey: 'kyc.kycSuccess',
    },
    [UserKycStatus.Failed]: {
        image: kycPendingImg,
        messageKey: 'kyc.kycPending',
    },
};

/**
 * KYC Verification Result Page
 * Displays the status of KYC verification (pending or success)
 */
export const KYCVerifyResult: FC<KYCVerifyResultProps> = ({ status = UserKycStatus.Pending }) => {
    const t = useTranslations('user');

    const { image, messageKey } = STATUS_CONFIGS[status] || STATUS_CONFIGS[UserKycStatus.Pending];

    return (
        <div className="w-full py-8 h-full gap-y-2 items-center flex flex-col">
            <Image src={image} alt="KYC Status" width={180} height={130} />
            <div className="font-bold w-75 flex justify-center items-center text-center text-filltext-ft-e text-sm leading-4">
                {t(messageKey)}
            </div>
        </div>
    );
};
