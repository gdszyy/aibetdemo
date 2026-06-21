import dayjs, { type Dayjs } from 'dayjs';

export const DATE_FULL = 'YYYY-MM-DD';
export const DATETIME_FULL = 'YYYY-MM-DD HH:mm:ss';
export const DATE_MINUTE_FULL = 'YYYY-MM-DD HH:mm';
export const TIME_FULL = 'HH:mm:ss';
export const MINUTE_FULL = 'HH:mm';

/**
 * 格式化秒数
 */
export const formatSeconds = (seconds: number, formatStr: string = 'mm:ss') => {
    return dayjs.duration(seconds, 'seconds').format(formatStr);
};

/** 秒转分钟 */
export const secondsToMinutes = (originSeconds: number | null | undefined) => {
    const seconds = Number(originSeconds);
    if (Number.isNaN(seconds)) {
        return originSeconds;
    }
    return Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
};

/** 将多种时间格式，格式化为指定格式 */
export const formatLikeTime = (value: number | string | undefined | null, format: string = DATETIME_FULL) => {
    if (!value) {
        return '-';
    }
    let d: Dayjs | null = null;
    if (typeof value === 'number') {
        // 此处有bug，没办法判断是秒还是毫秒，只能认为 >= 12位，是毫秒
        if (value.toString().length >= 12) {
            d = dayjs(value);
        } else {
            d = dayjs(value * 1000);
        }
    } else {
        d = dayjs(value);
    }

    if (!d) {
        return '-';
    }

    return d.format(format);
};
