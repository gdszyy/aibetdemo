import type { ChangeEvent, FC, ReactNode } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { cn } from '@/utils/common';
import 'client-only';

import { FormErrorMessage } from '@/components/form-error-message/form-error-message';

export type TextFieldProps = {
    name: string;
    label?: ReactNode;
    placeholder?: string;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
    className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'>;

export const TextField: FC<TextFieldProps> = ({
    name,
    className,
    label,
    placeholder,
    startAdornment,
    endAdornment,
    onChange: customOnChange,
    onBlur: customOnBlur,
    onFocus: customOnFocus,
    ...rest
}) => {
    const { register, trigger } = useFormContext();
    const { errors } = useFormState();

    const error = errors?.[name];
    const hasError = !!error;

    const { onChange: rhfOnChange, onBlur: rhfOnBlur, ...registerProps } = register(name);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        customOnChange?.(event);
        rhfOnChange(event);
    };

    const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        customOnBlur?.(event);
        await rhfOnBlur(event);
        trigger(name);
    };

    return (
        <div className={cn('flex flex-col gap-1 w-full', className)}>
            {label && (
                <label className={cn('text-filltext-ft-h text-body-sm font-medium', hasError && 'text-func-lost')}>
                    {label}
                </label>
            )}
            <div
                className={cn(
                    'h-11 w-full min-w-0 flex items-center px-4',
                    'rounded-sm overflow-hidden',
                    'border border-transparent',
                    'bg-filltext-ft-a backdrop-blur-[1.5px]',
                    'focus-within:border-filltext-ft-g',
                    'data-[invalid=true]:border-brand-primary-4',
                )}
                data-invalid={Boolean(hasError)}
            >
                {Boolean(startAdornment) && <div className="shrink-0">{startAdornment}</div>}
                <input
                    {...registerProps}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={customOnFocus}
                    placeholder={placeholder}
                    data-slot="input"
                    className={cn(
                        'flex-1 min-w-0 h-full',
                        'text-body-md text-filltext-ft-h',
                        'placeholder:text-body-md placeholder:text-filltext-ft-e focus:placeholder:text-transparent',
                        'data-[invalid=true]:text-func-lost',
                        'disabled:pointer-events-none disabled:cursor-not-allowed',
                    )}
                    data-invalid={Boolean(hasError)}
                    {...rest}
                />
                {Boolean(endAdornment) && <div className="shrink-0">{endAdornment}</div>}
            </div>
            {<FormErrorMessage errMsg={error} enable={true} />}
        </div>
    );
};
