import { useState } from 'react';

/**
 * Syncs local expanded state with a parent-driven `forceCollapsed` prop.
 *
 * Returns `[isExpanded, setIsExpanded]` — a controlled toggle that
 * automatically resets whenever `forceCollapsed` changes.
 */
export function useForceCollapse(forceCollapsed?: boolean) {
    const [isExpanded, setIsExpanded] = useState(() => !forceCollapsed);
    const [prevForceCollapsed, setPrevForceCollapsed] = useState(forceCollapsed);

    if (forceCollapsed !== prevForceCollapsed) {
        setPrevForceCollapsed(forceCollapsed);
        setIsExpanded(!forceCollapsed);
    }

    return [isExpanded, setIsExpanded] as const;
}
