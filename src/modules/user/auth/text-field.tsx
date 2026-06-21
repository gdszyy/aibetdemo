import type { ChangeEvent, FC, ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/utils/common';

import 'client-only';
import { FormControl, FormField, FormItem, FormMessage } from './_components/form';
import { OutlineInput, type OutlineInputProps } from './_components/outline-input';

export type TextFieldProps = {
    name: string;
    label?: ReactNode;
    placeholder?: string;
    outlineProps?: Partial<OutlineInputProps>;
    className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'>;

export const TextField: FC<TextFieldProps> = ({
    name,
    className,
    label,
    placeholder,
    outlineProps,
    onChange: customOnChange,
    onBlur: customOnBlur,
    onFocus: customOnFocus,
    ...rest
}) => {
    const { control, trigger } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => {
                const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                    customOnChange?.(event);
                    field.onChange(event);
                };

                const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
                    customOnBlur?.(event);
                    field.onBlur();
                    trigger(name);
                };

                return (
                    // Removing gap-1 as Shadcn FormItem handles spacing via space-y-2 usually,
                    // but we can keep flex-col. FormItem is a div with gap-2 by default in shadcn.
                    <FormItem className={cn(className)}>
                        <FormControl>
                            <OutlineInput
                                {...field}
                                error={!!error}
                                label={label}
                                placeholder={placeholder}
                                {...outlineProps}
                                {...rest}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={customOnFocus}
                                // Ensure value is never undefined to avoid controlled/uncontrolled warnings
                                value={field.value ?? ''}
                            />
                        </FormControl>
                        {/* 
                          FormMessage handles the error text. 
                          We might need to style it to match previous look if needed, 
                          but typically Shadcn defaults are good.
                        */}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
};
