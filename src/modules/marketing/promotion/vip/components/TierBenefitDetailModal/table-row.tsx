import type { FC } from 'react';
import type { VipLevelInfo } from '@/api/models/vip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useCurrencyCode } from '@/hooks/use-wallet';
import { cn } from '@/utils/common';
import { formatVipCurrencyAmount } from '../../services/formatVipAmount';

interface DetailRowProps {
    highlighted: boolean;
    level: VipLevelInfo;
}

/**
 * 格式化普通权益值，空值与 0 值统一展示为占位符。
 */
const formatBenefitValue = (value: string): string => {
    const normalizedValue = value?.trim();
    return normalizedValue && normalizedValue !== '0' && normalizedValue !== '0%' ? normalizedValue : '-';
};

/**
 * 格式化等级经验值，非法数字统一展示为占位符。
 */
const formatNumberValue = (value: number, formatNumber: (value: number) => string): string => {
    return Number.isFinite(value) ? formatNumber(value) : '-';
};

/**
 * 格式化金额权益值，纯数字按当前钱包币种展示，百分比等非金额值保持原样。
 */
const formatCurrencyBenefitValue = (
    value: string,
    formatCurrency: (value: number) => string,
    formatNumber: (value: number) => string,
    currencyCode: string,
): string => {
    const normalizedValue = formatBenefitValue(value);

    if (normalizedValue === '-' || normalizedValue.includes('%') || !/^-?\d+(\.\d+)?$/.test(normalizedValue)) {
        return normalizedValue;
    }

    const amount = Number(normalizedValue);
    return formatVipCurrencyAmount(normalizedValue, formatCurrency) || `${formatNumber(amount)} ${currencyCode}`;
};

export const DetailRow: FC<DetailRowProps> = ({ highlighted, level }) => {
    const { formatCurrency, formatNumber } = useIntlFormatter();
    const currencyCode = useCurrencyCode();

    const cells = [
        level.levelName || '',
        formatNumberValue(level.levelExp, formatNumber),
        formatNumberValue(level.maintenanceExp, formatNumber),
        formatBenefitValue(level.sportCashback),
        formatBenefitValue(level.casinoCashback),
        formatCurrencyBenefitValue(level.levelUpBonus, formatCurrency, formatNumber, currencyCode),
        formatCurrencyBenefitValue(level.weeklyBonus, formatCurrency, formatNumber, currencyCode),
    ];

    return (
        <div
            className={cn(
                'grid grid-cols-[140px_140px_140px_140px_140px_140px_140px] rounded-xs px-6 py-3',
                highlighted ? 'bg-brand-primary-1' : 'bg-filltext-ft-a',
            )}
        >
            {cells.map((cell, index) => (
                <div key={`${level.levelNo}-${index}`} className="text-body-md text-filltext-ft-g">
                    {cell}
                </div>
            ))}
        </div>
    );
};
