import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { usePathname, useRouter } from '@/i18n';
import { TransactionTab } from '../_constants';

const VALID_TABS = new Set(Object.values(TransactionTab));

function parseTab(value: string | null): TransactionTab {
    if (value && VALID_TABS.has(value as TransactionTab)) return value as TransactionTab;
    return TransactionTab.BALANCE;
}

/**
 * Single source of truth for transaction page URL state.
 * All tab/filter state lives in searchParams — no local useState needed.
 */
export function useTransactionParams() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const tab = parseTab(searchParams.get('tab'));
    const type = searchParams.get('type') || 'all';
    const period = searchParams.get('period') || '-1';
    const page = Number(searchParams.get('page')) || 1;

    const updateParams = useCallback(
        (updates: Record<string, string | null>, mode: 'push' | 'replace' = 'replace') => {
            const params = new URLSearchParams(searchParams);
            for (const [key, value] of Object.entries(updates)) {
                if (value === null) params.delete(key);
                else params.set(key, value);
            }
            const url = `${pathname}?${params.toString()}`;
            if (mode === 'push') router.push(url);
            else router.replace(url);
        },
        [searchParams, router, pathname],
    );

    /** Switch tab — clears sub-filter params, uses push for back-button support */
    const setTab = useCallback(
        (newTab: TransactionTab) => {
            updateParams({ tab: newTab, type: null, period: null, page: null }, 'push');
        },
        [updateParams],
    );

    /** Update sub-filter params — uses replace to avoid history spam */
    const setFilter = useCallback(
        (updates: Record<string, string | null>) => {
            updateParams({ ...updates, page: null }, 'replace');
        },
        [updateParams],
    );

    /** Update page number */
    const setPage = useCallback(
        (p: number) => {
            updateParams({ page: p <= 1 ? null : String(p) }, 'replace');
        },
        [updateParams],
    );

    return { tab, type, period, page, setTab, setFilter, setPage };
}
