import type { ChangeEvent, FunctionComponent, ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '@/utils/common';

/**
 * WARNING: For form usage, prefer FormItem component — this component has no error message display!
 * Input component
 */
export const Input: FunctionComponent<
    React.ComponentProps<'input'> & {
        error?: boolean;
        addonBefore?: ReactNode;
        addonAfter?: ReactNode;
    }
> = ({ className, type, error, addonBefore, addonAfter, value, onChange, ...props }) => {
    // For controlled components (with value prop)
    const isControlled = value !== undefined;
    const [inputValue, setInputValue] = useState(isControlled ? value || '' : '');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
            setInputValue(e.target.value);
        }
        if (onChange) {
            onChange(e);
        }
    };

    const hasValue = (isControlled ? value : inputValue) !== '';

    return (
        <div
            className={cn(
                'h-10 w-full min-w-0 flex items-center',
                'rounded-[8px] overflow-hidden',
                'bg-filltext-ft-a',
                'focus-within:border focus-within:border-filltext-ft-g focus-within:border-[0.5px]',
                hasValue && 'border border-filltext-ft-d border-[0.5px]',
                'data-[invalid=true]:border-[0.5px] data-[invalid=true]:border-func-lost',
                'hover:bg-filltext-ft-b',
                className,
            )}
            data-invalid={Boolean(error)}
        >
            {Boolean(addonBefore) && <div className="shrink-0">{addonBefore}</div>}
            <input
                type={type}
                data-slot="input"
                className={cn(
                    'flex-1 min-w-0 h-full px-4',
                    'text-body-sm text-filltext-ft-e',
                    'placeholder:text-auxiliary-sm placeholder:text-filltext-ft-e',
                    'data-[invalid=true]:text-func-lost',
                    'disabled:pointer-events-none disabled:cursor-not-allowed',
                )}
                data-invalid={Boolean(error)}
                value={isControlled ? value || '' : inputValue}
                onChange={handleChange}
                {...props}
            />
            {Boolean(addonAfter) && <div className="shrink-0">{addonAfter}</div>}
        </div>
    );
};
