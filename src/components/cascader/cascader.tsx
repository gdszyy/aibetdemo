'use client';

import { Select as SelectPrimitive } from 'radix-ui';
import { type FC, type ReactNode, useCallback, useEffect, useState } from 'react';
import { ArrowRight } from '@/components/icons';
import { cn, delay } from '@/utils/common';
import { SelectContent, SelectItem, SelectTrigger } from '../select/components/select-compositions';
import type { Option, SelectProps } from '../select/constants';

const SelectRoot = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

/**
 * Cascader select component
 * @param options - Option list
 * @param error - Error state
 */
export const Cascader: FC<SelectProps> = ({ options, placeholder, className, error, onValueChange, ...rootProps }) => {
    const [selectedPath, setSelectedPath] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState<boolean | undefined>(rootProps.open ?? false);

    useEffect(() => {
        if (rootProps.open !== undefined) {
            setIsOpen(rootProps.open);
        }
    }, [rootProps.open]);

    // Get options for each level (for multi-column layout)
    const getCascadeColumns = (): Option[][] => {
        const columns: Option[][] = [options];
        let current: Option[] = options;

        for (const selectedValue of selectedPath) {
            const found = current.find((opt) => opt.value === selectedValue);
            if (found?.children && found.children.length > 0) {
                columns.push(found.children);
                current = found.children;
            } else {
                break;
            }
        }

        return columns;
    };

    // Find option by current cascade path and value
    const findOptionInLevel = (value: string, level: number): Option | null => {
        const columns = getCascadeColumns();
        if (level >= columns.length) {
            return null;
        }
        return columns[level].find((opt) => opt.value === value) || null;
    };

    // Find label by value in the entire option tree
    const findLabelByValue = (value: string, opts: Option[] = options): ReactNode | null => {
        for (const opt of opts) {
            if (opt.value === value) {
                return opt.label;
            }
            if (opt.children) {
                const found = findLabelByValue(value, opt.children);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    // Handle option click (cascade mode)
    const handleCascadeOptionClick = (value: string, level: number) => {
        const option = findOptionInLevel(value, level);
        if (!option) return;

        const newPath = selectedPath.slice(0, level);

        if (option.children && option.children.length > 0) {
            // Has children — update selected path to current level, show next level
            setSelectedPath([...newPath, value]);
            setIsOpen(true);
            return;
        }

        const finalPath = [...newPath, value];
        setSelectedPath(finalPath);
        setInternalValue(value);
        onValueChange?.(value);
        // Close dropdown immediately
        setIsOpen(false);
    };

    const resetSelectedPath = useCallback(async (immediately: boolean) => {
        if (!immediately) await delay(100);
        setSelectedPath([]);
    }, []);

    // Reset cascade path when SelectRoot value changes
    useEffect(() => {
        resetSelectedPath(rootProps?.value === undefined);
    }, [rootProps?.value, resetSelectedPath]);

    const [internalValue, setInternalValue] = useState<string | undefined>(rootProps.value ?? undefined);

    useEffect(() => {
        setInternalValue(rootProps.value ?? undefined);
    }, [rootProps.value]);

    const controlledValue = rootProps.value !== undefined ? rootProps.value : undefined;
    const controlledOpen = rootProps.open !== undefined ? rootProps.open : isOpen;
    const cascadeColumns = getCascadeColumns();

    return (
        <div className={cn('flex flex-col gap-1 ', className)}>
            <SelectRoot
                {...rootProps}
                value={controlledValue}
                open={controlledOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        // When Select closes (click outside, ESC key, etc.), reset cascade path
                        setSelectedPath([]);
                        setIsOpen(false); // Explicitly set to false to ensure closure
                    } else {
                        // When opening, keep open state (for cascade navigation)
                        setIsOpen(true);
                    }
                    rootProps?.onOpenChange?.(open);
                }}
            >
                <SelectTrigger className={cn('w-full')} data-invalid={Boolean(error)}>
                    {internalValue ? (
                        <span className="text-neutral-black-h">{findLabelByValue(internalValue) || placeholder}</span>
                    ) : (
                        <SelectValue placeholder={placeholder} />
                    )}
                </SelectTrigger>
                <SelectContent
                    className={cn('[&>div]:p-0')}
                    style={{ width: `${cascadeColumns.length * 120}px` }}
                    onEscapeKeyDown={(e) => {
                        if (selectedPath.length > 0) {
                            e.preventDefault();
                            setSelectedPath(selectedPath.slice(0, -1));
                            setIsOpen(true);
                        }
                    }}
                >
                    {/* Hidden SelectItem so SelectValue can find the corresponding text */}
                    {internalValue && (
                        <SelectItem value={internalValue} className="hidden">
                            {findLabelByValue(internalValue) || internalValue}
                        </SelectItem>
                    )}
                    <div className="flex max-h-[300px] overflow-y-auto">
                        {cascadeColumns.map((columnOptions, level) => {
                            // Use first item's value as column key (if available)
                            const columnKey =
                                columnOptions.length > 0
                                    ? `column-${columnOptions[0].value}-${level}`
                                    : `column-${level}`;
                            return (
                                <div
                                    key={columnKey}
                                    className={cn(
                                        'flex flex-col min-w-[120px] border-r border-filltext-ft-d last:border-r-0',
                                    )}
                                >
                                    {columnOptions.map((option) => {
                                        const isSelected = selectedPath[level] === option.value;
                                        const hasChildren = option.children && option.children.length > 0;
                                        return (
                                            <div
                                                key={option.value}
                                                className={cn(
                                                    'relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm p-3 text-body-sm transition-colors',
                                                    'hover:bg-surface-2 hover:text-brand-red',
                                                    isSelected && 'bg-surface-2 text-brand-red font-semibold',
                                                    option.disabled && 'pointer-events-none opacity-40',
                                                )}
                                                onClick={() => {
                                                    if (option.disabled) return;
                                                    handleCascadeOptionClick(option.value, level);
                                                }}
                                            >
                                                <span>{option.label}</span>
                                                {hasChildren && (
                                                    <ArrowRight
                                                        className={cn(
                                                            'size-3 ml-2 text-neutral-black-h transition-colors',
                                                            'hover:text-brand-red',
                                                        )}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </SelectContent>
            </SelectRoot>
        </div>
    );
};
