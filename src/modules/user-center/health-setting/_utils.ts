import type { LimitConfigItem, RestConfigItem } from '@/api/models/health-setting';
import type { TranslationFunction } from '@/i18nV2/types';

/**
 * Format pending hint text
 */
export const formatPendingText = (
    t: TranslationFunction<'user'>,
    pending: LimitConfigItem | RestConfigItem | null | undefined,
    type: 'limit' | 'rest',
    currencySymbol?: string,
): string | undefined => {
    if (!pending) return undefined;

    const date = new Date(pending.effective_at);
    const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

    if (type === 'limit') {
        const limitPending = pending as LimitConfigItem;
        return t('healthSetting.pendingLimit', {
            date: dateStr,
            currency: currencySymbol || '',
            amount: limitPending.limit,
        });
    }
    const restPending = pending as RestConfigItem;
    return t('healthSetting.pendingSchedule', {
        date: dateStr,
        start: restPending.start.substring(0, 5),
        end: restPending.end.substring(0, 5),
    });
};

/**
 * Format limit display value
 */
export const formatLimitValue = (
    t: TranslationFunction<'user'>,
    currencySymbol: string,
    effective?: LimitConfigItem | null,
): string => {
    if (!effective?.limit) {
        return t('healthSetting.noLimit');
    }
    return `${currencySymbol} ${effective.limit}`;
};

/**
 * Format gaming schedule display value
 */
export const formatScheduleValue = (t: TranslationFunction<'user'>, effective?: RestConfigItem | null): string => {
    if (!effective?.start || !effective?.end) {
        return t('healthSetting.noLimit');
    }
    // Truncate seconds, display as HH:mm - HH:mm
    return `${effective.start.substring(0, 5)} - ${effective.end.substring(0, 5)}`;
};
