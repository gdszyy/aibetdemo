import { forwardRef, type ReactNode, useRef } from 'react';

import { cn } from '@/utils/common';

/** 登录表单浮动输入框的属性定义。 */
export interface OutlineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /**
     * 输入框标签内容。
     */
    label?: ReactNode;
    /**
     * 是否展示错误态。
     */
    error?: boolean;
    /**
     * 输入框前置装饰内容。
     */
    startAdornment?: ReactNode;
    /**
     * 输入框后置装饰内容。
     */
    endAdornment?: ReactNode;
}

/** 登录弹窗使用的带外置标签输入框。 */
export const OutlineInput = forwardRef<HTMLInputElement, OutlineInputProps>(
    ({ className, label, error, startAdornment, endAdornment, value, onChange, onFocus, onBlur, ...rest }, ref) => {
        const internalInputRef = useRef<HTMLInputElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);

        const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
            // If focus moved to an element within the container (e.g. adornment button),
            // skip form validation — user is still interacting with this field
            if (containerRef.current?.contains(event.relatedTarget as Node)) {
                return;
            }
            onBlur?.(event);
        };

        const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>): void => {
            const target = event.target as HTMLElement;
            // Keep interactive adornments (e.g. region Select trigger) in control.
            if (target.closest('button, [role="button"], [role="combobox"], [data-state]')) {
                return;
            }
            if (ref && typeof ref !== 'function') {
                ref.current?.focus();
            } else if (internalInputRef.current) {
                internalInputRef.current.focus();
            }
        };

        return (
            <div className={cn('flex min-w-0 flex-col gap-1', className)}>
                {label && <div className="text-body-sm text-filltext-ft-g">{label}</div>}
                <div
                    ref={containerRef}
                    onClick={handleContainerClick}
                    className={cn(
                        'flex h-10 min-w-0 items-center gap-2 overflow-hidden rounded-sm bg-filltext-ft-a px-4 transition-colors',
                        'cursor-text hover:bg-filltext-ft-b focus-within:bg-filltext-ft-b',
                        error
                            ? 'border-[0.5px] border-func-lost'
                            : 'border-[0.5px] border-transparent focus-within:border-filltext-ft-g has-data-[state=open]:border-filltext-ft-g',
                    )}
                >
                    {startAdornment}
                    {/* Input */}
                    <input
                        ref={(e) => {
                            // Handle both forwarding ref and internal ref
                            internalInputRef.current = e;
                            if (typeof ref === 'function') {
                                ref(e);
                            } else if (ref) {
                                ref.current = e;
                            }
                        }}
                        className={cn(
                            'flex-1 h-full min-w-0',
                            'text-body-md text-filltext-ft-g bg-transparent',
                            'placeholder:text-auxiliary-sm placeholder:text-filltext-ft-e focus:placeholder:text-transparent',
                            'disabled:pointer-events-none disabled:cursor-not-allowed',
                        )}
                        value={value}
                        onChange={onChange}
                        onFocus={onFocus}
                        onBlur={handleBlur}
                        {...rest}
                    />
                    {endAdornment}
                </div>
            </div>
        );
    },
);

OutlineInput.displayName = 'OutlineInput';
