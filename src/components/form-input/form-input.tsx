import type { ChangeEvent, ComponentProps, FC, InputHTMLAttributes } from 'react';
import { type RegisterOptions, useFormContext, useFormState, useWatch } from 'react-hook-form';
import { cn } from '@/utils/common';
import { FormItem, type FormItemProps } from '../form-item/form-item';
import { Input } from '../input/input';

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'>;
type FieldProps = ComponentProps<typeof Input> & NativeInputProps;
type FormInputProps = FormItemProps & { fieldProps?: FieldProps; rules?: RegisterOptions };
/**
 * Form input component — must be used with react-hook-form FormProvider
 * @returns
 */
export const FormInput: FC<FormInputProps> = ({ name, className, fieldProps = {}, rules, ...rest }) => {
    const { register } = useFormContext();
    const { errors } = useFormState();
    const fieldValue = useWatch({ name });

    const registerResult = register(name, rules);
    const { onChange: rhfOnChange, ...registerProps } = registerResult;
    const { onChange: customOnChange, ...restFieldProps } = fieldProps;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (typeof customOnChange === 'function') {
            customOnChange(event);
        }
        if (typeof rhfOnChange === 'function') {
            rhfOnChange(event);
        }
    };

    return (
        <FormItem name={name} {...rest} className={cn('flex flex-col gap-1', className)}>
            <Input
                error={Boolean(errors?.[name]?.message)}
                {...registerProps}
                {...restFieldProps}
                value={fieldValue}
                onChange={handleChange}
            />
        </FormItem>
    );
};
