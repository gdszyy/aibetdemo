import type { Select } from 'radix-ui';
import type { ComponentProps, ReactNode } from 'react';
import type { FormItemProps } from '@/components/form-item/form-item';

/**
 * Select option type
 */
export type Option = {
    label: ReactNode;
    value: string;
    defaultValue?: string;
    disabled?: boolean;
    children?: Option[];
};

/**
 * Select component Props
 */
export interface SelectProps extends Omit<ComponentProps<typeof Select.Root>, 'children'> {
    options: Option[];
    placeholder?: ReactNode;
    className?: string;
    contentClassName?: string;
    error?: boolean;
}

export type FormSelectProps = FormItemProps & { fieldProps: SelectProps };
