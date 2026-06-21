'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { cn } from '@/utils/common';

interface InsufficientBalanceBannerProps {
    /** 当前不足差额。 */
    differenceAmount: number;
    /** 点击充值按钮。 */
    onDeposit: () => void;
    /** 自定义样式。 */
    className?: string;
}

/** 余额不足时展示的充值提示条。 */
export const InsufficientBalanceBanner: FC<InsufficientBalanceBannerProps> = ({
    differenceAmount,
    onDeposit,
    className,
}) => {
    const t = useTranslations('betSlip');
    const { formatCurrency } = useIntlFormatter();
    const formattedDifferenceAmount = formatCurrency(Math.ceil(differenceAmount));
    const insufficientBalanceLabel = t.rich('banner.insufficientBalance', {
        amount: () => <span className="whitespace-nowrap text-auxiliary-md">{formattedDifferenceAmount}</span>,
    });

    return (
        <div
            className={cn(
                'flex w-auto items-center gap-1 rounded-r-xs border-l-2 border-l-func-lost bg-brand-primary-1 py-1 pl-1.5 pr-2',
                className,
            )}
        >
            <span className="min-w-0 flex-1 text-auxiliary-2xs text-func-lost">{insufficientBalanceLabel}</span>

            <button
                type="button"
                onClick={onDeposit}
                className="shrink-0 cursor-pointer text-auxiliary-md text-brand-red"
            >
                {t('button.deposit')}
            </button>
        </div>
    );
};
