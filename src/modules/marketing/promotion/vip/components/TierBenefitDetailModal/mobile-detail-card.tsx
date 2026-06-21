import Image, { type StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { VipLevelInfo } from '@/api/models/vip';
import { cn } from '@/utils/common';
import { MobileDetailItem } from './mobile-detail-item';

interface MobileDetailCardProps {
    current: boolean;
    fullWidth?: boolean;
    level: VipLevelInfo;
    tierIcon: StaticImageData;
}

const formatBenefitValue = (value: string) => {
    const normalizedValue = value?.trim();
    return normalizedValue && normalizedValue !== '0' && normalizedValue !== '0%' ? normalizedValue : '-';
};

export const MobileDetailCard: FC<MobileDetailCardProps> = ({ current, fullWidth = false, level, tierIcon }) => {
    const t = useTranslations('vip');

    const items = [
        {
            label: t('tierBenefits.detailedValues.requiredXp'),
            value: level.levelExp,
            type: 'number' as const,
            className: '',
        },
        {
            label: t('tierBenefits.detailedValues.maintenanceXp'),
            value: level.maintenanceExp,
            type: 'number' as const,
        },
        {
            label: t('tierBenefits.sportCashback'),
            value: formatBenefitValue(level.sportCashback),
        },
        {
            label: t('tierBenefits.casinoCashback'),
            value: formatBenefitValue(level.casinoCashback),
        },
        {
            label: t('tierBenefits.levelUpBonus'),
            value: formatBenefitValue(level.levelUpBonus),
            type: 'currency' as const,
        },
        {
            label: t('tierBenefits.weeklyBonus'),
            value: formatBenefitValue(level.weeklyBonus),
            type: 'currency' as const,
        },
    ];

    return (
        <article
            className={cn(
                'shrink-0 overflow-hidden rounded-sm bg-surface-1 shadow-[0_1px_4px_rgba(46,46,46,0.16)]',
                fullWidth ? 'w-full' : 'w-55',
            )}
        >
            <header className="flex h-8 items-center justify-between bg-filltext-ft-h px-3">
                <div className="flex min-w-0 items-center gap-1.5">
                    <Image src={tierIcon} alt="" aria-hidden="true" width={16} height={16} />
                    <span className="truncate text-body-md text-neutral-white-h">{level.levelName}</span>
                </div>

                {current ? (
                    <span className="rounded-xs bg-filltext-ft-f px-2 py-0.5 text-auxiliary-sm text-neutral-white-h">
                        {t('tierBenefits.detailedValues.current')}
                    </span>
                ) : null}
            </header>

            <div className="flex flex-col px-4 py-3">
                {items.map((item, index) => (
                    <MobileDetailItem
                        key={item.label}
                        divider={index === 1}
                        label={item.label}
                        type={item.type}
                        value={item.value}
                    />
                ))}
            </div>
        </article>
    );
};
