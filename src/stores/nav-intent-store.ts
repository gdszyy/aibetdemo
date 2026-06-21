import { create } from 'zustand';

/**
 * Optimistic navigation intent.
 *
 * App Router navigation is a server round-trip (RSC). Active-tab state derived from
 * the committed `usePathname()` therefore can only update *after* the route commits,
 * which makes a clicked tab feel unresponsive on slow/uncached routes.
 *
 * This store records the path the user is navigating *to* the moment they click, so
 * nav components can highlight the target immediately and resolve back to the real
 * pathname once it commits. See `use-nav-intent.ts`.
 */
interface NavIntentState {
    /** Path the user clicked toward, before the route commits. `null` when idle. */
    pendingPath: string | null;
    setPendingPath: (path: string | null) => void;
}

/** Safety net: never let an optimistic highlight stick if a navigation is canceled/aborted. */
const SAFETY_CLEAR_MS = 8000;
let safetyTimer: ReturnType<typeof setTimeout> | null = null;

export const useNavIntentStore = create<NavIntentState>((set) => ({
    pendingPath: null,
    setPendingPath: (pendingPath) => {
        if (safetyTimer) {
            clearTimeout(safetyTimer);
            safetyTimer = null;
        }
        if (pendingPath != null) {
            safetyTimer = setTimeout(() => set({ pendingPath: null }), SAFETY_CLEAR_MS);
        }
        set({ pendingPath });
    },
}));

/** Imperative setter for click handlers (avoids subscribing the caller to the store). */
export const recordNavIntent = (href: string): void => {
    useNavIntentStore.getState().setPendingPath(href);
};

export const clearNavIntent = (): void => {
    useNavIntentStore.getState().setPendingPath(null);
};
