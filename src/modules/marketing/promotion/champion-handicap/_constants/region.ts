import type { StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import type { RegionCode } from '@/i18n';
import type { TranslationKey } from '@/i18nV2/types';
import { useRegionCode } from '@/stores/region-store';
import { ChampionHandicapHero, ChampionHandicapHeroBgBrazil } from '../../_images';

type ChampionHandicapTeamNameKey = Extract<
    TranslationKey<'promotion'>,
    'championHandicap.common.brazil' | 'championHandicap.common.mexico'
>;

/** 冠军盘地区配置。 */
export interface ChampionHandicapRegionConfig {
    /** 当前站点对应的球队翻译 key。 */
    teamNameKey: ChampionHandicapTeamNameKey;
    /** 头图资源。 */
    heroImage: StaticImageData;
    /** 业务时区偏移分钟。 */
    timeOffsetMinutes: number;
    /** 业务时区偏移字符串。 */
    timeOffsetValue: string;
    /** 页面展示的时区文案。 */
    timeLabel: string;
    /** 用户最高赔付金额。 */
    maximumPayout: string;
    /** 平台总赔付金额。 */
    platformTotalPayout: string;
    /** 参与门槛净亏损。 */
    minimumNetLoss: string;
    /** 币种。 */
    currency: 'BRL' | 'MXN';
}

/** 冠军盘翻译插值参数。 */
export type ChampionHandicapTranslationValues = Record<string, string> & {
    /** 当前站点对应国家队名称。 */
    teamName: string;
    /** 用户最高赔付金额。 */
    maximumPayout: string;
    /** 平台总赔付金额。 */
    platformTotalPayout: string;
    /** 参与门槛净亏损。 */
    minimumNetLoss: string;
    /** 币种。 */
    currency: 'BRL' | 'MXN';
};

const CHAMPION_HANDICAP_REGION_CONFIGS: Record<RegionCode, ChampionHandicapRegionConfig> = {
    BR: {
        teamNameKey: 'championHandicap.common.brazil',
        heroImage: ChampionHandicapHeroBgBrazil,
        timeOffsetMinutes: -3 * 60,
        timeOffsetValue: '-03:00',
        timeLabel: 'UTC-3',
        maximumPayout: '300.000',
        platformTotalPayout: '5.000.000',
        minimumNetLoss: '500',
        currency: 'BRL',
    },
    MX: {
        teamNameKey: 'championHandicap.common.mexico',
        heroImage: ChampionHandicapHero,
        timeOffsetMinutes: -6 * 60,
        timeOffsetValue: '-06:00',
        timeLabel: 'UTC-6',
        maximumPayout: '1,000,000',
        platformTotalPayout: '10,000,000',
        minimumNetLoss: '500',
        currency: 'MXN',
    },
};

/** 获取冠军盘的地区配置。 */
export const getChampionHandicapRegionConfig = (regionCode: RegionCode): ChampionHandicapRegionConfig => {
    return CHAMPION_HANDICAP_REGION_CONFIGS[regionCode] ?? CHAMPION_HANDICAP_REGION_CONFIGS.BR;
};

/** 获取冠军盘页面使用的地区文案参数。 */
export const useChampionHandicapTranslationValues = (): ChampionHandicapTranslationValues => {
    const regionCode = useRegionCode();
    const t = useTranslations('promotion');
    const regionConfig = getChampionHandicapRegionConfig(regionCode);

    return {
        teamName: t(regionConfig.teamNameKey),
        maximumPayout: regionConfig.maximumPayout,
        platformTotalPayout: regionConfig.platformTotalPayout,
        minimumNetLoss: regionConfig.minimumNetLoss,
        currency: regionConfig.currency,
    };
};
