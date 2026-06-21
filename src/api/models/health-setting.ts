// ============ RG Config Types (new API structure) ============

/** Limit config item */
export interface LimitConfigItem {
    /** Limit amount (string) */
    limit: string;
    /** Effective time ISO 8601 */
    effective_at: string;
}

/** Rest time config item */
export interface RestConfigItem {
    /** Start time "HH:mm:ss" */
    start: string;
    /** End time "HH:mm:ss" */
    end: string;
    /** Minimum rest hours */
    min_hours: number;
    /** User timezone */
    timezone: string;
    /** Effective time ISO 8601 */
    effective_at: string;
}

/** Config block (effective + pending) */
export interface ConfigBlock<T> {
    /** Currently effective config */
    effective: T | null;
    /** Pending config */
    pending: T | null;
}

/** RG Config response */
export interface RGConfig {
    deposit: ConfigBlock<LimitConfigItem>;
    loss: ConfigBlock<LimitConfigItem>;
    rest: ConfigBlock<RestConfigItem>;
}

export type LimitConfig = ConfigBlock<LimitConfigItem>;
export type RestConfig = ConfigBlock<RestConfigItem>;

/** Minimum rest hours */
export const MIN_REST_HOURS = 6;

/**
 * Calculate the number of hours between two time points (supports crossing midnight)
 * @param startTime "HH:mm:ss" or "HH:mm"
 * @param endTime "HH:mm:ss" or "HH:mm"
 * @returns Number of hours
 *
 * @example
 * calcRestHours('22:00:00', '06:00:00') // → 8 (crosses midnight)
 * calcRestHours('00:00:00', '06:00:00') // → 6
 */
export function calcRestHours(startTime: string, endTime: string): number {
    const startParts = startTime.split(':').map(Number);
    const endParts = endTime.split(':').map(Number);

    const startH = startParts[0] || 0;
    const startM = startParts[1] || 0;
    const startS = startParts[2] || 0;

    const endH = endParts[0] || 0;
    const endM = endParts[1] || 0;
    const endS = endParts[2] || 0;

    const startSeconds = startH * 3600 + startM * 60 + startS;
    const endSeconds = endH * 3600 + endM * 60 + endS;

    // If end time is less than start time, it crosses midnight
    const diffSeconds = endSeconds >= startSeconds ? endSeconds - startSeconds : 24 * 3600 - startSeconds + endSeconds;

    return diffSeconds / 3600;
}
