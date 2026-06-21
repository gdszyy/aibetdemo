'use client';

import { useTranslations } from 'next-intl';
import type { FC, MouseEvent } from 'react';
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
import { BetBtnShortBase } from './bet-btn-short-base';

export interface BetBtnShortProps {
    oddsEntity: OddsEntity;
    className?: string;
}

/**
 * Logic wrapper for Short (Square) Bet Button
 */
export const BetBtnShort: FC<BetBtnShortProps> = ({ oddsEntity, className }) => {
    const selected = useIsSelectedByEntity(oddsEntity);
    const toggle = useBetSlipStore((state) => state.toggle);
    const selections = useAllSelections();
    const betMode = useBetCartStore((state) => state.betMode);
    const cartStatus = useCartStatus();
    const t = useTranslations('betSlip');

    const isLocked = useMemo(() => {
        return isOutcomeLocked(oddsEntity.lineStatus ?? LineStatus.Active, oddsEntity.outcome.active);
    }, [oddsEntity.lineStatus, oddsEntity.outcome.active]);

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
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
        <BetBtnShortBase
            outcome={oddsEntity.outcome}
            isLocked={isLocked}
            selected={selected}
            onClick={handleClick}
            className={className}
        />
    );
};
