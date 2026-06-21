'use client';

import { type FC, useEffect, useState } from 'react';
import { cn } from '@/utils/common';
import { Checked, UnChecked } from '../icons';

interface Props {
    /** Whether disabled */
    disabled?: boolean;
    /** Whether checked */
    checked?: boolean;
    /** Whether checked by default */
    defaultChecked?: boolean;
    /** Label */
    label?: string;
    /** Class name */
    className?: string;
    /** Checked icon class name */
    checkedIconClassName?: string;
    /** Unchecked icon class name */
    uncheckedIconClassName?: string;
    /** Change callback */
    onChange?: (checked: boolean) => void;
}

/**
 * Checkbox component
 * TODO: disabled styles
 */
export const Checkbox: FC<Props> = ({
    disabled,
    checked,
    defaultChecked,
    label,
    className,
    checkedIconClassName,
    uncheckedIconClassName,
    onChange,
}) => {
    const [isChecked, setIsChecked] = useState<boolean>(defaultChecked ?? false);

    useEffect(() => {
        if (checked !== undefined) {
            setIsChecked(checked);
        }
    }, [checked]);

    const handleChange = () => {
        if (disabled) {
            return;
        }
        const next = !isChecked;
        setIsChecked(next);
        onChange?.(next);
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <button
                type="button"
                onClick={handleChange}
                className={cn(disabled ? 'cursor-not-allowed' : 'cursor-pointer', 'shrink-0')}
            >
                {isChecked ? (
                    <Checked
                        className={cn(
                            'text-auxiliary-sm [&>path:first-child]:stroke-filltext-ft-g [&>path:last-child]:stroke-func-win',
                            checkedIconClassName,
                        )}
                    />
                ) : (
                    <UnChecked
                        className={cn(
                            'text-auxiliary-sm [&>path:first-child]:stroke-filltext-ft-g',
                            uncheckedIconClassName,
                        )}
                    />
                )}
            </button>
            {label && <span className="text-auxiliary-sm text-filltext-ft-g">{label}</span>}
        </div>
    );
};
