import type { FC, PropsWithChildren } from 'react';

/**
 * ContentContainer component
 * Provides a fixed-height container for Tabs content area, ensuring inner content scrolls properly
 */
export const ContentContainer: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="account-card mt-4 flex flex-col max-md:flex-1 max-md:min-h-0 md:h-[calc(100dvh-250px)] min-h-[300px] overflow-hidden">
            {children}
        </div>
    );
};
