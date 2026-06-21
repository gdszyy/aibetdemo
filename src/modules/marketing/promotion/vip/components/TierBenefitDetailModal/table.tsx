import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { VipLevelInfo } from '@/api/models/vip';
import { DetailRow } from './table-row';

interface DetailTableProps {
    currentLevelNo: number | null;
    levels: VipLevelInfo[];
}

const headerKeys = [
    'tierBenefits.detailedValues.level',
    'tierBenefits.detailedValues.requiredXp',
    'tierBenefits.detailedValues.maintenanceXp',
    'tierBenefits.sportCashback',
    'tierBenefits.casinoCashback',
    'tierBenefits.levelUpBonus',
    'tierBenefits.weeklyBonus',
] as const;

export const DetailTable: FC<DetailTableProps> = ({ currentLevelNo, levels }) => {
    const t = useTranslations('vip');
    const sortedLevels = [...levels].sort((previous, next) => previous.levelNo - next.levelNo);

    return (
        <div className="min-w-245">
            <div className="grid grid-cols-[140px_140px_140px_140px_140px_140px_140px] rounded-sm bg-filltext-ft-c px-6 py-3">
                {headerKeys.map((key) => (
                    <div key={key} className="text-body-lg text-filltext-ft-h">
                        {t(key)}
                    </div>
                ))}
            </div>

            <div className="mt-2 flex flex-col gap-2">
                {sortedLevels.map((level) => (
                    <DetailRow key={level.levelNo} highlighted={currentLevelNo === level.levelNo} level={level} />
                ))}
            </div>
        </div>
    );
};
