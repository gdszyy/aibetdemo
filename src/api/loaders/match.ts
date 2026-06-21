import DataLoader from 'dataloader';
import { PostMatchRowBatchCountInterface } from '@/api/handlers/matches';

/**
 * Match Row Count Loader
 * Batches multiple match event IDs into a single PostMatchRowBatchCountInterface call.
 * Uses a small debounce window to collect IDs from various components.
 */
export const matchRowCountLoader = new DataLoader<string, number>(
    async (eventIds) => {
        const batchData = await PostMatchRowBatchCountInterface({
            event_ids: eventIds as string[],
        });

        // DataLoader requires returning the results in the same order as requested IDs.
        return eventIds.map((id) => {
            const markets = batchData?.[id];
            return Array.isArray(markets) ? markets.length : 0;
        });
    },
    {
        cache: false, // Cache management is delegated to TanStack Query.
        // Batch requests within a 50ms window to maximize gathering IDs from paginated lists.
        batchScheduleFn: (callback) => setTimeout(callback, 50),
    },
);
