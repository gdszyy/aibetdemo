'use client';

import { cn } from '@/utils/common';

const LEFT_ELLIPSIS = 'ellipsis-left' as const;
const RIGHT_ELLIPSIS = 'ellipsis-right' as const;
type PaginationItem = number | typeof LEFT_ELLIPSIS | typeof RIGHT_ELLIPSIS;

function range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function generateRange(current: number, total: number, siblings = 1): PaginationItem[] {
    const totalNumbers = siblings * 2 + 5;
    if (total <= totalNumbers) return range(1, total);

    const left = Math.max(current - siblings, 1);
    const right = Math.min(current + siblings, total);
    const showLeftEllipsis = left > 2;
    const showRightEllipsis = right < total - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
        const count = 3 + 2 * siblings;
        return [...range(1, count), RIGHT_ELLIPSIS, total];
    }
    if (showLeftEllipsis && !showRightEllipsis) {
        const count = 3 + 2 * siblings;
        return [1, LEFT_ELLIPSIS, ...range(total - count + 1, total)];
    }
    return [1, LEFT_ELLIPSIS, ...range(left, right), RIGHT_ELLIPSIS, total];
}

type PaginationVariant = 'default' | 'subtle';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    variant?: PaginationVariant;
}

const VARIANT_STYLES: Record<PaginationVariant, { active: string; inactive: string; nav: string; page: string }> = {
    default: {
        active: 'bg-brand-primary-0 text-on-brand rounded-sm',
        inactive: 'text-filltext-ft-e hover:bg-filltext-ft-b rounded-sm',
        nav: 'rounded-sm text-filltext-ft-e hover:bg-filltext-ft-b',
        page: 'text-body-sm',
    },
    subtle: {
        active: 'bg-filltext-ft-b text-filltext-ft-g rounded-full',
        inactive: 'text-filltext-ft-e rounded-full',
        nav: 'rounded-xs bg-filltext-ft-a text-filltext-ft-e',
        page: 'text-body-lg',
    },
};

export function Pagination({ currentPage, totalPages, onPageChange, className, variant = 'default' }: PaginationProps) {
    if (!totalPages || totalPages <= 1) return null;

    const pages = generateRange(currentPage, totalPages);
    const styles = VARIANT_STYLES[variant];

    return (
        <nav className={cn('flex items-center justify-end gap-2', className)}>
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={cn(
                    'flex items-center justify-center size-8 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors',
                    styles.nav,
                )}
            >
                &lt;
            </button>
            {pages.map((item) =>
                typeof item === 'string' ? (
                    <span
                        key={item}
                        className={cn('flex items-center justify-center size-8', styles.page, 'text-filltext-ft-e')}
                    >
                        ...
                    </span>
                ) : (
                    <button
                        type="button"
                        key={item}
                        onClick={() => onPageChange(item)}
                        className={cn(
                            'flex items-center justify-center min-w-8 h-8 cursor-pointer transition-colors',
                            styles.page,
                            item === currentPage ? styles.active : styles.inactive,
                        )}
                    >
                        {item}
                    </button>
                ),
            )}
            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={cn(
                    'flex items-center justify-center size-8 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors',
                    styles.nav,
                )}
            >
                &gt;
            </button>
        </nav>
    );
}
