import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/es';
import 'dayjs/locale/pt-br';
import type { Locale, RegionCode } from '@/i18n';
import { getChampionHandicapRegionConfig } from '../_constants/region';

dayjs.extend(utc);

const CHAMPION_HANDICAP_START_TIME = '2026-06-08T00:00:00';
const CHAMPION_HANDICAP_END_TIME = '2026-07-09T23:59:59';
const CHAMPION_HANDICAP_REWARD_DEADLINE_TIME = '2026-07-31T23:59:59';

const DAYJS_LOCALE_BY_APP_LOCALE: Record<Locale, string> = {
    es: 'es',
    en: 'en',
    pt: 'pt-br',
};

/** 冠军盘活动业务时间窗口，startUtc/endUtc 始终返回 UTC-0 ISO 值。 */
export interface ChampionHandicapEventWindow {
    /** 活动开始时间，UTC-0 ISO 格式。 */
    startUtc: string;
    /** 活动结束时间，UTC-0 ISO 格式。 */
    endUtc: string;
}

/** 冠军盘列表页展示和排序需要的活动时间信息。 */
export interface ChampionHandicapPromotionListMeta extends ChampionHandicapEventWindow {
    /** 列表卡片展示的开始日期。 */
    startDate: string;
    /** 列表卡片展示的结束日期。 */
    endDate: string;
    /** 当前时间是否处于活动期。 */
    isActive: boolean;
    /** 列表卡片状态标签。 */
    status: 'active' | 'upcoming' | 'ended';
}

const resolveLocale = (locale: string): Locale => {
    if (locale === 'es' || locale === 'en' || locale === 'pt') return locale;
    return 'en';
};

const getDayjsLocale = (locale: string): string => DAYJS_LOCALE_BY_APP_LOCALE[resolveLocale(locale)];

/** 将冠军盘业务时区时间转换为 UTC-0 ISO 字符串。 */
const toChampionHandicapUtcIso = (time: string, regionCode: RegionCode): string => {
    const { timeOffsetValue } = getChampionHandicapRegionConfig(regionCode);

    return dayjs(`${time}${timeOffsetValue}`).utc().toISOString();
};

/** 获取冠军盘活动开始和结束时间的 UTC-0 值。 */
export const getChampionHandicapEventWindow = (regionCode: RegionCode = 'BR'): ChampionHandicapEventWindow => {
    return {
        startUtc: toChampionHandicapUtcIso(CHAMPION_HANDICAP_START_TIME, regionCode),
        endUtc: toChampionHandicapUtcIso(CHAMPION_HANDICAP_END_TIME, regionCode),
    };
};

/** 获取冠军盘奖励发放截止时间的 UTC-0 值。 */
export const getChampionHandicapRewardDeadlineUtc = (regionCode: RegionCode = 'BR'): string => {
    return toChampionHandicapUtcIso(CHAMPION_HANDICAP_REWARD_DEADLINE_TIME, regionCode);
};

/** 判断当前时间是否位于冠军盘活动期内。 */
export const isChampionHandicapEventActive = (regionCode: RegionCode = 'BR'): boolean => {
    const { startUtc, endUtc } = getChampionHandicapEventWindow(regionCode);
    const now = dayjs();
    const startTime = dayjs(startUtc);
    const endTime = dayjs(endUtc);

    return !now.isBefore(startTime) && !now.isAfter(endTime);
};

const getHeroDateFormat = (locale: string): string => {
    const normalized = resolveLocale(locale);
    if (normalized === 'en') return 'MMM D, YYYY HH:mm';
    return 'D [de] MMMM [de] YYYY HH:mm';
};

const getCardDateFormat = (locale: string): string => {
    const normalized = resolveLocale(locale);
    if (normalized === 'en') return 'MM/DD/YYYY';
    return 'DD/MM/YYYY';
};

const getChampionHandicapStatus = (startUtc: string, endUtc: string): ChampionHandicapPromotionListMeta['status'] => {
    const now = dayjs();
    const startTime = dayjs(startUtc);
    const endTime = dayjs(endUtc);

    if (now.isBefore(startTime)) return 'upcoming';
    if (now.isAfter(endTime)) return 'ended';
    return 'active';
};

/** 获取冠军盘列表页所需的开始/结束时间与活动状态。 */
export const getChampionHandicapPromotionListMeta = (
    locale: string,
    regionCode: RegionCode = 'BR',
): ChampionHandicapPromotionListMeta => {
    const { startUtc, endUtc } = getChampionHandicapEventWindow(regionCode);
    const pattern = getCardDateFormat(locale);
    const status = getChampionHandicapStatus(startUtc, endUtc);
    const { timeOffsetMinutes } = getChampionHandicapRegionConfig(regionCode);

    return {
        startUtc,
        endUtc,
        startDate: dayjs.utc(startUtc).utcOffset(timeOffsetMinutes).locale(getDayjsLocale(locale)).format(pattern),
        endDate: dayjs.utc(endUtc).utcOffset(timeOffsetMinutes).locale(getDayjsLocale(locale)).format(pattern),
        isActive: status === 'active',
        status,
    };
};

/** 格式化冠军盘活动期展示文案。 */
export const formatChampionHandicapHeroValidity = (
    locale: string,
    label: string,
    regionCode: RegionCode = 'BR',
): string => {
    const { startUtc, endUtc } = getChampionHandicapEventWindow(regionCode);
    const pattern = getHeroDateFormat(locale);
    const { timeLabel, timeOffsetMinutes } = getChampionHandicapRegionConfig(regionCode);
    const startText = dayjs.utc(startUtc).utcOffset(timeOffsetMinutes).locale(getDayjsLocale(locale)).format(pattern);
    const endText = dayjs.utc(endUtc).utcOffset(timeOffsetMinutes).locale(getDayjsLocale(locale)).format(pattern);

    return `${label}: ${startText} - ${endText} (${timeLabel})`;
};

const getRewardDeadlineDateFormat = (locale: string): string => {
    const normalized = resolveLocale(locale);
    if (normalized === 'en') return 'MMMM D, YYYY, HH:mm';
    return 'D [de] MMMM [de] YYYY, HH:mm';
};

/** 格式化冠军盘奖励发放截止时间展示文案。 */
export const formatChampionHandicapRewardDeadline = (locale: string, regionCode: RegionCode = 'BR'): string => {
    const deadlineUtc = getChampionHandicapRewardDeadlineUtc(regionCode);
    const pattern = getRewardDeadlineDateFormat(locale);
    const { timeLabel, timeOffsetMinutes } = getChampionHandicapRegionConfig(regionCode);
    const deadlineText = dayjs
        .utc(deadlineUtc)
        .utcOffset(timeOffsetMinutes)
        .locale(getDayjsLocale(locale))
        .format(pattern);

    return `${deadlineText} (${timeLabel})`;
};
