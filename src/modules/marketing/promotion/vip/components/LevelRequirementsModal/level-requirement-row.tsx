'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { VipLevelInfo } from '@/api/models/vip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';

interface LevelRequirementRowProps {
    level: VipLevelInfo;
    comingSoon?: boolean;
}

const REQUIREMENT_COMPACT_THRESHOLD = 9999;
const REQUIREMENT_COMPACT_UNIT = 1000;

const formatRequirementValue = (
    value: number,
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string,
) => {
    if (value <= REQUIREMENT_COMPACT_THRESHOLD) {
        return formatNumber(value);
    }

    return `${formatNumber(value / REQUIREMENT_COMPACT_UNIT, { maximumFractionDigits: 1 })}k`;
};

/**
 * VIP 等级需求行。
 */
export const LevelRequirementRow: FC<LevelRequirementRowProps> = ({ level, comingSoon = false }) => {
    const t = useTranslations('vip');
    const { formatNumber } = useIntlFormatter();

    if (comingSoon) {
        return (
            <div className="grid grid-cols-3 items-center border-filltext-ft-c border-t px-4 py-3 text-body-md font-poppins text-filltext-ft-g first:border-t-0 hover:bg-filltext-ft-a">
                <span>{t('levelRequirements.vipLevel', { level: level.levelName })}</span>
                <span className="col-span-2 text-center text-auxiliary-2xs uppercase text-filltext-ft-e">
                    {t('levelRequirements.comingSoon')}
                </span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 items-center border-filltext-ft-c border-t px-4 py-3 text-body-md font-poppins text-filltext-ft-g first:border-t-0 hover:bg-filltext-ft-a">
            <span>{level.levelName || ''}</span>
            <span>{formatRequirementValue(level.levelExp, formatNumber)}</span>
            <span>{formatRequirementValue(level.maintenanceExp, formatNumber)}</span>
        </div>
    );
};
