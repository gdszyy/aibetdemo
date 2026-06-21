import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { WordCupPassCardRectangle } from '@/components/icons2/WordCupPassCardRectangle';
import { cn } from '@/utils/common';
import Gear from '../../../../assets/gear.svg';
import RewardLock from '../../../../assets/reward-lock.png';
import type { WorldCupPassRewardWithCoupon } from '../../../../constants';
import { getWorldCupPassRewardImage } from '../../../../reward-assets';
import { RewardContent } from '../RewardContent';

interface NormalLockedRewardCardProps {
    reward: WorldCupPassRewardWithCoupon;
}

/** 免费通行证 - 未解锁 */
export const NormalLockedRewardCard: FC<NormalLockedRewardCardProps> = ({ reward }) => {
    const t = useTranslations('promotionWorldCupPass');
    const rewardImage = getWorldCupPassRewardImage(reward.coupon.type);

    return (
        <div className="relative w-31 h-38.5 py-4 flex flex-col justify-between items-center border-[0.5px] rounded-md bg-[linear-gradient(180deg,var(--filltext-ft-b)_0%,var(--filltext-ft-b)_100%)] border-filltext-ft-d">
            <div className="p-2 w-18.75 h-18.75 rounded-md border-[0.5px] bg-[radial-gradient(62.5%_62.5%_at_50%_50%,var(--neutral-white-h)_0%,var(--filltext-ft-d)_100%)] border-filltext-ft-b">
                <div
                    className="relative rounded-sm w-full h-full"
                    style={{
                        backgroundImage: `linear-gradient(0deg, rgba(4, 38, 30, 0.60) 0%, rgba(4, 38, 30, 0.60) 100%), url(${rewardImage.src})`,
                        backgroundColor: 'lightgray',
                        backgroundPosition: '50%',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <Image
                        className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        src={RewardLock.src}
                        alt={t('rewardCard.locked')}
                        width={20}
                        height={21}
                    />
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
                        'text-neutral-white-g',
                    )}
                >
                    {t('rewardCard.locked')}
                </div>
            </div>
        </div>
    );
};
