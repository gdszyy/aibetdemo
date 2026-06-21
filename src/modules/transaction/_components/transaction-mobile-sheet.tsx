'use client';

import type { FC, ReactNode } from 'react';
import { Checkbox } from '@/components/checkbox/checkbox';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/drawer/drawer';
import { Close } from '@/components/icons';
import { RightFilled } from '@/components/icons2/RightFilled';
import { cn } from '@/utils/common';

interface TransactionMobileSheetProps {
    title: string;
    visible: boolean;
    onClose: () => void;
    children?: ReactNode;
    mode?: 'single' | 'multiple';
    options?: TransactionMobileSheetOption[];
    value?: string | string[];
    onSelect?: (value: string) => void;
}

interface TransactionMobileSheetOption {
    label: ReactNode;
    value: string;
}

interface TransactionMobileSheetOptionsProps {
    mode: 'single' | 'multiple';
    options: TransactionMobileSheetOption[];
    value: string | string[];
    onSelect: (value: string) => void;
}

/**
 * 交易中心移动端底部筛选弹层。
 */
export const TransactionMobileSheet: FC<TransactionMobileSheetProps> = ({
    title,
    visible,
    onClose,
    children,
    mode,
    options,
    value,
    onSelect,
}) => {
    const hasBuiltInOptions = !!mode && !!options && value !== undefined && !!onSelect;

    return (
        <Drawer open={visible} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent
                overlayClassName="bg-black/55"
                className={cn(
                    'mx-auto flex max-h-[calc(100dvh-72px)] w-full max-w-none flex-col overflow-hidden border-none bg-surface-1 pb-[max(env(safe-area-inset-bottom),16px)',
                    'rounded-t-[20px] [&>div:first-child]:hidden',
                )}
            >
                <div className="relative flex items-center justify-center px-4 pb-3.5 pt-6">
                    <DrawerTitle className="text-title-sm text-filltext-ft-h">{title}</DrawerTitle>
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-4 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-filltext-ft-e transition-colors hover:text-filltext-ft-g"
                    >
                        <Close className="size-3.5" />
                    </button>
                </div>
                <div data-vaul-no-drag className="overflow-y-auto px-4 pb-2">
                    {hasBuiltInOptions ? (
                        <TransactionMobileSheetOptions
                            mode={mode}
                            options={options}
                            value={value}
                            onSelect={onSelect}
                        />
                    ) : (
                        children
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

/**
 * 交易中心移动端筛选项列表模板。
 */
export const TransactionMobileSheetOptions: FC<TransactionMobileSheetOptionsProps> = ({
    mode,
    options,
    value,
    onSelect,
}) => {
    const selectedValues = Array.isArray(value) ? value : [value];

    return (
        <div className="flex flex-col gap-1">
            {options.map((option) => {
                const isActive = selectedValues.includes(option.value);

                return (
                    <div key={option.value} className="flex flex-col gap-1">
                        <button
                            type="button"
                            onClick={() => onSelect(option.value)}
                            className={cn(
                                'flex w-full min-h-10 items-center justify-between rounded-xs px-4 py-2 text-left text-body-md text-filltext-ft-h transition-colors',
                                isActive && 'bg-filltext-ft-a',
                            )}
                        >
                            <span>{option.label}</span>
                            {mode === 'single' ? (
                                isActive ? (
                                    <RightFilled className="size-5 text-func-win" />
                                ) : null
                            ) : (
                                <Checkbox
                                    checked={isActive}
                                    className="pointer-events-none"
                                    checkedIconClassName="size-5 [&>path:first-child]:fill-brand-primary-0 [&>path:first-child]:stroke-brand-primary-0 [&>path:last-child]:stroke-neutral-white-h"
                                    uncheckedIconClassName="size-5"
                                />
                            )}
                        </button>

                        {option.value !== options[options.length - 1]?.value ? (
                            <div className="h-px bg-filltext-ft-c" />
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
};
