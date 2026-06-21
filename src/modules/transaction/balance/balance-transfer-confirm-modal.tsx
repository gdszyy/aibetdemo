'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { Button } from '@/components/button/button';
import { Close } from '@/components/icons';
import { Modal } from '@/components/modal/modal';

interface BalanceTransferConfirmModalProps {
    visible: boolean;
    loading: boolean;
    description: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const BalanceTransferConfirmModal: FC<BalanceTransferConfirmModalProps> = ({
    visible,
    loading,
    description,
    onClose,
    onConfirm,
}) => {
    const t = useTranslations('transaction');
    const commonT = useTranslations('common');

    return (
        <Modal
            visible={visible}
            onClose={() => {
                if (!loading) {
                    onClose();
                }
            }}
            withBg={false}
            closeButton={false}
            blur
            maskClosable={!loading}
        >
            <div className="relative w-[calc(100vw-2rem)] max-w-[327px] overflow-hidden rounded-md bg-surface-1 px-6 pb-8 pt-8 shadow-floating backdrop-blur-[2.5px] md:max-w-[420px]">
                <button
                    type="button"
                    onClick={() => {
                        if (!loading) {
                            onClose();
                        }
                    }}
                    disabled={loading}
                    className="absolute right-3 top-3 inline-flex size-3.5 cursor-pointer items-center justify-center text-filltext-ft-e transition-colors hover:text-filltext-ft-g disabled:pointer-events-none md:right-4 md:top-4"
                >
                    <Close className="size-3.5" />
                </button>

                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="flex flex-col items-center gap-2 md:gap-4">
                        <p className="text-center text-title-md text-filltext-ft-g">{t('transferConfirmTitle')}</p>
                        <p className="text-center text-body-sm text-filltext-ft-g">{description}</p>
                    </div>

                    <div className="flex w-full items-center gap-2">
                        <Button
                            block
                            variant="secondary"
                            disabled={loading}
                            onClick={onClose}
                            className="h-10 rounded-full px-4 text-body-lg text-filltext-ft-e disabled:bg-filltext-ft-b disabled:text-filltext-ft-e"
                        >
                            {commonT('dialog.cancelBtnText')}
                        </Button>
                        <Button
                            block
                            variant="primary"
                            loading={loading}
                            onClick={onConfirm}
                            className="h-10 rounded-full px-4 text-body-lg"
                        >
                            {commonT('dialog.confirmBtnText')}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
