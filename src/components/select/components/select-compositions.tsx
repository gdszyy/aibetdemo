import { Select } from 'radix-ui';
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react';
import { ArrowDown, ArrowUp } from '@/components/icons';
import { DomIdEnum } from '@/constants';
import { cn } from '@/utils/common';
import { getPortalContainer } from '@/utils/dom';

/**
 * Select trigger component
 */
export const SelectTrigger = forwardRef<
    ComponentRef<typeof Select.Trigger>,
    ComponentPropsWithoutRef<typeof Select.Trigger>
>(({ className, children, ...props }, ref) => (
    <Select.Trigger
        ref={ref}
        className={cn(
            'group flex py-3 px-4 w-full items-center justify-between rounded-sm transition-colors text-body-sm',
            // Default: bg-a, arrow down, color-e
            'bg-filltext-ft-a',
            'data-placeholder:text-filltext-ft-e',
            // Hover: bg-b, arrow down, color-e
            'hover:bg-filltext-ft-b',
            // Open: bg-b, border-g, arrow up, color-g
            'data-[state=open]:bg-filltext-ft-b data-[state=open]:border-[0.5px] data-[state=open]:border-filltext-ft-g data-[state=open]:text-filltext-ft-g',
            'focus-visible:border-[0.5px] focus-visible:border-filltext-ft-g',
            'data-[invalid=true]:border-[0.5px] data-[invalid=true]:border-func-lost data-[invalid=true]:text-func-lost',
            'disabled:cursor-not-allowed disabled:opacity-60',
            className,
        )}
        {...props}
    >
        {children}
        <Select.Icon asChild>
            <ArrowDown
                className={cn(
                    'ml-2 size-3 shrink-0 transition-all',
                    // Default: color-e, arrow down
                    'text-filltext-ft-e',
                    // Open: color-g, arrow up
                    'group-data-[state=open]:text-filltext-ft-g group-data-[state=open]:rotate-180 group-hover:text-filltext-ft-g',
                )}
            />
        </Select.Icon>
    </Select.Trigger>
));
SelectTrigger.displayName = Select.Trigger.displayName;

/**
 * Select scroll up button
 */
export const ScrollUpButton = forwardRef<
    ComponentRef<typeof Select.ScrollUpButton>,
    ComponentPropsWithoutRef<typeof Select.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <Select.ScrollUpButton
        ref={ref}
        className={cn(
            'flex h-6 cursor-default items-center justify-center bg-surface-2 text-neutral-black-h',
            className,
        )}
        {...props}
    >
        <ArrowUp className="size-3" />
    </Select.ScrollUpButton>
));
ScrollUpButton.displayName = Select.ScrollUpButton.displayName;

/**
 * Select scroll down button
 */
export const ScrollDownButton = forwardRef<
    ComponentRef<typeof Select.ScrollDownButton>,
    ComponentPropsWithoutRef<typeof Select.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <Select.ScrollDownButton
        ref={ref}
        className={cn(
            'flex h-6 cursor-default items-center justify-center bg-surface-2 text-neutral-black-h',
            className,
        )}
        {...props}
    >
        <ArrowDown className="size-3" />
    </Select.ScrollDownButton>
));
ScrollDownButton.displayName = Select.ScrollDownButton.displayName;

/**
 * Select content component
 */
export const SelectContent = forwardRef<
    ComponentRef<typeof Select.Content>,
    ComponentPropsWithoutRef<typeof Select.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
    <Select.Portal container={getPortalContainer(DomIdEnum.ModalContainer)}>
        <Select.Content
            ref={ref}
            className={cn(
                'overflow-hidden rounded-sm bg-surface-1 shadow-floating',
                'w-(--radix-select-trigger-width)',
                'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
                'z-50',
                className,
            )}
            position={position}
            {...props}
        >
            <ScrollUpButton />
            <Select.Viewport
                className={cn(
                    'p-2 flex flex-col gap-1',
                    position === 'popper' &&
                        'min-w-full max-h-[min(320px,var(--radix-select-content-available-height))]',
                )}
            >
                {children}
            </Select.Viewport>
            <ScrollDownButton />
        </Select.Content>
    </Select.Portal>
));
SelectContent.displayName = Select.Content.displayName;

/**
 * Select option item component
 */
export const SelectItem = forwardRef<ComponentRef<typeof Select.Item>, ComponentPropsWithoutRef<typeof Select.Item>>(
    ({ className, children, ...props }, ref) => (
        <Select.Item
            ref={ref}
            className={cn(
                'relative flex h-10 w-full cursor-pointer select-none items-center justify-center rounded-sm px-[10px] text-body-sm text-filltext-ft-g transition-colors',
                'data-disabled:pointer-events-none data-disabled:opacity-40',
                'data-highlighted:bg-filltext-ft-a ',
                'data-[state=checked]:text-brand-red ',
                className,
            )}
            {...props}
        >
            <Select.ItemText>{children}</Select.ItemText>
        </Select.Item>
    ),
);
SelectItem.displayName = Select.Item.displayName;
