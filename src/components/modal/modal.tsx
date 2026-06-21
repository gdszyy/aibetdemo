'use client';

import { Dialog } from 'radix-ui';
import type { FC } from 'react';
import { Close } from '@/components/icons';
import { BaseModal, type ModalProps } from '../base-modal/base-modal';

/**
 * Modal component
 * @param visible - Whether visible
 * @param onClose - Close callback
 * @param withBg - Whether to show content background @default true
 * @param closeButton - Whether to show close button @default true
 * @param children - Child elements
 */
export const Modal: FC<ModalProps & { withBg?: boolean; closeButton?: boolean }> = ({
    children,
    withBg = true,
    closeButton = true,
    ...rest
}) => {
    return (
        <BaseModal {...rest} maskClosable={rest.maskClosable ?? !closeButton} blur={rest.blur ?? Boolean(withBg)}>
            {closeButton && (
                <Dialog.Close className="size-6 absolute right-4 top-4 z-20 flex cursor-pointer items-center justify-center rounded-xs bg-transparent text-filltext-ft-e transition-colors stroke-filltext-ft-e hover:bg-filltext-ft-b hover:text-filltext-ft-g hover:stroke-filltext-ft-g">
                    <Close className="size-3.5 text-current" />
                </Dialog.Close>
            )}
            <div className="relative z-10">
                {withBg ? <div className="bg-surface-1 rounded-sm p-4 min-w-40">{children}</div> : children}
            </div>
        </BaseModal>
    );
};
