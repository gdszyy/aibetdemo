'use client';

import {
    type CalendarDate,
    endOfMonth,
    endOfWeek,
    getLocalTimeZone,
    isSameDay,
    startOfWeek,
    today,
} from '@internationalized/date';
import { useTimeZone, useTranslations } from 'next-intl';
import { Popover } from 'radix-ui';
import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Calendar as CalendarIcon } from '@/components/icons';
import { DomIdEnum } from '@/constants';
import { useRegionIntlLocale } from '@/i18nV2/store';
import { cn } from '@/utils/common';
import { getPortalContainer } from '@/utils/dom';
import { Button } from '../button/button';
import { type DateRangePickerValue, formatDateRange } from './types';

const getMonthStart = (date: CalendarDate) => date.set({ day: 1 });

const getNormalizedRange = (start: CalendarDate, end: CalendarDate) =>
    start.compare(end) <= 0 ? { start, end } : { start: end, end: start };

const getIsDateInRange = (date: CalendarDate, value: DateRangePickerValue) => {
    if (!value) return false;
    return date.compare(value.start) >= 0 && date.compare(value.end) <= 0;
};

/** 判断日期是否超出选择器允许范围。 */
const getIsDateOutOfBounds = (date: CalendarDate, minValue?: CalendarDate, maxValue?: CalendarDate): boolean => {
    return (!!minValue && date.compare(minValue) < 0) || (!!maxValue && date.compare(maxValue) > 0);
};

/** 判断月份是否与允许范围存在交集，用于限制月份/年份导航。 */
const getDoesMonthIntersectBounds = (
    month: CalendarDate,
    minValue?: CalendarDate,
    maxValue?: CalendarDate,
): boolean => {
    const monthStart = getMonthStart(month);
    const monthEnd = endOfMonth(monthStart);

    return (!minValue || monthEnd.compare(minValue) >= 0) && (!maxValue || monthStart.compare(maxValue) <= 0);
};

interface DateRangePickerProps {
    /** 当前选中的日期范围 */
    value: DateRangePickerValue;
    /** 日期范围变化时的回调 */
    onChange: (value: DateRangePickerValue) => void;
    /** 自定义触发器样式类名 */
    className?: string;
    /** 是否禁用选择器 */
    disabled?: boolean;
    /** 未选择时展示的占位文本 */
    placeholder?: string;
    /** 触发按钮的无障碍标签 */
    ariaLabel?: string;
    /** 最早可选择日期 */
    minValue?: CalendarDate;
    /** 最晚可选择日期 */
    maxValue?: CalendarDate;
    /** 弹层相对触发器的对齐方式 */
    align?: 'start' | 'center' | 'end';
    /** 弹层与触发器的间距（默认 4） */
    sideOffset?: number;
}

/**
 * 范围日期选择器
 */
export function DateRangePicker({
    value,
    onChange,
    className,
    disabled,
    placeholder,
    ariaLabel,
    minValue,
    maxValue,
    align = 'end',
    sideOffset = 4,
}: DateRangePickerProps) {
    const t = useTranslations('common');
    const locale = useRegionIntlLocale();
    const timeZone = useTimeZone() || getLocalTimeZone();
    const [open, setOpen] = useState(false);
    const [draftStart, setDraftStart] = useState<CalendarDate | null>(null);
    const [previewEnd, setPreviewEnd] = useState<CalendarDate | null>(null);
    const [draftValue, setDraftValue] = useState<DateRangePickerValue>(value);
    const [visibleMonth, setVisibleMonth] = useState(() => getMonthStart(value?.start ?? today(timeZone)));

    const displayText = value
        ? formatDateRange(value, locale, timeZone)
        : (placeholder ?? t('date.dateRangePlaceholder'));

    useEffect(() => {
        if (open || draftStart) return;
        setDraftValue(value);
        if (!value?.start) return;
        setVisibleMonth(getMonthStart(value.start));
    }, [draftStart, open, value]);

    const monthTitle = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, {
                timeZone,
                month: 'long',
            }).format(visibleMonth.toDate(timeZone)),
        [locale, timeZone, visibleMonth],
    );

    const yearTitle = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, {
                timeZone,
                year: 'numeric',
            }).format(visibleMonth.toDate(timeZone)),
        [locale, timeZone, visibleMonth],
    );

    const weekdayLabels = useMemo(() => {
        const weekStart = startOfWeek(today(timeZone), locale);
        const formatter = new Intl.DateTimeFormat(locale, { timeZone, weekday: 'short' });
        return Array.from({ length: 7 }, (_, index) =>
            formatter.format(weekStart.add({ days: index }).toDate(timeZone)),
        );
    }, [locale, timeZone]);

    const calendarDates = useMemo(() => {
        const gridStart = startOfWeek(visibleMonth, locale);
        const gridEnd = endOfWeek(endOfMonth(visibleMonth), locale);
        const totalDays = gridEnd.compare(gridStart) + 1;

        return Array.from({ length: totalDays }, (_, index) => gridStart.add({ days: index }));
    }, [locale, visibleMonth]);

    const handleOpenChange = (nextOpen: boolean) => {
        if (disabled) return;
        setOpen(nextOpen);
        setDraftStart(null);
        setPreviewEnd(null);
        setDraftValue(value);
    };

    const handleDateSelect = (date: CalendarDate) => {
        if (getIsDateOutOfBounds(date, minValue, maxValue)) {
            return;
        }

        if (!draftStart) {
            setDraftStart(date);
            setPreviewEnd(null);
            setDraftValue({ start: date, end: date });
            return;
        }

        setDraftValue(getNormalizedRange(draftStart, date));
        setDraftStart(null);
        setPreviewEnd(null);
    };

    const canGoPreviousMonth = getDoesMonthIntersectBounds(visibleMonth.subtract({ months: 1 }), minValue, maxValue);
    const canGoNextMonth = getDoesMonthIntersectBounds(visibleMonth.add({ months: 1 }), minValue, maxValue);
    const canGoPreviousYear = getDoesMonthIntersectBounds(visibleMonth.subtract({ years: 1 }), minValue, maxValue);
    const canGoNextYear = getDoesMonthIntersectBounds(visibleMonth.add({ years: 1 }), minValue, maxValue);

    const handlePreviousMonth = () => {
        if (!canGoPreviousMonth) return;
        setVisibleMonth((current) => getMonthStart(current.subtract({ months: 1 })));
    };

    const handleNextMonth = () => {
        if (!canGoNextMonth) return;
        setVisibleMonth((current) => getMonthStart(current.add({ months: 1 })));
    };

    const handlePreviousYear = () => {
        if (!canGoPreviousYear) return;
        setVisibleMonth((current) => getMonthStart(current.subtract({ years: 1 })));
    };

    const handleNextYear = () => {
        if (!canGoNextYear) return;
        setVisibleMonth((current) => getMonthStart(current.add({ years: 1 })));
    };

    const handleCancel = () => {
        setDraftStart(null);
        setPreviewEnd(null);
        setDraftValue(value);
        setOpen(false);
    };

    const handleConfirm = () => {
        onChange(draftValue);
        setDraftStart(null);
        setPreviewEnd(null);
        setOpen(false);
    };

    return (
        <Popover.Root open={open} onOpenChange={handleOpenChange}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    title={ariaLabel}
                    className={cn(
                        'group flex h-8 shrink-0 items-center justify-between gap-2 rounded-sm border border-transparent px-3 transition-colors md:h-10 md:w-[296px] md:px-4',
                        'bg-filltext-ft-a text-body-md text-filltext-ft-g',
                        'hover:bg-filltext-ft-b',
                        'data-[state=open]:border-filltext-ft-g data-[state=open]:bg-filltext-ft-b',
                        'focus-visible:border-filltext-ft-g focus-visible:bg-filltext-ft-b',
                        disabled && 'cursor-not-allowed opacity-60',
                        className,
                    )}
                >
                    <span className="flex min-w-0 items-center gap-2">
                        <CalendarIcon className="size-4 shrink-0 text-filltext-ft-e" />
                        <span className={cn('truncate tabular-nums', !value && 'text-filltext-ft-e')}>
                            {displayText}
                        </span>
                    </span>
                    <ArrowDown className="size-3 shrink-0 text-filltext-ft-e transition-transform group-data-[state=open]:rotate-180" />
                </button>
            </Popover.Trigger>

            <Popover.Portal container={getPortalContainer(DomIdEnum.ModalContainer)}>
                <Popover.Content
                    align={align}
                    sideOffset={sideOffset}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                    className={cn(
                        'z-50 rounded-md bg-surface-1 p-4 text-filltext-ft-g shadow-floating',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                    )}
                >
                    <div className="w-[382px] inline-flex flex-col items-center">
                        <header className="mb-3 flex items-center justify-between w-full">
                            {/* month */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handlePreviousMonth}
                                    disabled={!canGoPreviousMonth}
                                    className="flex size-3 cursor-pointer items-center justify-center rounded-full text-brand-primary-0 hover:bg-filltext-ft-a focus-visible:ring-1 focus-visible:ring-brand-primary-0 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ArrowLeft className="size-3" />
                                </button>
                                <div className="w-[80px] text-center text-body-lg text-filltext-ft-g capitalize">
                                    {monthTitle}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleNextMonth}
                                    disabled={!canGoNextMonth}
                                    className="flex size-3 cursor-pointer items-center justify-center rounded-full text-brand-primary-0 hover:bg-filltext-ft-a focus-visible:ring-1 focus-visible:ring-brand-primary-0 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ArrowRight className="size-3" />
                                </button>
                            </div>

                            {/* year */}
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={handlePreviousYear}
                                    disabled={!canGoPreviousYear}
                                    className="flex size-3 cursor-pointer items-center justify-center rounded-full text-brand-primary-0 hover:bg-filltext-ft-a focus-visible:ring-1 focus-visible:ring-brand-primary-0 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ArrowLeft className="size-4" />
                                </button>
                                <div className="w-[50px] text-center text-body-lg text-filltext-ft-g">{yearTitle}</div>
                                <button
                                    type="button"
                                    onClick={handleNextYear}
                                    disabled={!canGoNextYear}
                                    className="flex size-3 cursor-pointer items-center justify-center rounded-full text-brand-primary-0 hover:bg-filltext-ft-a focus-visible:ring-1 focus-visible:ring-brand-primary-0 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                                >
                                    <ArrowRight className="size-3" />
                                </button>
                            </div>
                        </header>

                        <div
                            className="mb-2 grid w-full grid-cols-7 gap-y-2 border-b border-filltext-ft-b pb-3"
                            onMouseLeave={() => setPreviewEnd(null)}
                        >
                            {weekdayLabels.map((label) => (
                                <div
                                    key={label}
                                    className="flex w-full items-center justify-center text-body-md text-filltext-ft-e uppercase border-b border-filltext-ft-c pb-2"
                                >
                                    {label}
                                </div>
                            ))}

                            {calendarDates.map((date) => {
                                const dateKey = date.toString();
                                const previewRange =
                                    draftStart && previewEnd ? getNormalizedRange(draftStart, previewEnd) : null;
                                const activeRange = previewRange ?? draftValue;
                                const isCurrentMonth =
                                    date.month === visibleMonth.month && date.year === visibleMonth.year;
                                const isSelected = getIsDateInRange(date, activeRange);
                                const isSelectionStart = activeRange ? isSameDay(date, activeRange.start) : false;
                                const isSelectionEnd = activeRange ? isSameDay(date, activeRange.end) : false;
                                const isDraftStart = draftStart ? isSameDay(date, draftStart) : false;
                                const isPreviewEnd = previewRange
                                    ? isSameDay(date, previewRange.end) && !isDraftStart
                                    : false;
                                const isRangeEndpoint = !previewRange && (isSelectionStart || isSelectionEnd);
                                const isToday = isSameDay(date, today(timeZone));
                                const isDateDisabled = getIsDateOutOfBounds(date, minValue, maxValue);
                                const shouldShowRangeTrack = isSelected && !(isSelectionStart && isSelectionEnd);
                                const rangeTrackClassName = cn(
                                    'absolute top-1/2 h-10 -translate-y-1/2 bg-filltext-ft-a',
                                    isSelectionStart && 'left-1/2 right-0',
                                    isSelectionEnd && 'left-0 right-1/2',
                                    !isSelectionStart && !isSelectionEnd && 'left-0 right-0',
                                );

                                return (
                                    <div
                                        key={dateKey}
                                        className="relative flex h-10 w-full items-center justify-center"
                                    >
                                        {shouldShowRangeTrack ? <div className={rangeTrackClassName} /> : null}

                                        <button
                                            type="button"
                                            disabled={isDateDisabled}
                                            onFocus={() => draftStart && !isDateDisabled && setPreviewEnd(date)}
                                            onMouseEnter={() => draftStart && !isDateDisabled && setPreviewEnd(date)}
                                            onClick={() => handleDateSelect(date)}
                                            className={cn(
                                                'relative z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border border-transparent text-center text-title-sm leading-none text-filltext-ft-g transition-colors',
                                                'hover:bg-brand-primary-1 focus-visible:ring-1 focus-visible:ring-brand-primary-0',
                                                (isRangeEndpoint || isDraftStart) &&
                                                    'bg-brand-primary-0 text-neutral-white-h hover:bg-brand-primary-0',
                                                isPreviewEnd &&
                                                    'border-brand-primary-0 bg-surface-1 text-brand-primary-0 hover:bg-surface-1',
                                                !isCurrentMonth && !isSelected && 'text-filltext-ft-e',
                                                isToday &&
                                                    !isSelected &&
                                                    'text-brand-primary-0 border border-brand-primary-0',
                                                isDateDisabled &&
                                                    'cursor-not-allowed opacity-30 hover:bg-transparent focus-visible:ring-0',
                                            )}
                                        >
                                            {date.day}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <footer className="flex w-full items-center justify-end gap-3 ">
                            <Button onClick={handleCancel} variant="secondary" className="w-[120px]">
                                {t('dialog.cancelBtnText')}
                            </Button>
                            <Button onClick={handleConfirm} className="w-[120px]">
                                {t('dialog.confirmBtnText')}
                            </Button>
                        </footer>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
