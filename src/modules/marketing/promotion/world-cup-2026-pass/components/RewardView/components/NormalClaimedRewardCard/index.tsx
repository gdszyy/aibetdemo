import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { Right } from '@/components/icons2/Right';
import { WordCupPassCardRectangle } from '@/components/icons2/WordCupPassCardRectangle';
import { cn } from '@/utils/common';
import Gear from '../../../../assets/gear.svg';
import type { WorldCupPassRewardWithCoupon } from '../../../../constants';
import { getWorldCupPassRewardImage } from '../../../../reward-assets';
import { RewardContent } from '../RewardContent';

interface NormalClaimedRewardCardProps {
    reward: WorldCupPassRewardWithCoupon;
}

/** 免费通行证 - 已领取 */
export const NormalClaimedRewardCard: FC<NormalClaimedRewardCardProps> = ({ reward }) => {
    const t = useTranslations('promotionWorldCupPass');
    const rewardImage = getWorldCupPassRewardImage(reward.coupon.type);

    return (
        <div className="relative w-31 h-38.5 py-4 flex flex-col justify-between items-center border-[0.5px] rounded-md bg-[linear-gradient(180deg,var(--filltext-ft-b)_0%,var(--filltext-ft-b)_100%)] border-filltext-ft-d">
            <div className="p-2 w-18.75 h-18.75 rounded-md border-[0.5px] bg-[radial-gradient(62.5%_62.5%_at_50%_50%,var(--neutral-white-h)_0%,var(--filltext-ft-d)_100%)] border-filltext-ft-b">
                <div
                    className="flex justify-center items-center rounded-sm w-full h-full"
                    style={{
                        backgroundImage: `linear-gradient(0deg, rgba(4, 38, 30, 0.60) 0%, rgba(4, 38, 30, 0.60) 100%), url(${rewardImage.src})`,
                        backgroundColor: 'lightgray',
                        backgroundPosition: '50%',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <Right />
                </div>
            </div>
            <div className="text-filltext-ft-h">
                <RewardContent reward={reward} gearSrc={Gear.src} gearAlt={t('rewardCard.gear')} />
            </div>
            <div className="absolute bottom-0">
                <WordCupPassCardRectangle className="w-22.5 h-4 text-filltext-ft-d" />
                <div
                    className={cn(
                        'w-full h-full absolute bottom-0 text-center text-[8px] font-poppins font-bold leading-4 align-middle',
                        'text-filltext-ft-f',
                    )}
                >
                    {t('rewardCard.claimed')}
                </div>
            </div>
        </div>
    );
};
