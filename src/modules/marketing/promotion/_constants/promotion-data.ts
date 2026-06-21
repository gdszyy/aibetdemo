import type { StaticImageData } from 'next/image';
import { HeroBanner, StepDeposit, StepPlay, StepRegister } from '../_images';

export const HERO_IMAGE: StaticImageData = HeroBanner;

export const STEP_IMAGES: StaticImageData[] = [StepRegister, StepDeposit, StepPlay];

export type BonusType = 'casino' | 'sport';
export type BonusStageKey = 'stage1' | 'stage2' | 'stage3';

export interface BonusDetail {
    ratio: string;
    wagering: string;
    maxWithdraw: string;
    odds: string | null;
}

export interface BonusStage {
    stageKey: BonusStageKey;
    minDeposit: string;
    maxDeposit: string;
    best: boolean;
    casino: BonusDetail;
    sport: BonusDetail;
}

/** Rules accordion config: key → i18n namespace, itemCount, indices needing rich text */
export const RULES_CONFIG = [
    { key: 'general', itemCount: 4 },
    { key: 'deadlines', itemCount: 4, richItems: [0, 1] },
    { key: 'sportsBetting', itemCount: 4, richItems: [1] },
    { key: 'casinoBetting', itemCount: 3 },
    { key: 'withdrawals', itemCount: 4 },
    { key: 'restrictions', itemCount: 5 },
] as const;
