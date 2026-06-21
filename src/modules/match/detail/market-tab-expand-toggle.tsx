'use client';

import type { FC } from 'react';
import { CollapseOutlined } from '@/components/icons2/CollapseOutlined';
import { ExpandOutlined } from '@/components/icons2/ExpandOutlined';
import { cn } from '@/utils/common';

interface MarketTabExpandToggleProps {
    /** 当前 tab 是否已展开全部盘口。 */
    isExpanded: boolean;
    /** 切换当前 tab 的全部盘口展开态。 */
    onToggle: () => void;
}

/** 详情页盘口 tab 右侧独立的展开/收起全部盘口按钮。 */
export const MarketTabExpandToggle: FC<MarketTabExpandToggleProps> = ({ isExpanded, onToggle }) => {
    const Icon = isExpanded ? CollapseOutlined : ExpandOutlined;

    return (
        <button
            type="button"
            onClick={onToggle}
            className={cn(
                'ml-4 flex w-10 shrink-0 items-center justify-center cursor-pointer text-filltext-ft-e transition-all duration-200',
                'hover:text-filltext-ft-g active:scale-95',
            )}
        >
            <Icon className="size-8" />
        </button>
    );
};
