'use client';

import { useRequest } from 'ahooks';
import { useTranslations } from 'next-intl';
import { Dialog, VisuallyHidden } from 'radix-ui';
import type React from 'react';
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { Button } from '@/components/button/button';
import { DomIdEnum } from '@/constants';
import { cn } from '@/utils/common';
import { getPortalContainer } from '@/utils/dom';
import { Warn } from '../icons';
import { closeDialog, getDialogSnapshot, subscribeDialog } from './';
import type { DialogItem } from './constant';

// Dialog provider component
export const DialogProvider: React.FC = () => {
    const dialog = useSyncExternalStore(subscribeDialog, getDialogSnapshot, () => null);

    const t = useTranslations('common');
    const confirmBtnText = t('dialog.confirmBtnText');
    const cancelBtnText = t('dialog.cancelBtnText');

    // Create confirm promise function
    const confirmPromise = useMemo(() => {
        if (!dialog || dialog.type !== 'confirm' || !dialog.onConfirm) {
            return async () => {};
        }
        return async () => {
            await dialog.onConfirm?.(closeDialog);
        };
    }, [dialog]);

    // Use useRequest to manage confirm action loading state
    const { loading: confirmLoading, run: runConfirm } = useRequest(confirmPromise, {
        manual: true,
        loadingDelay: 300,
        onSuccess: () => {
            if (dialog?.autoClose) closeDialog();
        },
    });

    // Handle confirm
    const handleConfirm = useCallback(
        async (currentDialog: DialogItem) => {
            if (currentDialog.type === 'confirm' && currentDialog.onConfirm) {
                runConfirm();
            } else {
                // Non-confirm type or no onConfirm handler
                await currentDialog?.onConfirm?.(closeDialog);
                if (currentDialog.autoClose || !currentDialog.onConfirm) closeDialog();
            }
        },
        [runConfirm],
    );

    // Handle cancel
    const handleCancel = async (currentDialog: DialogItem) => {
        await currentDialog.onCancel?.(closeDialog);
        if (currentDialog.autoClose || !currentDialog.onCancel) closeDialog();
    };

    return (
        <>
            {dialog && (
                <Dialog.Root key={dialog.id} open onOpenChange={(open) => !open && closeDialog()}>
                    <Dialog.Portal container={getPortalContainer(DomIdEnum.ModalContainer)}>
                        <Dialog.Overlay
                            className={cn(
                                'fixed inset-0 bg-black/42 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                            )}
                        />
                        <Dialog.Content
                            className={cn(
                                'fixed left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-[435px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface-raised p-4',
                                'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                            )}
                            onPointerDownOutside={(event) => {
                                event.preventDefault();
                            }}
                            onInteractOutside={(event) => {
                                event.preventDefault();
                            }}
                        >
                            <Dialog.Title asChild>
                                <VisuallyHidden.Root>{t('dialog.ariaTitle')}</VisuallyHidden.Root>
                            </Dialog.Title>
                            <Dialog.Description asChild>
                                <VisuallyHidden.Root>{t('dialog.ariaDescription')}</VisuallyHidden.Root>
                            </Dialog.Description>

                            <div className=" flex flex-col gap-4">
                                {dialog?.type === 'error' && <Warn className="size-6 mx-auto text-func-lost" />}
                                {Boolean(dialog?.title) && (
                                    <div className="text-title-md">
                                        {typeof dialog.title === 'function' ? (
                                            dialog.title()
                                        ) : (
                                            <pre className="whitespace-pre-wrap">{dialog.title}</pre>
                                        )}
                                    </div>
                                )}
                                {Boolean(dialog?.content) && (
                                    <div className="text-body-sm w-full wrap-break-word">
                                        {typeof dialog.content === 'function' ? (
                                            dialog.content()
                                        ) : (
                                            <pre className="w-full wrap-break-word whitespace-pre-wrap">
                                                {dialog.content}
                                            </pre>
                                        )}
                                    </div>
                                )}
                                <div className="flex gap-[10px] justify-end">
                                    {dialog.type === 'confirm' && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleCancel(dialog)}
                                            className="flex-1 h-10"
                                        >
                                            {dialog.cancelText || cancelBtnText}
                                        </Button>
                                    )}
                                    <Button
                                        variant="primary"
                                        onClick={() => handleConfirm(dialog)}
                                        className="flex-1 h-10"
                                        loading={dialog.type === 'confirm' ? confirmLoading : false}
                                    >
                                        {dialog.confirmText || confirmBtnText}
                                    </Button>
                                </div>
                            </div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            )}
        </>
    );
};
