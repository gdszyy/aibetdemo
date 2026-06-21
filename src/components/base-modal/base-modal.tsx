'use client';

import { useTranslations } from 'next-intl';
import { Dialog, VisuallyHidden } from 'radix-ui';
import { type FC, type PropsWithChildren, useEffect, useRef } from 'react';
import { DomIdEnum } from '@/constants';
import { cn } from '@/utils/common';
import { getPortalContainer } from '@/utils/dom';
import { useModalLevel } from './hooks/use-modal-level';

export interface ModalProps extends PropsWithChildren {
    /** Whether visible */
    visible: boolean;
    /** Close callback */
    onClose: () => void;
    /**
     * Whether clicking the overlay closes the modal
     * @default true
     */
    maskClosable?: boolean;
    /**
     * Whether to blur the background
     * @default false
     */
    blur?: boolean;
    /** Additional styles for Dialog.Content */
    contentClassName?: string;
}

/**
 * Base modal component
 * @description Supports multi-layer modal stacking, each layer fully overlays the previous one (including backdrop)
 */
export const BaseModal: FC<ModalProps> = ({
    visible,
    onClose,
    children,
    maskClosable = true,
    blur = false,
    contentClassName,
}) => {
    const t = useTranslations('common');
    const modalIdRef = useRef<string | null>(null);
    const { addModalId, removeModalId, getModalLevel } = useModalLevel();

    // Register and unregister Modal
    useEffect(() => {
        if (visible) {
            const id = addModalId();
            modalIdRef.current = id;
        } else if (modalIdRef.current !== null) {
            // When visible becomes false, unregister immediately
            removeModalId(modalIdRef.current);
            modalIdRef.current = null;
        }

        // Cleanup: unregister on component unmount
        return () => {
            if (modalIdRef.current !== null) {
                removeModalId(modalIdRef.current);
                modalIdRef.current = null;
            }
        };
    }, [visible, addModalId, removeModalId]);

    // Calculate current Modal's z-level
    const level = modalIdRef.current !== null ? getModalLevel(modalIdRef.current) : 0;

    if (!visible) return null;

    return (
        <Dialog.Root
            open={visible}
            onOpenChange={(nextOpen: boolean) => {
                if (!nextOpen) {
                    onClose();
                }
            }}
        >
            <Dialog.Portal container={getPortalContainer(DomIdEnum.ModalContainer)}>
                <Dialog.Overlay
                    className={cn(
                        'fixed inset-0 bg-black/42 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                    )}
                />
                <Dialog.Content
                    className={cn(
                        'fixed left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2',
                        contentClassName,
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                        blur ? (level > 1 ? 'backdrop-blur-[2.5px]' : 'backdrop-blur-[7.5px]') : '',
                    )}
                    onOpenAutoFocus={(e) => {
                        e.preventDefault();
                        (e.currentTarget as HTMLElement)?.focus();
                    }}
                    onPointerDownOutside={(event) => {
                        // Don't close modal when clicking a masked toast overlay above the modal.
                        const hasMaskedToast = document.querySelector('[data-toast-mask="true"]');
                        if (!maskClosable || hasMaskedToast) {
                            event.preventDefault();
                        }
                    }}
                    onInteractOutside={(event) => {
                        const hasMaskedToast = document.querySelector('[data-toast-mask="true"]');
                        if (!maskClosable || hasMaskedToast) {
                            event.preventDefault();
                        }
                    }}
                >
                    <Dialog.Title asChild>
                        <VisuallyHidden.Root>{t('dialog.ariaTitle')}</VisuallyHidden.Root>
                    </Dialog.Title>
                    <Dialog.Description asChild>
                        <VisuallyHidden.Root>{t('dialog.ariaDescription')}</VisuallyHidden.Root>
                    </Dialog.Description>
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
