'use client';

import type { FC, ReactNode } from 'react';
import { cn } from '@/utils/common';
import {
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarGroup as UISidebarGroup,
    useSidebar,
} from './sidebar-primitives';

export interface SidebarGroupProps {
    title?: string;
    /** Short label shown when sidebar is collapsed */
    collapsedTitle?: string;
    children: ReactNode;
    className?: string;
}

/**
 * SidebarGroup component - Reusable group with label and content.
 * Wraps ui/sidebar's SidebarGroup.
 */
export const SidebarGroup: FC<SidebarGroupProps> = ({ title, collapsedTitle, children, className }) => {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    return (
        <UISidebarGroup className={cn('p-0 gap-1', className)}>
            {title && <SidebarGroupLabel>{isCollapsed && collapsedTitle ? collapsedTitle : title}</SidebarGroupLabel>}
            <SidebarGroupContent className={cn('flex flex-col gap-0', isCollapsed && 'items-center')}>
                {children}
            </SidebarGroupContent>
        </UISidebarGroup>
    );
};

export const SidebarLine: FC = () => {
    return <div className="flex h-px w-full shrink-0 items-center bg-filltext-ft-c" />;
};
