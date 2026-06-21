/**
 * Timezone conversion utility functions
 *
 * Supports local time <-> UTC seconds conversion for cross-timezone scheduling.
 */

import { INVARIANT_LOCALE } from '@/constants';

/**
 * Get UTC offset in minutes for a given timezone
 * @param timezone IANA timezone identifier (e.g. "Asia/Shanghai")
 * @returns Offset in minutes (e.g. Shanghai = +480)
 */
export function getTimezoneOffsetMinutes(timezone: string): number {
    const now = new Date();

    // Get UTC time
    const utcDate = new Date(now.toLocaleString(INVARIANT_LOCALE, { timeZone: 'UTC' }));
    // Get target timezone time
    const tzDate = new Date(now.toLocaleString(INVARIANT_LOCALE, { timeZone: timezone }));

    // Calculate difference (minutes)
    return Math.round((tzDate.getTime() - utcDate.getTime()) / 60000);
}

/**
 * Get short timezone offset, e.g. "GMT+8"
 */
function getTimezoneOffset(timezone: string): string {
    const parts = new Intl.DateTimeFormat(INVARIANT_LOCALE, {
        timeZone: timezone,
        timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
}

/**
 * Get long timezone name, e.g. "China Standard Time"
 */
function getTimezoneLongName(timezone: string): string {
    const parts = new Intl.DateTimeFormat(INVARIANT_LOCALE, {
        timeZone: timezone,
        timeZoneName: 'long',
    }).formatToParts(new Date());
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
}

/**
 * Format timezone as a full display string
 *
 * Whether input is "Asia/Shanghai" or "Etc/GMT-8",
 * always displays as "(GMT+8) China Standard Time" format
 *
 * @param timezone IANA timezone identifier
 * @returns Formatted string, e.g. "(GMT+8) China Standard Time"
 */
export function formatTimezoneDisplay(timezone: string): string {
    try {
        const offset = getTimezoneOffset(timezone);
        const longName = getTimezoneLongName(timezone);
        if (offset && longName) {
            return `(${offset}) ${longName}`;
        }
        return offset || timezone;
    } catch {
        return timezone;
    }
}

/**
 * Get browser-detected timezone
 *
 * If a non-geographic timezone like Etc/GMT-X is detected, attempts to find
 * a geographic timezone with the same offset from the full IANA list
 */
export function getBrowserTimezone(): string {
    const raw = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!raw.startsWith('Etc/')) return raw;

    // Etc/GMT-X is a valid but unfriendly IANA timezone — try to find a geographic timezone with the same offset
    try {
        const targetOffset = getTimezoneOffsetMinutes(raw);
        const allZones = Intl.supportedValuesOf('timeZone');
        const geographic = allZones.find((z) => !z.startsWith('Etc/') && getTimezoneOffsetMinutes(z) === targetOffset);
        return geographic ?? raw;
    } catch {
        return raw;
    }
}
