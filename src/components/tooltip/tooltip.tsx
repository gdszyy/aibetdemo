'use client';

import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { forwardRef, type ReactNode } from 'react';
import { DomIdEnum } from '@/constants';
import { cn } from '@/utils/common';
import { getPortalContainer } from '@/utils/dom';

export interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    className?: string;
    sideOffset?: number;
    contentStyle?: React.CSSProperties;
    arrowClassName?: string;
    arrowStyle?: React.CSSProperties;
    arrowWidth?: number;
    arrowHeight?: number;
    /** Whether tooltip content should ignore pointer events */
    disablePointerEvents?: boolean;
    open?: boolean | undefined;
    onOpenChange?: (open: boolean) => void;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
    (
        {
            children,
            content,
            side = 'top',
            align = 'center',
            className,
            sideOffset = 4,
            contentStyle,
            arrowClassName,
            arrowStyle,
            arrowWidth = 20,
            arrowHeight = 10,
            disablePointerEvents = false,
            open,
            onOpenChange,
        },
        ref,
    ) => {
        return (
            <TooltipPrimitive.Provider delayDuration={0}>
                <TooltipPrimitive.Root open={open} onOpenChange={onOpenChange}>
                    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
                    <TooltipPrimitive.Portal container={getPortalContainer(DomIdEnum.ModalContainer)}>
                        <TooltipPrimitive.Content
                            ref={ref}
                            side={side}
                            align={align}
                            sideOffset={sideOffset}
                            arrowPadding={8}
                            style={contentStyle}
                            className={cn(
                                'z-50 rounded-sm bg-content-primary p-2 shadow-floating backdrop-blur-[7.5px]',
                                'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                                'max-w-[300px]',
                                disablePointerEvents && 'pointer-events-none',
                                className,
                            )}
                        >
                            <div className="text-auxiliary-sm text-content-inverse break-words">{content}</div>
                            <TooltipPrimitive.Arrow asChild width={arrowWidth} height={arrowHeight}>
                                <svg>
                                    <path
                                        d="M0 0 L12.69 9.14 C13.89 10 16.11 10 17.31 9.14 L30 0 Z"
                                        className={cn('fill-filltext-ft-h', arrowClassName)}
                                        style={arrowStyle}
                                    />
                                </svg>
                            </TooltipPrimitive.Arrow>
                        </TooltipPrimitive.Content>
                    </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
            </TooltipPrimitive.Provider>
        );
    },
);

Tooltip.displayName = 'Tooltip';
