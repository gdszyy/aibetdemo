import { useToggle } from 'ahooks';
import type { ComponentProps, FC } from 'react';
import { useFormState } from 'react-hook-form';
import { cn } from '@/utils/common';
import { FormInput } from '../form-input/form-input';
import { EyeClose, EyeOpen } from '../icons';

/**
 * Password input (form component) — must be used with react-hook-form FormProvider
 * @returns
 */
export const FormPassword: FC<ComponentProps<typeof FormInput>> = ({ className, fieldProps, rules, ...rest }) => {
    const [isVisible, { toggle }] = useToggle();
    const { errors } = useFormState();

    return (
        <FormInput
            {...rest}
            rules={rules}
            className={cn('relative', className)}
            fieldProps={{
                ...fieldProps,
                type: isVisible ? 'text' : 'password',
                error: Boolean(errors?.[rest.name]?.message),
                addonAfter: (
                    <button type="button" className="px-4 h-full flex items-center cursor-pointer" onClick={toggle}>
                        {isVisible ? <EyeOpen className="text-base" /> : <EyeClose className="text-base" />}
                    </button>
                ),
            }}
        />
    );
};
