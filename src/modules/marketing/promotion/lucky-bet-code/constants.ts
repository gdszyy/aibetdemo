import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { RegionCode } from '@/i18n';
import { regionConfigs } from '@/i18nV2';

dayjs.extend(utc);
dayjs.extend(timezone);

/** 幸运投注码活动时间范围。 */
export interface LuckyBetCodeTimeRange {
    /** 活动开始时间戳。 */
    startTimestamp: number;
    /** 活动结束时间戳。 */
    endTimestamp: number;
}

/** 幸运投注码活动当地时间配置。 */
const LUCKY_BET_CODE_TIME_CONFIG_BY_REGION: Record<RegionCode, { startTime: string; endTime: string }> = {
    BR: {
        startTime: '2026-06-05T00:00:00',
        endTime: '2026-07-05T23:59:00',
    },
    MX: {
        startTime: '2026-06-05T00:00:00',
        endTime: '2026-07-05T23:59:00',
    },
};

/** 获取当前地区的幸运投注码活动时间戳范围。 */
export const getLuckyBetCodeTimeRange = (regionCode: RegionCode): LuckyBetCodeTimeRange => {
    const timeConfig = LUCKY_BET_CODE_TIME_CONFIG_BY_REGION[regionCode];
    const timezone = regionConfigs[regionCode].timezone;

    return {
        startTimestamp: dayjs.tz(timeConfig.startTime, timezone).valueOf(),
        endTimestamp: dayjs.tz(timeConfig.endTime, timezone).valueOf(),
    };
};
