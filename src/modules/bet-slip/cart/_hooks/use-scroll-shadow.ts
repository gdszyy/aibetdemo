import { useMotionValueEvent, useScroll } from 'motion/react';
import { type RefObject, useEffect, useState } from 'react';

/**
 * Detects whether a scroll container can still scroll down, used to control bottom shadow display and layout logic.
 *
 * @param containerRef Ref to the scroll container
 * @returns { showShadow: boolean, hasOverflow: boolean }
 */

export function useScrollShadow(containerRef: RefObject<HTMLElement | null>): {
    showShadow: boolean;
    hasOverflow: boolean;
} {
    const [showShadow, setShowShadow] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const { scrollYProgress } = useScroll({ container: containerRef });

    // Watch scroll progress changes
    useMotionValueEvent(scrollYProgress, 'change', (progress) => {
        // progress: 0 = top, 1 = bottom
        // Not at bottom (< 0.99) and has content -> show shadow
        // Using 0.99 instead of 1 for tolerance
        const el = containerRef.current;
        if (!el) return;

        const overflow = el.scrollHeight > el.clientHeight;
        setHasOverflow(overflow);
        setShowShadow(overflow && progress < 0.99);
    });

    // Initial detection + content change detection
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const checkStatus = () => {
            const overflow = el.scrollHeight > el.clientHeight;
            const notAtBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
            setHasOverflow(overflow);
            setShowShadow(overflow && notAtBottom);
        };

        // Initial check
        checkStatus();

        // Watch for size changes (content added/removed)
        const observer = new ResizeObserver(checkStatus);
        observer.observe(el);

        // Also observe child element changes
        const child = el.firstElementChild;
        if (child) observer.observe(child);

        return () => observer.disconnect();
    }, [containerRef]);

    return { showShadow, hasOverflow };
}
