/**
 * 获取数值字符串的小数位数，用于 VIP 金额展示保留接口原始精度。
 */
export const getVipAmountFractionDigits = (value: number | string): number => {
    const normalizedValue = String(value).trim();
    const decimalPart = normalizedValue.split('.')[1];

    return decimalPart?.length ?? 0;
};

/**
 * 按原始小数位数格式化 VIP 金额，避免全局金额格式化默认截断为 2 位。
 */
export const formatVipCurrencyAmount = (
    value: number | string,
    formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => string,
): string => {
    const amount = Number(value);

    return formatCurrency(amount, {
        maximumFractionDigits: getVipAmountFractionDigits(value),
    });
};
