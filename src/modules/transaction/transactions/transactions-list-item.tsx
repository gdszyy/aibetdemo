'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import type { TransactionsListItemProps } from '@/api/models/transaction';
import { Copy } from '@/components/icons';
import { CopyOutlined } from '@/components/icons2/CopyOutlined';
import { Toast } from '@/components/toast';
import { ConditionalTooltip } from '@/components/tooltip/conditional-tooltip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useIsDesktop } from '@/hooks/use-media-query';

export const TransactionsListItem: FC<TransactionsListItemProps> = ({
    order_type_name,
    order_id,
    currency_type_name,
    remark,
    amount,
    after_balance,
    created_at,
}) => {
    const [_, copy] = useCopyToClipboard();
    const { formatCurrency, formatNumber, formatRelativeFullDatetime } = useIntlFormatter();
    const t = useTranslations('transaction');
    const isDesktop = useIsDesktop();

    const handleCopy = async (): Promise<void> => {
        await copy(order_id);
        Toast.success(t('copySuccess'), { id: 'transaction-copy-success' });
    };

    if (!isDesktop) {
        return (
            <div className="rounded-md bg-surface-1 px-4 py-1">
                <div className="flex items-start justify-between gap-3 border-b border-filltext-ft-b py-2">
                    <div className="min-w-0">
                        <div className="truncate text-auxiliary-md text-filltext-ft-h">{order_type_name}</div>
                    </div>
                    {/* TODO: 设计图内存在状态栏，但当前接口未返回状态文案，先注释掉  */}
                    {/* <span
                        className={cn(
                            'shrink-0 text-title-sm',
                            status_text === 'Completed'
                                ? 'text-func-win'
                                : status_text === 'Fail'
                                  ? 'text-func-lost'
                                  : 'text-filltext-ft-h',
                        )}
                    >
                        {status_text ?? ''}
                    </span> */}
                </div>

                <div className="flex flex-col gap-1 py-2">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-auxiliary-xs text-filltext-ft-g">
                            {t('transactionsCaptionCurrencyType')}
                        </span>
                        <span className="text-auxiliary-md text-filltext-ft-h">{currency_type_name}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-auxiliary-xs text-filltext-ft-g">{t('transactionsCaptionAmount')}</span>
                        <span className="text-auxiliary-md text-filltext-ft-h">
                            {formatNumber(Number(amount) || 0)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-auxiliary-xs text-filltext-ft-g">
                            {t('transactionsCaptionTotalBalance')}
                        </span>
                        <span className="text-auxiliary-md text-filltext-ft-h">
                            {formatCurrency(Number(after_balance) || 0)}
                        </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                        <span className="shrink-0 text-auxiliary-xs text-filltext-ft-g">
                            {t('transactionsCaptionNotice')}
                        </span>
                        <span className="min-w-0 flex-1 break-words text-right text-auxiliary-md text-filltext-ft-h">
                            {remark || '-'}
                        </span>
                    </div>
                </div>

                <div className="flex items-start justify-between gap-3 border-t border-filltext-ft-b py-2">
                    <div className="min-w-0 flex-1 text-auxiliary-sm text-filltext-ft-e">
                        <span className="break-all">{`OrderNo : ${order_id}`}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            void handleCopy().catch(() => {
                                Toast.error(t('copyFailed'), { id: 'transaction-copy-failed' });
                            });
                        }}
                        className="flex w-7 h-7 shrink-0 items-center justify-center text-filltext-ft-e"
                    >
                        <CopyOutlined className="size-9" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-filltext-ft-b rounded-xs flex w-full flex-col items-start self-stretch gap-2 overflow-clip px-4 py-2">
            {/* Row 1: Datetime (left) + OrderNo + Copy (right) */}
            <div className="flex h-5 w-full items-center justify-between gap-2">
                <div className="shrink-0 text-body-sm text-filltext-ft-f">
                    {formatRelativeFullDatetime(new Date(created_at))}
                </div>
                <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
                    <ConditionalTooltip content={order_id}>
                        <span className="text-body-sm text-filltext-ft-f truncate max-w-[400px]">
                            OrderNo : {order_id}
                        </span>
                    </ConditionalTooltip>
                    <button
                        type="button"
                        onClick={() => {
                            void handleCopy().catch(() => {
                                Toast.error(t('copyFailed'), { id: 'transaction-copy-failed' });
                            });
                        }}
                        className="flex items-center cursor-pointer justify-center shrink-0 size-6 text-filltext-ft-e hover:text-filltext-ft-g transition-colors"
                    >
                        <Copy className="size-4" />
                    </button>
                </div>
            </div>

            {/* Row 2: Data columns (aligned with header) */}
            <div className="flex gap-2 items-center h-9">
                <div className="w-[200px] shrink-0">
                    <ConditionalTooltip content={order_type_name}>
                        <span className="text-body-md text-filltext-ft-g truncate block capitalize">
                            {order_type_name}
                        </span>
                    </ConditionalTooltip>
                </div>
                <div className="w-[150px] shrink-0">
                    <span className="text-body-md text-filltext-ft-g truncate block capitalize">
                        {currency_type_name}
                    </span>
                </div>
                <div className="w-[140px] shrink-0">
                    <ConditionalTooltip content={formatNumber(Number(amount) || 0)}>
                        <span className="text-body-md text-filltext-ft-g truncate block">
                            {formatNumber(Number(amount) || 0)}
                        </span>
                    </ConditionalTooltip>
                </div>
                <div className="w-[140px] shrink-0">
                    <ConditionalTooltip content={formatCurrency(Number(after_balance) || 0)}>
                        <span className="text-body-md text-filltext-ft-g truncate block">
                            {formatCurrency(Number(after_balance) || 0)}
                        </span>
                    </ConditionalTooltip>
                </div>
                <div className="min-w-[140px] flex-1">
                    <ConditionalTooltip content={remark || '-'}>
                        <span className="text-body-md text-filltext-ft-g truncate block capitalize">
                            {remark || '-'}
                        </span>
                    </ConditionalTooltip>
                </div>
            </div>
        </div>
    );
};
