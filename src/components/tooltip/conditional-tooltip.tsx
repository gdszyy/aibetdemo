import type { FocusEventHandler, PointerEventHandler, ReactElement, Ref, RefAttributes } from 'react';
import { cloneElement, useCallback, useState } from 'react';
import { useIsMobile } from '@/hooks/use-media-query';
import { useTextOverflow } from '@/hooks/use-text-overflow';
import { Tooltip, type TooltipProps } from './tooltip';

type ConditionalTooltipChildProps = {
    onBlur?: FocusEventHandler<HTMLElement>;
    onFocus?: FocusEventHandler<HTMLElement>;
    onPointerEnter?: PointerEventHandler<HTMLElement>;
    onPointerLeave?: PointerEventHandler<HTMLElement>;
} & RefAttributes<HTMLElement>;

interface ConditionalTooltipProps extends Omit<TooltipProps, 'children' | 'open' | 'onOpenChange'> {
    children: ReactElement<ConditionalTooltipChildProps>;
    /** Tooltip content - only shown when text overflows */
    content: TooltipProps['content'];
    /** Force tooltip to always show (for non-text-overflow use cases) */
    forceShow?: boolean;
}

function assignRef<T>(targetRef: Ref<T> | undefined, value: T | null) {
    if (typeof targetRef === 'function') {
        targetRef(value);
        return;
    }

    if (targetRef) {
        targetRef.current = value;
    }
}

export function ConditionalTooltip({ children, content, forceShow = false, ...tooltipProps }: ConditionalTooltipProps) {
    const { ref, check } = useTextOverflow<HTMLElement>();
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const { ref: childRef, onBlur, onFocus, onPointerEnter, onPointerLeave } = children.props;

    const openIfNeeded = useCallback(() => {
        if (isMobile) {
            return;
        }

        if (forceShow || check()) {
            setOpen(true);
        }
    }, [check, forceShow, isMobile]);

    const handleRef = useCallback(
        (element: HTMLElement | null) => {
            ref.current = element;
            assignRef(childRef, element);
        },
        [childRef, ref],
    );

    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            if (!nextOpen) {
                setOpen(false);
                return;
            }

            if (isMobile) {
                setOpen(false);
                return;
            }

            setOpen(forceShow || check());
        },
        [check, forceShow, isMobile],
    );

    const handlePointerEnter = useCallback<PointerEventHandler<HTMLElement>>(
        (event) => {
            onPointerEnter?.(event);
            openIfNeeded();
        },
        [onPointerEnter, openIfNeeded],
    );

    const handlePointerLeave = useCallback<PointerEventHandler<HTMLElement>>(
        (event) => {
            onPointerLeave?.(event);
            setOpen(false);
        },
        [onPointerLeave],
    );

    const handleFocus = useCallback<FocusEventHandler<HTMLElement>>(
        (event) => {
            onFocus?.(event);
            openIfNeeded();
        },
        [onFocus, openIfNeeded],
    );

    const handleBlur = useCallback<FocusEventHandler<HTMLElement>>(
        (event) => {
            onBlur?.(event);
            setOpen(false);
        },
        [onBlur],
    );

    const childWithRef = cloneElement(children, {
        ref: handleRef,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onPointerEnter: handlePointerEnter,
        onPointerLeave: handlePointerLeave,
    });

    if (isMobile) {
        return childWithRef;
    }

    return (
        <Tooltip content={content} open={open} onOpenChange={handleOpenChange} disablePointerEvents {...tooltipProps}>
            {childWithRef}
        </Tooltip>
    );
}
