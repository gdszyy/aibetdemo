'use client';

import type { FC } from 'react';
import type { Option } from '@/components/select/constants';
import { Select } from '@/components/select/select';
import { cn } from '@/utils/common';

interface TransactionsSelectV2Props {
    value: string;
    options: Option[];
    onValueChange: (value: string) => void;
    className?: string;
}

/** 交易页桌面端 V2 下拉筛选。 */
export const TransactionsSelectV2: FC<TransactionsSelectV2Props> = ({ value, options, onValueChange, className }) => {
    return (
        <Select
            value={value}
            options={options}
            onValueChange={onValueChange}
            className={cn(
                'h-10 w-[200px] bg-surface-1 px-4 text-body-md text-filltext-ft-h',
                'hover:bg-surface-2 hover:text-filltext-ft-f',
                'data-[state=open]:bg-surface-1 data-[state=open]:text-filltext-ft-h data-[state=open]:border data-[state=open]:border-filltext-ft-g',
                'focus-visible:border-filltext-ft-g',
                className,
            )}
            contentClassName="rounded-sm bg-surface-1 p-0"
        />
    );
};
