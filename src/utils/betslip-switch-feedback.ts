import { clamp, getCenter, prefersReducedMotion } from '@/utils/dom';

const FLIP_SLIDE_IN_MS = 240;
const FLIP_IN_MS = 220;
const FLIP_OUT_MS = 220;
const FLIP_HOLD_MS = 800;
const FLIP_SLIDE_OUT_MS = 280;

const CARD_WIDTH = 240;
const CARD_HEIGHT = 64;

type FlipPlacement = 'right' | 'left' | 'top';

type FlipEntry = {
    el: HTMLDivElement;
    lastY: number;
    placement: FlipPlacement;
    flipIn?: Animation;
    flipOut?: Animation;
    slideIn?: Animation;
    slideOut?: Animation;
    hideTimer?: number;
    currentLabel?: string;
};

const ACTIVE_FLIPS = new Map<string, FlipEntry>();

function cleanupFlip(selectionId: string) {
    const active = ACTIVE_FLIPS.get(selectionId);
    if (!active) return;
    if (active.hideTimer) window.clearTimeout(active.hideTimer);
    active.flipIn?.cancel();
    active.flipOut?.cancel();
    active.slideIn?.cancel();
    active.slideOut?.cancel();
    active.el.remove();
    ACTIVE_FLIPS.delete(selectionId);
}

/** Builds or reuses the 3D card node inside the overlay root; returns line elements for title / outcome. */
function createFlipCardDom(root: HTMLDivElement): {
    card: HTMLDivElement;
    titleLine: HTMLElement | null;
    outcomeLine: HTMLElement | null;
} {
    let card = root.firstElementChild as HTMLDivElement | null;
    if (!card) {
        card = document.createElement('div');
        card.style.width = `${CARD_WIDTH}px`;
        card.style.height = `${CARD_HEIGHT}px`;
        card.style.borderRadius = 'var(--radius-sm, 8px)';
        card.style.background = 'var(--color-neutral-white-h, #fff)';
        card.style.border = '1px solid var(--color-brand-primary-0, var(--brand-primary-0, #E80104))';
        card.style.boxShadow = '0 10px 28px color-mix(in srgb, var(--color-brand-primary-0, #E80104) 25%, transparent)';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'center';
        card.style.transformStyle = 'preserve-3d';
        card.style.willChange = 'transform, opacity';
        root.appendChild(card);
    }

    let front = card.querySelector<HTMLDivElement>('[data-face="front"]');
    if (!front) {
        front = document.createElement('div');
        front.setAttribute('data-face', 'front');
        front.style.position = 'absolute';
        front.style.inset = '0';
        front.style.display = 'flex';
        front.style.flexDirection = 'column';
        front.style.alignItems = 'flex-start';
        front.style.justifyContent = 'center';
        front.style.gap = '6px';
        front.style.backfaceVisibility = 'hidden';
        front.style.padding = '10px 14px';
        front.style.textAlign = 'left';
        card.appendChild(front);

        const titleEl = document.createElement('div');
        titleEl.setAttribute('data-line', 'title');
        titleEl.style.width = '100%';
        titleEl.style.fontSize = '14px';
        titleEl.style.lineHeight = '18px';
        titleEl.style.fontWeight = '500';
        titleEl.style.color = 'var(--color-filltext-ft-e, var(--filltext-ft-e, #6D7D98))';
        titleEl.style.whiteSpace = 'nowrap';
        titleEl.style.overflow = 'hidden';
        titleEl.style.textOverflow = 'ellipsis';
        front.appendChild(titleEl);

        const outcomeEl = document.createElement('div');
        outcomeEl.setAttribute('data-line', 'outcome');
        outcomeEl.style.width = '100%';
        outcomeEl.style.fontSize = '14px';
        outcomeEl.style.lineHeight = '18px';
        outcomeEl.style.fontWeight = '400';
        outcomeEl.style.color = 'var(--color-brand-primary-0, var(--brand-primary-0, #E80104))';
        outcomeEl.style.whiteSpace = 'nowrap';
        outcomeEl.style.overflow = 'hidden';
        outcomeEl.style.textOverflow = 'ellipsis';
        front.appendChild(outcomeEl);
    }

    return {
        card,
        titleLine: front.querySelector<HTMLElement>('[data-line="title"]'),
        outcomeLine: front.querySelector<HTMLElement>('[data-line="outcome"]'),
    };
}

function patchFlipEntry(selectionId: string, patch: Partial<FlipEntry>) {
    const entry = ACTIVE_FLIPS.get(selectionId);
    if (entry) Object.assign(entry, patch);
}

/** Slide in → flip (swap label) → hold → slide out; updates ACTIVE_FLIPS animation handles. */
function runFlipAnimationSequence(opts: {
    selectionId: string;
    root: HTMLDivElement;
    card: HTMLDivElement;
    outcomeLine: HTMLElement | null;
    placement: FlipPlacement;
    stableY: number;
    hiddenLeftX: number;
    shownLeftX: number;
    hiddenTopY: number;
    toLabel: string;
}): Animation {
    const { selectionId, root, card, outcomeLine, placement, stableY, hiddenLeftX, shownLeftX, hiddenTopY, toLabel } =
        opts;

    const slideIn =
        placement === 'left'
            ? root.animate(
                  [
                      { transform: `translate3d(${hiddenLeftX}px, ${stableY}px, 0)`, opacity: 0 },
                      { transform: `translate3d(${shownLeftX}px, ${stableY}px, 0)`, opacity: 1 },
                  ],
                  { duration: FLIP_SLIDE_IN_MS, easing: 'ease-out', fill: 'forwards' },
              )
            : placement === 'top'
              ? root.animate(
                    [
                        { transform: `translate3d(0px, ${hiddenTopY}px, 0)`, opacity: 0 },
                        { transform: `translate3d(0px, ${stableY}px, 0)`, opacity: 1 },
                    ],
                    { duration: FLIP_SLIDE_IN_MS, easing: 'ease-out', fill: 'forwards' },
                )
              : root.animate(
                    [
                        { transform: `translate3d(120%, ${stableY}px, 0)`, opacity: 0 },
                        { transform: `translate3d(0%, ${stableY}px, 0)`, opacity: 1 },
                    ],
                    { duration: FLIP_SLIDE_IN_MS, easing: 'ease-out', fill: 'forwards' },
                );

    slideIn.onfinish = () => {
        if (placement === 'left') {
            root.style.transform = `translate3d(${shownLeftX}px, ${stableY}px, 0)`;
        } else if (placement === 'top') {
            root.style.transform = `translate3d(0px, ${stableY}px, 0)`;
        } else {
            root.style.transform = `translate3d(0%, ${stableY}px, 0)`;
        }

        const flipIn = card.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(90deg)' }], {
            duration: FLIP_IN_MS,
            easing: 'ease-in',
            fill: 'forwards',
        });

        flipIn.onfinish = () => {
            if (outcomeLine) outcomeLine.textContent = toLabel;

            const flipOut = card.animate([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }], {
                duration: FLIP_OUT_MS,
                easing: 'ease-out',
                fill: 'forwards',
            });

            flipOut.onfinish = () => {
                const hideTimer = window.setTimeout(() => {
                    const slideOut =
                        placement === 'left'
                            ? root.animate(
                                  [
                                      { transform: `translate3d(${shownLeftX}px, ${stableY}px, 0)`, opacity: 1 },
                                      { transform: `translate3d(${hiddenLeftX}px, ${stableY}px, 0)`, opacity: 0 },
                                  ],
                                  { duration: FLIP_SLIDE_OUT_MS, easing: 'ease-in', fill: 'forwards' },
                              )
                            : placement === 'top'
                              ? root.animate(
                                    [
                                        { transform: `translate3d(0px, ${stableY}px, 0)`, opacity: 1 },
                                        { transform: `translate3d(0px, ${hiddenTopY}px, 0)`, opacity: 0 },
                                    ],
                                    { duration: FLIP_SLIDE_OUT_MS, easing: 'ease-in', fill: 'forwards' },
                                )
                              : root.animate(
                                    [
                                        { transform: `translate3d(0%, ${stableY}px, 0)`, opacity: 1 },
                                        { transform: `translate3d(120%, ${stableY}px, 0)`, opacity: 0 },
                                    ],
                                    { duration: FLIP_SLIDE_OUT_MS, easing: 'ease-in', fill: 'forwards' },
                                );
                    patchFlipEntry(selectionId, { slideOut });
                    slideOut.onfinish = () => cleanupFlip(selectionId);
                }, FLIP_HOLD_MS);

                patchFlipEntry(selectionId, { hideTimer });
            };

            patchFlipEntry(selectionId, { flipOut });
        };

        patchFlipEntry(selectionId, { flipIn });
    };

    return slideIn;
}

export function showBetslipSwitchFlip({
    selectionId,
    title,
    fromLabel,
    toLabel,
    anchorEl,
    desiredY,
    placement = 'right',
    gapPx = 30,
}: {
    selectionId: string;
    title: string;
    fromLabel?: string;
    toLabel: string;
    anchorEl: HTMLElement;
    desiredY?: number;
    placement?: FlipPlacement;
    gapPx?: number;
}) {
    if (typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;

    const anchor = getCenter(anchorEl);
    const viewportH = window.innerHeight || 800;

    const existing = ACTIVE_FLIPS.get(selectionId);
    const yRaw = desiredY ?? existing?.lastY ?? anchor.y;
    const y = desiredY !== undefined ? clamp(yRaw, 0, viewportH - 80) : clamp(yRaw, 80, viewportH - 80);

    const root = existing?.el ?? document.createElement('div');
    if (!existing) {
        root.style.position = 'fixed';
        root.style.top = '0';
        root.style.pointerEvents = 'none';
        root.style.zIndex = '65';
        root.style.perspective = '800px';
        document.body.appendChild(root);
    }

    const hiddenLeftX = -(CARD_WIDTH + gapPx + 40);
    const shownLeftX = -(CARD_WIDTH + gapPx);
    let layoutY = y;

    if (placement === 'left') {
        const rect = anchorEl.getBoundingClientRect();
        root.style.left = `${rect.left}px`;
        root.style.right = '';
        root.style.transform = `translate3d(${hiddenLeftX}px, ${y}px, 0)`;
    } else if (placement === 'top') {
        const rect = anchorEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const left = centerX - CARD_WIDTH / 2;
        const computedTopY = clamp(rect.top - CARD_HEIGHT - gapPx, 0, viewportH - CARD_HEIGHT);
        const topY = desiredY !== undefined ? clamp(desiredY, 0, viewportH - CARD_HEIGHT) : computedTopY;
        layoutY = topY;
        root.style.left = `${left}px`;
        root.style.right = '';
        root.style.transform = `translate3d(0px, ${topY + 16}px, 0)`;
    } else {
        root.style.right = '48px';
        root.style.left = '';
        root.style.transform = `translate3d(120%, ${y}px, 0)`;
    }

    const { card, titleLine, outcomeLine } = createFlipCardDom(root);
    if (titleLine) titleLine.textContent = title;

    const stableY = existing && existing.placement === placement ? existing.lastY : layoutY;
    const hiddenTopY = stableY + 16;
    if (existing) {
        if (placement === 'left') {
            root.style.transform = `translate3d(${shownLeftX}px, ${stableY}px, 0)`;
        } else if (placement === 'top') {
            root.style.transform = `translate3d(0px, ${stableY}px, 0)`;
        } else {
            root.style.transform = `translate3d(0%, ${stableY}px, 0)`;
        }
    }

    existing?.flipIn?.cancel();
    existing?.flipOut?.cancel();
    existing?.slideIn?.cancel();
    existing?.slideOut?.cancel();
    if (existing?.hideTimer) window.clearTimeout(existing.hideTimer);
    if (outcomeLine) {
        outcomeLine.textContent = existing?.currentLabel ?? fromLabel ?? outcomeLine.textContent ?? toLabel;
    }

    const slideIn = runFlipAnimationSequence({
        selectionId,
        root,
        card,
        outcomeLine,
        placement,
        stableY,
        hiddenLeftX,
        shownLeftX,
        hiddenTopY,
        toLabel,
    });

    ACTIVE_FLIPS.set(selectionId, {
        el: root,
        lastY: stableY,
        placement,
        slideIn,
        currentLabel: toLabel,
    });
}
