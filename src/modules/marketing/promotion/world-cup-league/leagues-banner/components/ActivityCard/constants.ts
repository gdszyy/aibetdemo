import type { StaticImageData } from 'next/image';
import type { RegionCode } from '@/i18n';
import ChampionBR from './assets/champion-br.png';
import ChampionBRH5 from './assets/champion-br-h5.png';
import ChampionMX from './assets/champion-mx.png';
import ChampionMXH5 from './assets/champion-mx-h5.png';

/** 金色按钮背景与渐变边框。 */
export const GOLD_BUTTON_BG =
    'linear-gradient(180deg, #FFDB81 0%, #F6AF3E 100%) padding-box, linear-gradient(95.97deg, #FFF6D9 0.56%, #CE9E00 48.17%, #A57F00 95.79%) border-box';

/** 金色赔率文字渐变。 */
export const GOLD_ODDS_BG = 'linear-gradient(0deg, #FFC750 38.6%, #FFF6E0 79.51%)';

export const FIRST_CARD_IMGS: Record<RegionCode, StaticImageData> = {
    MX: ChampionMX,
    BR: ChampionBR,
};

export const FIRST_CARD_IMG_H5: Record<RegionCode, StaticImageData> = {
    MX: ChampionMXH5,
    BR: ChampionBRH5,
};

export interface ActivityCardType {
    tag: string;
    title: string;
    titleH5?: string;
    desc: string;
    imageUrl: StaticImageData;
    // imageH5Url?: StaticImageData;
    link: string;
}

export interface ActivityCardItemProps {
    item: ActivityCardType;
    className?: string;
}
