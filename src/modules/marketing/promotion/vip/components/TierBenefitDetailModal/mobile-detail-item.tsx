import type { FC } from 'react';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useCurrencyCode } from '@/hooks/use-wallet';
import { cn } from '@/utils/common';
import { formatVipCurrencyAmount } from '../../services/formatVipAmount';

interface MobileDetailItemProps {
    divider?: boolean;
    label: string;
    type?: 'currency' | 'number';
    value: number | string | null | undefined;
}

const DETAIL_COMPACT_THRESHOLD = 9999;
const DETAIL_COMPACT_UNIT = 1000;

/**
 * 格式化移动端详情数字，较大数值使用 k 缩写避免撑开卡片。
 */
const formatDetailNumber = (
    value: number,
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string,
): string => {
    if (value <= DETAIL_COMPACT_THRESHOLD) {
        return formatNumber(value);
    }

    return `${formatNumber(value / DETAIL_COMPACT_UNIT, { maximumFractionDigits: 1 })}k`;
};

/**
 * 格式化移动端金额权益，纯数字按当前钱包币种展示，非金额值保持原样。
 */
const formatCurrencyValue = (
    value: number | string | null | undefined,
    formatCurrency: (value: number) => string,
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string,
    currencyCode: string,
): string => {
    const normalizedValue = String(value ?? '').trim();

    if (
        !normalizedValue ||
        normalizedValue === '-' ||
        normalizedValue.includes('%') ||
        !/^-?\d+(\.\d+)?$/.test(normalizedValue)
    ) {
        return normalizedValue || '-';
    }

    const amount = Number(normalizedValue);
    return formatVipCurrencyAmount(normalizedValue, formatCurrency) || `${formatNumber(amount)} ${currencyCode}`;
};

export const MobileDetailItem: FC<MobileDetailItemProps> = ({ divider = false, label, type, value }) => {
    const { formatCurrency, formatNumber } = useIntlFormatter();
    const currencyCode = useCurrencyCode();
    const numericValue = Number(value);
    const formattedValue =
        type === 'number'
            ? Number.isFinite(numericValue)
                ? formatDetailNumber(numericValue, formatNumber)
                : '-'
            : type === 'currency'
              ? formatCurrencyValue(value, formatCurrency, formatNumber, currencyCode)
              : (value ?? '-');

    return (
        <div
            className={cn(
                'flex items-center justify-between gap-3 py-1 text-auxiliary-sm',
                divider && 'border-filltext-ft-c border-b-[0.5px] pb-2',
            )}
        >
            <span className="min-w-0 text-filltext-ft-h">{label}</span>
            <span className="shrink-0 text-filltext-ft-f">{formattedValue}</span>
        </div>
    );
};
