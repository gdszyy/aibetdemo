'use client';
import { type FC, useState } from 'react';
import type { VipBenefitItem } from '@/api/models/vip';
import { ArrowRight } from '@/components/icons';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useCurrencyCode } from '@/hooks/use-wallet';
import { cn } from '@/utils/common';
import { formatVipCurrencyAmount } from '../../services/formatVipAmount';
import { useVipStaticConfGetter } from '../../services/useVipStaticConfGetter';

/**
 * 格式化权益数值，百分比保持接口原值，纯数字按当前钱包币种展示。
 */
const formatBenefitValue = (
    value: string,
    formatCurrency: (value: number) => string,
    formatNumber: (value: number) => string,
    currencyCode: string,
): string => {
    const normalizedValue = value.trim();

    if (!normalizedValue || normalizedValue.includes('%') || !/^-?\d+(\.\d+)?$/.test(normalizedValue)) return value;

    const amount = Number(normalizedValue);
    return formatVipCurrencyAmount(normalizedValue, formatCurrency) || `${formatNumber(amount)} ${currencyCode}`;
};

/**
 * 单个权益卡片组件，负责图标、标题和描述的展示与 hover 效果。
 */
export const BenefitCard: FC<{ item: VipBenefitItem }> = ({ item }) => {
    const { benefitTitleMap } = useVipStaticConfGetter();
    const { formatCurrency, formatNumber } = useIntlFormatter();
    const currencyCode = useCurrencyCode();
    const [isHovered, setIsHovered] = useState(false);
    const currentValue = formatBenefitValue(item.current, formatCurrency, formatNumber, currencyCode);
    const nextValue = formatBenefitValue(item.next, formatCurrency, formatNumber, currencyCode);

    return (
        <article
            className={cn(
                'h-full rounded-sm border border-filltext-ft-c bg-surface-1 p-4',
                ' hover:border-filltext-ft-f',
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 标题 */}
            <p className={cn('mb-2 text-body-md font-poppins text-filltext-ft-e', isHovered && 'text-filltext-ft-g')}>
                {benefitTitleMap[item.type]}
            </p>

            {/* 当前权益 - 下等级权益 */}
            <div className="flex items-center">
                <span className="font-poppins text-body-lg text-filltext-ft-h">{currentValue}</span>
                <ArrowRight className="size-3 mx-2" color={item.on ? 'var(--filltext-ft-g)' : 'var(--filltext-ft-e)'} />
                <span className={cn('font-poppins text-title-md ', item.on ? 'text-func-win' : 'text-filltext-ft-d')}>
                    {nextValue}
                </span>
            </div>
        </article>
    );
};
