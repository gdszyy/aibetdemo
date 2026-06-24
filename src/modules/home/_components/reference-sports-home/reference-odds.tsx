'use client';

import { useTranslations } from 'next-intl';
import {
    type ButtonHTMLAttributes,
    type FC,
    type MouseEvent,
    type ReactNode,
    useCallback,
} from 'react';
import { CartStatus } from '@/api/models/cart';
import { LineStatus, OutcomeActiveEnum, ProductEnum, ProductRawEnum } from '@/api/models/market';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import {
    useAllSelections,
    useBetSlipStore,
    useCartStatus,
    useIsSelectedByEntity,
} from '@/modules/bet-slip/stores/bet-slip-store';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { executeBetClick } from '@/modules/match/_hooks/bet-actions';
import { cn } from '@/utils/common';
import { isSameLine, isSameSelection } from '@/utils/specifier';

/**
 * 参考首页（含球员盘口、SGP 加成等 mock 板块）共用的「假赔率 → 接入投注单」桥接层。
 * 抽到独立文件是为了让 reference-sports-home/index.tsx 与 player-props 等子板块都能复用 ReferenceOddsButton，
 * 同时避免「首页 import 子板块、子板块 import 首页」造成的循环依赖。
 */

export interface Odd {
    id: string;
    label: string;
    value: string;
}

export interface ReferenceOddsContext {
    categoryId?: string;
    eventId: string;
    isOutright?: boolean;
    marketName: string;
    matchStatus?: number;
    productId?: string;
    productRaw?: string;
    sportId?: string;
    title: string;
    tournamentId?: string;
}

export const REFERENCE_CATEGORY_ID = 'reference-home';
export const REFERENCE_SPORT_ID = 'sr:sport:1';

const getReferenceMarketId = (eventId: string, marketName: string): number => {
    const input = `${eventId}:${marketName}`;
    return (
        700_000 + (Array.from(input).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0) % 90_000)
    );
};

const parseOddValue = (value: string): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

export const createReferenceOddsEntity = (odd: Odd, context: ReferenceOddsContext): OddsEntity => ({
    eventId: context.eventId,
    eventIdType: 'reference',
    matchStatus: context.matchStatus,
    line: '',
    tournamentId: context.tournamentId ?? 'reference-tournament',
    categoryId: context.categoryId ?? REFERENCE_CATEGORY_ID,
    isOutright: context.isOutright,
    title: context.title,
    marketId: getReferenceMarketId(context.eventId, context.marketName),
    marketName: context.marketName,
    productRaw: context.productRaw ?? ProductRawEnum.PreMatch,
    productId: context.productId ?? ProductEnum.PreMatch,
    specifiers: '',
    lineStatus: LineStatus.Active,
    outcome: {
        id: `${context.eventId}:${odd.id}`,
        name: odd.label,
        name_alias: odd.label,
        quick_name: odd.label,
        odds: parseOddValue(odd.value),
        active: OutcomeActiveEnum.Active,
        line: '',
        last_update: 0,
    },
    sportId: context.sportId ?? REFERENCE_SPORT_ID,
    timestamp: 0,
});

export const toggleReferenceSelection = (selections: OddsEntity[], oddsEntity: OddsEntity): OddsEntity[] => {
    const sameSelectionIndex = selections.findIndex((selection) => isSameSelection(selection, oddsEntity));

    if (sameSelectionIndex !== -1) {
        return selections.filter((_, index) => index !== sameSelectionIndex);
    }

    const sameLineIndex = selections.findIndex((selection) => isSameLine(selection, oddsEntity));

    if (sameLineIndex !== -1) {
        return [oddsEntity, ...selections.filter((selection) => !isSameLine(selection, oddsEntity))];
    }

    return [oddsEntity, ...selections];
};

export const ReferenceOddsButton: FC<
    {
        children: ReactNode | ((state: { selected: boolean }) => ReactNode);
        className: string;
        oddsEntity: OddsEntity;
        selectedClassName?: string;
    } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'onClick' | 'type'>
> = ({ children, className, oddsEntity, selectedClassName, ...buttonProps }) => {
    const t = useTranslations('betSlip');
    const selected = useIsSelectedByEntity(oddsEntity);
    const selections = useAllSelections();
    const setSelections = useBetSlipStore((state) => state.setSelections);
    const betMode = useBetCartStore((state) => state.betMode);
    const cartStatus = useCartStatus();

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>): void => {
            executeBetClick({
                oddsEntity,
                selections,
                betMode,
                cartStatus: cartStatus ?? CartStatus.Normal,
                toggle: (entity) => {
                    setSelections(toggleReferenceSelection(selections, entity), { pendingSync: false });
                },
                t,
                triggerEl: event.currentTarget,
            });
        },
        [betMode, cartStatus, oddsEntity, selections, setSelections, t],
    );

    return (
        <button
            {...buttonProps}
            type="button"
            className={cn(className, selected && selectedClassName)}
            data-reference-bet-slip="local"
            data-selected={selected}
            onClick={handleClick}
        >
            {typeof children === 'function' ? children({ selected }) : children}
        </button>
    );
};
