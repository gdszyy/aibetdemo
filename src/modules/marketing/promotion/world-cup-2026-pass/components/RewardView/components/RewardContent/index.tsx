import Image from 'next/image';
import type { FC } from 'react';
import { useAmount } from '../../../../../_utils/useAmount';
import type { WorldCupPassRewardWithCoupon } from '../../../../constants';
import { useRewardTypeLabels } from '../../../../hooks/useRewardTypeLabels';

interface RewardContentProps {
    reward: WorldCupPassRewardWithCoupon;
    gearSrc: string;
    gearAlt: string;
}

/** 世界杯通行证奖励内容，金额按当前钱包币种格式化展示。 */
export const RewardContent: FC<RewardContentProps> = ({ reward, gearSrc, gearAlt }) => {
    const { getRewardTypeLabel } = useRewardTypeLabels();
    const formatAmount = useAmount();

    return (
        <div className="h-9.5 pb-1.5 flex flex-col items-center font-poppins text-[10px] italic font-semibold leading-4 text-inherit">
            <div className="h-4 gap-0.5 flex">
                <Image src={gearSrc} alt={gearAlt} width={16} height={16} />
                <span className="text-[12px]">{formatAmount(Number(reward.amount))}</span>
            </div>
            <div className="h-4 text-center">
                {getRewardTypeLabel(reward.coupon.type)}
                {reward.count > 1 && (
                    <>
                        {'*'}
                        <span className="text-[12px]">{reward.count}</span>
                    </>
                )}
            </div>
        </div>
    );
};
