import { useLocalStorageState } from 'ahooks';
import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CartStatus } from '@/api/models/cart';
import useDetectKeyboardOpen from '@/hooks/use-detect-keyboard-open';
import { useIsDesktop } from '@/hooks/use-media-query';
import {
    getSingleStakeAmount,
    getSingleStakeLineKey,
    getUniqueSelectionId,
    normalizeSingleStakeMap,
} from '@/modules/bet-slip/_logic/cart-sync';
import { getSelectionsToRemove } from '@/modules/bet-slip/_utils';
import { cn } from '@/utils/common';
import { DRAWER_CARD_WIDTH } from '../_constants/constants';
import { useBetSlipDrawerContext } from '../slip/context';
import { useAllSelections, useCartStatus } from '../stores/bet-slip-store';
import { STORAGE_KEYS } from './_constants';
import {
    DESKTOP_FOOTER_RESERVED_HEIGHT,
    DESKTOP_SCROLL_MAX_HEIGHT,
    useDesktopFooterOverflow,
} from './_hooks/use-desktop-footer-overflow';
import { useScrollShadow } from './_hooks/use-scroll-shadow';
import { SingleFooter } from './single-footer';
import { SingleStakeCard } from './single-stake-card';

export const Single: FC<{ className?: string }> = ({ className }) => {
    const isDesktop = useIsDesktop();
    const isKeyboardOpen = useDetectKeyboardOpen();
    const selections = useAllSelections();
    const cartStatus = useCartStatus();
    const [isClearingHover, setIsClearingHover] = useState(false);
    const [isStakeInputFocused, setIsStakeInputFocused] = useState(false);
    const [showDesktopHoverShadow, setShowDesktopHoverShadow] = useState(false);
    const [wouldDesktopHoverOverflow, setWouldDesktopHoverOverflow] = useState(false);
    const [betOnAllAnimationNonce, setBetOnAllAnimationNonce] = useState(0);
    const { isHovered: isDrawerHovered } = useBetSlipDrawerContext();

    // Scroll shadow detection (show shadow when not scrolled to bottom)
    const scrollRef = useRef<HTMLDivElement>(null);
    const expandedContentRef = useRef<HTMLDivElement>(null);
    const { showShadow, hasOverflow } = useScrollShadow(scrollRef);

    // Locally manage singleStakes, auto-synced to localStorage
    const [stakeMap, setStakeMap] = useLocalStorageState<Record<string, number>>(STORAGE_KEYS.SINGLE_STAKES, {
        defaultValue: {},
    });

    // Clean up stakes for removed selections.
    useEffect(() => {
        setStakeMap((prev) => normalizeSingleStakeMap(selections, prev));
    }, [selections, setStakeMap]);

    const handleStakeChange = (stakeKey: string, value: number) => {
        setStakeMap((prev) => ({
            ...prev,
            [stakeKey]: value,
        }));
    };

    const handleClearStakes = () => {
        setStakeMap({});
    };

    const handleBetOnAll = (value: number) => {
        const newMap: Record<string, number> = {};
        for (const selection of selections) {
            newMap[getSingleStakeLineKey(selection)] = value;
        }
        setStakeMap(newMap);
        setBetOnAllAnimationNonce((current) => current + 1);
    };

    // Compute the set of items to be removed (for hover highlight logic)
    const selectionsToRemove = useMemo(() => {
        if (!isClearingHover) return new Set<string>();
        // Single mode has no conflict logic, pass empty set as invalidMatchIds
        return getSelectionsToRemove(selections, new Set<string>(), new Set<string>()).ids;
    }, [isClearingHover, selections]);
    const selectionCount = selections.length;

    const isStakeInputElement = (element: EventTarget | null): element is HTMLElement =>
        element instanceof HTMLElement && element.dataset.stakeInput === 'true';
    const shouldHideFooterOnMobile = !isDesktop && isStakeInputFocused && isKeyboardOpen;
    const { expandedOverflowHeight, desktopFooterShadowBottom, desktopContentBottomPadding } = useDesktopFooterOverflow(
        {
            expandedContentRef,
            isExpanded: true,
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
            setShowDesktopHoverShadow(isDrawerHovered && overflow && notAtBottom);
        });

        return () => cancelAnimationFrame(frame);
    }, [shouldUseDesktopOverlay, isDrawerHovered]);

    const handleScroll = () => {
        if (!shouldUseDesktopOverlay) return;

        const el = scrollRef.current;
        if (!el) return;

        const overflow = el.scrollHeight > el.clientHeight;
        const notAtBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
        setShowDesktopHoverShadow(isDrawerHovered && overflow && notAtBottom);
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
                    onFocusCapture={(event) => {
                        if (isStakeInputElement(event.target)) {
                            setIsStakeInputFocused(true);
                        }
                    }}
                    onBlurCapture={(event) => {
                        if (!isStakeInputElement(event.target)) return;
                        requestAnimationFrame(() => {
                            setIsStakeInputFocused(isStakeInputElement(document.activeElement));
                        });
                    }}
                >
                    <div
                        className="flex flex-col items-center gap-2 py-2 pb-2"
                        style={{
                            paddingBottom: shouldUseDesktopOverlay ? desktopContentBottomPadding : undefined,
                        }}
                    >
                        {selections.map((selection) => {
                            const key = getUniqueSelectionId(selection);
                            const stakeKey = getSingleStakeLineKey(selection);
                            // If hovering the clear button and this item is in the removal list -> dim it
                            const shouldDim = isClearingHover && selectionsToRemove.has(key);

                            return (
                                <SingleStakeCard
                                    key={key}
                                    value={selection}
                                    stake={getSingleStakeAmount(stakeMap, selection)}
                                    onStakeChange={(value) => handleStakeChange(stakeKey, value)}
                                    bulkAnimationNonce={betOnAllAnimationNonce}
                                    isPending={cartStatus === CartStatus.Locked}
                                    className={cn(shouldDim && 'opacity-40 transition-opacity')}
                                />
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
                <SingleFooter
                    stakeMap={stakeMap}
                    onClearStakes={handleClearStakes}
                    onBetOnAll={handleBetOnAll}
                    onHoverClearExceptions={setIsClearingHover}
                    showShadow={showShadow}
                    hasOverflow={hasOverflow}
                    hideOnMobile={shouldHideFooterOnMobile}
                    expandedContentRef={expandedContentRef}
                    className={cn(shouldUseDesktopOverlay && 'absolute bottom-0 left-1/2 -translate-x-1/2')}
                />
            </div>
        </div>
    );
};
