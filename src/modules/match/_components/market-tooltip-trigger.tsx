'use client';

import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/drawer/drawer';
import { Close } from '@/components/icons';
import { Tooltip } from '@/components/tooltip';
import { useIsDesktop } from '@/hooks/use-media-query';
import { cn } from '@/utils/common';

interface MarketTooltipTriggerProps {
    /** 市场名称，用于 H5 bottom sheet 标题。 */
    title: string;
    /** 当前语言的市场说明。 */
    desc: string;
    /** 触发说明展示的图标按钮。 */
    children: ReactNode;
    /** 图标按钮样式。 */
    className?: string;
}

/**
 * 比赛详情市场说明入口：PC 展示 tooltip，H5 展示底部抽屉。
 */
export const MarketTooltipTrigger: FC<MarketTooltipTriggerProps> = ({ title, desc, children, className }) => {
    const isDesktop = useIsDesktop();
    const [open, setOpen] = useState(false);

    if (isDesktop) {
        return (
            <Tooltip side="top" align="center" content={<p className="whitespace-pre-wrap text-center">{desc}</p>}>
                <button
                    type="button"
                    className={cn(
                        'flex size-4 shrink-0 cursor-pointer items-center justify-center text-filltext-ft-e transition-colors hover:text-filltext-ft-g focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0',
                        className,
                    )}
                >
                    {children}
                </button>
            </Tooltip>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={cn(
                    'flex size-4 shrink-0 cursor-pointer items-center justify-center text-filltext-ft-e transition-colors active:text-filltext-ft-g focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0',
                    className,
                )}
            >
                {children}
            </button>

            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent
                    overlayClassName="bg-black/55"
                    className={cn(
                        'mx-auto min-h-[180px] w-full max-w-[430px] border border-neutral-white-h bg-surface-1 px-4 pb-8 pt-8',
                        'rounded-t-[24px] shadow-floating',
                        '[&>div:first-child]:hidden',
                    )}
                >
                    <div className="absolute left-1/2 top-2 h-[5px] w-[35px] -translate-x-1/2 rounded-[30px] bg-filltext-ft-d" />
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="absolute right-4 top-4 flex size-5 cursor-pointer items-center justify-center rounded-xs text-filltext-ft-e transition-colors active:text-filltext-ft-g"
                    >
                        <Close className="size-3.5" />
                    </button>

                    <DrawerTitle className="w-full px-8 text-center text-title-md text-filltext-ft-h">
                        {title}
                    </DrawerTitle>
                    <p className="mt-4 whitespace-pre-wrap wrap-break-word text-left text-body-sm text-filltext-ft-f">
                        {desc}
                    </p>
                </DrawerContent>
            </Drawer>
        </>
    );
};
