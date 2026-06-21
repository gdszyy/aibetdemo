import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { WordCupPassCardRectangle } from '@/components/icons2/WordCupPassCardRectangle';
import { cn } from '@/utils/common';
import Gear from '../../../../assets/gear.svg';
import type { WorldCupPassRewardWithCoupon } from '../../../../constants';
import { getWorldCupPassRewardImage } from '../../../../reward-assets';
import { RewardContent } from '../RewardContent';

interface NormalClaimableRewardCardProps {
    reward: WorldCupPassRewardWithCoupon;
}

/** 免费通行证 - 可领取 */
export const NormalClaimableRewardCard: FC<NormalClaimableRewardCardProps> = ({ reward }) => {
    const t = useTranslations('promotionWorldCupPass');
    const rewardImage = getWorldCupPassRewardImage(reward.coupon.type);

    return (
        <div className="relative w-31 h-38.5 py-4 flex flex-col justify-between items-center border-[0.5px] rounded-md bg-[linear-gradient(180deg,var(--neutral-white-h)_0%,var(--brand-primary-2)_100%)] border-brand-primary-0">
            <div className="p-2 w-18.75 h-18.75 rounded-md border-[0.5px] bg-[radial-gradient(62.5%_62.5%_at_50%_50%,var(--neutral-white-h)_0%,var(--filltext-ft-d)_100%)] border-brand-primary-3">
                <div
                    className="relative rounded-sm w-full h-full shadow-[0_0_4px_0_var(--brand-primary-3)]"
                    style={{
                        backgroundImage: `url(${rewardImage.src})`,
                        backgroundColor: 'lightgray',
                        backgroundPosition: '50%',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            </div>
            <div className="text-filltext-ft-h">
                <RewardContent reward={reward} gearSrc={Gear.src} gearAlt={t('rewardCard.gear')} />
            </div>
            <div className="absolute bottom-0">
                <WordCupPassCardRectangle className="w-22.5 h-4 text-brand-primary-0" />
                <div
                    className={cn(
                        'w-full h-full absolute bottom-0 text-center text-[8px] font-poppins font-bold leading-4 align-middle',
                        'text-neutral-white-h',
                    )}
                >
                    {t('rewardCard.claimable')}
                </div>
            </div>
        </div>
    );
};
