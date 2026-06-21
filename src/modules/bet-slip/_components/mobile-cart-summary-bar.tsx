'use client';

import { useLocalStorageState } from 'ahooks';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useMemo } from 'react';
import { BetType } from '@/api/models/cart';
import { DoubleArrowUpThinOutlined } from '@/components/icons2/DoubleArrowUpThinOutlined';
import { SlipOutlined } from '@/components/icons2/SlipOutlined';
import { useSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useParlayBoostRule } from '@/hooks/use-parlay-boost-rule';
import { getSingleStakeAmount } from '@/modules/bet-slip/_logic/cart-sync';
import { getParlayOddsEligibleSelections, safeMultiply, safeSum } from '@/modules/bet-slip/_utils';
import { getBetSlipSkin } from '@/modules/bet-slip/_utils/slip-skin';
import { STORAGE_KEYS } from '@/modules/bet-slip/cart/_constants';
import {
    useParlayConflicts,
    useParlayNonCompliantSelectionIds,
} from '@/modules/bet-slip/cart/_hooks/use-parlay-selection-map';
import { SelectionBadge } from '@/modules/bet-slip/slip/selection-badge';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import { useBetSlipStore } from '@/modules/bet-slip/stores/bet-slip-store';
import { useIsUnauthenticated } from '@/stores/session-store';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { formatOddsByFormat } from '@/utils/odds-format';
import {
    getParlayBoostDisplayOdds,
    getParlayBoostPayoutPreview,
    getParlayBoostPreview,
} from '@/utils/parlay-boost-preview';

/** 摘要条金额格式：两位小数截断，与投注单票据金额展示一致。 */
const SUMMARY_CURRENCY_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    roundingMode: 'trunc',
};

const MOBILE_SUMMARY_COPY = {
    selections: 'Selecciones',
    setStake: 'Establecer',
    placeBet: 'Realizar Apuesta',
} as const;

/** 移动端常驻购物车摘要条属性。 */
export interface MobileCartSummaryBarProps {
    /** 自定义类名。 */
    className?: string;
}

/**
 * 移动端常驻购物车摘要条。
 *
 * 只展示移动端赛事页底部的红色摘要条：
 * - 左侧购物车图标 + 数量徽标
 * - 中间三列汇总信息
 * - 点击后打开投注单抽屉
 */
export const MobileCartSummaryBar: FC<MobileCartSummaryBarProps> = ({ className }) => {
    const t = useTranslations('betSlip');
    const schemeMeta = useSchemeMeta();
    const slipSkin = getBetSlipSkin(schemeMeta);
    const openBetSlipDrawer = useUIStore((state) => state.openBetSlipDrawer);
    const isUnauthenticated = useIsUnauthenticated();
    const selections = useBetSlipStore((state) => state.selections);
    const betMode = useBetCartStore((state) => state.betMode);
    const conflictedSelectionIds = useParlayConflicts();
    const nonCompliantSelectionIds = useParlayNonCompliantSelectionIds();
    const oddsFormat = useOddsFormat();
    const { formatCurrency, formatNumber } = useIntlFormatter();
    const [singleStakeMap = {}] = useLocalStorageState<Record<string, number>>(STORAGE_KEYS.SINGLE_STAKES, {
        defaultValue: {},
        listenStorageChange: true,
    });
    const [parlayStake = 0] = useLocalStorageState<number>(STORAGE_KEYS.PARLAY_STAKE, {
        defaultValue: 0,
        listenStorageChange: true,
    });
    const { data: parlayBoostRule = null } = useParlayBoostRule();

    const selectionCount = selections.length;
    const singleStake = safeSum(...selections.map((selection) => getSingleStakeAmount(singleStakeMap, selection)));
    const singlePotentialWin = safeSum(
        ...selections.map((selection) => {
            const stake = getSingleStakeAmount(singleStakeMap, selection);
            return safeMultiply(stake, selection.outcome.odds);
        }),
    );
    const totalStake = betMode === BetType.Single ? singleStake : parlayStake;
    const parlayOddsSelections = useMemo(
        () => getParlayOddsEligibleSelections(selections, conflictedSelectionIds, nonCompliantSelectionIds),
        [conflictedSelectionIds, nonCompliantSelectionIds, selections],
    );
    const parlayBoostPreview = useMemo(
        () => getParlayBoostPreview(parlayOddsSelections, parlayBoostRule),
        [parlayBoostRule, parlayOddsSelections],
    );
    const parlayDisplayOdds = useMemo(
        () => getParlayBoostDisplayOdds(parlayStake, parlayOddsSelections, parlayBoostPreview, parlayBoostRule),
        [parlayBoostPreview, parlayBoostRule, parlayOddsSelections, parlayStake],
    );
    const parlayBasePayout = safeMultiply(parlayStake, parlayDisplayOdds.parlayOdds);
    const parlayPayoutPreview = useMemo(
        () => getParlayBoostPayoutPreview(parlayBasePayout, parlayBoostPreview, parlayBoostRule),
        [parlayBasePayout, parlayBoostPreview, parlayBoostRule],
    );
    const totalPotentialWin = betMode === BetType.Single ? singlePotentialWin : parlayPayoutPreview.finalPayout;
    const displayOdds =
        betMode === BetType.Single && totalStake > 0
            ? totalPotentialWin / totalStake
            : betMode === BetType.Parlay
              ? parlayDisplayOdds.effectiveTotalOdds
              : 0;
    const formattedStake = formatCurrency(totalStake, SUMMARY_CURRENCY_FORMAT_OPTIONS);
    const formattedPotentialWin = formatCurrency(totalPotentialWin, SUMMARY_CURRENCY_FORMAT_OPTIONS);

    return (
        <button
            type="button"
            onClick={openBetSlipDrawer}
            className={cn(
                'group/mobile-dock fixed left-0 right-0 z-40',
                isUnauthenticated
                    ? 'bottom-[calc(var(--bottom-bar-safe-height)+var(--mobile-auth-action-bar-height))]'
                    : 'bottom-[var(--bottom-bar-safe-height)]',
                'flex h-(--mobile-cart-summary-bar-height) w-full items-center gap-2 rounded-t-[var(--mobile-summary-bar-radius)] border-t border-[color:var(--mobile-summary-bar-border)] px-2.5 py-2 text-neutral-white-h',
                'border-[color:var(--slip-summary-border,var(--mobile-summary-bar-border))]',
                '[background:var(--slip-dock-bg,var(--dock-bar-bg))] [box-shadow:var(--slip-summary-shadow,var(--mobile-summary-bar-shadow))]',
                'transition-[background,opacity] duration-200 hover:[background:var(--slip-dock-hover-bg,var(--dock-bar-hover-bg))] active:[opacity:var(--mobile-touch-active-opacity)]',
                'md:hidden',
                className,
            )}
            style={slipSkin.style}
        >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[var(--slip-dock-icon-bg,var(--mobile-dock-icon-bg))] text-[var(--mobile-dock-icon-text)]">
                <SlipOutlined className="size-5" />
                <span className="-right-1 -top-1 absolute" data-energy-ball-target="mobile-betslip-badge">
                    <SelectionBadge
                        count={selectionCount}
                        className="h-4 min-w-4 rounded-full bg-accent-warm px-1 text-auxiliary-xxs font-bold leading-4 text-surface-shell"
                    />
                </span>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className="flex min-w-[70px] flex-col items-start">
                    <span className="text-auxiliary-2xs font-medium text-neutral-white-h/72">
                        {selectionCount} {MOBILE_SUMMARY_COPY.selections}
                    </span>
                    <span className="text-body-md font-bold leading-5 text-neutral-white-h">
                        {t('summary.odds')} {displayOdds > 0 ? formatOddsByFormat(displayOdds, oddsFormat) : '0.00'}
                    </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start border-neutral-white-h/12 border-l pl-2">
                    <span className="text-auxiliary-2xs text-neutral-white-h/68">{t('summary.stake')}</span>
                    <span
                        className="max-w-full truncate text-body-md font-bold leading-5 text-neutral-white-h"
                        title={formatNumber(totalStake)}
                    >
                        {formattedStake}
                    </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start">
                    <span className="text-auxiliary-2xs text-neutral-white-h/68">{t('summary.potentialWin')}</span>
                    <span
                        className="max-w-full truncate text-body-md font-bold leading-5 text-accent-warm"
                        title={formatNumber(totalPotentialWin)}
                    >
                        {formattedPotentialWin}
                    </span>
                </div>
            </div>
            {/* 上拉提示：示意点击摘要条可拉起投注单抽屉（对齐 betbus 移动 dock） */}
            <div className="flex h-10 shrink-0 items-center gap-1 rounded-sm bg-[var(--slip-dock-action-bg,var(--mobile-dock-action-bg))] px-2.5 text-body-sm font-bold text-[var(--slip-cta-text,var(--on-brand))] transition-colors group-hover/mobile-dock:bg-[var(--slip-dock-action-hover-bg,var(--mobile-dock-action-hover-bg))]">
                <span className="max-w-[72px] truncate">
                    {totalStake > 0 ? MOBILE_SUMMARY_COPY.placeBet : MOBILE_SUMMARY_COPY.setStake}
                </span>
                <DoubleArrowUpThinOutlined className="size-3.5 shrink-0 text-[var(--slip-cta-text,var(--on-brand))]" />
            </div>
        </button>
    );
};
