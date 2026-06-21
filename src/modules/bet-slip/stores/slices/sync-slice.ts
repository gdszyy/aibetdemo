import type { StateCreator } from 'zustand';
import { GetCartInterface, PutCartItemInterface } from '@/api/handlers/cart';
import type { Cart } from '@/api/models/cart';
import { CartStatus } from '@/api/models/cart';
import { ERROR_CODE } from '@/constants';
import { config } from '@/constants/config';
import {
    convertCartItemToOddsEntity,
    convertOddsEntityToCartItem,
    getUniqueSelectionId,
    mergeCartSelectionsByTimestamp,
} from '@/modules/bet-slip/_logic/cart-sync';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { useSessionStore } from '@/stores/session-store';
import { ApiError, AppError, reportError } from '@/utils/error';
import { verifyLocalSelections } from '../internal/lifecycle';
import { createSelectionSnapshotPatch } from '../internal/selection-snapshot';
import type { BetSlipState, SyncSlice } from './_types';

// === Module-level variables ===

// fetchLatest throttle
let lastCartFetchTime = 0;
let pendingCartFetchPromise: Promise<void> | null = null;
const CART_FETCH_THROTTLE_MS = 2000;

// syncToServer debounce
let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const SYNC_DEBOUNCE_MS = 300;

// Cart lock fallback mechanism
let cartLockFallbackTimer: ReturnType<typeof setTimeout> | null = null;
const CART_LOCK_TIMEOUT_MS = 20000;

/**
 * Create Sync Slice.
 * Uses full sync + version control + conflict fallback (Plan A).
 *
 * Core flow:
 * 1. listSlice action -> optimistic UI update -> call syncToServer()
 * 2. syncToServer() debounce 300ms -> get current selections -> PUT { version, items }
 * 3. Success -> update version; full GET snapshots preserve fresher WS selection data by timestamp
 * 4. Version conflict -> fetchLatest pulls server latest, discards unsynced local changes
 */
export const createSyncSlice: StateCreator<BetSlipState, [], [], SyncSlice> = (set, get) => {
    /**
     * Internal method that actually executes the sync.
     */
    const executePutSync = async () => {
        const { selections, version, isSyncing, hasPendingSync } = get();

        if (isSyncing) {
            if (config.isDev) console.log('[syncToServer] Already syncing, scheduling retry...');
            // Currently syncing — schedule retry after current sync finishes (clear existing timer to prevent leak)
            if (syncDebounceTimer) {
                clearTimeout(syncDebounceTimer);
            }
            syncDebounceTimer = setTimeout(executePutSync, SYNC_DEBOUNCE_MS);
            return;
        }

        if (!hasPendingSync) {
            return;
        }

        // Don't sync when not logged in
        const { data } = useSessionStore.getState();
        if (!data?.user?.uid) return;

        set({ isSyncing: true });

        try {
            const items = selections.map((s) => convertOddsEntityToCartItem(s));

            const res = await PutCartItemInterface({
                version: version ?? 0,
                items,
            });

            // Success: only update version. Don't use mergeRemoteCart because API doesn't return full data
            if (config.isDev) console.log(`Cart PUT sync successful. New Version: v${res.version}`);
            set({
                version: res.version,
                hasPendingSync: false,
            });
        } catch (error: unknown) {
            const err = error as { code?: number };
            console.error('🛑 Cart PUT sync failed:', error);

            if (err?.code === 200001) {
                // Version conflict: server has newer data, fetch latest to overwrite local
                if (config.isDev) console.log('Version conflict detected, fetching latest from server...');
                await get().fetchLatest(true);
            } else {
                // Non-conflict error (network issues etc.): keep local selections and maintain pending state
                // Will retry on next user action or page re-initialization
                if (config.isDev) console.log('Sync failed (non-conflict), preserving local selections as pending.');
            }
        } finally {
            set({ isSyncing: false });
        }
    };

    return {
        // === Initial state ===
        version: null,
        cartStatus: null,
        isOddsAnimationSuspended: false,
        isSyncing: false,
        hasPendingSync: false,
        onClearAll: undefined,

        // === Sync operations ===

        /**
         * Trigger debounced sync (300ms).
         * Merges rapid consecutive operations (e.g., quick add/remove of multiple selections) before uploading.
         */
        syncToServer: () => {
            if (syncDebounceTimer) {
                clearTimeout(syncDebounceTimer);
            }
            syncDebounceTimer = setTimeout(executePutSync, SYNC_DEBOUNCE_MS);
        },

        fetchLatest: async (force?: boolean) => {
            const { data } = useSessionStore.getState();
            const user = data?.user;
            if (!user?.uid) return;

            const now = Date.now();

            // Reuse in-flight request
            if (pendingCartFetchPromise) {
                if (config.isDev) console.log('[CartStore] Reusing pending cart fetch call');
                return pendingCartFetchPromise;
            }

            // Throttle (unless force)
            if (!force && now - lastCartFetchTime < CART_FETCH_THROTTLE_MS) {
                if (config.isDev) console.log('[CartStore] Skipping cart fetch - too soon since last call');
                return;
            }

            if (config.isDev) console.log('[CartStore] Making cart API call');
            lastCartFetchTime = now;

            pendingCartFetchPromise = (async () => {
                try {
                    const res = await GetCartInterface();
                    get().mergeRemoteCart(res);
                    // Use setCartStatus so that the fallback timeout logic applies globally
                    // whether it's an initial page load (fetchLatest) or a WS push
                    get().setCartStatus(res.status);
                    set({
                        version: res.version,
                    });
                    if (config.isDev) console.log(`Cart data pull successful v${res.version}`);
                } catch (e) {
                    if (e instanceof ApiError && e.context.code === ERROR_CODE.TOKEN_EXPIRED_SILENT) {
                        return;
                    }
                    console.error('Failed to pull cart:', e);
                } finally {
                    pendingCartFetchPromise = null;
                }
            })();

            return pendingCartFetchPromise;
        },

        recheckSelections: async () => {
            const { selections } = get();

            if (selections.length === 0) {
                return;
            }

            const { data } = useSessionStore.getState();
            if (data?.user?.uid) {
                await get().fetchLatest(true);
                return;
            }

            const verifiedSelections = await verifyLocalSelections(selections);
            const verifiedSelectionMap = new Map<string, OddsEntity>(
                verifiedSelections.map((selection) => [getUniqueSelectionId(selection), selection]),
            );

            const mergedSelections = get().selections.map((selection) => {
                const verifiedSelection = verifiedSelectionMap.get(getUniqueSelectionId(selection));
                if (!verifiedSelection) {
                    return selection;
                }

                return verifiedSelection.timestamp < selection.timestamp ? selection : verifiedSelection;
            });

            get().setSelections(mergedSelections, { pendingSync: false });
        },

        mergeRemoteCart: (remoteCart: Cart) => {
            const remoteSelections: OddsEntity[] =
                remoteCart.list?.map((item) => convertCartItemToOddsEntity(item, item.event_id)) ?? [];

            set((state) =>
                createSelectionSnapshotPatch({
                    selections: mergeCartSelectionsByTimestamp(state.selections, remoteSelections),
                    hasPendingSync: false,
                }),
            );
        },

        setCartStatus: (status: CartStatus) => {
            set({ cartStatus: status });

            if (status === CartStatus.Locked) {
                if (cartLockFallbackTimer) {
                    clearTimeout(cartLockFallbackTimer);
                }
                cartLockFallbackTimer = setTimeout(() => {
                    const currentStatus = get().cartStatus;
                    if (currentStatus === CartStatus.Locked) {
                        if (config.isDev) {
                            console.warn('[CartStore] Cart locked for over 20s, fetching latest to recover...');
                        }

                        const session = useSessionStore.getState().data;
                        const userUid = session?.user?.uid;
                        const userSuffix = userUid ? userUid.slice(-6) : undefined;
                        const cartVersion = get().version;

                        reportError(
                            new AppError('Cart lock timeout fallback triggered', {
                                level: 'warning',
                                tags: {
                                    module: 'bet-slip',
                                    action: 'cart-unlock-fallback',
                                    trigger: 'lock-timeout',
                                },
                                extra: {
                                    ...(userSuffix ? { userSuffix } : {}),
                                    cartVersion: cartVersion ?? 'unknown',
                                },
                            }),
                        );

                        get().fetchLatest(true);
                    }
                }, CART_LOCK_TIMEOUT_MS);
            } else {
                if (cartLockFallbackTimer) {
                    clearTimeout(cartLockFallbackTimer);
                    cartLockFallbackTimer = null;
                }
            }
        },

        setOddsAnimationSuspended: (isOddsAnimationSuspended: boolean) => {
            set({ isOddsAnimationSuspended });
        },
    };
};
