import type { FC } from 'react';
import type { VipLevelInfo, VipTierInfo } from '@/api/models/vip';
import { tierIconMap } from '../../services/useVipStaticConfGetter';
import { MobileDetailCard } from './mobile-detail-card';

interface MobileDetailContentProps {
    currentLevelNo: number | null;
    levels: VipLevelInfo[];
    tiers: VipTierInfo[];
}

const getTierIconIndex = (levelNo: number, tiers: VipTierInfo[]) => {
    const tierIndex = tiers.findIndex((tier) => levelNo >= tier.minLevel && levelNo <= tier.maxLevel);
    return tierIndex >= 0 ? tierIndex + 1 : 1;
};

export const MobileDetailContent: FC<MobileDetailContentProps> = ({ currentLevelNo, levels, tiers }) => {
    const sortedLevels = [...levels].sort((previous, next) => previous.levelNo - next.levelNo);
    const currentLevel = sortedLevels.find((level) => level.levelNo === currentLevelNo) ?? null;
    const remainingLevels = currentLevel
        ? sortedLevels.filter((level) => level.levelNo !== currentLevel.levelNo)
        : sortedLevels;

    return (
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto bg-filltext-ft-a p-2 pt-3">
            {currentLevel ? (
                <div className="mb-3">
                    <MobileDetailCard
                        current
                        fullWidth
                        level={currentLevel}
                        tierIcon={tierIconMap[getTierIconIndex(currentLevel.levelNo, tiers)]}
                    />
                </div>
            ) : null}

            <div className="flex gap-3 overflow-x-auto pb-3">
                {remainingLevels.map((level) => (
                    <MobileDetailCard
                        key={level.levelNo}
                        current={false}
                        level={level}
                        tierIcon={tierIconMap[getTierIconIndex(level.levelNo, tiers)]}
                    />
                ))}
            </div>
        </div>
    );
};
