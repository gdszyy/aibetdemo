import type { Cart, CartStatus } from '@/api/models/cart';
import type { LiveScorePayload, MatchStatusPayload, OddsChangePayload } from '@/api/models/ws';
import type { OddsEntity } from '@/modules/match/_constants/match.types';

export interface SetSelectionsOptions {
    pendingSync?: boolean;
}

/**
 * List Slice — manages add/remove operations on the selections list.
 */
export interface ListSlice {
    // === State ===
    selections: OddsEntity[];

    // === List operations ===
    /** Remove selection */
    remove: (oddsEntity: OddsEntity) => void;
    /** Toggle selection (select/deselect) */
    toggle: (oddsEntity: OddsEntity) => void;
    /** Clear all selections */
    clearAll: () => void;
    /** Set selections (for merging remote data) */
    setSelections: (selections: OddsEntity[], options?: SetSelectionsOptions) => void;
}

/**
 * Item Slice — manages selection item updates (odds, status, etc.).
 */
export interface ItemSlice {
    /** Update based on WebSocket odds change */
    updateByOddsChangePayload: (matchId: string, payload: OddsChangePayload) => void;
    /** 根据 WebSocket LiveScore 更新赛事阶段。 */
    updateByLiveScorePayload: (matchId: string, payload: LiveScorePayload) => void;
    /** 根据 WebSocket 赛事状态变化更新赛事阶段。 */
    updateByMatchStatusPayload: (matchId: string, payload: MatchStatusPayload) => void;
}

/**
 * Sync Slice — manages server sync state and methods.
 */
export interface SyncSlice {
    // === State ===
    version: number | null;
    cartStatus: CartStatus | null;
    isOddsAnimationSuspended: boolean;
    /** Whether currently syncing (prevents concurrency) */
    isSyncing: boolean;
    /** Whether there are local changes not yet confirmed by server */
    hasPendingSync: boolean;

    // === Sync operations ===
    /** Trigger debounced sync (300ms, merges rapid operations before full upload) */
    syncToServer: () => void;
    /** Fetch latest from server; force=true skips throttle */
    fetchLatest: (force?: boolean) => Promise<void>;
    /** Re-check selections against the latest server/local cart snapshot */
    recheckSelections: () => Promise<void>;
    /** Merge remote cart data */
    mergeRemoteCart: (remoteCart: Cart) => void;
    /** Set cart status (for order locking) */
    setCartStatus: (status: CartStatus) => void;
    /** Temporarily suppress odds trend animations across detail page and bet slip */
    setOddsAnimationSuspended: (isSuspended: boolean) => void;
    /** Callback when clearAll is called (for cleanup listeners) */
    onClearAll?: () => void;
}

/**
 * Complete Slip Store state (composed of all Slices).
 */
export type BetSlipState = ListSlice & ItemSlice & SyncSlice;
