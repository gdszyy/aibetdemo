/** TimePicker Props — describes data and callbacks only, not bound to specific interaction */
export interface TimePickerProps {
    /** Time value HH:mm or HH:mm:ss */
    value?: string;
    /** Value change callback */
    onChange?: (value: string) => void;
    /** Whether disabled */
    disabled?: boolean;
    /** Custom class name */
    className?: string;
    /** Placeholder */
    placeholder?: string;
    /** Whether to show seconds (overrides context config) */
    showSeconds?: boolean;
}

/** TimePicker configuration */
export interface TimePickerConfig {
    /** Whether to use 24-hour format */
    use24Hour: boolean;
    /** Whether to show seconds */
    showSeconds?: boolean;
}

/** Generate hour options */
export const generateHourOptions = (use24Hour: boolean): string[] => {
    if (use24Hour) {
        return Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    }
    return Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
};

/** Generate minute options */
export const generateMinuteOptions = (): string[] => {
    return Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
};

/** Generate second options */
export const generateSecondOptions = (): string[] => {
    return Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
};

/** Parse time string */
export const parseTimeValue = (
    value: string | undefined,
    use24Hour: boolean,
): { hour: string; minute: string; second: string; period: 'AM' | 'PM' } => {
    if (!value) {
        return { hour: '', minute: '', second: '', period: 'AM' };
    }

    const parts = value.split(':');
    const hourStr = parts[0] || '00';
    const minuteStr = parts[1] || '00';
    const secondStr = parts[2] || '00';
    const hour = Number.parseInt(hourStr, 10);

    if (use24Hour) {
        return {
            hour: String(hour).padStart(2, '0'),
            minute: minuteStr.padStart(2, '0'),
            second: secondStr.padStart(2, '0'),
            period: 'AM',
        };
    }

    // 12-hour format conversion
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return {
        hour: String(hour12).padStart(2, '0'),
        minute: minuteStr.padStart(2, '0'),
        second: secondStr.padStart(2, '0'),
        period,
    };
};

/** Format time value */
export const formatTimeValue = (
    hour: string,
    minute: string,
    second: string,
    period: 'AM' | 'PM',
    use24Hour: boolean,
    showSeconds: boolean,
): string => {
    if (!hour || !minute) return '';

    let hour24: number;
    if (use24Hour) {
        hour24 = Number.parseInt(hour, 10);
    } else {
        // Convert 12-hour to 24-hour format
        hour24 = Number.parseInt(hour, 10);
        if (period === 'PM' && hour24 !== 12) {
            hour24 += 12;
        } else if (period === 'AM' && hour24 === 12) {
            hour24 = 0;
        }
    }

    const base = `${String(hour24).padStart(2, '0')}:${minute}`;
    return showSeconds ? `${base}:${second || '00'}` : base;
};
