'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { Button } from '@/components/button/button';
import { Close } from '@/components/icons';
import { Right } from '@/components/icons2/Right';
import { Wallet } from '@/components/icons2/Wallet';
import { Loading } from '@/components/loading/loading';
import { Modal } from '@/components/modal/modal';
import { cn } from '@/utils/common';

export type Status =
    /** 支付状态 */
    | 'confirm'
    /** 余额不足 */
    | 'insufficient'
    /** 支付中 */
    | 'processing'
    /** 支付成功 */
    | 'success';

interface PaymentModalProps {
    visible: boolean;
    status: Status;
    balanceText: string;
    purchaseAmountText: string;
    onClose: () => void;
    onConfirm: () => void;
    onDeposit: () => void;
    onSuccessAction: () => void;
}

export const PaymentModal: FC<PaymentModalProps> = ({
    visible,
    status,
    balanceText,
    purchaseAmountText,
    onClose,
    onConfirm,
    onDeposit,
    onSuccessAction,
}) => {
    const t = useTranslations('promotionWorldCupPass');
    /** 支付中 */
    const isProcessing = status === 'processing';
    // const isProcessing = true;
    /** 支付成功 */
    const isSuccess = status === 'success';
    /** 余额不足 */
    const isInsufficient = status === 'insufficient';
    /** 展示余额信息 */
    const showBalanceCard = status === 'confirm' || status === 'insufficient';
    const highlightClassName = isInsufficient ? cn('text-func-lost') : cn('text-[#009655]');

    return (
        <Modal
            visible={visible}
            onClose={() => {
                if (!isProcessing) {
                    onClose();
                }
            }}
            withBg={false}
            closeButton={false}
            maskClosable={!isProcessing}
        >
            <div className="relative w-[calc(100vw-2rem)] max-w-105 overflow-hidden rounded-md bg-surface-1 px-6 py-8">
                <button
                    type="button"
                    onClick={() => {
                        if (!isProcessing) {
                            onClose();
                        }
                    }}
                    disabled={isProcessing}
                    className="absolute right-2 top-2 inline-flex size-6 cursor-pointer items-center justify-center text-filltext-ft-e transition-colors hover:text-filltext-ft-g rounded-xs hover:bg-filltext-ft-b disabled:pointer-events-none"
                >
                    <Close className="size-3.5" />
                </button>

                <div className="flex flex-col gap-6 items-center text-center">
                    <h3 className="text-title-md uppercase text-filltext-ft-h">{t('unlock.unlockPremium')}</h3>

                    {showBalanceCard && (
                        <div
                            className={cn(
                                'flex w-full flex-col gap-2.5 rounded-sm px-4 py-2',
                                isInsufficient ? 'bg-brand-primary-1' : 'bg-filltext-ft-a',
                            )}
                        >
                            <div className="flex items-center gap-1 text-body-md text-filltext-ft-h text-left">
                                <Wallet className="size-6" />
                                <span>{t('unlock.currentBalance')}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center">
                                <span className="text-body-lg text-filltext-ft-h">{balanceText}</span>
                                {isInsufficient && (
                                    <span className="text-auxiliary-sm text-func-lost">
                                        {t('unlock.insufficientBalanceTitle')}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loading className="size-10" variant="color-red" />
                            <p className="text-body-lg text-filltext-ft-g">{t('unlock.processingPayment')}</p>
                        </div>
                    ) : isSuccess ? (
                        <div className="w-full flex flex-col gap-6 items-center">
                            <div className="flex flex-col items-center gap-4">
                                <Right className="size-20" />
                                <p className="text-title-md text-filltext-ft-h">{t('unlock.successTitle')}</p>
                                <div className="w-full text-body-sm text-filltext-ft-g">
                                    {t.rich('unlock.successDescription', {
                                        highlight: (chunks) => (
                                            <span className="text-body-lg text-[#009655]">{chunks}</span>
                                        ),
                                    })}
                                </div>
                            </div>
                            <Button
                                block
                                onClick={onSuccessAction}
                                className="h-10 rounded-full bg-filltext-ft-h px-4 text-body-lg text-neutral-white-h"
                            >
                                {t('unlock.startClaimingRewards')}
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="w-full text-body-sm text-filltext-ft-g">
                                {t.rich('unlock.modalDescription', {
                                    highlight: (chunks) => (
                                        <span className={cn('text-body-lg', highlightClassName)}>{chunks}</span>
                                    ),
                                })}
                            </div>

                            <div className="flex flex-col w-full gap-2">
                                <Button
                                    block
                                    variant={isInsufficient ? 'secondary' : 'primary'}
                                    onClick={isInsufficient ? onDeposit : onConfirm}
                                    className={cn(
                                        'h-10 rounded-full px-4 text-body-lg w-full',
                                        isInsufficient
                                            ? 'bg-filltext-ft-b text-filltext-ft-g'
                                            : 'bg-brand-primary-0 text-neutral-white-h',
                                    )}
                                >
                                    {isInsufficient
                                        ? t('unlock.depositToUnlock')
                                        : t('unlock.payNow', { amount: purchaseAmountText })}
                                </Button>

                                <div className="w-full flex justify-center gap-1 text-auxiliary-sm uppercase text-[rgba(34,43,89,0.63)]">
                                    <span>{t('unlock.insufficientBalancePrompt')}</span>
                                    <button
                                        type="button"
                                        onClick={onDeposit}
                                        className="cursor-pointer text-auxiliary-blue transition-opacity"
                                    >
                                        {t('unlock.depositHere')}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};
