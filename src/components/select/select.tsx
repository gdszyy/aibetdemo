'use client';

import { Select as SelectPrimitive } from 'radix-ui';
import type { FC } from 'react';
import { cn } from '@/utils/common';
import { SelectContent, SelectItem, SelectTrigger } from './components/select-compositions';
import type { SelectProps } from './constants';

const SelectRoot = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

/**
 * Select component
 * @param options - Option list
 * @param error - Error state
 */
export const Select: FC<SelectProps> = ({ options, placeholder, className, contentClassName, error, ...rest }) => {
    const label = options.find((v) => v.value === rest.value)?.label;

    return (
        <SelectRoot {...rest}>
            <SelectTrigger className={cn('w-full touch-manipulation', className)} data-invalid={Boolean(error)}>
                <SelectValue placeholder={<span>{placeholder}</span>} data-invalid={Boolean(error)}>
                    <span className="whitespace-nowrap break-keep">{label}</span>
                </SelectValue>
            </SelectTrigger>
            <SelectContent className={cn('min-w-[max-content] touch-manipulation', contentClassName)}>
                {options.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className="touch-manipulation"
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    );
};
