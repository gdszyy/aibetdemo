import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { useUIStore } from '@/stores/ui-store';
import { prefersReducedMotion } from '@/utils/dom';

function isVisibleEl(el: HTMLElement): boolean {
    // `querySelector` may return elements that are mounted but hidden by responsive CSS.
    // Those often produce zero rects (or 0x0) and lead to incorrect animation direction.
    if (!el.isConnected) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (el.getClientRects().length === 0) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
}

function queryFirstVisible(selectors: string[]): HTMLElement | null {
    for (const selector of selectors) {
        const el = document.querySelector<HTMLElement>(selector);
        if (el && isVisibleEl(el)) return el;
    }
    return null;
}

export function getAnimationKey(oddsEntity: OddsEntity): string {
    return `${oddsEntity.eventId}:${oddsEntity.marketId}:${oddsEntity.outcome.id}`;
}

export function getSelectionId(oddsEntity: OddsEntity): string {
    return `${oddsEntity.eventId}:${oddsEntity.productId}:${oddsEntity.marketId}:${oddsEntity.specifiers}`;
}

export function resolveEnergyBallTarget(): HTMLElement | null {
    const isDrawerOpen = useUIStore.getState().betSlipDrawerOpen;
    if (isDrawerOpen) {
        return queryFirstVisible(['[data-energy-ball-target="betslip-panel"]']);
    }
    // Prefer the visible target for the current breakpoint to avoid selecting hidden mobile elements on desktop.
    const isDesktop = window.matchMedia?.('(min-width: 1024px)')?.matches ?? false;
    return queryFirstVisible(
        isDesktop
            ? ['[data-energy-ball-target="betslip-toggle"]', '[data-energy-ball-target="betslip-badge"]']
            : [
                  '[data-energy-ball-target="mobile-betslip-badge"]',
                  '[data-energy-ball-target="mobile-betslip-tab"]',
                  '[data-energy-ball-target="betslip-toggle"]',
                  '[data-energy-ball-target="betslip-badge"]',
              ],
    );
}

export function pulseBetSlipBadge() {
    const badgeEl = queryFirstVisible([
        '[data-energy-ball-target="mobile-betslip-badge"]',
        '[data-energy-ball-target="betslip-badge"]',
    ]);
    if (!badgeEl) return;
    badgeEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], {
        duration: 280,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'none',
    });
}

export function resolveSelectionCardEl(selectionId: string): HTMLElement | null {
    return document.querySelector<HTMLElement>(`[data-energy-ball-selection-id="${CSS.escape(selectionId)}"]`);
}

export function resolveSelectionOutcomeEl(selectionId: string): HTMLElement | null {
    return document.querySelector<HTMLElement>(
        `[data-energy-ball-selection-id="${CSS.escape(selectionId)}"] [data-energy-ball-outcome]`,
    );
}

export function resolveSlipTabBadgeEl(): HTMLElement | null {
    return queryFirstVisible([
        '[data-energy-ball-target="mobile-betslip-badge"]',
        '[data-energy-ball-target="betslip-tab-slip-badge"]',
    ]);
}

export function resolveBetSlipDrawerEl(): HTMLElement | null {
    return document.querySelector<HTMLElement>('[data-testid="bet-slip-drawer"]');
}

export function resolveMobileBetSlipTabEl(): HTMLElement | null {
    return queryFirstVisible(['[data-energy-ball-target="mobile-betslip-tab"]']);
}

export function resolveBetslipToggleEl(): HTMLElement | null {
    return queryFirstVisible(['[data-energy-ball-target="betslip-toggle"]']);
}

function resolveScrollableAncestor(el: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = el;
    while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const isScrollableY = /(auto|scroll)/.test(style.overflowY);
        if (isScrollableY && current.scrollHeight > current.clientHeight) {
            return current;
        }
        current = current.parentElement;
    }
    return null;
}

/** Per-container cancel map — prevents independent scroll containers from cancelling each other */
const pendingScrollCancellers = new WeakMap<HTMLElement, () => void>();

/** Smooth-scroll slip list to top, then run `onDone`. Returns cancel; starting a new scroll on the same container cancels the previous chain. */
export function scrollSlipListToTopThen(selectionOutcomeEl: HTMLElement, onDone: () => void): () => void {
    const scrollableEl = resolveScrollableAncestor(selectionOutcomeEl);

    // Cancel any pending scroll on the same container
    if (scrollableEl) {
        pendingScrollCancellers.get(scrollableEl)?.();
    }

    let cancelled = false;
    const release = () => {
        if (scrollableEl && pendingScrollCancellers.get(scrollableEl) === cancel) {
            pendingScrollCancellers.delete(scrollableEl);
        }
    };
    const cancel = () => {
        cancelled = true;
        release();
    };
    if (scrollableEl) {
        pendingScrollCancellers.set(scrollableEl, cancel);
    }

    const finish = () => {
        release();
        if (!cancelled) onDone();
    };

    if (!scrollableEl || scrollableEl.scrollTop <= 1) {
        finish();
        return cancel;
    }

    scrollableEl.scrollTo({ top: 0, behavior: 'smooth' });
    const startAt = performance.now();
    const maxWaitMs = 650;
    const tick = () => {
        if (cancelled) return;
        if (scrollableEl.scrollTop <= 1 || performance.now() - startAt >= maxWaitMs) {
            finish();
            return;
        }
        window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
    return cancel;
}

export function animateOutcomeBreathing(el: HTMLElement) {
    if (prefersReducedMotion()) return;

    const brandColor = 'var(--color-brand-primary-0)';
    const brandGlow = `0 8px 16px color-mix(in srgb, ${brandColor} 55%, transparent)`;
    const highlightFrame = {
        color: brandColor,
        transform: 'scale(1.05)',
        textShadow: brandGlow,
    };

    el.animate(
        [
            { color: 'inherit', transform: 'scale(1)', textShadow: '0 0 0 transparent', offset: 0 },
            { ...highlightFrame, offset: 0.3 },
            { ...highlightFrame, offset: 0.73 },
            { ...highlightFrame, offset: 0.9 },
            { color: 'var(--color-filltext-ft-g)', transform: 'scale(1)', textShadow: '0 0 0 transparent', offset: 1 },
        ],
        { duration: 800, easing: 'ease-out', fill: 'forwards' },
    );
}

export function animateSelectionCardEntry(el: HTMLElement) {
    if (prefersReducedMotion()) return;

    const brandColor = 'var(--color-brand-primary-0)';
    const restFrame = {
        transform: 'scale(1)',
        boxShadow: '0 0 0 0 transparent',
        borderWidth: '0px',
        borderStyle: 'solid' as const,
        borderColor: 'transparent',
    };
    const highlightFrame = {
        transform: 'scale(1.008)',
        boxShadow: `0 2px 6px color-mix(in srgb, ${brandColor} 12%, transparent)`,
        borderWidth: '1px',
        borderStyle: 'solid' as const,
        borderColor: brandColor,
    };

    el.animate(
        [
            { ...restFrame, offset: 0 },
            { ...highlightFrame, offset: 0.1 },
            { ...highlightFrame, offset: 0.75 },
            { ...restFrame, offset: 1 },
        ],
        { duration: 1600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' },
    );
}
