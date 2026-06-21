'use client';

import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { FC, RefObject } from 'react';
import { useState } from 'react';
import { type CreateOrderBody, CreateOrderInterface } from '@/api/handlers/order';
import type { ErrorReject } from '@/api/lib/types';
import { BetType, CartStatus } from '@/api/models/cart';
import { IconButton } from '@/components/icon-button';
import { DoubleArrowRightOutlined } from '@/components/icons2/DoubleArrowRightOutlined';
import { TrashOutlined } from '@/components/icons2/TrashOutlined';
import { Toast } from '@/components/toast';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useKycRequiredToast } from '@/hooks/use-kyc-state';
import { useIsDesktop, useIsMobile } from '@/hooks/use-media-query';
import { useOpenDepositModal } from '@/hooks/use-open-deposit-modal';
import { useParlayBoostRule } from '@/hooks/use-parlay-boost-rule';
import { useCurrencyCode, useWallet } from '@/hooks/use-wallet';
import { getUniqueSelectionId } from '@/modules/bet-slip/_logic/cart-sync';
import {
    generateRemovedToastMessage,
    getBetSlipBalanceSummary,
    getSelectionsToRemove,
} from '@/modules/bet-slip/_utils';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import { useOddsFormat, useSlipSettingsStore } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { DRAWER_SHELL_WIDTH, KYC_REQUIRED_ERROR } from '../_constants/constants';
import { useBetSlipDrawerContext } from '../slip/context';
import { useAllSelections, useBetSlipStore } from '../stores/bet-slip-store';
import { ClearExceptionButton } from './_components/clear-exception-button';
import { CloseSlipIcon } from './_components/close-slip-icon';
import { InsufficientBalanceBanner } from './_components/insufficient-balance-banner';
import { InsufficientBalanceModal } from './_components/insufficient-balance-modal';
import { ModeTooltipTrigger } from './_components/mode-tooltip-trigger';
import { ParlayBoostOddsDisplay } from './_components/parlay-boost-odds-display';
import { ParlayBoostPayoutWarn } from './_components/parlay-boost-payout-warn';
import { ParlayBoostProgress } from './_components/parlay-boost-progress';
import { PlaceBetButton } from './_components/place-bet-button';
import { PlaceBetStatus } from './_constants';
import { useHasException } from './_hooks/use-has-exception';
import { useParlayBoostCartRules } from './_hooks/use-parlay-boost-cart-rules';
import { useParlayConflicts, useParlayNonCompliantSelectionIds } from './_hooks/use-parlay-selection-map';
import { usePlaceBetStatus } from './_hooks/use-place-bet-status';
import { StakeInput } from './stake-input';

export interface ParlayFooterProps {
    stake: number | undefined;
    onStakeChange: (value: number) => void;
    /** Clear exceptions button hover callback */
    onHoverClearExceptions?: (hovering: boolean) => void;
    /** Whether to show top shadow (when content overflows) */
    showShadow?: boolean;
    /** Whether content overflows */
    hasOverflow?: boolean;
    /** 桌面端展开内容测量 ref，供 footer overflow 计算 */
    expandedContentRef?: RefObject<HTMLDivElement | null>;
    /** Custom class name */
    className?: string;
    /** 打开串关加赔规则弹窗（与卡片闪电共用）。 */
    onOpenRules?: () => void;
}

interface InsufficientBalanceModalData {
    /** 当前余额。 */
    currentBalance: number;
    /** 当前订单金额。 */
    orderAmount: number;
    /** 当前差额。 */
    differenceAmount: number;
}

type CreateOrderInsufficientBizData = NonNullable<Awaited<ReturnType<typeof CreateOrderInterface>>>['biz_data'];

/** 把余额不足业务数据转换成弹窗需要的结构。 */
const buildInsufficientBalanceModalData = (
    bizData: CreateOrderInsufficientBizData | undefined,
): InsufficientBalanceModalData => {
    return {
        currentBalance: Number(bizData?.current_balance),
        orderAmount: Number(bizData?.total_amount),
        differenceAmount: Number(bizData?.shortage),
    };
};

type BetSlipBalanceSummary = ReturnType<typeof getBetSlipBalanceSummary>;

const BETBUS_CART_TEXT = {
    placeBet: 'Apostar',
    clearException: 'Eliminar no disponibles',
    betOnAll: 'Apostar en todas',
    single: 'Simple',
    parlay: 'Combinada',
    modeTooltip: 'Elige apuestas simples o combinadas.',
    payout: 'Pago',
    showMoreMultiples: 'Mostrar mas multiplos',
    hideMultiples: 'Ocultar multiplos',
    systemMultiples: 'Multiplos del sistema',
    doubles: 'Dobles',
    triples: 'Triples',
    system: 'Sistema',
    unavailable: 'Pendiente',
} as const;

const getCombinationCount = (items: number, pick: number): number => {
    if (pick > items || pick <= 0) return 0;
    let result = 1;
    for (let index = 1; index <= pick; index++) {
        result = (result * (items - index + 1)) / index;
    }
    return Math.round(result);
};

const SystemMultiplesPanel: FC<{ selectionCount: number; open: boolean; onToggle: () => void }> = ({
    selectionCount,
    open,
    onToggle,
}) => {
    const rows = [
        { label: BETBUS_CART_TEXT.doubles, count: getCombinationCount(selectionCount, 2) },
        { label: BETBUS_CART_TEXT.triples, count: getCombinationCount(selectionCount, 3) },
        { label: BETBUS_CART_TEXT.system, count: selectionCount },
    ].filter((row) => row.count > 0);

    return (
        <div className="flex w-full flex-col overflow-hidden rounded-sm border border-[color:var(--slip-card-border,var(--filltext-ft-c))] bg-[var(--slip-panel-bg,var(--surface-muted))]">
            <button
                type="button"
                onClick={onToggle}
                className="flex h-9 w-full cursor-pointer items-center justify-between px-3 text-left transition-colors hover:bg-[var(--slip-card-bg,var(--filltext-ft-c))]"
            >
                <span className="text-body-sm font-bold text-filltext-ft-h">
                    {open ? BETBUS_CART_TEXT.hideMultiples : BETBUS_CART_TEXT.showMoreMultiples}
                </span>
                <span className="text-body-lg text-[var(--slip-accent,var(--brand-primary-0))]">
                    {open ? '-' : '+'}
                </span>
            </button>
            {open && (
                <div className="border-t border-[color:var(--slip-card-border,var(--filltext-ft-c))] px-3 py-2">
                    <div className="mb-2 text-auxiliary-md font-bold text-filltext-ft-f">
                        {BETBUS_CART_TEXT.systemMultiples}
                    </div>
                    <div className="flex flex-col gap-1">
                        {rows.map((row) => (
                            <div
                                key={row.label}
                                className="flex h-8 items-center justify-between rounded bg-[var(--slip-card-bg,var(--surface-selected))] px-2"
                            >
                                <span className="text-body-sm text-filltext-ft-h">{row.label}</span>
                                <span className="text-auxiliary-md text-filltext-ft-f">
                                    {row.count} / {BETBUS_CART_TEXT.unavailable}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Parlay mode footer toolbar.
 *
 * Interaction logic:
 * - Layout: sticky bottom-0, expands upward when opened
 * - Shadow: fades in via motion when isOverflowing
 * - Always shows full information (always expanded)
 * - Odds and input displayed at the top
 */
export const ParlayFooter: FC<ParlayFooterProps> = ({
    stake = 0,
    onStakeChange,
    onHoverClearExceptions,
    expandedContentRef,
    className,
    onOpenRules,
}) => {
    const t = useTranslations('betSlip');
    const tUser = useTranslations('user');
    const { currencySymbolNarrow, formatCompactAmount, formatNumber } = useIntlFormatter();
    const { openDepositModal } = useOpenDepositModal();
    const clearAll = useBetSlipStore((state) => state.clearAll);
    const remove = useBetSlipStore((state) => state.remove);
    const setBetMode = useBetCartStore((state) => state.setBetMode);
    const setCartStatus = useBetSlipStore((state) => state.setCartStatus);
    const oddsFormat = useOddsFormat();
    const selections = useAllSelections();
    const currencyCode = useCurrencyCode();
    const mainBalance = useWallet((state) => state.mainBalance);
    const sportBonus = useWallet((state) => state.sportBonus);
    const quickBuyAmounts = useSlipSettingsStore((state) => state.quickBuyAmounts);
    const setSettingsOpen = useSlipSettingsStore((state) => state.setSettingsOpen);
    const isDesktop = useIsDesktop();
    const isMobile = useIsMobile();
    const { data: parlayBoostRule = null } = useParlayBoostRule();
    const {
        enabled: parlayBoostEnabled,
        preview: parlayBoostPreview,
        payoutPreview,
        parlayDisplayOdds,
    } = useParlayBoostCartRules(stake);

    const { isHovered: isDrawerHovered } = useBetSlipDrawerContext();
    const [isStakeFocused, setIsStakeFocused] = useState(false);
    const [betOnAllAnimationNonce, setBetOnAllAnimationNonce] = useState(0);
    const [isSystemMultiplesOpen, setIsSystemMultiplesOpen] = useState(false);
    const [insufficientBalanceModalData, setInsufficientBalanceModalData] =
        useState<InsufficientBalanceModalData | null>(null);

    const mutation = useMutation({
        mutationFn: (body: CreateOrderBody) => {
            return CreateOrderInterface(body);
        },
    });

    // Calculate betCount
    const betCount = selections.length;
    const canShowSystemMultiples = betCount >= 3;

    // Get conflictedSelectionIds
    const conflictedSelectionIds = useParlayConflicts();
    const nonCompliantSelectionIds = useParlayNonCompliantSelectionIds();

    // Calculate disabled
    const disabled = betCount === 0;

    // Calculate hasException
    const hasException = useHasException(selections, conflictedSelectionIds, nonCompliantSelectionIds);

    // Handle clearing exceptions
    const handleClearExceptions = () => {
        const { ids: idsToRemove, counts } = getSelectionsToRemove(
            selections,
            conflictedSelectionIds,
            nonCompliantSelectionIds,
        );

        selections.forEach((selection) => {
            const key = getUniqueSelectionId(selection);
            if (idsToRemove.has(key)) {
                remove(selection);
            }
        });

        onHoverClearExceptions?.(false);
        const message = generateRemovedToastMessage(counts, t);
        if (message) {
            Toast.success(message, { id: 'clear-exception' });
        }
    };

    const totalPotentialWin = payoutPreview.finalPayout;
    const totalStake = stake;
    const { differenceAmount, isInsufficient }: BetSlipBalanceSummary = getBetSlipBalanceSummary(
        mainBalance + sportBonus,
        totalStake,
    );

    // Parlay mode: expand on hover.
    // Keep the footer height stable while hovering "clear exception" so the button
    // does not move away from the cursor and trigger a hover loop.
    const isExpanded = !isDesktop || isDrawerHovered;

    const status = usePlaceBetStatus(hasException);
    const isLocked = status === PlaceBetStatus.Locked;
    const parlayInputAnimationNonce = betOnAllAnimationNonce > 0 ? `bulk-${betOnAllAnimationNonce}` : null;

    const handleBetOnAllSelect = (amount: number) => {
        onStakeChange(stake + amount);
        setBetOnAllAnimationNonce((current) => current + 1);
    };
    const handleCloseInsufficientBalanceModal = (): void => {
        setInsufficientBalanceModalData(null);
    };
    const handleDepositFromInsufficientBalanceModal = (): void => {
        setInsufficientBalanceModalData(null);
        openDepositModal();
    };

    const { checkKycRequired } = useKycRequiredToast();

    // Handle placing bet
    const handlePlaceBet = async () => {
        setSettingsOpen(false);

        if (!checkKycRequired()) {
            return;
        }

        if (betCount < 2) {
            Toast.error(t('message.minParlaySelections'), { id: 'min-parlay-selections' });
            return;
        }

        if (stake <= 0) {
            Toast.error(t('message.invalidStake'), { id: 'invalid-stake' });
            return;
        }

        if (status === PlaceBetStatus.Locked) return;
        if (mutation.isPending) return;

        try {
            setCartStatus(CartStatus.Locked);

            const response = await mutation.mutateAsync({
                bet_type: BetType.Parlay,
                ...(parlayBoostEnabled && parlayBoostRule ? { activity_parlay_boost_id: parlayBoostRule.id } : {}),
                bets: [
                    {
                        selections: selections.map((selection) => ({
                            product: selection.productId,
                            product_raw: selection.productRaw,
                            event_id: selection.eventId,
                            event_id_type: selection.eventIdType,
                            market_id: selection.marketId.toString(),
                            outcome_id: selection.outcome.id,
                            outcome_odds: selection.outcome.odds.toString(),
                            specifiers: selection.specifiers,
                            line: selection.line,
                        })),
                        stakes: [
                            {
                                type: 'cash',
                                currency: currencyCode,
                                amount: stake.toString(),
                            },
                        ],
                    },
                ],
            });

            const nextInsufficientBalanceModalData =
                Number(response?.biz_code) === 200006 ? buildInsufficientBalanceModalData(response?.biz_data) : null;

            if (nextInsufficientBalanceModalData) {
                setCartStatus(CartStatus.Normal);
                setInsufficientBalanceModalData(nextInsufficientBalanceModalData);
                return;
            }
        } catch (error) {
            setCartStatus(CartStatus.Normal);

            const e = error as ErrorReject;
            switch (e.code) {
                case KYC_REQUIRED_ERROR:
                    Toast.error(tUser('kyc.completeFirst'), { id: 'kyc-required' });
                    return;
                default:
                    Toast.error((error as ErrorReject).message, { id: 'place-bet-error' });
            }
        }
    };

    const placeBetText = BETBUS_CART_TEXT.placeBet;
    const clearExceptionText = BETBUS_CART_TEXT.clearException;
    const summaryLabel = BETBUS_CART_TEXT.payout;

    return (
        <>
            <div className={cn(isLocked && 'opacity-50', 'rounded-t-sm overflow-hidden')}>
                <div
                    className={cn('relative z-50 flex w-full flex-col items-center', className)}
                    style={{ width: isDesktop ? DRAWER_SHELL_WIDTH : undefined }}
                >
                    <motion.div
                        className={cn(
                            'flex w-full flex-col items-center rounded-sm bg-[var(--slip-footer-bg,var(--surface-selected))]',
                            !isDesktop && 'overflow-hidden rounded-t-sm rounded-b-none pb-5',
                        )}
                        animate={{
                            paddingTop: !isDesktop ? 0 : 8,
                            paddingBottom: !isDesktop ? undefined : 8,
                        }}
                    >
                        {isDesktop ? (
                            <div ref={expandedContentRef} className="flex w-full flex-col">
                                <div className="flex h-10 w-full items-center justify-between border-b-[0.5px] border-[color:var(--slip-card-border,var(--filltext-ft-c))] px-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span className="text-auxiliary-sm text-filltext-ft-g">
                                            {BETBUS_CART_TEXT.single}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                onStakeChange(0);
                                                setBetMode(BetType.Single);
                                            }}
                                            className="relative h-5 w-9 shrink-0 cursor-pointer rounded-xs bg-[var(--slip-quick-bg,var(--filltext-ft-c))] transition-colors"
                                        >
                                            <span className="absolute left-[18px] top-[2px] size-4 rounded-[2px] bg-[var(--slip-accent,var(--brand-red))] shadow-card transition-all" />
                                        </button>

                                        <span className="text-auxiliary-md text-filltext-ft-g">
                                            {BETBUS_CART_TEXT.parlay}
                                        </span>

                                        <ModeTooltipTrigger
                                            title={`${BETBUS_CART_TEXT.single} / ${BETBUS_CART_TEXT.parlay}`}
                                            content={BETBUS_CART_TEXT.modeTooltip}
                                        />
                                    </div>

                                    <IconButton
                                        icon={TrashOutlined}
                                        size="sm"
                                        variant="subtle"
                                        shape="square"
                                        className="rounded-[5.333px]"
                                        iconClassName="size-4"
                                        onClick={clearAll}
                                    />
                                </div>

                                <div className="border-b-[0.5px] border-[color:var(--slip-card-border,var(--filltext-ft-c))] bg-[var(--slip-footer-bg,var(--surface-selected))] px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <StakeInput
                                            value={stake}
                                            onChange={onStakeChange}
                                            onFocus={() => setIsStakeFocused(true)}
                                            onBlur={() => setIsStakeFocused(false)}
                                            valueAnimationNonce={parlayInputAnimationNonce}
                                            inputFlashNonce={parlayInputAnimationNonce}
                                            inputFlashVariant={parlayInputAnimationNonce != null ? 'outlined' : null}
                                            className={`h-9 shrink-0 transition-[width] duration-200 ease-out ${isStakeFocused ? 'w-[112px]' : 'w-[96px]'}`}
                                        />
                                        <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                            {quickBuyAmounts.map((amount) => (
                                                <button
                                                    key={amount}
                                                    type="button"
                                                    onClick={() => handleBetOnAllSelect(amount)}
                                                    disabled={disabled || isLocked}
                                                    className={cn(
                                                        'flex h-9 flex-1 basis-0 items-center justify-center rounded-sm px-1',
                                                        'text-auxiliary-sm leading-4 font-poppins',
                                                        'bg-[var(--slip-quick-bg,var(--filltext-ft-a))] text-filltext-ft-g transition-colors',
                                                        'cursor-pointer hover:bg-[var(--slip-quick-hover-bg,var(--brand-primary-1))] hover:text-[var(--slip-quick-hover-text,var(--brand-primary-0))]',
                                                        'active:bg-[var(--slip-accent,var(--brand-primary-0))] active:text-neutral-white-h',
                                                        'disabled:cursor-not-allowed disabled:bg-neutral-black-a disabled:text-neutral-black-d',
                                                    )}
                                                >
                                                    +{amount}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {parlayBoostEnabled && parlayBoostRule && (
                                    <div className="flex w-full items-center justify-center px-3 py-2">
                                        <ParlayBoostProgress
                                            rule={parlayBoostRule}
                                            preview={parlayBoostPreview}
                                            onOpenRules={onOpenRules}
                                        />
                                    </div>
                                )}

                                <div className="flex w-full flex-col gap-2 px-3 py-2">
                                    <div className="flex min-h-8 w-full items-center justify-between gap-2">
                                        <span className="shrink-0 text-body-sm font-semibold text-filltext-ft-g">
                                            {summaryLabel}
                                        </span>
                                        <div className="flex min-w-0 items-center gap-2">
                                            <span
                                                title={formatNumber(totalStake)}
                                                className="truncate text-auxiliary-md text-filltext-ft-g"
                                            >
                                                {currencySymbolNarrow}
                                                {formatCompactAmount(totalStake)}
                                            </span>
                                            <DoubleArrowRightOutlined className="size-2.5 shrink-0 text-filltext-ft-e" />
                                            <span
                                                title={formatNumber(totalPotentialWin)}
                                                className="shrink-0 text-body-lg text-[var(--slip-profit,var(--brand-red))]"
                                            >
                                                {currencySymbolNarrow}
                                                {formatCompactAmount(totalPotentialWin)}
                                            </span>
                                            <ParlayBoostPayoutWarn payoutPreview={payoutPreview} />
                                        </div>
                                    </div>

                                    <ParlayBoostOddsDisplay oddsFormat={oddsFormat} {...parlayDisplayOdds} />

                                    {canShowSystemMultiples && (
                                        <SystemMultiplesPanel
                                            selectionCount={betCount}
                                            open={isSystemMultiplesOpen}
                                            onToggle={() => setIsSystemMultiplesOpen((current) => !current)}
                                        />
                                    )}

                                    {isInsufficient && (
                                        <InsufficientBalanceBanner
                                            differenceAmount={differenceAmount}
                                            onDeposit={openDepositModal}
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        key="expanded-content"
                                        initial={{ height: 0, opacity: 0, marginBottom: 0, y: 8 }}
                                        animate={{ height: 'auto', opacity: 1, marginBottom: 8, y: 0 }}
                                        exit={{ height: 0, opacity: 0, marginBottom: 0, y: 8 }}
                                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        className="w-full overflow-hidden"
                                    >
                                        <div className="flex flex-col">
                                            <div className="flex w-full items-center justify-between border-y-[0.5px] border-[color:var(--slip-card-border,var(--filltext-ft-c))] bg-[var(--slip-footer-bg,var(--surface-selected))] px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-auxiliary-sm text-filltext-ft-g transition-all">
                                                        {BETBUS_CART_TEXT.single}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            onStakeChange(0);
                                                            setBetMode(BetType.Single);
                                                        }}
                                                        className="relative h-5 w-9 cursor-pointer rounded-xs bg-[var(--slip-quick-bg,var(--filltext-ft-c))] transition-colors"
                                                    >
                                                        <span className="absolute left-[18px] top-[2px] size-4 rounded-[2px] bg-[var(--slip-accent,var(--brand-red))] shadow-card transition-all" />
                                                    </button>
                                                    <span className="text-auxiliary-md text-filltext-ft-g transition-all">
                                                        {BETBUS_CART_TEXT.parlay}
                                                    </span>
                                                    <ModeTooltipTrigger
                                                        title={`${BETBUS_CART_TEXT.single} / ${BETBUS_CART_TEXT.parlay}`}
                                                        content={BETBUS_CART_TEXT.modeTooltip}
                                                    />
                                                </div>
                                                <IconButton
                                                    icon={TrashOutlined}
                                                    size="sm"
                                                    variant="subtle"
                                                    shape="square"
                                                    className="rounded-[5.333px]"
                                                    iconClassName="size-4"
                                                    onClick={clearAll}
                                                />
                                            </div>

                                            <div className="border-b-[0.5px] border-[color:var(--slip-card-border,var(--filltext-ft-c))] bg-[var(--slip-footer-bg,var(--surface-selected))] px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <StakeInput
                                                        value={stake}
                                                        onChange={onStakeChange}
                                                        onFocus={() => setIsStakeFocused(true)}
                                                        onBlur={() => setIsStakeFocused(false)}
                                                        valueAnimationNonce={parlayInputAnimationNonce}
                                                        inputFlashNonce={parlayInputAnimationNonce}
                                                        inputFlashVariant={
                                                            parlayInputAnimationNonce != null ? 'outlined' : null
                                                        }
                                                        className="h-[42px] w-[100px] shrink-0"
                                                    />
                                                    <div className="flex flex-1 items-center gap-1.5">
                                                        {quickBuyAmounts.map((amount) => (
                                                            <button
                                                                key={amount}
                                                                type="button"
                                                                onClick={() => handleBetOnAllSelect(amount)}
                                                                disabled={disabled || isLocked}
                                                                className={cn(
                                                                    'flex h-[42px] flex-1 basis-0 items-center justify-center rounded-sm px-1',
                                                                    'text-auxiliary-sm leading-4 font-poppins',
                                                                    'bg-[var(--slip-quick-bg,var(--filltext-ft-a))] text-filltext-ft-g transition-colors',
                                                                    'cursor-pointer hover:bg-[var(--slip-quick-hover-bg,var(--brand-primary-1))] hover:text-[var(--slip-quick-hover-text,var(--brand-primary-0))]',
                                                                    'active:bg-[var(--slip-accent,var(--brand-primary-0))] active:text-neutral-white-h',
                                                                    'disabled:cursor-not-allowed disabled:bg-neutral-black-a disabled:text-neutral-black-d',
                                                                    'disabled:hover:bg-neutral-black-a disabled:hover:text-neutral-black-d',
                                                                    'disabled:active:bg-neutral-black-a disabled:active:text-neutral-black-d',
                                                                )}
                                                            >
                                                                +{amount}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {parlayBoostEnabled && parlayBoostRule && (
                                                <div className="flex w-full items-center justify-center px-4 py-3">
                                                    <ParlayBoostProgress
                                                        rule={parlayBoostRule}
                                                        preview={parlayBoostPreview}
                                                        variant="mobile"
                                                        onOpenRules={onOpenRules}
                                                    />
                                                </div>
                                            )}

                                            <div className="flex w-full flex-col gap-2 px-4 py-1">
                                                <div className="flex min-h-8 w-full flex-wrap items-center justify-between gap-x-2 gap-y-1">
                                                    <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
                                                        <span className="shrink-0 text-body-sm font-semibold text-filltext-ft-g">
                                                            {summaryLabel}
                                                        </span>
                                                        <div className="flex min-w-0 items-center gap-1">
                                                            <span
                                                                title={formatNumber(totalPotentialWin)}
                                                                className="shrink-0 whitespace-nowrap text-body-lg text-[var(--slip-profit,var(--brand-primary-0))]"
                                                            >
                                                                {currencySymbolNarrow}
                                                                {formatCompactAmount(totalPotentialWin)}
                                                            </span>
                                                            <ParlayBoostPayoutWarn payoutPreview={payoutPreview} />
                                                        </div>
                                                    </div>

                                                    <ParlayBoostOddsDisplay
                                                        oddsFormat={oddsFormat}
                                                        {...parlayDisplayOdds}
                                                    />
                                                </div>

                                                {canShowSystemMultiples && (
                                                    <SystemMultiplesPanel
                                                        selectionCount={betCount}
                                                        open={isSystemMultiplesOpen}
                                                        onToggle={() => setIsSystemMultiplesOpen((current) => !current)}
                                                    />
                                                )}

                                                {isInsufficient && (
                                                    <InsufficientBalanceBanner
                                                        differenceAmount={differenceAmount}
                                                        onDeposit={openDepositModal}
                                                        className="w-full"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}

                        {status === PlaceBetStatus.Exception ? (
                            <div className={cn('w-full', !isDesktop && 'flex items-center gap-2.5 px-3.5')}>
                                {isMobile && <CloseSlipIcon />}
                                <ClearExceptionButton
                                    text={clearExceptionText}
                                    onClick={handleClearExceptions}
                                    className={cn(!isDesktop && 'w-full min-w-0 max-w-none flex-1')}
                                    onMouseEnter={() => {
                                        onHoverClearExceptions?.(true);
                                    }}
                                    onMouseLeave={() => {
                                        onHoverClearExceptions?.(false);
                                    }}
                                />
                            </div>
                        ) : (
                            <div className={cn('w-full', !isDesktop && 'flex items-center gap-2.5 px-3.5')}>
                                {isMobile && <CloseSlipIcon />}
                                <PlaceBetButton
                                    disabled={disabled || betCount === 0}
                                    loading={status === PlaceBetStatus.Locked}
                                    onClick={handlePlaceBet}
                                    className={cn(
                                        isDesktop || isExpanded ? '' : 'px-4',
                                        !isDesktop && 'w-full min-w-0 max-w-none flex-1',
                                    )}
                                >
                                    {isDesktop || isExpanded ? (
                                        <span>{placeBetText}</span>
                                    ) : (
                                        <div className="flex items-center justify-center overflow-hidden gap-[13px]">
                                            <span className="min-w-0 truncate">{placeBetText}</span>
                                            {totalStake !== undefined && totalPotentialWin !== undefined && (
                                                <div className="flex shrink-0 items-center gap-1">
                                                    <span className="whitespace-nowrap text-auxiliary-sm text-neutral-white-h">
                                                        {formatCompactAmount(totalStake)}
                                                    </span>
                                                    <DoubleArrowRightOutlined className="size-2.5 shrink-0 text-white" />
                                                    <span className="whitespace-nowrap text-body-md text-neutral-white-h">
                                                        {formatCompactAmount(totalPotentialWin)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </PlaceBetButton>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <InsufficientBalanceModal
                visible={insufficientBalanceModalData !== null}
                currentBalance={insufficientBalanceModalData?.currentBalance ?? 0}
                orderAmount={insufficientBalanceModalData?.orderAmount ?? 0}
                differenceAmount={insufficientBalanceModalData?.differenceAmount ?? 0}
                onClose={handleCloseInsufficientBalanceModal}
                onDeposit={handleDepositFromInsufficientBalanceModal}
            />
        </>
    );
};
