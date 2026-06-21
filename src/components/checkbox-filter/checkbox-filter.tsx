'use client';

import { Popover } from 'radix-ui';
import { type FC, useCallback } from 'react';
import { ArrowDown } from '@/components/icons';
import { DomIdEnum } from '@/constants';
import { cn } from '@/utils/common';
import { getPortalContainer } from '@/utils/dom';
import { Checkbox } from '../checkbox/checkbox';

export interface CheckboxFilterOption {
    value: string;
    label: string;
    /** Game count badge */
    count?: number;
}

export interface CheckboxFilterGroup {
    title: string;
    options: CheckboxFilterOption[];
}

export interface CheckboxFilterProps {
    /** Grouped options */
    groups: CheckboxFilterGroup[];
    /** Currently selected values (controlled) */
    selected: string[];
    /** Callback when selection changes */
    onSelectionChange: (values: string[]) => void;
    /** Trigger placeholder text */
    placeholder?: string;
    className?: string;
}

/**
 * Multi-select checkbox filter with Popover dropdown.
 *
 * Renders grouped checkbox lists inside a Popover.
 * Controlled component — parent owns selected state.
 */
export const CheckboxFilter: FC<CheckboxFilterProps> = ({
    groups,
    selected,
    onSelectionChange,
    placeholder = 'Filter',
    className,
}) => {
    const handleToggle = useCallback(
        (value: string, checked: boolean) => {
            if (checked) {
                onSelectionChange([...selected, value]);
            } else {
                onSelectionChange(selected.filter((v) => v !== value));
            }
        },
        [selected, onSelectionChange],
    );

    const displayText = selected.length > 0 ? `${placeholder} (${selected.length})` : placeholder;

    return (
        <Popover.Root>
            <Popover.Trigger
                className={cn(
                    'group flex py-3 px-4 items-center justify-between rounded-sm border transition-colors text-body-sm',
                    'bg-filltext-ft-b border-filltext-ft-d text-neutral-black-h',
                    'hover:border-neutral-black-h',
                    'data-[state=open]:text-brand-red',
                    'focus-visible:border-brand-red',
                    className,
                )}
            >
                <span className="truncate">{displayText}</span>
                <ArrowDown
                    className={cn(
                        'size-3 shrink-0 ml-2 transition-all',
                        'text-neutral-black-h',
                        'group-hover:text-brand-red',
                        'group-data-[state=open]:text-brand-red group-data-[state=open]:rotate-180',
                    )}
                />
            </Popover.Trigger>

            <Popover.Portal container={getPortalContainer(DomIdEnum.ModalContainer)}>
                <Popover.Content
                    className="z-50 w-[300px] max-h-[400px] overflow-y-auto custom-scrollbar bg-surface-1 rounded-sm shadow-floating p-4 data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1"
                    align="start"
                    sideOffset={4}
                >
                    <div className="flex flex-col gap-4">
                        {groups.map((group) => (
                            <div key={group.title} className="flex flex-col gap-1">
                                <span className="text-body-sm text-filltext-ft-f">{group.title}</span>
                                <div className="flex flex-col gap-1">
                                    {group.options.map((option) => (
                                        <div key={option.value} className="flex items-center gap-2 h-8 px-2 rounded-xs">
                                            <Checkbox
                                                checked={selected.includes(option.value)}
                                                onChange={(checked) => handleToggle(option.value, checked)}
                                            />
                                            <span className="text-body-sm text-filltext-ft-g flex-1 min-w-0 truncate">
                                                {option.label}
                                            </span>
                                            {option.count != null && (
                                                <span className="shrink-0 size-3.5 flex items-center justify-center rounded-xs bg-filltext-ft-g text-[10px] font-semibold text-white leading-none">
                                                    {option.count}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};
