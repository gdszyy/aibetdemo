'use client';

import { useTranslations } from 'next-intl';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { calcRestHours, MIN_REST_HOURS, type RestConfigItem } from '@/api/models/health-setting';
import { Button } from '@/components/button/button';
import { CloseBold } from '@/components/icons';
import { TimePicker } from '@/components/time-picker/time-picker';
import { useTimezoneStore } from '@/stores/timezone-store';
import { formatTimezoneDisplay } from '@/utils/timezone';

interface GamingScheduleEditorProps {
    /** Currently effective value */
    currentValue?: RestConfigItem | null;
    /** Close callback */
    onClose: () => void;
    /** Confirm callback (triggers password modal) */
    onConfirm: (params: { start: string; end: string }) => void;
}

/**
 * Gaming schedule editor component
 *
 * Time submitted as "HH:mm:ss" string; backend relies on X-Timezone header for timezone handling.
 * Inline expanded form, not a modal.
 */
export const GamingScheduleEditor: FC<GamingScheduleEditorProps> = ({ currentValue, onClose, onConfirm }) => {
    const t = useTranslations('user');
    const globalTimezone = useTimezoneStore((s) => s.timezone);

    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('06:00');
    const [error, setError] = useState('');

    // Sync with current value
    useEffect(() => {
        if (currentValue) {
            // Backend may return "HH:mm:ss", convert to "HH:mm"
            setStartTime(currentValue.start.substring(0, 5));
            setEndTime(currentValue.end.substring(0, 5));
        } else {
            setStartTime('00:00');
            setEndTime('06:00');
        }
        setError('');
    }, [currentValue]);

    // Calculate current rest duration in real-time
    const restHours = useMemo(() => calcRestHours(startTime, endTime), [startTime, endTime]);

    // Re-validate when timezone or time changes
    const validateTimes = useCallback((): boolean => {
        if (restHours < MIN_REST_HOURS) {
            setError(t('healthSetting.gamingScheduleModal.minRestError'));
            return false;
        }
        setError('');
        return true;
    }, [restHours, t]);

    // Clear error in real-time when duration meets requirement
    useEffect(() => {
        if (restHours >= MIN_REST_HOURS) {
            setError('');
        } else {
            setError(t('healthSetting.gamingScheduleModal.minRestError'));
        }
    }, [restHours, t]);

    const handleConfirm = () => {
        if (!validateTimes()) {
            return;
        }

        onConfirm({
            // Append seconds on submit for backend compatibility
            start: `${startTime}:00`,
            end: `${endTime}:00`,
        });
    };

    return (
        <div className="p-4 bg-filltext-ft-a rounded-sm mt-3">
            {/* Title row - centered layout */}
            <div className="flex items-center justify-center relative mb-4">
                <h4 className="text-body-lg text-filltext-ft-g text-center">
                    {t('healthSetting.gamingScheduleModal.title')}
                </h4>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-0 p-1 hover:opacity-70 transition-opacity cursor-pointer"
                >
                    <CloseBold className="size-[14px] text-filltext-ft-e" />
                </button>
            </div>

            {/* Timezone display (read-only) */}
            <div className="mb-3 text-auxiliary-sm text-filltext-ft-e text-center">
                {t('healthSetting.gamingScheduleModal.timezone')}: {formatTimezoneDisplay(globalTimezone)}
            </div>

            {/* Time pickers - minute precision */}
            <div className="flex items-center justify-center gap-4">
                <TimePicker
                    value={startTime}
                    onChange={(val) => {
                        setStartTime(val);
                    }}
                    showSeconds={false}
                    className="flex-1"
                />
                <span className="text-auxiliary-semibold text-filltext-ft-g">
                    {t('healthSetting.gamingScheduleModal.to')}
                </span>
                <TimePicker
                    value={endTime}
                    onChange={(val) => {
                        setEndTime(val);
                    }}
                    showSeconds={false}
                    className="flex-1"
                />
            </div>

            {/* Error message */}
            {error && <p className="text-auxiliary-sm text-brand-red mt-2 text-center">{error}</p>}

            {/* Confirm button */}
            <Button block className="mt-4 rounded-full" onClick={handleConfirm} disabled={restHours < MIN_REST_HOURS}>
                {t('healthSetting.confirm')}
            </Button>
        </div>
    );
};
