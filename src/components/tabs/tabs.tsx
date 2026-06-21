'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';
import { type ComponentType, type FC, Fragment, type PropsWithChildren, type ReactNode } from 'react';
import { cn } from '@/utils/common';

const TabsRoot = TabsPrimitive.Root;
const TabsList = TabsPrimitive.List;
const TabsTrigger = TabsPrimitive.Trigger;
const TabsContent = TabsPrimitive.Content;

export interface TabItem<T = string> {
    /** Unique tab identifier */
    value: T;
    /** Tab display text */
    label: string | ReactNode;
    /** Tab content */
    content?: ReactNode;
    /** Tab trailing icon (optional) */
    icon?: ReactNode;
    /** Whether disabled */
    disabled?: boolean;
    /** Whether to show badge dot */
    showBadge?: boolean;
}

export interface TabsProps {
    /** Tab item list */
    items: TabItem[];
    /** Default selected tab value */
    defaultValue?: string;
    /** Controlled selected value */
    value?: string;
    /** Callback when selected value changes */
    onChange?: (value: string) => void;
    /** Custom class name */
    className?: string;
    /** Custom content container */
    ContentContainer?: ComponentType<PropsWithChildren>;
}

/**
 * Tabs component
 */
export const Tabs: FC<TabsProps> = ({
    items,
    defaultValue,
    value,
    onChange,
    ContentContainer = Fragment,
    className,
}) => {
    return (
        <TabsRoot
            defaultValue={defaultValue}
            value={value}
            onValueChange={onChange}
            className={cn('w-full flex flex-col', className)}
        >
            <TabsList className={cn('flex gap-10 pl-4')}>
                {items.map((item) => (
                    <TabsTrigger
                        key={item.value}
                        value={item.value}
                        disabled={item.disabled}
                        className={cn(
                            'h-full inline-flex items-center relative pb-2',
                            'text-filltext-ft-g cursor-pointer text-body-lg leading-[16px]',
                            'after:content-[""] after:w-full after:h-1 after:rounded-full after:absolute after:bottom-0 after:left-0 after:bg-transparent',
                            'hover:after:bg-mini-sbd',
                            'data-[state=active]:after:bg-brand-red!',
                        )}
                    >
                        <span className="relative">
                            {item.label}
                            {item.showBadge && (
                                <span className="absolute top-0 right-[-8px] w-[6px] h-[6px] rounded-full bg-brand-red" />
                            )}
                        </span>
                        {item.icon && (
                            <span className="flex items-center shrink-0 text-neutral-black-h transition-colors">
                                {item.icon}
                            </span>
                        )}
                    </TabsTrigger>
                ))}
            </TabsList>
            <ContentContainer>
                {items.map((item) => (
                    <TabsContent key={item.value} value={item.value} className={cn('flex-1 min-h-0')}>
                        {item.content}
                    </TabsContent>
                ))}
            </ContentContainer>
        </TabsRoot>
    );
};
