import Image, { type StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { VipTierRewards } from '@/api/models/vip';
import tierIcon1 from '../../../../assets/tier-1.png';
import tierIcon2 from '../../../../assets/tier-2.png';
import tierIcon3 from '../../../../assets/tier-3.png';
import tierIcon4 from '../../../../assets/tier-4.png';
import tierIcon5 from '../../../../assets/tier-5.png';
import tierIcon6 from '../../../../assets/tier-6.png';
import tierIcon7 from '../../../../assets/tier-7.png';
import tierIcon8 from '../../../../assets/tier-8.png';
import tierIcon9 from '../../../../assets/tier-9.png';
import tierIcon10 from '../../../../assets/tier-10.png';
import tierIcon11 from '../../../../assets/tier-11.png';
import tierIcon12 from '../../../../assets/tier-12.png';
import tierIcon13 from '../../../../assets/tier-13.png';
import tierIcon14 from '../../../../assets/tier-14.png';

interface HeaderProps {
    iconIndex: number;
    tier: VipTierRewards;
}

const tierIconMap: Record<number, StaticImageData> = {
    1: tierIcon1,
    2: tierIcon2,
    3: tierIcon3,
    4: tierIcon4,
    5: tierIcon5,
    6: tierIcon6,
    7: tierIcon7,
    8: tierIcon8,
    9: tierIcon9,
    10: tierIcon10,
    11: tierIcon11,
    12: tierIcon12,
    13: tierIcon13,
    14: tierIcon14,
};

export const Header: FC<HeaderProps> = ({ iconIndex, tier }) => {
    const t = useTranslations('vip');
    const tierIcon = tierIconMap[iconIndex] ?? tierIcon1;

    return (
        <header className="flex h-14 items-center justify-between bg-filltext-ft-h px-4">
            <div className="flex min-w-0 items-center gap-1">
                <Image src={tierIcon} alt={tier.tierName} width={26} height={26} unoptimized />
                <h3 className="truncate text-auxiliary-md text-neutral-white-h">{tier.tierName}</h3>
                {!tier.open ? (
                    <span className="text-auxiliary-xxs text-filltext-ft-e">{t('tierBenefits.comingSoon')}</span>
                ) : null}
            </div>

            <span className="shrink-0 rounded-xs bg-filltext-ft-g px-1 py-0.5 text-auxiliary-md text-neutral-white-h">
                {tier.tierDesc}
            </span>
        </header>
    );
};
