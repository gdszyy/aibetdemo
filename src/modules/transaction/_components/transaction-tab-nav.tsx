'use client';

import { useIsDesktop } from '@/hooks/use-media-query';
import { cn } from '@/utils/common';

export interface TransactionTabNavItem<T extends string = string> {
    label: string;
    value: T;
}

interface TransactionTabNavProps<T extends string = string> {
    items: TransactionTabNavItem<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

/**
 * 交易中心专用二级导航。
 * 桌面端保持文本导航，移动端支持横向滚动。
 */
export const TransactionTabNav = <T extends string>({
    items,
    value,
    onChange,
    className,
}: TransactionTabNavProps<T>) => {
    const isDesktop = useIsDesktop();

    return (
        <div
            className={cn(
                'flex min-w-0 items-center gap-3 overflow-x-auto hidden-scrollbar border-b border-filltext-ft-d border-b-[0.5px]',
                isDesktop ? 'gap-6' : 'gap-1.5 px-1',
                className,
            )}
        >
            {items.map((item) => {
                const isActive = item.value === value;

                return (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => onChange(item.value)}
                        className={cn(
                            'relative shrink-0 cursor-pointer whitespace-nowrap transition-colors text-filltext-ft-f text-body-lg',
                            isDesktop ? 'px-0 pb-3' : 'px-2 py-2 first:pl-2 last:pr-2',
                            isActive ? 'text-filltext-ft-h' : 'text-filltext-ft-e hover:text-filltext-ft-g',
                        )}
                    >
                        {item.label}
                        <span
                            className={cn(
                                'absolute bottom-0 rounded-full bg-brand-primary-0 transition-opacity',
                                isDesktop ? 'inset-x-0 h-[2px]' : 'left-2 right-2 h-[2px]',
                                isActive ? 'opacity-100' : 'opacity-0',
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
};
