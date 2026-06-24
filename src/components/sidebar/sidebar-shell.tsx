'use client';

import type { FC, ReactNode } from 'react';
import { HamburgerMenu } from '@/components/icons';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';
import { Logo } from '../Logo';
import { SidebarContent, SidebarHeader, SidebarProvider, useSidebar } from './sidebar-primitives';

export interface SidebarShellProps {
    /**
     * Controlled collapsed state.
     * If provided, SidebarProvider will use it.
     * Note: ui/sidebar.tsx manages its own state via context/cookies too.
     */
    collapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
    hideHeader?: boolean;
    children: ReactNode;
    className?: string;
    /** Optional event handler on the scroll container (e.g. for click capture) */
    onScrollContainerClickCapture?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Inner shell that handles the header and scrolling area
 */
const SidebarInner: FC<Omit<SidebarShellProps, 'collapsed' | 'onCollapsedChange'>> = ({
    hideHeader = false,
    children,
    className,
    onScrollContainerClickCapture,
}) => {
    const { state, toggleSidebar } = useSidebar();
    const componentProfile = useThemeComponentProfile();
    const isCollapsed = state === 'collapsed';

    return (
        <div
            data-state={state}
            data-nav-profile={componentProfile.nav.profile}
            data-nav-active-marker={componentProfile.nav.activeMarker}
            className={cn(
                'group flex h-full w-full flex-col border-[color:var(--brand-sidebar-border,var(--filltext-ft-c))] border-r bg-[var(--brand-sidebar-bg,var(--filltext-ft-a))]',
                className,
            )}
            style={componentProfile.style}
        >
            {/* Header - Logo + Toggle */}
            {!hideHeader && (
                <SidebarHeader
                    className={cn(
                        'flex h-[72px] shrink-0 flex-row items-center gap-4 border-[color:var(--brand-sidebar-border,var(--filltext-ft-c))] border-b-[0.5px] bg-[var(--brand-sidebar-header-bg,var(--surface-1))] px-4 transition-all duration-200',
                        isCollapsed && 'justify-center p-0',
                    )}
                >
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className={cn(
                            'p-2 text-filltext-ft-d hover:text-neutral-black-h transition-colors cursor-pointer',
                            isCollapsed && 'size-10 flex items-center justify-center p-0',
                        )}
                    >
                        <HamburgerMenu className="size-5" />
                    </button>
                    {!isCollapsed && (
                        <Link href="/">
                            <Logo className="w-30" variant="long" />
                        </Link>
                    )}
                </SidebarHeader>
            )}
            {/* Scrollable content area */}
            <SidebarContent
                className="flex-1 hidden-scrollbar flex flex-col gap-4 p-0 overflow-x-hidden overscroll-y-contain"
                onClickCapture={onScrollContainerClickCapture}
            >
                {children}
            </SidebarContent>
        </div>
    );
};

/**
 * Shared sidebar shell — provides Logo header, hamburger toggle, and scrollable content area.
 * Migrated to use ui/sidebar components.
 */
export const SidebarShell: FC<SidebarShellProps> = ({ collapsed, onCollapsedChange, ...props }) => {
    return (
        <SidebarProvider
            className="min-h-0 h-full w-full overflow-hidden"
            open={collapsed !== undefined ? !collapsed : undefined}
            onOpenChange={(open) => onCollapsedChange?.(!open)}
        >
            <SidebarInner {...props} />
        </SidebarProvider>
    );
};
