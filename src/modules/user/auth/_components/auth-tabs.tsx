'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';
import type { FC } from 'react';
import { cn } from '@/utils/common';

/** 认证入口支持的标签项。 */
export interface AuthTabItem<T extends string> {
    /** 标签值。 */
    value: T;
    /** 标签文案。 */
    label: string;
}

interface AuthTabsProps<T extends string> {
    /** 当前激活标签。 */
    value: T;
    /** 可切换的认证标签。 */
    items: AuthTabItem<T>[];
    /** 标签切换回调。 */
    onChange: (value: T) => void;
    /** 根节点样式。 */
    className?: string;
    /** 标签列表样式。 */
    listClassName?: string;
}

// TODO: 先抽离试用，后期提取出公共的组件
/**
 * 认证页标签切换组件，供登录与后续注册场景复用。
 * @param props 当前值、标签项和切换回调
 * @returns 认证方式切换标签
 */
export function AuthTabs<T extends string>({
    value,
    items,
    onChange,
    className,
    listClassName,
}: AuthTabsProps<T>): ReturnType<FC> {
    return (
        <TabsPrimitive.Root value={value} onValueChange={(nextValue) => onChange(nextValue as T)} className={className}>
            <TabsPrimitive.List
                className={cn('flex h-10 items-center gap-x-6 border-b-[0.5px] border-filltext-ft-d', listClassName)}
            >
                {items.map((item, index) => {
                    const isFirstTab = index === 0;

                    return (
                        <TabsPrimitive.Trigger
                            key={item.value}
                            value={item.value}
                            className={cn(
                                'group flex h-10 shrink-0 cursor-pointer flex-col items-center justify-center text-body-lg transition-colors',
                                'text-filltext-ft-f data-[state=active]:text-filltext-ft-h',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex min-h-0 w-full flex-1 items-end justify-center',
                                    isFirstTab ? 'pl-2 -ml-2 pr-2' : 'px-2',
                                )}
                            >
                                <span className="h-0.5 w-full rounded-lg opacity-0" />
                            </span>
                            <span
                                className={cn(
                                    'flex shrink-0 items-center gap-2 py-1 transition-colors rounded-sm',
                                    isFirstTab ? 'pl-2 -ml-2 pr-2' : 'px-2',
                                    'group-hover:bg-filltext-ft-c group-data-[state=active]:bg-transparent',
                                )}
                            >
                                {item.label}
                            </span>
                            <span
                                className={cn(
                                    'flex h-2 w-full shrink-0 items-end justify-center',
                                    isFirstTab ? 'pl-1 -ml-2 pr-1' : 'px-2',
                                )}
                            >
                                <span className="h-0.5 w-full rounded-lg bg-brand-primary-0 opacity-0 transition-opacity group-data-[state=active]:opacity-100" />
                            </span>
                        </TabsPrimitive.Trigger>
                    );
                })}
            </TabsPrimitive.List>
        </TabsPrimitive.Root>
    );
}
