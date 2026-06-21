import type { QueryClient } from '@tanstack/react-query';

/**
 * clear cache data, in next request, cache will be invalid
 *
 * without interrupt request
 * without refresh states
 */
export const clearCacheData = (client: QueryClient) => {
    const queries = client.getQueryCache().findAll();

    queries.forEach((query) => {
        query.invalidate();
    });
};
