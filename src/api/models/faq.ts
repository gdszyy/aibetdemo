export enum FaqDisplayPlaceEnum {
    All = 1,
    Site = 2,
    Login = 3,
    Vip = 4,
    Cs = 5,
    Agent = 6,
    Deposit = 7,
    Withdraw = 8,
}

/** Standard FAQ display place values */
export const STANDARD_FAQ_DISPLAY_PLACES = [
    FaqDisplayPlaceEnum.All,
    FaqDisplayPlaceEnum.Site,
    FaqDisplayPlaceEnum.Login,
    FaqDisplayPlaceEnum.Vip,
    FaqDisplayPlaceEnum.Cs,
    FaqDisplayPlaceEnum.Agent,
    FaqDisplayPlaceEnum.Deposit,
    FaqDisplayPlaceEnum.Withdraw,
] as const;

/** Standard FAQ display place */
export type StandardFaqDisplayPlace = (typeof STANDARD_FAQ_DISPLAY_PLACES)[number];

/** FAQ display place */
export type FaqDisplayPlace = FaqDisplayPlaceEnum;

/** FAQ language */
export type FaqLanguage = 'en' | 'pt' | 'es';

/** FAQ front list item */
export interface FaqFrontItem {
    /** FAQ ID */
    id: number;
    /** Title / category */
    title: string;
    /** Question */
    question: string;
    /** Rich-text answer HTML */
    answer: string;
    /** Keywords */
    keywords: string;
    /** Sort weight */
    sort: number;
    /** Display place tags */
    display_place?: string[];
}
