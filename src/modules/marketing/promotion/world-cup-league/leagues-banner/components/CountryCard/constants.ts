import type { StaticImageData } from 'next/image';
import type { RegionCode } from '@/i18n';
import flagBrazil from './assets/flag_brasil.png';
import flagMexico from './assets/flag_mexico.png';
import roleBrazil from './assets/role_brasil.png';
import roleMexico from './assets/role_mexico.png';

/** 推荐投注选项展示数量。 */
export const BETTING_OPTION_COUNT = 5;

/** 金色按钮背景与渐变边框。 */
export const GOLD_BUTTON_BACKGROUND =
    'linear-gradient(180deg, #FFDB81 0%, #F6AF3E 100%) padding-box, linear-gradient(95.97deg, #FFF6D9 0.56%, #CE9E00 48.17%, #A57F00 95.79%) border-box';

/** 金色赔率文字渐变。 */
export const GOLD_ODDS_GRADIENT = 'linear-gradient(0deg, #FFC750 38.6%, #FFF6E0 79.51%)';

/** 冠军市场标题文字渐变。 */
export const CHAMPION_TITLE_GRADIENT = 'linear-gradient(0deg, #FFC750 19.67%, #FFF6E0 79.51%)';

/** 国家冠军盘地区配置。 */
export interface CountryCardRegionConfig {
    /** 国家名称翻译 key。 */
    countryNameKey: 'brazil' | 'mexico';
    /** 用于匹配冠军盘投注项的接口国家名。 */
    outcomeName: 'Brazil' | 'Mexico';
    /** 国家徽章资源。 */
    flagImage: StaticImageData;
    /** 国家球员资源。 */
    roleImage: StaticImageData;
}

const COUNTRY_CARD_REGION_CONFIGS: Record<RegionCode, CountryCardRegionConfig> = {
    BR: {
        countryNameKey: 'brazil',
        outcomeName: 'Brazil',
        flagImage: flagBrazil,
        roleImage: roleBrazil,
    },
    MX: {
        countryNameKey: 'mexico',
        outcomeName: 'Mexico',
        flagImage: flagMexico,
        roleImage: roleMexico,
    },
};

/** 根据当前地区获取国家冠军盘展示配置。 */
export const getCountryCardRegionConfig = (regionCode: RegionCode): CountryCardRegionConfig => {
    return COUNTRY_CARD_REGION_CONFIGS[regionCode];
};
