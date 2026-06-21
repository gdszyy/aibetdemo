/**
 * UI Layout Constants
 * Centralized dimensions used for sticky positioning, layout calculations, and spacing.
 */

export const UI_CONSTANTS = {
    /** Main Navigation Header height on mobile (56px) */
    HEADER_HEIGHT_MOBILE: 56,
    /** Main Navigation Header height on desktop (72px) */
    HEADER_HEIGHT_DESKTOP: 72,

    /** Tailwind-compatible class strings for top offset */
    STICKY_TOP_CLASS: 'top-0 md:top-14 md:top-[calc(72px+var(--header-strip-height))]',
} as const;
