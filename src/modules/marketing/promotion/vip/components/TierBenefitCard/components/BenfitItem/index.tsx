import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import StatusIcon01 from './assets/status-icon-01.svg';
import StatusIcon02 from './assets/status-icon-02.svg';
import StatusIcon03 from './assets/status-icon-03.svg';

export type BenefitStatus = 'available' | 'unavailable' | 'comingSoon';

interface BenfitItemProps {
    status: BenefitStatus;
    titleKey: TierBenefitTitleKey;
}

export type TierBenefitTitleKey =
    | 'tierBenefits.sportCashback'
    | 'tierBenefits.casinoCashback'
    | 'tierBenefits.levelUpBonus'
    | 'tierBenefits.weeklyBonus'
    | 'tierBenefits.birthdayBonus'
    | 'tierBenefits.vipSupport'
    | 'tierBenefits.withdrawalBenefits'
    | 'tierBenefits.premiumGiveaways';

const statusIconMap: Record<BenefitStatus, string> = {
    available: StatusIcon01,
    unavailable: StatusIcon02,
    comingSoon: StatusIcon03,
};

export const BenfitItem: FC<BenfitItemProps> = ({ status, titleKey }) => {
    const t = useTranslations('vip');
    const isComingSoon = status === 'comingSoon';

    return (
        <div className="flex items-start gap-2">
            <Image alt="" aria-hidden="true" height={20} src={statusIconMap[status]} width={20} />

            <div className="min-w-0">
                <p className="text-body-lg text-filltext-ft-h">{t(titleKey)}</p>
                {isComingSoon ? (
                    <p className="mt-1 text-auxiliary-xs text-filltext-ft-e">{t('tierBenefits.comingSoon')}</p>
                ) : null}
            </div>
        </div>
    );
};
