'use client';

import { Time } from '@internationalized/date';
import { Popover, Select } from 'radix-ui';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { DateInput, DateSegment, TimeField } from 'react-aria-components';
import { ArrowDown, Clock } from '@/components/icons';
import { DomIdEnum } from '@/constants';
import { cn } from '@/utils/common';
import { getPortalContainer } from '@/utils/dom';
import { useTimePickerConfig } from './context';
import {
    formatTimeValue,
    generateHourOptions,
    generateMinuteOptions,
    generateSecondOptions,
    parseTimeValue,
    type TimePickerProps,
} from './types';

/** Time picker dropdown option */
const TimeSelect: FC<{
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    className?: string;
}> = ({ value, onChange, options, placeholder, className }) => {
    return (
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger
                className={cn(
                    'group flex h-8 w-14 items-center justify-center gap-1 rounded-sm',
                    'bg-filltext-ft-a border-[0.5px] border-filltext-ft-d text-body-medium text-filltext-ft-g',
                    'hover:border-filltext-ft-g',
                    'data-[state=open]:border-brand-red',
                    className,
                )}
            >
                <Select.Value placeholder={placeholder} />
                <Select.Icon asChild>
                    <ArrowDown className="size-3 text-filltext-ft-e transition-all group-data-[state=open]:rotate-180" />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal container={getPortalContainer(DomIdEnum.ModalContainer)}>
                <Select.Content
                    className={cn('overflow-hidden rounded-sm bg-surface-1 shadow-floating', 'z-50 max-h-60')}
                    position="popper"
                    sideOffset={4}
                >
                    <Select.ScrollUpButton className="flex h-6 items-center justify-center bg-filltext-ft-a">
                        <ArrowDown className="size-3 rotate-180 text-filltext-ft-e" />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="p-1">
                        {options.map((opt) => (
                            <Select.Item
                                key={opt}
                                value={opt}
                                className={cn(
                                    'flex h-8 w-12 cursor-pointer items-center justify-center rounded-sm text-body-medium text-filltext-ft-g',
                                    'data-highlighted:bg-filltext-ft-a',
                                    'data-[state=checked]:text-brand-red',
                                )}
                            >
                                <Select.ItemText>{opt}</Select.ItemText>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex h-6 items-center justify-center bg-filltext-ft-a">
                        <ArrowDown className="size-3 text-filltext-ft-e" />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};

/**
 * PC TimePicker
 *
 * Combined interaction:
 * - React Aria TimeField: keyboard segment input (Tab / arrow keys / direct number)
 * - Radix Popover + Select: mouse click hour / minute dropdown
 */
export const TimePicker: FC<TimePickerProps> = ({
    value,
    onChange,
    disabled,
    className,
    showSeconds: showSecondsProp,
}) => {
    const config = useTimePickerConfig();
    const { use24Hour } = config;
    const showSeconds = showSecondsProp ?? config.showSeconds ?? false;

    const [open, setOpen] = useState(false);
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState('');
    const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
    const triggerRef = useRef<HTMLDivElement>(null);

    // Sync external value → internal Select state
    useEffect(() => {
        const parsed = parseTimeValue(value, use24Hour);
        setHour(parsed.hour);
        setMinute(parsed.minute);
        setSecond(parsed.second);
        setPeriod(parsed.period);
    }, [value, use24Hour]);

    // Parse string value → Time object for TimeField
    const timeValue = parseStringToTime(value);

    // TimeField keyboard input → onChange
    const handleTimeFieldChange = (newTime: Time | null) => {
        if (!newTime || !onChange) return;
        const h = String(newTime.hour).padStart(2, '0');
        const m = String(newTime.minute).padStart(2, '0');
        if (showSeconds) {
            const s = String(newTime.second).padStart(2, '0');
            onChange(`${h}:${m}:${s}`);
        } else {
            onChange(`${h}:${m}`);
        }
    };

    // Select dropdown → onChange
    const handleSelectChange = useCallback(
        (newHour: string, newMinute: string, newSecond: string, newPeriod: 'AM' | 'PM') => {
            if (newHour && newMinute) {
                const formatted = formatTimeValue(newHour, newMinute, newSecond, newPeriod, use24Hour, showSeconds);
                onChange?.(formatted);
            }
        },
        [onChange, use24Hour, showSeconds],
    );

    const handleHourChange = (newHour: string) => {
        setHour(newHour);
        handleSelectChange(newHour, minute || '00', second || '00', period);
    };

    const handleMinuteChange = (newMinute: string) => {
        setMinute(newMinute);
        handleSelectChange(hour || '00', newMinute, second || '00', period);
    };

    const handleSecondChange = (newSecond: string) => {
        setSecond(newSecond);
        handleSelectChange(hour || '00', minute || '00', newSecond, period);
    };

    const handlePeriodChange = (newPeriod: string) => {
        const p = newPeriod as 'AM' | 'PM';
        setPeriod(p);
        handleSelectChange(hour || '12', minute || '00', second || '00', p);
    };

    const hourOptions = generateHourOptions(use24Hour);
    const minuteOptions = generateMinuteOptions();
    const secondOptions = generateSecondOptions();

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Anchor asChild>
                <TimeField
                    value={timeValue}
                    onChange={handleTimeFieldChange}
                    isDisabled={disabled}
                    hourCycle={use24Hour ? 24 : 12}
                    granularity={showSeconds ? 'second' : 'minute'}
                >
                    <div
                        ref={triggerRef}
                        className={cn(
                            'flex h-10 items-center gap-2 rounded-sm px-[10px] cursor-text',
                            'bg-filltext-ft-a border-[0.5px] border-filltext-ft-d',
                            'text-body-medium text-filltext-ft-g',
                            'hover:border-filltext-ft-g',
                            'focus-within:border-brand-red',
                            disabled && 'cursor-not-allowed opacity-60',
                            className,
                        )}
                        onClickCapture={() => !disabled && setOpen(true)}
                    >
                        <Clock className="size-4 shrink-0 text-filltext-ft-e" />
                        <DateInput className="flex flex-1 items-center tabular-nums">
                            {(segment) => (
                                <DateSegment
                                    segment={segment}
                                    className={cn(
                                        'rounded-xs px-0.5 text-center',
                                        'focus:bg-brand-red focus:text-on-brand',
                                        'data-[placeholder]:text-filltext-ft-e',
                                        segment.type === 'literal' && 'text-filltext-ft-e px-0',
                                    )}
                                />
                            )}
                        </DateInput>
                    </div>
                </TimeField>
            </Popover.Anchor>
            <Popover.Portal container={getPortalContainer(DomIdEnum.ModalContainer)}>
                <Popover.Content
                    className={cn(
                        'rounded-sm bg-surface-1 p-3 shadow-floating',
                        'z-50',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                    )}
                    sideOffset={4}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="flex items-center gap-2">
                        <TimeSelect value={hour} onChange={handleHourChange} options={hourOptions} placeholder="HH" />
                        <span className="text-body-sm text-neutral-black-h">:</span>
                        <TimeSelect
                            value={minute}
                            onChange={handleMinuteChange}
                            options={minuteOptions}
                            placeholder="MM"
                        />
                        {showSeconds && (
                            <>
                                <span className="text-body-sm text-neutral-black-h">:</span>
                                <TimeSelect
                                    value={second}
                                    onChange={handleSecondChange}
                                    options={secondOptions}
                                    placeholder="SS"
                                />
                            </>
                        )}
                        {!use24Hour && (
                            <TimeSelect
                                value={period}
                                onChange={handlePeriodChange}
                                options={['AM', 'PM']}
                                className="w-16"
                            />
                        )}
                    </div>
                    <Popover.Arrow className="fill-surface-1" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

/** Parse "HH:mm" or "HH:mm:ss" string → Time object */
function parseStringToTime(value?: string): Time | null {
    if (!value) return null;
    const parts = value.split(':').map(Number);
    if (parts.length >= 3) {
        return new Time(parts[0], parts[1], parts[2]);
    }
    if (parts.length === 2) {
        return new Time(parts[0], parts[1]);
    }
    return null;
}
