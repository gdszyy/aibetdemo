'use client';

import { Popover } from 'radix-ui';
import { type FC, type ReactNode, useMemo, useState } from 'react';
import { ArrowDown } from '@/components/icons';
import { DomIdEnum } from '@/constants';
import { useIsDesktop } from '@/hooks/use-media-query';
import { cn } from '@/utils/common';
import { getPortalContainer } from '@/utils/dom';
import { Checkbox } from '../checkbox/checkbox';

export interface FilterSelectOption {
    label: ReactNode;
    value: string;
    disabled?: boolean;
}

interface FilterSelectProps {
    mode: 'single' | 'multiple';
    options: FilterSelectOption[];
    value: string | string[];
    onValueChange: (value: string | string[]) => void;
    placeholder?: ReactNode;
    allLabel?: ReactNode;
    className?: string;
    contentClassName?: string;
    contentWidth?: 'trigger' | 'content';
    triggerPrefix?: ReactNode;
}

const getOptionText = (label: ReactNode): string | null => {
    if (typeof label === 'string' || typeof label === 'number') {
        return String(label);
    }

    return null;
};

const normalizeMultipleValue = (value: string | string[]): string[] => {
    return Array.isArray(value) ? value : value ? [value] : [];
};

export const FilterSelect: FC<FilterSelectProps> = ({
    mode,
    options,
    value,
    onValueChange,
    placeholder,
    allLabel,
    className,
    contentClassName,
    contentWidth = 'trigger',
    triggerPrefix,
}) => {
    const [open, setOpen] = useState(false);
    const isDesktop = useIsDesktop();

    const selectedValues = useMemo(() => normalizeMultipleValue(value), [value]);
    const selectableOptions = useMemo(() => options.filter((option) => !option.disabled), [options]);
    const selectableValues = useMemo(() => selectableOptions.map((option) => option.value), [selectableOptions]);
    const selectedOptions = useMemo(
        () => options.filter((option) => selectedValues.includes(option.value)),
        [options, selectedValues],
    );
    const allOptionsSelected = useMemo(() => {
        return (
            mode === 'multiple' &&
            selectableValues.length > 0 &&
            selectableValues.every((optionValue) => selectedValues.includes(optionValue))
        );
    }, [mode, selectableValues, selectedValues]);

    const displayText = useMemo(() => {
        if (allOptionsSelected) {
            return allLabel ?? placeholder;
        }

        if (selectedOptions.length === 0) {
            return placeholder;
        }

        if (mode === 'single') {
            return selectedOptions[0]?.label ?? placeholder;
        }

        if (selectedOptions.length === 1) {
            return selectedOptions[0]?.label ?? placeholder;
        }

        const textLabels = selectedOptions.map((option) => getOptionText(option.label)).filter(Boolean);

        if (textLabels.length === selectedOptions.length) {
            return textLabels.join(', ');
        }

        const placeholderText = getOptionText(placeholder);
        return placeholderText ? `${placeholderText} (${selectedOptions.length})` : placeholder;
    }, [allLabel, allOptionsSelected, mode, placeholder, selectedOptions]);

    const handleSelect = (option: FilterSelectOption) => {
        if (option.disabled) {
            return;
        }

        if (mode === 'single') {
            onValueChange(option.value);
            setOpen(false);
            return;
        }

        const isSelected = selectedValues.includes(option.value);
        const baseValues = selectedValues.filter((item) => selectableValues.includes(item));
        const nextValues = isSelected
            ? baseValues.filter((item) => item !== option.value)
            : selectableValues.filter((item) => baseValues.includes(item) || item === option.value);

        if (nextValues.length === 0) {
            onValueChange(selectableValues);
            return;
        }

        onValueChange(nextValues);
    };

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    className={cn(
                        'group flex h-10 w-full items-center justify-between rounded-sm bg-filltext-ft-a px-4 py-3 text-body-sm transition-colors',
                        'hover:bg-filltext-ft-b',
                        'data-[state=open]:border-[0.5px] data-[state=open]:border-filltext-ft-g data-[state=open]:bg-filltext-ft-b data-[state=open]:text-filltext-ft-g',
                        'focus-visible:border-[0.5px] focus-visible:border-filltext-ft-g focus-visible:bg-filltext-ft-b focus-visible:outline-none',
                        className,
                    )}
                >
                    {isDesktop && triggerPrefix ? (
                        <span className="min-w-0 truncate text-left">
                            <span className="text-body-lg font-normal text-filltext-ft-e">{triggerPrefix}: </span>
                            <span className="text-body-lg text-filltext-ft-h">{displayText}</span>
                        </span>
                    ) : (
                        <span
                            className={cn(
                                'min-w-0 truncate text-left',
                                !selectedOptions.length && 'text-filltext-ft-e',
                            )}
                        >
                            {displayText}
                        </span>
                    )}
                    <ArrowDown className="ml-2 size-3 shrink-0 text-filltext-ft-e transition-all group-data-[state=open]:rotate-180 group-data-[state=open]:text-filltext-ft-g group-hover:text-filltext-ft-g" />
                </button>
            </Popover.Trigger>

            <Popover.Portal container={getPortalContainer(DomIdEnum.ModalContainer)}>
                <Popover.Content
                    align="start"
                    sideOffset={4}
                    className={cn(
                        'z-50 rounded-sm bg-surface-1 p-2 shadow-floating',
                        contentWidth === 'content'
                            ? 'w-max min-w-(--radix-popover-trigger-width) max-w-[calc(100vw-1rem)]'
                            : 'w-(--radix-popover-trigger-width)',
                        'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
                        contentClassName,
                    )}
                >
                    <div className="custom-scrollbar flex max-h-[320px] flex-col gap-1 overflow-y-auto">
                        {options.map((option) => {
                            const isSelected = selectedValues.includes(option.value);

                            return (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={cn(
                                        'flex h-10 w-full items-center justify-between rounded-sm px-[10px] text-left transition-colors',
                                        'text-body-sm text-filltext-ft-g hover:bg-filltext-ft-a hover:text-filltext-ft-h',
                                        isSelected && 'bg-filltext-ft-a text-filltext-ft-h',
                                        option.disabled && 'cursor-not-allowed opacity-40',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'min-w-0 flex-1 mr-2',
                                            contentWidth === 'content' ? 'whitespace-nowrap' : 'truncate',
                                        )}
                                    >
                                        {option.label}
                                    </span>

                                    <Checkbox
                                        checked={isSelected}
                                        className="pointer-events-none"
                                        checkedIconClassName="size-5 [&>path:first-child]:fill-brand-primary-0 [&>path:first-child]:stroke-brand-primary-0 [&>path:last-child]:stroke-neutral-white-h"
                                        uncheckedIconClassName="size-5"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};
