'use client';

import { useTranslations } from 'next-intl';
import { type FC, type MouseEvent, memo, useState } from 'react';
import { Toast } from '@/components/toast';
import { ConditionalTooltip } from '@/components/tooltip';
import { recordNavIntent, usePendingNavPath } from '@/hooks/use-nav-intent';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';
import { Tooltip, TooltipContent, TooltipTrigger, useSidebar } from './sidebar-primitives';

export interface SidebarItemProps {
    icon?: FC<{ className?: string }>;
    activeIcon?: FC<{ className?: string }>;
    label: string;
    href: string;
    isActive?: boolean;
    comingSoon?: boolean;
    comingSoonMessage?: string;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
}

const sidebarItemStateClasses = [
    'data-[active=false]:[--row-bg:transparent]',
    'data-[active=false]:[--text-color:var(--interactive-row-text)]',
    'data-[active=false]:[--icon-color:var(--interactive-row-icon)]',
    'data-[active=false]:hover:[--row-bg:var(--interactive-row-hover-bg)]',
    'data-[active=false]:hover:[--text-color:var(--interactive-row-hover-text)]',
    'data-[active=false]:hover:[--icon-color:var(--interactive-row-hover-icon)]',
    'data-[active=true]:[--row-bg:var(--interactive-row-active-bg)]',
    'data-[active=true]:[--text-color:var(--interactive-row-active-text)]',
    'data-[active=true]:[--icon-color:var(--interactive-row-active-icon)]',
    "data-[active=true]:before:content-['']",
    'data-[active=true]:before:absolute',
    'data-[active=true]:before:left-0',
    'data-[active=true]:before:top-1.5',
    'data-[active=true]:before:bottom-1.5',
    'data-[active=true]:before:w-[3px]',
    'data-[active=true]:before:rounded-r-sm',
    'data-[active=true]:before:[background:var(--interactive-active-rail-bg)]',
    'data-[active=true]:before:[box-shadow:var(--interactive-active-rail-shadow)]',
].join(' ');

export const SidebarItem: FC<SidebarItemProps> = memo(
    ({
        icon: Icon,
        activeIcon: ActiveIcon,
        label,
        href,
        isActive = false,
        comingSoon = false,
        comingSoonMessage,
        onClick,
        className,
    }) => {
        const tCommon = useTranslations('common');
        const { state } = useSidebar();
        const isCollapsed = state === 'collapsed';
        const pendingPath = usePendingNavPath();
        const hrefPath = href.split('?')[0];
        const active = pendingPath != null ? pendingPath === hrefPath : isActive;
        const [shouldPrefetch, setShouldPrefetch] = useState(false);
        const DisplayIcon = active && ActiveIcon ? ActiveIcon : Icon;
        const warmPrefetch = () => setShouldPrefetch(true);

        const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
            if (comingSoon) {
                e.preventDefault();
                Toast.info(comingSoonMessage ?? tCommon('message.coming'), { id: 'coming-soon', duration: 650 });
                return;
            }

            if (href && href !== '#') {
                recordNavIntent(href);
            }

            onClick?.(e);
        };

        if (isCollapsed) {
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={comingSoon ? '#' : href}
                            prefetch={shouldPrefetch}
                            onMouseEnter={warmPrefetch}
                            onFocus={warmPrefetch}
                            onClick={handleClick}
                            className={cn(
                                sidebarItemStateClasses,
                                'relative mx-auto inline-flex h-11 w-full items-center justify-center rounded-none',
                                'bg-(--row-bg)',
                                className,
                            )}
                            data-active={active}
                        >
                            {DisplayIcon ? (
                                <span className="flex size-6 shrink-0 items-center justify-center">
                                    <DisplayIcon className="size-5 text-(--icon-color) transition-transform duration-200" />
                                </span>
                            ) : null}
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                        {label}
                    </TooltipContent>
                </Tooltip>
            );
        }

        return (
            <ConditionalTooltip content={label} side="right">
                <Link
                    href={comingSoon ? '#' : href}
                    prefetch={shouldPrefetch}
                    onMouseEnter={warmPrefetch}
                    onFocus={warmPrefetch}
                    onClick={handleClick}
                    className={cn(
                        sidebarItemStateClasses,
                        'relative flex h-11 items-center gap-x-2 rounded-none px-3',
                        'bg-(--row-bg)',
                        className,
                    )}
                    data-active={active}
                >
                    {DisplayIcon && (
                        <span className="inline-flex size-6 shrink-0 items-center justify-center">
                            <DisplayIcon className="size-5 text-(--icon-color)" />
                        </span>
                    )}
                    <ConditionalTooltip content={label} side="right">
                        <span className="truncate whitespace-nowrap text-body-lg text-(--text-color)">{label}</span>
                    </ConditionalTooltip>
                </Link>
            </ConditionalTooltip>
        );
    },
);
