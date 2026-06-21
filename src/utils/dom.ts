import { DomIdEnum } from '@/constants';

export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return true;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export function clamp(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, n));
}

export function getCenter(el: HTMLElement): { x: number; y: number } {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/**
 * Safely get the portal container element for client-side rendering.
 * Returns undefined during server-side rendering or if the element is not found.
 *
 * @param id The DOM ID of the container element (default: DomIdEnum.ModalContainer)
 */
export function getPortalContainer(id: string = DomIdEnum.ModalContainer): HTMLElement | undefined {
    if (typeof window === 'undefined') return undefined;
    return document.getElementById(id) ?? undefined;
}
