import type { AppRouterInstance, NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { suppressNextScrollToTop } from './navigation-scroll';

/**
 * Update URL query parameters without full page reload.
 *
 * - Sets params with non-empty values
 * - Deletes params with undefined/null/'' values
 * - Preserves existing params not mentioned in the update
 */
export const updateQueryParams = (
    params: Record<string, string | number | undefined | null>,
    router: AppRouterInstance,
    pathname: string,
    searchParams: URLSearchParams,
    method: 'push' | 'replace' = 'replace',
    options?: NavigateOptions,
) => {
    const newParams = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') {
            newParams.delete(key);
        } else {
            newParams.set(key, String(value));
        }
    }

    // URLSearchParams.toString() encodes `:` as `%3A`, but `:` is safe in query values (RFC 3986)
    const queryString = newParams.toString().replaceAll('%3A', ':');
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    if (options?.scroll === false) {
        suppressNextScrollToTop(newUrl);
    }

    if (method === 'push') {
        router.push(newUrl, options);
    } else {
        router.replace(newUrl, options);
    }
};
