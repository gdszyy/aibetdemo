import { type BetType, CartStatus } from '@/api/models/cart';
import { Toast } from '@/components/toast';
import type { TranslationKey } from '@/i18nV2/types';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { useUIStore } from '@/stores/ui-store';
import { showBetslipSwitchFlip } from '@/utils/betslip-switch-feedback';
import { cancelBezierEnergyBall, launchBezierEnergyBall } from '@/utils/fly-energy-ball-bezier';
import { getOutcomeDisplayName } from '@/utils/outcome-display';
import { checkSelectionLimit } from '@/utils/selection-limit';
import { isSameLine } from '@/utils/specifier';
import {
    animateOutcomeBreathing,
    animateSelectionCardEntry,
    getAnimationKey,
    getSelectionId,
    pulseBetSlipBadge,
    resolveBetSlipDrawerEl,
    resolveBetslipToggleEl,
    resolveEnergyBallTarget,
    resolveMobileBetSlipTabEl,
    resolveSelectionCardEl,
    resolveSelectionOutcomeEl,
    resolveSlipTabBadgeEl,
    scrollSlipListToTopThen,
} from './bet-animation-utils';

/**
 * Common logic for handling a bet button click
 * Extracted from component to be reusable in different UI variants
 */
export const executeBetClick = ({
    oddsEntity,
    selections,
    betMode,
    cartStatus,
    toggle,
    t,
    triggerEl,
}: {
    oddsEntity: OddsEntity;
    selections: OddsEntity[];
    betMode: BetType;
    cartStatus: CartStatus;
    toggle: (entity: OddsEntity) => void;
    t: (key: TranslationKey<'betSlip'>, params?: Record<string, string | number>) => string;
    triggerEl?: HTMLElement;
}) => {
    // 1. Block if cart is locked (ordering in progress)
    if (cartStatus === CartStatus.Locked) {
        Toast.loading(t('message.waitOrderComplete'), { id: 'wait-order', duration: 3000 });
        return;
    }

    const sameSelectionIndex = selections.findIndex(
        (s) => s.outcome.id === oddsEntity.outcome.id && isSameLine(s, oddsEntity),
    );
    const sameLineIndex = selections.findIndex((s) => isSameLine(s, oddsEntity));
    const isRemovingSameSelection = sameSelectionIndex !== -1;
    const isSwitchingSameLine = !isRemovingSameSelection && sameLineIndex !== -1;
    const isAddingNew = !isRemovingSameSelection && !isSwitchingSameLine;

    if (isAddingNew) {
        const { canAdd, shouldWarn, maxLimit } = checkSelectionLimit(selections.length, betMode);

        if (!canAdd) {
            Toast.error(t('toast.maxSelectionsReached', { count: maxLimit }), { id: 'max-selections' });
            return;
        }
        if (shouldWarn) {
            Toast.warn(t('toast.tooManySelectionsWarning'), { id: 'selections-warning' });
        }

        // Intentionally do NOT auto-open the bet slip when adding to an empty cart.
        // The selection is added silently; the user opens the slip manually (mobile: cart summary bar; desktop: floating panel).
    }

    const animationKey = getAnimationKey(oddsEntity);
    const selectionId = getSelectionId(oddsEntity);

    // 5. Perform the toggle (keep business behavior unchanged)
    toggle(oddsEntity);

    // === Visual feedback (no business side-effects below) ===
    const isDrawerOpen = useUIStore.getState().betSlipDrawerOpen;

    // A) New selection: when drawer open, wait for card to appear then launch to that card.
    if (isAddingNew) {
        if (triggerEl) {
            if (isDrawerOpen) {
                const startAt = performance.now();
                const maxWaitMs = 700;
                const tick = () => {
                    const cardEl = resolveSelectionCardEl(selectionId);
                    if (cardEl) {
                        launchBezierEnergyBall({
                            key: animationKey,
                            fromEl: triggerEl,
                            toEl: cardEl,
                            onApproachEnd: () => {
                                pulseBetSlipBadge();
                                if (window.innerWidth >= 1024) {
                                    animateSelectionCardEntry(cardEl);
                                }
                            },
                        });
                        return;
                    }
                    if (performance.now() - startAt > maxWaitMs) {
                        const badgeEl = resolveSlipTabBadgeEl();
                        if (badgeEl) {
                            launchBezierEnergyBall({
                                key: animationKey,
                                fromEl: triggerEl,
                                toEl: badgeEl,
                                onApproachEnd: pulseBetSlipBadge,
                            });
                        }
                        return;
                    }
                    window.requestAnimationFrame(tick);
                };
                window.requestAnimationFrame(tick);
            } else {
                const targetEl = resolveEnergyBallTarget();
                if (targetEl) {
                    launchBezierEnergyBall({
                        key: animationKey,
                        fromEl: triggerEl,
                        toEl: targetEl,
                        onApproachEnd: pulseBetSlipBadge,
                    });
                }
            }
        }
        return;
    }

    // B) Switch (same line, different outcome): no fly ball, show switch feedback.
    if (isSwitchingSameLine) {
        cancelBezierEnergyBall(animationKey);
        const prevOutcome = selections[sameLineIndex]?.outcome;
        const prevOutcomeName = prevOutcome ? getOutcomeDisplayName(prevOutcome) : undefined;
        const nextOutcomeName = getOutcomeDisplayName(oddsEntity.outcome);
        const mobileSlipTabEl = resolveMobileBetSlipTabEl();

        // H5: always show switch flip above mobile slips tab.
        if (mobileSlipTabEl) {
            showBetslipSwitchFlip({
                selectionId,
                title: oddsEntity.marketName,
                fromLabel: prevOutcomeName,
                toLabel: nextOutcomeName,
                anchorEl: mobileSlipTabEl,
                placement: 'top',
                gapPx: 12,
            });
            return;
        }

        if (isDrawerOpen) {
            window.requestAnimationFrame(() => {
                const outcomeEl = resolveSelectionOutcomeEl(selectionId);
                if (outcomeEl) {
                    // PC + slip tab + current card in DOM: bring slip list to top on switch.
                    scrollSlipListToTopThen(outcomeEl, () => {
                        animateOutcomeBreathing(outcomeEl);
                    });
                    return;
                }

                const drawerEl = resolveBetSlipDrawerEl();
                const flipAnchorEl = drawerEl;
                if (!flipAnchorEl) return;
                showBetslipSwitchFlip({
                    selectionId,
                    title: oddsEntity.marketName,
                    fromLabel: prevOutcomeName,
                    toLabel: nextOutcomeName,
                    anchorEl: flipAnchorEl,
                    placement: 'left',
                    gapPx: 10,
                    desiredY: 68,
                });
            });
        } else {
            const anchorEl = resolveBetslipToggleEl();
            if (anchorEl) {
                showBetslipSwitchFlip({
                    selectionId,
                    title: oddsEntity.marketName,
                    fromLabel: prevOutcomeName,
                    toLabel: nextOutcomeName,
                    anchorEl,
                });
            }
        }
        return;
    }

    // C) Remove same selection: if there was an active flight, cancel/explode.
    if (isRemovingSameSelection) {
        cancelBezierEnergyBall(animationKey);
    }
};
