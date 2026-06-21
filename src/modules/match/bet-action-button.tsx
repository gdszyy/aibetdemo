'use client';

import { useTranslations } from 'next-intl';
import type { ButtonHTMLAttributes, FC, MouseEvent, ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { CartStatus } from '@/api/models/cart';
import { LineStatus } from '@/api/models/market';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import {
    useAllSelections,
    useBetSlipStore,
    useCartStatus,
    useIsSelectedByEntity,
} from '@/modules/bet-slip/stores/bet-slip-store';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { executeBetClick } from '@/modules/match/_hooks/bet-actions';
import { isOutcomeLocked } from '@/modules/match/_utils/match-utils';

/** 公开下注按钮属性，供其他业务模块复用现有购物车逻辑。 */
export interface BetActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> {
    /** 加入购物车所需的完整赔率实体。 */
    oddsEntity: OddsEntity;
    /** 按钮内容，也可根据选中和锁定状态渲染。 */
    children: ReactNode | ((state: { isLocked: boolean; selected: boolean }) => ReactNode);
}

/** 复用比赛模块下注逻辑的公开按钮。 */
export const BetActionButton: FC<BetActionButtonProps> = ({ oddsEntity, children, disabled, ...buttonProps }) => {
    const selected = useIsSelectedByEntity(oddsEntity);
    const toggle = useBetSlipStore((state) => state.toggle);
    const selections = useAllSelections();
    const betMode = useBetCartStore((state) => state.betMode);
    const cartStatus = useCartStatus();
    const t = useTranslations('betSlip');
    const isLocked = useMemo(
        () => isOutcomeLocked(oddsEntity.lineStatus ?? LineStatus.Active, oddsEntity.outcome.active),
        [oddsEntity.lineStatus, oddsEntity.outcome.active],
    );

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>): void => {
            executeBetClick({
                oddsEntity,
                selections,
                betMode,
                cartStatus: cartStatus ?? CartStatus.Normal,
                toggle,
                t,
                triggerEl: event.currentTarget,
            });
        },
        [oddsEntity, selections, betMode, cartStatus, toggle, t],
    );

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled || isLocked}
            data-selected={selected}
            {...buttonProps}
        >
            {typeof children === 'function' ? children({ isLocked, selected }) : children}
        </button>
    );
};
