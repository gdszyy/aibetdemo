import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { WorldCupPassCouponType } from '@/api/models/world-cup-pass';

interface UseRewardTypeLabelsReturn {
    /** 已翻译的奖励类型文案映射 */
    rewardTypeLabels: Record<WorldCupPassCouponType, string>;
    /** 根据奖励类型获取已翻译文案 */
    getRewardTypeLabel: (type: WorldCupPassCouponType) => string;
}

/** 获取世界杯通行证奖励类型的已翻译文案。 */
export const useRewardTypeLabels = (): UseRewardTypeLabelsReturn => {
    const t = useTranslations('promotionWorldCupPass');

    const rewardTypeLabels = useMemo<Record<WorldCupPassCouponType, string>>(
        () => ({
            [WorldCupPassCouponType.Cash]: t('rewardCard.rewardTypes.cash'),
            [WorldCupPassCouponType.SportBonus]: t('rewardCard.rewardTypes.sportBonus'),
            [WorldCupPassCouponType.FreeSport]: t('rewardCard.rewardTypes.freeSport'),
            [WorldCupPassCouponType.CasinoBonus]: t('rewardCard.rewardTypes.casinoBonus'),
            [WorldCupPassCouponType.FreeSpin]: t('rewardCard.rewardTypes.freeSpin'),
        }),
        [t],
    );

    return {
        rewardTypeLabels,
        getRewardTypeLabel: (type: WorldCupPassCouponType): string => rewardTypeLabels[type],
    };
};
