'use client';

import { motion } from 'motion/react';
import type { FC, ReactNode } from 'react';

interface CollapsePanelProps {
    open: boolean;
    className?: string;
    children: ReactNode;
}

/**
 * Animated collapse / expand panel using motion/react.
 * Children stay mounted when collapsed so hooks (e.g. WS listeners) remain active.
 */
export const CollapsePanel: FC<CollapsePanelProps> = ({ open, className, children }) => {
    return (
        <motion.div
            animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            initial={false}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', pointerEvents: open ? 'auto' : 'none' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
