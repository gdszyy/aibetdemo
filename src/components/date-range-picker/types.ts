import { type CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

/**
 * 日期范围值
 */
export interface DateRangeValue {
    start: CalendarDate;
    end: CalendarDate;
}

/**
 * 日期范围选择器值
 */
export type DateRangePickerValue = DateRangeValue | null;

/**
 * 日期范围时间戳参数
 */
export interface DateRangeTimestampParams {
    start_time?: string;
    end_time?: string;
}

/**
 * 获取默认的日期范围
 * @param timeZone - 时区
 * @returns 默认的日期范围
 */
export function getDefaultDateRange(timeZone = getLocalTimeZone()): DateRangeValue {
    const currentDate = today(timeZone);
    return {
        start: currentDate,
        end: currentDate,
    };
}

/**
 * 格式化日期为字符串
 * @param date - 日期
 * @param locale - 语言
 * @param timeZone - 时区
 * @returns 格式化后的日期字符串
 */
export function formatCalendarDate(date: CalendarDate, locale: string, timeZone: string): string {
    return new Intl.DateTimeFormat(locale, {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date.toDate(timeZone));
}

/**
 * 格式化日期范围
 * @param value - 日期范围值
 * @param locale - 语言
 * @param timeZone - 时区
 * @param separator - 分隔符
 * @returns 格式化后的日期范围字符串
 */
export function formatDateRange(
    value: DateRangePickerValue,
    locale: string,
    timeZone: string,
    separator = ' ~ ',
): string {
    if (!value) return '';
    return `${formatCalendarDate(value.start, locale, timeZone)}${separator}${formatCalendarDate(value.end, locale, timeZone)}`;
}

/**
 * 获取日期范围键
 * @param value - 日期范围值
 * @returns 日期范围键
 */
export function getDateRangeKey(value: DateRangePickerValue): string {
    if (!value) return 'all-time';
    return `${value.start.toString()}_${value.end.toString()}`;
}

/**
 * 获取日期范围时间戳参数
 * @param param - 参数
 * @param value - 日期范围值
 * @param timeZone - 时区
 * @returns 日期范围时间戳参数
 */
export function getDateRangeTimestampParams<T extends DateRangeTimestampParams>(
    param: T,
    value: DateRangePickerValue,
    timeZone = getLocalTimeZone(),
): T {
    if (!value) return param;

    const startDate = value.start.toDate(timeZone);
    startDate.setHours(0, 0, 0, 0);

    const endDate = value.end.toDate(timeZone);
    endDate.setHours(23, 59, 59, 999);

    return {
        ...param,
        start_time: String(startDate.getTime()),
        end_time: String(endDate.getTime()),
    };
}
