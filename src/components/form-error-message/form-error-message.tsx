import type { FC, ReactNode } from 'react';
import { isValidElement } from 'react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { Warn } from '@/components/icons';

/**
 * Form error message component
 * @param errMsg - Error message
 * @param enable - Whether enabled
 */
export const FormErrorMessage: FC<{
    errMsg: ReactNode | string | FieldError | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>> | undefined;
    enable?: boolean;
}> = ({ errMsg, enable = true }) => {
    if (!enable || !errMsg) return null;

    if (isValidElement(errMsg)) {
        return <div className="text-auxiliary-sm text-func-lost mt-1">{errMsg}</div>;
    }

    const resolvedMsg = (() => {
        if (typeof errMsg === 'object' && !isValidElement(errMsg) && !Array.isArray(errMsg)) {
            return (errMsg as FieldError)?.message;
        }
        return errMsg as ReactNode;
    })();

    if (!resolvedMsg) return null;

    return (
        <div className="flex items-center gap-1 mt-1 text-func-lost text-auxiliary-xs">
            <Warn className="size-3 shrink-0" />
            <span>{isValidElement(errMsg) ? errMsg : resolvedMsg}</span>
        </div>
    );
};
