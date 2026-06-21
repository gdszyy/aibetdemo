/**
 * Check if the input amount is within the allowed range
 * @param value Input amount
 * @param min Minimum amount
 * @param max Maximum amount
 * @returns Processed amount
 */
export const checkAmountLimit = (value: string, min: number, max: number): string => {
    // Skip limit check when empty, allowing users to clear and re-enter
    if (value !== '') {
        const num = Number(value);
        if (!Number.isNaN(num)) {
            // Clamp to min/max when out of range
            if (num < min) {
                value = min.toString();
            } else if (num > max) {
                value = max.toString();
            }
        }
    }

    return Number(value) === 0 ? `${value}` : value.replace(/^0+/, '').replace(/[^0-9]/g, '');
};

/**
 * 格式化账户号
 */
export const convertBankCardNumber = (bankCode: string, accountNo: string): string => {
    const num = accountNo ?? '';
    let masked = num;
    if (num.length > 6) {
        masked = `${num.slice(0, 2)}${'*'.repeat(num.length - 6)}${num.slice(-4)}`;
    } else if (num.length > 4) {
        masked = `${num.slice(0, 2)}${'*'.repeat(num.length - 4)}${num.slice(-2)}`;
    }
    return `${bankCode}-${masked}`;
};
