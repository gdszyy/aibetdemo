'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { Button } from '@/components/button/button';
import { WalletOutlined } from '@/components/icons2/WalletOutlined';
import { WarningCircleOutlined } from '@/components/icons2/WarningCircleOutlined';
import { Modal } from '@/components/modal/modal';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';

interface InsufficientBalanceModalProps {
    /** 是否展示弹窗。 */
    visible: boolean;
    /** 当前余额。 */
    currentBalance: number;
    /** 当前订单金额。 */
    orderAmount: number;
    /** 当前差额。 */
    differenceAmount: number;
    /** 关闭弹窗。 */
    onClose: () => void;
    /** 点击去充值。 */
    onDeposit: () => void;
}

/** 投注单余额不足弹窗。当前仅提供展示与交互壳子。 */
export const InsufficientBalanceModal: FC<InsufficientBalanceModalProps> = ({
    visible,
    currentBalance,
    orderAmount,
    differenceAmount,
    onClose,
    onDeposit,
}) => {
    const t = useTranslations('betSlip');
    const { formatCurrency } = useIntlFormatter();

    return (
        <Modal visible={visible} onClose={onClose} withBg={false} closeButton={false} maskClosable>
            <div className="w-[calc(100vw-2rem)] max-w-105 rounded-md bg-surface-1 px-6 py-8">
                <div className="flex flex-col items-center text-center">
                    <div className="flex size-15 items-center justify-center rounded-full bg-brand-primary-2">
                        <WarningCircleOutlined className="size-6 text-brand-red" />
                    </div>

                    <h3 className="mt-4 text-title-md text-filltext-ft-h">{t('modal.title')}</h3>

                    <div className="mt-2 w-full rounded-sm bg-filltext-ft-a px-4 py-5">
                        <div className="flex items-center gap-1 text-body-md text-filltext-ft-h">
                            <WalletOutlined className="w-5.5 h-4.5" />
                            <span>{t('modal.currentBalance')}</span>
                        </div>

                        <p className="mt-2 text-body-lg text-func-lost">{formatCurrency(currentBalance)}</p>
                    </div>

                    <p className="mt-2 text-body-sm text-func-lost">
                        {t.rich('modal.body', {
                            total: formatCurrency(orderAmount),
                            difference: formatCurrency(differenceAmount),
                            br: () => <br />,
                        })}
                    </p>

                    <div className="mt-6 flex w-full gap-2">
                        <Button block variant="secondary" className="h-10 flex-1" onClick={onClose}>
                            {t('button.cancel')}
                        </Button>
                        <Button block className="h-10 flex-1" onClick={onDeposit}>
                            {t('button.goDeposit')}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
