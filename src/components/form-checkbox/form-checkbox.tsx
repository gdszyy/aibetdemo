import { omit } from 'lodash-es';
import type { ComponentProps, FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { cn } from '@/utils/common';
import { Checkbox } from '../checkbox/checkbox';
import { FormItem, type FormItemProps } from '../form-item/form-item';

type FieldProps = ComponentProps<typeof Checkbox>;

/**
 * Form checkbox component — must be used with react-hook-form FormProvider
 * @returns
 */
export const FormCheckbox: FC<Omit<FormItemProps, 'label'> & { fieldProps: FieldProps }> = ({
    name,
    className,
    fieldProps,
    ...rest
}) => {
    const { control } = useFormContext();

    const {
        field: { value, onChange },
    } = useController({
        name,
        control,
    });

    const formProps = omit(rest, ['label']);

    return (
        <FormItem name={name} {...formProps} className={cn('flex flex-col gap-1', className)}>
            <Checkbox checked={value} onChange={onChange} {...fieldProps} />
        </FormItem>
    );
};
