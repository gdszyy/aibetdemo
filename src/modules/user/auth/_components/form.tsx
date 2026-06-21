'use client';

import { Slot } from 'radix-ui';
import * as React from 'react';
import {
    Controller,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
    FormProvider,
    useFormContext,
    useFormState,
} from 'react-hook-form';
import { Warn } from '@/components/icons';
import { cn } from '@/utils/common';

const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
};

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState } = useFormContext();
    const formState = useFormState({ name: fieldContext.name });
    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>');
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};

type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div data-slot="form-item" className={cn('grid', className)} {...props} />
        </FormItemContext.Provider>
    );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot.Root>) {
    const { error, formItemId } = useFormField();

    return <Slot.Root data-slot="form-control" id={formItemId} data-invalid={Boolean(error)} {...props} />;
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
    const { formDescriptionId } = useFormField();

    return (
        <p
            data-slot="form-description"
            id={formDescriptionId}
            className={cn('text-neutral-black-h text-sm', className)}
            {...props}
        />
    );
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? '') : props.children;

    if (!body) {
        return null;
    }

    return (
        <div
            data-slot="form-message"
            id={formMessageId}
            className={cn('text-auxiliary-xs flex items-center gap-1 mt-1  text-func-lost', className)}
            {...props}
        >
            <Warn className="size-3 shrink-0" />
            <span>{body}</span>
        </div>
    );
}

export { useFormField, Form, FormItem, FormControl, FormDescription, FormMessage, FormField };
