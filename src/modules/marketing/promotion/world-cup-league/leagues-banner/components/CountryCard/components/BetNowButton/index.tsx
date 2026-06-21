import type { FC } from 'react';
import { BetActionButton, type OddsEntity } from '@/modules/match';
import { cn } from '@/utils/common';
import { GOLD_BUTTON_BACKGROUND } from '../../constants';

/** 金色投注按钮属性。 */
interface BetNowButtonProps {
    /** 加入购物车所需的赔率实体。 */
    oddsEntity: OddsEntity;
    /** 按钮展示文案。 */
    label: string;
    /** 按钮附加样式。 */
    className?: string;
}

/** PC 冠军盘使用的金色渐变投注按钮。 */
export const BetNowButton: FC<BetNowButtonProps> = ({ oddsEntity, label, className }) => {
    return (
        <BetActionButton
            oddsEntity={oddsEntity}
            className={cn('cursor-pointer rounded-sm border border-transparent text-neutral-black-h', className)}
            style={{ background: GOLD_BUTTON_BACKGROUND }}
        >
            {label}
        </BetActionButton>
    );
};
