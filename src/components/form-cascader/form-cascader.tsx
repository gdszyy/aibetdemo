import type { FC } from 'react';
import { useController, useFormContext, useFormState } from 'react-hook-form';
import { cn } from '@/utils/common';
import { Cascader } from '../cascader/cascader';
import { FormItem } from '../form-item/form-item';
import type { FormSelectProps } from '../select/constants';

/**
 * Form cascader select component — must be used with react-hook-form FormProvider
 */
export const FormCascader: FC<FormSelectProps> = ({ name, className, fieldProps, ...rest }) => {
    const { control } = useFormContext();
    const { errors } = useFormState();

    const {
        field: { value, onChange },
    } = useController({
        name,
        control,
    });

    return (
        <FormItem name={name} {...rest} className={cn('flex flex-col gap-1', className)}>
            <Cascader {...fieldProps} value={value} onValueChange={onChange} error={Boolean(errors?.[name]?.message)} />
        </FormItem>
    );
};
