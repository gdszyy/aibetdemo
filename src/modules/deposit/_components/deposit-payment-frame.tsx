'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { cn } from '@/utils/common';
import type { DepositPaymentView } from '../_constants/payment';

interface DepositPaymentFrameProps {
    /** iframe 支付视图数据。 */
    payment: DepositPaymentView;
    /** 外层样式。 */
    className?: string;
    /** 是否隐藏处理中提示。 */
    hideProcessingText?: boolean;
}

/** 第三方充值链接 iframe 承载视图。 */
export const DepositPaymentFrame: FC<DepositPaymentFrameProps> = ({
    payment,
    className,
    hideProcessingText = false,
}) => {
    const t = useTranslations('deposit');

    return (
        <div className={className}>
            <p className="mb-3 text-body-md font-medium text-filltext-ft-g">
                {t('modal.payWithMethod', { method: payment.payPlatform })}
            </p>
            <div
                className={cn(
                    'h-107.5 overflow-hidden rounded-sm bg-surface-1 max-md:h-[58vh]',
                    'md:border md:border-filltext-ft-c',
                )}
            >
                <iframe
                    title={t('modal.paymentFrameTitle')}
                    src={payment.payUrl}
                    className="size-full border-0 bg-surface-1"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
            {!hideProcessingText && (
                <p className="mt-2 text-center text-auxiliary-sm text-filltext-ft-e">{t('modal.processingPayment')}</p>
            )}
        </div>
    );
};
