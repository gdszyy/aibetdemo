import { useLocalStorageState } from 'ahooks';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CartStatus } from '@/api/models/cart';
import { ParlayBoostMark } from '@/components/parlay-boost-mark';
import { ParlayBoostRulesModal } from '@/components/parlay-boost-rules-modal';
import { PARLAY_BOOST_LIGHTNING_RULES_SECTIONS } from '@/constants/parlay-boost-rules-modal';
import { useIsDesktop } from '@/hooks/use-media-query';
import { getUniqueSelectionId, isSameSelection } from '@/modules/bet-slip/_logic/cart-sync';
import { checkIsConflicted } from '@/modules/bet-slip/_logic/conflict';
import { getSelectionsToRemove } from '@/modules/bet-slip/_utils';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { cn } from '@/utils/common';
import { DRAWER_CARD_WIDTH } from '../_constants/constants';
import { useAllSelections, useCartStatus } from '../stores/bet-slip-store';
import { STORAGE_KEYS } from './_constants';
import {
    DESKTOP_FOOTER_RESERVED_HEIGHT,
    DESKTOP_SCROLL_MAX_HEIGHT,
    useDesktopFooterOverflow,
} from './_hooks/use-desktop-footer-overflow';
import { useParlayBoostCartRules } from './_hooks/use-parlay-boost-cart-rules';
import { useParlayConflicts, useParlayNonCompliantSelectionIds } from './_hooks/use-parlay-selection-map';
import { useScrollShadow } from './_hooks/use-scroll-shadow';
import { ParlayFooter } from './parlay-footer';
import { StakeCard, type StakeCardWarningType } from './stake-card';

/** 串关购物车列表，负责已选投注项、活动角标和底部下注栏联动展示。 */
export const Parlay: FC<{ className?: string }> = ({ className }) => {
    const isDesktop = useIsDesktop();
    const tParlayBoostBadge = useTranslations('common.parlayBoostBadge');
    const [conflictTarget, setConflictTarget] = useState<OddsEntity | 'all'>();
    const [isClearingHover, setIsClearingHover] = useState(false);
    const [showDesktopHoverShadow, setShowDesktopHoverShadow] = useState(false);
    const [wouldDesktopHoverOverflow, setWouldDesktopHoverOverflow] = useState(false);
    const [rulesModalOpen, setRulesModalOpen] = useState(false);
    const cartStatus = useCartStatus();

    // Scroll shadow detection (show shadow when not scrolled to bottom)
    const scrollRef = useRef<HTMLDivElement>(null);
    const expandedContentRef = useRef<HTMLDivElement>(null);
    const { showShadow, hasOverflow } = useScrollShadow(scrollRef);

    const selections = useAllSelections();
    const conflictedSelectionIds = useParlayConflicts();
    const nonCompliantSelectionIds = useParlayNonCompliantSelectionIds();
    // Locally manage parlayStake, auto-synced to localStorage
    const [stake, setStake] = useLocalStorageState<number>(STORAGE_KEYS.PARLAY_STAKE, {
        defaultValue: 0,
    });
    const { enabled: parlayBoostEnabled, betContext: parlayBoostBetContext } = useParlayBoostCartRules(stake);

    useEffect(() => {
        if (selections.length === 0) {
            setStake(0);
        }
    }, [selections.length, setStake]);

    const warnedSelections: OddsEntity[] = useMemo(() => {
        if (!conflictTarget || conflictTarget === 'all') return [];

        const targetId = getUniqueSelectionId(conflictTarget);
        if (!conflictedSelectionIds.has(targetId)) return [];

        // Find all items conflicting with the current target (including itself)
        return selections.filter((s) => isSameSelection(s, conflictTarget) || checkIsConflicted(s, conflictTarget));
    }, [conflictedSelectionIds, conflictTarget, selections]);

    // Compute the set of items to be removed (for hover highlight logic)
    const selectionsToRemove = useMemo(() => {
        if (!isClearingHover) return new Set<string>();
        return getSelectionsToRemove(selections, conflictedSelectionIds, nonCompliantSelectionIds).ids;
    }, [isClearingHover, selections, conflictedSelectionIds, nonCompliantSelectionIds]);
    const selectionCount = selections.length;
    const isParlayFooterExpanded = true;
    const { expandedOverflowHeight, desktopFooterShadowBottom, desktopContentBottomPadding } = useDesktopFooterOverflow(
        {
            expandedContentRef,
            isExpanded: isParlayFooterExpanded,
            enabled: isDesktop && selectionCount > 0,
        },
    );
    const shouldUseDesktopOverlay = isDesktop && (hasOverflow || wouldDesktopHoverOverflow);
    const shouldShowDesktopShadow = shouldUseDesktopOverlay && (showShadow || showDesktopHoverShadow);

    useEffect(() => {
        if (!isDesktop || selectionCount === 0) {
            setWouldDesktopHoverOverflow(false);
            return;
        }

        const updateWouldDesktopHoverOverflow = () => {
            const el = scrollRef.current;
            if (!el) return;

            const maxHeight = Number.parseFloat(window.getComputedStyle(el).maxHeight);
            if (!Number.isFinite(maxHeight)) {
                setWouldDesktopHoverOverflow(false);
                return;
            }

            setWouldDesktopHoverOverflow(el.scrollHeight + expandedOverflowHeight > maxHeight);
        };

        const frame = requestAnimationFrame(updateWouldDesktopHoverOverflow);
        window.addEventListener('resize', updateWouldDesktopHoverOverflow);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', updateWouldDesktopHoverOverflow);
        };
    }, [expandedOverflowHeight, isDesktop, selectionCount]);

    useEffect(() => {
        if (!shouldUseDesktopOverlay) {
            setShowDesktopHoverShadow(false);
            return;
        }

        const frame = requestAnimationFrame(() => {
            const el = scrollRef.current;
            if (!el) return;

            const overflow = el.scrollHeight > el.clientHeight;
            const notAtBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
            setShowDesktopHoverShadow(isParlayFooterExpanded && overflow && notAtBottom);
        });

        return () => cancelAnimationFrame(frame);
    }, [shouldUseDesktopOverlay]);

    const handleScroll = () => {
        if (!shouldUseDesktopOverlay) return;

        const el = scrollRef.current;
        if (!el) return;

        const overflow = el.scrollHeight > el.clientHeight;
        const notAtBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
        setShowDesktopHoverShadow(isParlayFooterExpanded && overflow && notAtBottom);
    };

    return (
        <div
            className={cn(
                'relative flex min-h-0 flex-col justify-start',
                isDesktop ? 'flex-none' : 'flex-1 justify-between bg-transparent',
                className,
            )}
        >
            <div
                className={cn(
                    'relative min-h-0',
                    isDesktop
                        ? 'flex-none'
                        : 'mx-2 w-[calc(100%-16px)] flex-1 bg-[var(--slip-panel-bg,var(--filltext-ft-b))]',
                )}
            >
                {/* Card list */}
                <div
                    className={cn(
                        'min-h-0 overflow-y-auto overscroll-y-contain hidden-scrollbar',
                        isDesktop ? '' : 'h-full px-2',
                    )}
                    style={{ maxHeight: isDesktop ? DESKTOP_SCROLL_MAX_HEIGHT : undefined }}
                    data-bet-slip-scroll-region="true"
                    ref={scrollRef}
                    onScroll={handleScroll}
                >
                    <div
                        className={cn('flex flex-col items-center gap-2 py-2', isDesktop && 'px-3')}
                        style={{
                            paddingBottom: shouldUseDesktopOverlay ? desktopContentBottomPadding : undefined,
                        }}
                    >
                        {selections.map((selection) => {
                            const selectionId = getUniqueSelectionId(selection);
                            const isConflict = conflictedSelectionIds.has(selectionId);
                            const isNonCompliant = nonCompliantSelectionIds.has(selectionId);
                            const hasWarningHover = warnedSelections.some((s) => isSameSelection(s, selection));
                            const warningType: StakeCardWarningType | undefined = isConflict
                                ? 'conflict'
                                : isNonCompliant
                                  ? 'non-compliant'
                                  : undefined;
                            const topInfoBadge =
                                parlayBoostEnabled &&
                                parlayBoostBetContext?.preview.qualifyingSelectionIds.has(selectionId) ? (
                                    <button
                                        type="button"
                                        onClick={() => setRulesModalOpen(true)}
                                        className="flex size-4 cursor-pointer items-center justify-center rounded-full active:scale-95"
                                    >
                                        <ParlayBoostMark />
                                        <span className="sr-only">{tParlayBoostBadge('boost')}</span>
                                    </button>
                                ) : undefined;
                            const key = selectionId;

                            // If hovering the clear button and this item is in the removal list -> dim it
                            const shouldDim = isClearingHover && selectionsToRemove.has(key);

                            return (
                                <div
                                    key={key}
                                    onMouseEnter={() => {
                                        if (isConflict) {
                                            setConflictTarget(selection);
                                        }
                                    }}
                                    onMouseLeave={() => setConflictTarget(undefined)}
                                    className={cn(!isDesktop && 'w-full', shouldDim && 'opacity-40 transition-opacity')}
                                >
                                    <StakeCard
                                        value={selection}
                                        warningType={warningType}
                                        warningHover={warningType === 'conflict' && hasWarningHover}
                                        isPending={cartStatus === CartStatus.Locked}
                                        topInfoBadge={topInfoBadge}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
                {!isDesktop && hasOverflow && showShadow && (
                    <div className="pointer-events-none absolute -bottom-2 left-2 z-30 h-[50px] w-[calc(100%-16px)] bg-[linear-gradient(180deg,var(--page-bg-transparent)_0%,var(--page-bg)_91.4%)]" />
                )}
            </div>

            <div
                className={cn(shouldUseDesktopOverlay ? 'relative w-full flex-none' : 'w-full')}
                style={{ height: shouldUseDesktopOverlay ? DESKTOP_FOOTER_RESERVED_HEIGHT : undefined }}
            >
                {shouldUseDesktopOverlay && (
                    <div
                        className={cn(
                            'pointer-events-none absolute left-1/2 z-40 h-[50px] -translate-x-1/2 bg-[linear-gradient(180deg,var(--page-bg-transparent)_0%,var(--page-bg)_91.4%)] opacity-0 transition-[bottom,opacity] duration-[250ms] ease-in-out',
                            shouldShowDesktopShadow && 'opacity-100',
                        )}
                        style={{ width: DRAWER_CARD_WIDTH, bottom: desktopFooterShadowBottom }}
                    />
                )}
                <ParlayFooter
                    stake={stake}
                    onStakeChange={setStake}
                    onHoverClearExceptions={setIsClearingHover}
                    showShadow={showShadow}
                    hasOverflow={hasOverflow}
                    expandedContentRef={expandedContentRef}
                    onOpenRules={() => setRulesModalOpen(true)}
                    className={cn(
                        shouldUseDesktopOverlay &&
                            'absolute bottom-0 left-1/2 -translate-x-1/2 [&>div>div:first-child]:overflow-hidden',
                    )}
                />
            </div>
            <ParlayBoostRulesModal
                visible={rulesModalOpen && parlayBoostEnabled}
                onClose={() => setRulesModalOpen(false)}
                betContext={parlayBoostBetContext}
                {...PARLAY_BOOST_LIGHTNING_RULES_SECTIONS}
            />
        </div>
    );
};
