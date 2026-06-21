import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/es';
import 'dayjs/locale/pt-br';
import type { RechargeCode } from '@/api/models/recharge-code';
import type { Locale } from '@/i18n';
import type { PromotionStatus } from '../_constants/promotion-cards';

dayjs.extend(utc);

const FIXED_PROMOTION_UTC_OFFSET_MINUTES = -6 * 60;

const DAYJS_LOCALE_BY_APP_LOCALE: Record<Locale, string> = {
    es: 'es',
    en: 'en',
    pt: 'pt-br',
};

type CampaignWindow = Pick<RechargeCode, 'start_time' | 'end_time'> | null | undefined;

/** Pick the first campaign that is currently within its time window. */
export const getFirstActiveCampaign = (campaigns: RechargeCode[] | null | undefined): RechargeCode | undefined => {
    if (!campaigns?.length) return undefined;
    const now = dayjs();
    return campaigns.find((c) => {
        const start = dayjs(c.start_time);
        const end = dayjs(c.end_time);
        return c.status === 1 && start.isValid() && end.isValid() && !now.isBefore(start) && !now.isAfter(end);
    });
};

const resolveLocale = (locale: string): Locale => {
    if (locale === 'es' || locale === 'en' || locale === 'pt') return locale;
    return 'es';
};

const getDayjsLocale = (locale: string): string => DAYJS_LOCALE_BY_APP_LOCALE[resolveLocale(locale)];

const parseCampaignTime = (isoTime: string, locale: string): Dayjs => {
    return dayjs.utc(isoTime).utcOffset(FIXED_PROMOTION_UTC_OFFSET_MINUTES).locale(getDayjsLocale(locale));
};

const getCampaignBounds = (campaign: CampaignWindow, locale: string): { start: Dayjs; end: Dayjs } | null => {
    if (!campaign?.start_time || !campaign?.end_time) return null;

    const start = parseCampaignTime(campaign.start_time, locale);
    const end = parseCampaignTime(campaign.end_time, locale);
    if (!start.isValid() || !end.isValid()) return null;

    return { start, end };
};

const getCardDateFormat = (locale: string): string => {
    const normalized = resolveLocale(locale);
    if (normalized === 'en') return 'MM/DD/YYYY';
    return 'DD/MM/YYYY';
};

export const getCampaignStatus = (campaign: CampaignWindow): PromotionStatus | null => {
    if (!campaign?.start_time || !campaign?.end_time) return null;

    const start = dayjs(campaign.start_time);
    const end = dayjs(campaign.end_time);
    if (!start.isValid() || !end.isValid()) return null;

    const now = dayjs();
    if (now.isBefore(start)) return 'upcoming';
    if (now.isAfter(end)) return 'ended';
    return 'active';
};

export const formatCampaignCardRange = (
    campaign: CampaignWindow,
    locale: string,
): { startDate: string; endDate: string } | null => {
    const bounds = getCampaignBounds(campaign, locale);
    if (!bounds) return null;

    const pattern = getCardDateFormat(locale);
    return {
        startDate: bounds.start.format(pattern),
        endDate: bounds.end.format(pattern),
    };
};
