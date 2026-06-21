'use client';

import { useEffect } from 'react';
import { config } from '@/constants/config';
import { STORAGE_KEYS } from '@/modules/bet-slip/cart/_constants';
import { useBetSlipStore } from '@/modules/bet-slip/stores/bet-slip-store';
import { SessionStatusEnum, useSessionStore } from '@/stores/session-store';

const SELECTIONS_STORAGE_KEY = 'bet-slip-storage';

export const CartCleanupListener = () => {
    useEffect(() => {
        const persistLatestCartSnapshot = () => {
            const { selections, version, hasPendingSync } = useBetSlipStore.getState();
            const storage = useBetSlipStore.persist.getOptions().storage;

            storage?.setItem(SELECTIONS_STORAGE_KEY, {
                state: {
                    selections,
                    version,
                    hasPendingSync,
                },
                version: 0,
            });
        };

        const handleUnload = () => {
            const { status } = useSessionStore.getState();
            const { hasPendingSync } = useBetSlipStore.getState();

            // Only clear local data when user is authenticated
            // Reason: cart is synced, data is persisted on server, safe to clear local cache
            if (status !== SessionStatusEnum.Authenticated) return;

            // When there are local changes not yet confirmed by server, keep local cache to prevent losing unsynced cart on page close
            if (hasPendingSync) {
                persistLatestCartSnapshot();
                if (config.isDev) {
                    console.log('[CartCleanupListener] pending sync exists, keeping local cart storage');
                }
                return;
            }

            if (config.isDev) {
                console.log('[CartCleanupListener] clearing local cart storage...');
            }
            try {
                window.localStorage.removeItem(SELECTIONS_STORAGE_KEY);
                window.localStorage.removeItem(STORAGE_KEYS.SINGLE_STAKES);
                window.localStorage.removeItem(STORAGE_KEYS.PARLAY_STAKE);
            } catch (error) {
                console.error('[CartCleanupListener] Failed to remove localStorage:', error);
            }
        };

        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('pagehide', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            window.removeEventListener('pagehide', handleUnload);
        };
    }, []);

    return null;
};
