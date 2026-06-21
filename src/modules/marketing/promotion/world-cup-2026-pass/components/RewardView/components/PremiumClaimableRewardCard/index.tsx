import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { WordCupPassCardRectangle } from '@/components/icons2/WordCupPassCardRectangle';
import { cn } from '@/utils/common';
import HighLevelGear from '../../../../assets/high-level-gear.svg';
import type { WorldCupPassRewardWithCoupon } from '../../../../constants';
import { getWorldCupPassRewardImage } from '../../../../reward-assets';
import { RewardContent } from '../RewardContent';

interface PremiumClaimableRewardCardProps {
    reward: WorldCupPassRewardWithCoupon;
}

/** 高级通行证 - 可领取 */
export const PremiumClaimableRewardCard: FC<PremiumClaimableRewardCardProps> = ({ reward }) => {
    const t = useTranslations('promotionWorldCupPass');
    const rewardImage = getWorldCupPassRewardImage(reward.coupon.type);

    return (
        <div className="relative w-31 h-38.5 py-4 flex flex-col justify-between items-center border-[0.5px] rounded-md bg-[radial-gradient(79.87%_79.87%_at_50%_-40.94%,#00FFB0_0%,rgba(21,34,40,0)_100%),linear-gradient(180deg,#1A3634_0%,#152228_100%)] border-[#66FDCE]">
            <div className="p-2 w-18.75 h-18.75 rounded-md border-[0.5px] bg-[radial-gradient(62.5%_62.5%_at_50%_50%,#00533D_0%,#06100F_100%)] border-[#027E66]">
                <div
                    className="relative rounded-sm w-full h-full shadow-[0_0_4px_0_#66FDCE]"
                    style={{
                        backgroundImage: `url(${rewardImage.src})`,
                        backgroundColor: 'lightgray',
                        backgroundPosition: '50%',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            </div>
            <div className="text-neutral-white-h">
                <RewardContent reward={reward} gearSrc={HighLevelGear.src} gearAlt={t('rewardCard.premiumGear')} />
            </div>
            <div className="absolute bottom-0">
                <WordCupPassCardRectangle className="w-22.5 h-4 text-[#66FDCE]" />
                <div
                    className={cn(
                        'w-full h-full absolute bottom-0 text-center text-[8px] font-poppins font-bold leading-4 align-middle',
                        'text-filltext-ft-h',
                    )}
                >
                    {t('rewardCard.claimable')}
                </div>
            </div>
        </div>
    );
};
