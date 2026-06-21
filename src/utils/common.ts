import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const colors = [
    'brand-primary-0',
    'brand-primary-1',
    'brand-primary-2',
    'brand-primary-3',
    'brand-primary-4',
    'brand-primary-5',

    'func-win',
    'func-lost',
    'func-favorite',
    'func-bonus',
    'func-pending',
    'func-void',

    'promo-parlay-boost-bg',
    'promo-parlay-boost-accent',

    'filltext-ft-a',
    'filltext-ft-b',
    'filltext-ft-c',
    'filltext-ft-d',
    'filltext-ft-e',
    'filltext-ft-f',
    'filltext-ft-g',
    'filltext-ft-h',

    'neutral-white-a',
    'neutral-white-b',
    'neutral-white-c',
    'neutral-white-d',
    'neutral-white-e',
    'neutral-white-f',
    'neutral-white-g',
    'neutral-white-h',

    'neutral-black-a',
    'neutral-black-b',
    'neutral-black-c',
    'neutral-black-d',
    'neutral-black-e',
    'neutral-black-f',
    'neutral-black-g',
    'neutral-black-h',

    'auxiliary-pink',
    'auxiliary-orange',
    'auxiliary-green',
    'auxiliary-blue',
    'auxiliary-purple',
    'auxiliary-brown',
    'auxiliary-cyan',
    'auxiliary-gray',

    'brand-red',

    'background',
    'foreground',

    'card-rbd',
    'mini-sbd',

    'page-bg',
    'surface-1',
    'surface-2',
    'surface-3',
    'surface-shell',
    'surface-selected',
    'surface-raised',
    'surface-muted',
    'border-subtle',
    'border-strong',
    'content-primary',
    'content-secondary',
    'content-muted',
    'content-inverse',
    'on-brand',
    'accent-warm',
    'status-success-surface',
    'status-success-text',
    'status-danger-surface',
    'status-danger-text',
    'status-info-surface',
];

/**
 * Custom tailwind-merge configuration to handle project-specific design tokens.
 * This ensures that custom font-size tokens and text-color tokens do not conflict.
 */
const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            /** Prevent tailwind-merge from merging all text-* classes */
            'font-size': [
                // New naming convention (2026-01)
                'text-auxiliary-xxs',
                'text-auxiliary-2xs',
                'text-auxiliary-xs',
                'text-auxiliary-sm',
                'text-auxiliary-md',
                'text-body-sm',
                'text-body-md',
                'text-body-lg',
                'text-title-sm',
                'text-title-md',
                'text-title-lg',
                'text-market',
                'text-headline-sm',
                'text-headline-md',
                'text-headline-lg',
            ],
            'text-color': colors.map((v) => `text-${v}`),
            'bg-color': colors.map((v) => `bg-${v}`),
            'border-color': colors.map((v) => `border-${v}`),
        },
    },
});

/** Class merge (Tailwind Merge + Clsx) */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Check whether a value is null or undefined */
export function isNullish<T>(value: T | null | undefined): value is null | undefined {
    return value == null;
}

/** Delay for the specified number of milliseconds */
export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
