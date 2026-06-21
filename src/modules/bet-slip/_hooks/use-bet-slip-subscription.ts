'use client';

import { useMemo } from 'react';
import { useGameSubscription } from '@/hooks/use-game-subscription';
import { useBetSlipStore } from '../stores/bet-slip-store';

/**
 * Hook to manage WebSocket subscriptions for matches currently in the Bet Slip (Cart)
 * Ensures that odds and match status are updated in real-time for all selections
 */
export const useBetSlipSubscription = () => {
    const selections = useBetSlipStore((s) => s.selections);

    // Extract unique event IDs from selections
    const eventIds = useMemo(() => {
        const ids = new Set<string>();
        for (const selection of selections) {
            if (selection.eventId) {
                ids.add(selection.eventId);
            }
        }
        return Array.from(ids);
    }, [selections]);

    // Subscribe to all matches in the bet slip
    useGameSubscription(eventIds);
};
