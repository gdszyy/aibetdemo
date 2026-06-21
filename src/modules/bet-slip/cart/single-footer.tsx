'use client';

import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { FC, RefObject } from 'react';
import { useState } from 'react';
import { type CreateOrderBet, type CreateOrderBody, CreateOrderInterface } from '@/api/handlers/order';
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
import { useCurrencyCode, useWallet } from '@/hooks/use-wallet';
import { getSingleStakeAmount, getUniqueSelectionId } from '@/modules/bet-slip/_logic/cart-sync';
import {
    generateRemovedToastMessage,
    getBetSlipBalanceSummary,
    getSelectionsToRemove,
    safeMultiply,
    safeSum,
} from '@/modules/bet-slip/_utils';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import { useSlipSettingsStore } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { DRAWER_SHELL_WIDTH, KYC_REQUIRED_ERROR } from '../_constants/constants';
import { useBetSlipDrawerContext } from '../slip/context';
import { useAllSelections, useBetSlipStore, useCartStatus } from '../stores/bet-slip-store';
import { BetOnAllButtonGroup } from './_components/bet-on-all-button-group';
import { ClearExceptionButton } from './_components/clear-exception-button';
import { CloseSlipIcon } from './_components/close-slip-icon';
import { InsufficientBalanceBanner } from './_components/insufficient-balance-banner';
import { InsufficientBalanceModal } from './_components/insufficient-balance-modal';
import { ModeTooltipTrigger } from './_components/mode-tooltip-trigger';
import { PlaceBetButton } from './_components/place-bet-button';
import { PlaceBetStatus } from './_constants';
import { useHasException } from './_hooks/use-has-exception';
import { usePlaceBetStatus } from './_hooks/use-place-bet-status';

export interface SingleFooterProps {
    stakeMap: Record<string, number>;
    /** Clear exceptions button hover callback */
    onHoverClearExceptions?: (hovering: boolean) => void;
    /** Clear all stakes callback */
    onClearStakes?: () => void;
    /** Apply the same stake to all selections */
    onBetOnAll?: (value: number) => void;
    /** Whether to show top shadow (when content overflows) */
    showShadow?: boolean;
    /** Whether content overflows */
    hasOverflow?: boolean;
    /** Hide footer while editing stake on mobile */
    hideOnMobile?: boolean;
    /** 桌面端展开内容测量 ref，供 footer overflow 计算 */
    expandedContentRef?: RefObject<HTMLDivElement | null>;
    /** Custom class name */
    className?: string;
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
    totalStake: 'Apuesta total',
} as const;

/**
 * Single mode footer toolbar.
 *
 * Interaction logic:
 * - Layout: sticky bottom-0, expands upward when opened
 * - Shadow: fades in via motion when isOverflowing
 * - Shows only button by default, expands details on hover
 * - Collapsed state shows summary info inside button (Place + amounts)
 */
export const SingleFooter: FC<SingleFooterProps> = ({
    stakeMap,
    onHoverClearExceptions,
    onClearStakes,
    onBetOnAll,
    hideOnMobile = false,
    expandedContentRef,
    className,
}) => {
    const t = useTranslations('betSlip');
    const tUser = useTranslations('user');
    const { currencySymbolNarrow, formatCompactAmount, formatNumber } = useIntlFormatter();
    const { openDepositModal } = useOpenDepositModal();
    const clearAll = useBetSlipStore((state) => state.clearAll);
    const remove = useBetSlipStore((state) => state.remove);
    const setBetMode = useBetCartStore((state) => state.setBetMode);
    const setCartStatus = useBetSlipStore((state) => state.setCartStatus);
    const cartStatus = useCartStatus();
    const selections = useAllSelections();
    const currencyCode = useCurrencyCode();
    const mainBalance = useWallet((state) => state.mainBalance);
    const sportBonus = useWallet((state) => state.sportBonus);
    const setSettingsOpen = useSlipSettingsStore((state) => state.setSettingsOpen);
    const quickBuyAmounts = useSlipSettingsStore((state) => state.quickBuyAmounts);
    const isDesktop = useIsDesktop();
    const isMobile = useIsMobile();

    const { isHovered: isDrawerHovered } = useBetSlipDrawerContext();
    const [insufficientBalanceModalData, setInsufficientBalanceModalData] =
        useState<InsufficientBalanceModalData | null>(null);

    const totalStake = safeSum(
        ...selections.map((selection) => {
            return getSingleStakeAmount(stakeMap, selection);
        }),
    );

    const totalPotentialWin = safeSum(
        ...selections.map((selection) => {
            const stake = getSingleStakeAmount(stakeMap, selection);
            return safeMultiply(stake, selection.outcome.odds);
        }),
    );
    const { differenceAmount, isInsufficient }: BetSlipBalanceSummary = getBetSlipBalanceSummary(
        mainBalance + sportBonus,
        totalStake,
    );

    const mutation = useMutation({
        mutationFn: (body: CreateOrderBody) => {
            return CreateOrderInterface(body);
        },
    });

    // Calculate betCount
    const betCount = selections.length;

    // Calculate disabled
    const disabled = betCount === 0;

    // Calculate hasException (Single mode has no conflict check, pass empty set)
    const hasException = useHasException(selections);

    // Handle clearing exceptions
    const handleClearExceptions = () => {
        // Single mode: only remove locked and invalid selections (no conflict check)
        const { ids: idsToRemove, counts } = getSelectionsToRemove(selections, new Set<string>(), new Set<string>());

        // Execute removal
        selections.forEach((selection) => {
            const key = getUniqueSelectionId(selection);
            if (idsToRemove.has(key)) {
                remove(selection);
            }
        });

        // Reset hover state after clearing
        onHoverClearExceptions?.(false);
        const message = generateRemovedToastMessage(counts, t);
        if (message) {
            Toast.success(message, { id: 'clear-exception' });
        }
    };

    // Single mode: expand on hover.
    // Keep the footer height stable while hovering "clear exception" so the button
    // does not move away from the cursor and trigger a hover loop.
    const isExpanded = !isDesktop || isDrawerHovered;

    const status = usePlaceBetStatus(hasException);
    const isLocked = cartStatus === CartStatus.Locked;

    const { checkKycRequired } = useKycRequiredToast();
    const handleCloseInsufficientBalanceModal = (): void => {
        setInsufficientBalanceModalData(null);
    };
    const handleDepositFromInsufficientBalanceModal = (): void => {
        setInsufficientBalanceModalData(null);
        openDepositModal();
    };

    if (!isDesktop && hideOnMobile) {
        return null;
    }

    // Handle placing bet
    const handlePlaceBet = async () => {
        setSettingsOpen(false);

        if (!checkKycRequired()) {
            return;
        }

        const hasZeroStake = selections.some((selection) => {
            return getSingleStakeAmount(stakeMap, selection) <= 0;
        });

        if (hasZeroStake) {
            Toast.error(t('message.invalidStake'), { id: 'invalid-stake' });
            return;
        }

        if (status === PlaceBetStatus.Locked) return;
        if (mutation.isPending) return;
        try {
            const bets = selections.map((selection): CreateOrderBet => {
                return {
                    selections: [
                        {
                            product: selection.productId,
                            product_raw: selection.productRaw,
                            event_id: selection.eventId,
                            event_id_type: selection.eventIdType,
                            market_id: selection.marketId.toString(),
                            outcome_id: selection.outcome.id,
                            outcome_odds: selection.outcome.odds.toString(),
                            line: selection.line,
                            specifiers: selection.specifiers,
                        },
                    ],
                    stakes: [
                        {
                            type: 'cash',
                            currency: currencyCode,
                            amount: getSingleStakeAmount(stakeMap, selection).toString(),
                        },
                    ],
                };
            });

            setCartStatus(CartStatus.Locked);

            const response = await mutation.mutateAsync({
                bet_type: BetType.Single,
                bets: bets,
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
                    Toast.error(tUser('kyc.completeFirst'), { id: 'bet-cart-kyc-required' });
                    return;
                default:
                    Toast.error((error as ErrorReject).message, { id: 'place-bet-error' });
            }
        }
    };

    const placeBetText = BETBUS_CART_TEXT.placeBet;
    const clearExceptionText = BETBUS_CART_TEXT.clearException;

    // 是否显示 bet on all
    const showBetOnAll = false;

    return (
        <>
            <div
                className={cn('relative z-50 flex w-full flex-col items-center', isLocked && 'opacity-50', className)}
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
                            <div className="flex h-10 w-full items-center justify-between border-b-[0.5px] border-[color:var(--slip-card-border,var(--filltext-ft-c))] bg-[var(--slip-footer-bg,var(--surface-selected))] px-3">
                                <div className="flex min-w-0 items-center gap-2">
                                    <span className="text-auxiliary-md text-filltext-ft-g">
                                        {BETBUS_CART_TEXT.single}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            onClearStakes?.();
                                            setBetMode(BetType.Parlay);
                                        }}
                                        className="relative h-5 w-9 shrink-0 cursor-pointer rounded-xs bg-[var(--slip-quick-bg,var(--filltext-ft-c))] transition-colors"
                                    >
                                        <span className="absolute left-[2px] top-[2px] size-4 rounded-[2px] bg-filltext-ft-g shadow-card transition-all" />
                                    </button>

                                    <span className="text-auxiliary-sm text-filltext-ft-g">
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

                            <div className="flex w-full flex-col gap-2 px-3 py-2">
                                <div className="flex min-h-8 w-full items-center justify-between gap-2">
                                    <span className="shrink-0 text-body-sm font-semibold text-filltext-ft-g">
                                        {BETBUS_CART_TEXT.totalStake}
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
                                    </div>
                                </div>

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
                                        {showBetOnAll && (
                                            <BetOnAllButtonGroup
                                                label={BETBUS_CART_TEXT.betOnAll}
                                                amounts={quickBuyAmounts}
                                                disabled={disabled || isLocked}
                                                onSelect={onBetOnAll}
                                            />
                                        )}

                                        <div
                                            className={cn(
                                                'flex w-full px-4 h-12 border-[color:var(--slip-card-border,var(--filltext-ft-c))] bg-[var(--slip-footer-bg,var(--surface-selected))] items-center justify-between',
                                                showBetOnAll ? 'border-y-[0.5px]' : 'border-b-[0.5px]',
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-auxiliary-md text-filltext-ft-g transition-all">
                                                    {BETBUS_CART_TEXT.single}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onClearStakes?.();
                                                        setBetMode(BetType.Parlay);
                                                    }}
                                                    className="relative h-5 w-9 cursor-pointer rounded-xs bg-[var(--slip-quick-bg,var(--filltext-ft-c))] transition-colors"
                                                >
                                                    <span className="absolute top-[2px] left-[2px] size-4 rounded-[2px] bg-filltext-ft-g shadow-card transition-all" />
                                                </button>

                                                <span className="text-auxiliary-sm text-filltext-ft-g transition-all">
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

                                        <div className="flex w-full flex-col gap-2 px-4 py-2">
                                            <div className="flex h-8 items-center justify-start">
                                                <span className="text-body-sm text-filltext-ft-g font-semibold">
                                                    {BETBUS_CART_TEXT.totalStake}
                                                </span>

                                                <div className="ml-3 flex items-center gap-3">
                                                    <span
                                                        title={formatNumber(totalStake)}
                                                        className="text-auxiliary-md text-filltext-ft-g"
                                                    >
                                                        {currencySymbolNarrow}
                                                        {formatCompactAmount(totalStake)}
                                                    </span>
                                                    <DoubleArrowRightOutlined className="size-2.5 shrink-0 text-filltext-ft-e" />
                                                    <span
                                                        title={formatNumber(totalPotentialWin)}
                                                        className="text-body-lg text-[var(--slip-profit,var(--brand-red))]"
                                                    >
                                                        {currencySymbolNarrow}
                                                        {formatCompactAmount(totalPotentialWin)}
                                                    </span>
                                                </div>
                                            </div>

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
                                loading={isLocked}
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
