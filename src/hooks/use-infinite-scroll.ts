import { useCallback, useRef } from 'react';

/**
 * Infinite scroll hook using IntersectionObserver.
 * Returns a callback ref — attach it to a sentinel element at the bottom of the list.
 * Automatically triggers `fetchNextPage` when the sentinel enters the viewport.
 *
 * Handles the classic "first page doesn't fill container" edge case that onScroll cannot.
 */
export function useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    root = null,
    rootMargin = '200px',
}: {
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    root?: Element | null;
    rootMargin?: string;
}) {
    const observer = useRef<IntersectionObserver>(null);

    const sentinelRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();
            if (node) {
                observer.current = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting && hasNextPage) fetchNextPage();
                    },
                    { root, rootMargin },
                );
                observer.current.observe(node);
            }
        },
        [isFetchingNextPage, hasNextPage, fetchNextPage, root, rootMargin],
    );

    return { sentinelRef };
}
