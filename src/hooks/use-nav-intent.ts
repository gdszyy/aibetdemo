'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { usePathname } from '@/i18n';
import { useNavIntentStore } from '@/stores/nav-intent-store';

export { recordNavIntent } from '@/stores/nav-intent-store';

interface ResolvedNavLocation {
    /** Locale-stripped pathname — optimistic target while a click is pending, else the live path. */
    path: string;
    /** Search params matching `path`. Empty while a pending target carries no query string. */
    searchParams: URLSearchParams;
}

const EMPTY_SEARCH = new URLSearchParams();

/**
 * Returns the location nav components should test for active state.
 *
 * While the user is mid-navigation (a click recorded an intent), this returns the
 * *target* location so the active tab highlights instantly. It clears the intent the
 * moment the real route commits, so the highlight then tracks the committed pathname
 * with no flash.
 *
 * Note: `usePathname` here comes from `@/i18n` (locale-stripped), matching the `href`
 * values recorded by `recordNavIntent`, so the two live in the same path space.
 */
export function useResolvedNavLocation(): ResolvedNavLocation {
    const pathname = usePathname();
    const liveSearch = useSearchParams();
    const pendingPath = useNavIntentStore((s) => s.pendingPath);

    const liveSearchKey = liveSearch.toString();

    // Clear the optimistic intent once the committed route changes.
    useEffect(() => {
        void pathname;
        void liveSearchKey;
        useNavIntentStore.getState().setPendingPath(null);
        // pathname / liveSearchKey changing == the navigation committed.
    }, [pathname, liveSearchKey]);

    if (pendingPath == null) {
        return { path: pathname, searchParams: liveSearch };
    }

    const qIndex = pendingPath.indexOf('?');
    if (qIndex === -1) {
        return { path: pendingPath, searchParams: EMPTY_SEARCH };
    }
    return {
        path: pendingPath.slice(0, qIndex),
        searchParams: new URLSearchParams(pendingPath.slice(qIndex + 1)),
    };
}

/**
 * Lightweight subscription for components that already receive a computed `isActive`
 * boolean (e.g. SidebarItem) and only need to override it optimistically by href.
 *
 * Returns the pending target path (query stripped) or `null` when idle.
 */
export function usePendingNavPath(): string | null {
    const pendingPath = useNavIntentStore((s) => s.pendingPath);
    if (pendingPath == null) return null;
    const qIndex = pendingPath.indexOf('?');
    return qIndex === -1 ? pendingPath : pendingPath.slice(0, qIndex);
}
