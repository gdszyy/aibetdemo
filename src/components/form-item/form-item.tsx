import type { FC, PropsWithChildren, ReactNode } from 'react';
import { useFormState } from 'react-hook-form';
import { cn } from '@/utils/common';
import { FormErrorMessage } from '../form-error-message/form-error-message';

export interface FormItemProps extends PropsWithChildren {
    /** Form field name */
    name: string;
    /** Label */
    label?: string;
    /** Whether the label is bold */
    labelBold?: boolean;
    right?: ReactNode;
    className?: string;
    /**
     * Whether to show error message
     * @default true
     */
    showError?: boolean;
}

/**
 * FormItem — labeled form field, must be used with react-hook-form FormProvider
 * @param name - Form field name (required)
 * @param label - Label text
 * @param labelBold - Whether the label is bold
 * @param className - Custom class name
 * @param showError - Whether to show error message
 */
export const FormItem: FC<FormItemProps> = ({
    name,
    label,
    right,
    children,
    className,
    labelBold = false,
    showError = true,
}) => {
    const { errors } = useFormState();
    const error = errors?.[name];
    return (
        <div className={cn('flex flex-col gap-1', className)}>
            {Boolean(label) && (
                <div className="flex items-center">
                    <label className={cn('text-filltext-ft-g', labelBold ? 'text-body-lg' : 'text-auxiliary-sm')}>
                        {label}
                    </label>
                    <div className="flex-1" />
                    {Boolean(right) && right}
                </div>
            )}
            {children}
            <FormErrorMessage errMsg={error} enable={showError} />
        </div>
    );
};
