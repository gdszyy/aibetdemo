'use client';

import { useTranslations } from 'next-intl';
import type { FC, MouseEvent } from 'react';
import { useCallback, useMemo } from 'react';
import { CartStatus } from '@/api/models/cart';
import { LineStatus } from '@/api/models/market';
import { config } from '@/constants/config';
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
import { BetBtnStandardBase } from './bet-btn-standard-base';

export interface BetBtnStandardProps {
    oddsEntity: OddsEntity;
    className?: string;
    size?: 'default' | 'tall';
    useNameAlias?: boolean;
    /** Layout mode forwarded to BetBtnStandardBase */
    layout?: 'horizontal' | 'vertical' | 'auto';
    /** Whether to show the outcome name; forwarded to BetBtnStandardBase */
    showName?: boolean;
    /** 仅用于按钮展示的名称，不改变下注数据。 */
    displayNameOverride?: string;
    surface?: 'default' | 'detail';
}

/**
 * Logic wrapper for Standard (Long horizontal) Bet Button
 */
export const BetBtnStandard: FC<BetBtnStandardProps> = ({
    oddsEntity,
    className,
    size = 'default',
    useNameAlias,
    layout,
    showName,
    displayNameOverride,
    surface,
}) => {
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

    const testDataAttributes =
        surface === 'detail' && config.enableMatchOutcomeTestData
            ? {
                  'data-event-id': oddsEntity.eventId,
                  'data-market-id': oddsEntity.marketId.toString(),
                  'data-outcome-id': oddsEntity.outcome.id,
                  'data-specifiers': oddsEntity.specifiers,
                  'data-outcome-name': oddsEntity.outcome.name,
                  'data-last-update': (oddsEntity.outcome.last_update ?? 0).toString(),
              }
            : undefined;

    return (
        <BetBtnStandardBase
            outcome={oddsEntity.outcome}
            isLocked={isLocked}
            selected={selected}
            onClick={handleClick}
            className={className}
            size={size}
            useNameAlias={useNameAlias}
            layout={layout}
            showName={showName}
            displayNameOverride={displayNameOverride}
            surface={surface}
            testDataAttributes={testDataAttributes}
        />
    );
};
