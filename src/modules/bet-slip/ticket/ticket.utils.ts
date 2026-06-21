type RelativeFullDatetimeFormatter = (value: Date) => string;

export const PAYOUT_DISPLAY_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    roundingMode: 'trunc',
};

export const PAYOUT_TOOLTIP_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    roundingMode: 'trunc',
};

/** 格式化注单时间，当前用于展示下注时间 created_at。 */
export const formatTicketTime = (
    timestamp: number | undefined,
    formatRelativeFullDatetime: RelativeFullDatetimeFormatter,
): string => {
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp) || !timestamp) {
        return '';
    }

    return formatRelativeFullDatetime(new Date(timestamp));
};
