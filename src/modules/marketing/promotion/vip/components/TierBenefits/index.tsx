'use client';

import { useTranslations } from 'next-intl';
import { useVipBaseInfoStore } from '../../services/store';
import { SectionHeader } from '../SectionHeader';
import { TierBenefitCard } from '../TierBenefitCard';

/**
 * 等级权益区块，展示 VIP 段位与各等级权益。
 */
export const TierBenefits = () => {
    const t = useTranslations('vip');
    const tierRewards = useVipBaseInfoStore((state) => state.tierRewards);
    const currentTierName = useVipBaseInfoStore((state) => state.userVipInfo?.tier);
    const isLoading = useVipBaseInfoStore((state) => state.tierRewardsLoading);
    const isInitialized = useVipBaseInfoStore((state) => state.tierRewardsInitialized);
    const error = useVipBaseInfoStore((state) => state.tierRewardsError);

    const hasTierRewards = tierRewards.length > 0;
    const isCurrentTier = (tier: (typeof tierRewards)[number]): boolean => {
        return currentTierName !== undefined && tier.tierName === currentTierName;
    };

    return (
        <section id="vip-tier-benefits" className="w-full px-2">
            <SectionHeader className=" md:px-0" />

            <div className="mt-10">
                {isLoading && !hasTierRewards ? (
                    <div className="rounded-md border border-filltext-ft-c bg-surface-1 p-6 text-center text-body-md text-filltext-ft-f">
                        {t('tierBenefits.loading')}
                    </div>
                ) : null}

                {error ? (
                    <div className="rounded-md border border-func-lost/30 bg-surface-1 p-6 text-center text-body-md text-func-lost">
                        {t('tierBenefits.error')}
                    </div>
                ) : null}

                {!isLoading && isInitialized && !error && !hasTierRewards ? (
                    <div className="rounded-md border border-filltext-ft-c bg-surface-1 p-6 text-center text-body-md text-filltext-ft-f">
                        {t('tierBenefits.empty')}
                    </div>
                ) : null}

                {hasTierRewards ? (
                    <div className=" overflow-x-auto px-0 pb-2 custom-scrollbar">
                        <div className="flex w-max gap-4">
                            {tierRewards.map((tier, index) => (
                                <TierBenefitCard
                                    key={`${tier.tierName}-${tier.minLevel}-${tier.maxLevel}`}
                                    iconIndex={index + 1}
                                    isCurrentTier={isCurrentTier(tier)}
                                    tier={tier}
                                />
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
};
