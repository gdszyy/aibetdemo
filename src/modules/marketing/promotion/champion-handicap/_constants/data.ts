import type { TranslationKey } from '@/i18nV2/types';
import { ChampionHandicapHero } from '../../_images';

export const CHAMPION_HANDICAP_PROMOTION_CARD_IMAGE = ChampionHandicapHero;

export interface ChampionHandicapInfoItem {
    id: string;
    labelKey: TranslationKey<'promotion'>;
    valueKey: TranslationKey<'promotion'>;
    descriptionKey: TranslationKey<'promotion'>;
}

export interface ChampionHandicapReward {
    id: string;
    titleKey: TranslationKey<'promotion'>;
    valueKey: TranslationKey<'promotion'>;
    descriptionKey: TranslationKey<'promotion'>;
    highlighted?: boolean;
}

export interface ChampionHandicapStep {
    id: string;
    titleKey: TranslationKey<'promotion'>;
    descriptionKey: TranslationKey<'promotion'>;
}

export interface ChampionHandicapTableRow {
    id: string;
    cells: TranslationKey<'promotion'>[];
    cellTooltips?: (TranslationKey<'promotion'> | undefined)[];
}

export interface ChampionHandicapTable {
    id: string;
    titleKey: TranslationKey<'promotion'>;
    columns: TranslationKey<'promotion'>[];
    rows: ChampionHandicapTableRow[];
}

export interface ChampionHandicapTermItem {
    id: string;
    titleKey: TranslationKey<'promotion'>;
    descriptionKey?: TranslationKey<'promotion'>;
}

export interface ChampionHandicapTermGroup {
    id: string;
    titleKey: TranslationKey<'promotion'>;
    items: ChampionHandicapTermItem[];
}

export const CHAMPION_HANDICAP_REWARDS: ChampionHandicapReward[] = [
    {
        id: 'compensation',
        titleKey: 'championHandicap.rewards.compensation.title',
        valueKey: 'championHandicap.rewards.compensation.value',
        descriptionKey: 'championHandicap.rewards.compensation.description',
        highlighted: true,
    },
    {
        id: 'minimum-loss',
        titleKey: 'championHandicap.rewards.minimumLoss.title',
        valueKey: 'championHandicap.rewards.minimumLoss.value',
        descriptionKey: 'championHandicap.rewards.minimumLoss.description',
    },
    {
        id: 'wagering',
        titleKey: 'championHandicap.rewards.wagering.title',
        valueKey: 'championHandicap.rewards.wagering.value',
        descriptionKey: 'championHandicap.rewards.wagering.description',
    },
];

export const CHAMPION_HANDICAP_STEPS: ChampionHandicapStep[] = [
    {
        id: 'sign-up',
        titleKey: 'championHandicap.steps.signUp.title',
        descriptionKey: 'championHandicap.steps.signUp.description',
    },
    {
        id: 'world-cup',
        titleKey: 'championHandicap.steps.bet.title',
        descriptionKey: 'championHandicap.steps.bet.description',
    },
    {
        id: 'cashback',
        titleKey: 'championHandicap.steps.cashback.title',
        descriptionKey: 'championHandicap.steps.cashback.description',
    },
];

export const CHAMPION_HANDICAP_CALCULATION_TABLES: ChampionHandicapTable[] = [
    {
        id: 'claim-records',
        titleKey: 'championHandicap.calculation.claimRecords.title',
        columns: [
            'championHandicap.calculation.claimRecords.netLossRange',
            'championHandicap.calculation.claimRecords.cashbackRate',
        ],
        rows: [
            {
                id: 'loss-0-1000',
                cells: [
                    'championHandicap.calculation.claimRecords.rows.loss0_1000.range',
                    'championHandicap.calculation.claimRecords.rows.loss0_1000.rate',
                ],
            },
            {
                id: 'loss-1001-5000',
                cells: [
                    'championHandicap.calculation.claimRecords.rows.loss1001_5000.range',
                    'championHandicap.calculation.claimRecords.rows.loss1001_5000.rate',
                ],
                cellTooltips: [undefined, 'championHandicap.calculation.claimRecords.rows.loss1001_5000.rateTooltip'],
            },
            {
                id: 'loss-5001-20000',
                cells: [
                    'championHandicap.calculation.claimRecords.rows.loss5001_20000.range',
                    'championHandicap.calculation.claimRecords.rows.loss5001_20000.rate',
                ],
                cellTooltips: [undefined, 'championHandicap.calculation.claimRecords.rows.loss5001_20000.rateTooltip'],
            },
            {
                id: 'loss-20001-plus',
                cells: [
                    'championHandicap.calculation.claimRecords.rows.loss20001Plus.range',
                    'championHandicap.calculation.claimRecords.rows.loss20001Plus.rate',
                ],
                cellTooltips: [undefined, 'championHandicap.calculation.claimRecords.rows.loss20001Plus.rateTooltip'],
            },
        ],
    },
    {
        id: 'odds-weighting',
        titleKey: 'championHandicap.calculation.oddsWeighting.title',
        columns: [
            'championHandicap.calculation.oddsWeighting.oddsRange',
            'championHandicap.calculation.oddsWeighting.contributionRate',
        ],
        rows: [
            {
                id: 'odds-under-1-2',
                cells: [
                    'championHandicap.calculation.oddsWeighting.rows.under1_2.range',
                    'championHandicap.calculation.oddsWeighting.rows.under1_2.rate',
                ],
            },
            {
                id: 'odds-1-2-1-5',
                cells: [
                    'championHandicap.calculation.oddsWeighting.rows.r1_2_1_5.range',
                    'championHandicap.calculation.oddsWeighting.rows.r1_2_1_5.rate',
                ],
            },
            {
                id: 'odds-1-5-2-5',
                cells: [
                    'championHandicap.calculation.oddsWeighting.rows.r1_5_2_5.range',
                    'championHandicap.calculation.oddsWeighting.rows.r1_5_2_5.rate',
                ],
            },
            {
                id: 'odds-2-5-plus',
                cells: [
                    'championHandicap.calculation.oddsWeighting.rows.r2_5Plus.range',
                    'championHandicap.calculation.oddsWeighting.rows.r2_5Plus.rate',
                ],
            },
        ],
    },
];

export const CHAMPION_HANDICAP_TERM_GROUPS: ChampionHandicapTermGroup[] = [
    {
        id: 'terms-and-conditions',
        titleKey: 'championHandicap.terms.termsAndConditions.title',
        items: [
            {
                id: 'registration',
                titleKey: 'championHandicap.terms.termsAndConditions.registration.title',
                descriptionKey: 'championHandicap.terms.termsAndConditions.registration.description',
            },
            {
                id: 'matches',
                titleKey: 'championHandicap.terms.termsAndConditions.matches.title',
                descriptionKey: 'championHandicap.terms.termsAndConditions.matches.description',
            },
            {
                id: 'settlement',
                titleKey: 'championHandicap.terms.termsAndConditions.settlement.title',
                descriptionKey: 'championHandicap.terms.termsAndConditions.settlement.description',
            },
            {
                id: 'eligible-bets',
                titleKey: 'championHandicap.terms.termsAndConditions.eligibleBets.title',
                descriptionKey: 'championHandicap.terms.termsAndConditions.eligibleBets.description',
            },
            {
                id: 'net-loss',
                titleKey: 'championHandicap.terms.termsAndConditions.netLoss.title',
                descriptionKey: 'championHandicap.terms.termsAndConditions.netLoss.description',
            },
            {
                id: 'minimum-bets',
                titleKey: 'championHandicap.terms.termsAndConditions.minimumBets.title',
            },
        ],
    },
    {
        id: 'reward-terms',
        titleKey: 'championHandicap.terms.rewardTerms.title',
        items: [
            {
                id: 'compensation',
                titleKey: 'championHandicap.terms.rewardTerms.compensation.title',
                descriptionKey: 'championHandicap.terms.rewardTerms.compensation.description',
            },
            {
                id: 'deadline',
                titleKey: 'championHandicap.terms.rewardTerms.deadline.title',
                descriptionKey: 'championHandicap.terms.rewardTerms.deadline.description',
            },
            {
                id: 'wagering',
                titleKey: 'championHandicap.terms.rewardTerms.wagering.title',
                descriptionKey: 'championHandicap.terms.rewardTerms.wagering.description',
            },
            {
                id: 'odds',
                titleKey: 'championHandicap.terms.rewardTerms.odds.title',
                descriptionKey: 'championHandicap.terms.rewardTerms.odds.description',
            },
            {
                id: 'hedging',
                titleKey: 'championHandicap.terms.rewardTerms.hedging.title',
                descriptionKey: 'championHandicap.terms.rewardTerms.hedging.description',
            },
            {
                id: 'validity',
                titleKey: 'championHandicap.terms.rewardTerms.validity.title',
                descriptionKey: 'championHandicap.terms.rewardTerms.validity.description',
            },
            {
                id: 'cap',
                titleKey: 'championHandicap.terms.rewardTerms.cap.title',
                descriptionKey: 'championHandicap.terms.rewardTerms.cap.description',
            },
            {
                id: 'platform-limit',
                titleKey: 'championHandicap.terms.rewardTerms.platformLimit.title',
                descriptionKey: 'championHandicap.terms.rewardTerms.platformLimit.description',
            },
            {
                id: 'bet-restriction',
                titleKey: 'championHandicap.terms.rewardTerms.betRestriction.title',
                descriptionKey: 'championHandicap.terms.rewardTerms.betRestriction.description',
            },
            {
                id: 'odds-abuse',
                titleKey: 'championHandicap.terms.rewardTerms.oddsAbuse.title',
                descriptionKey: 'championHandicap.terms.rewardTerms.oddsAbuse.description',
            },
        ],
    },
    {
        id: 'important-terms',
        titleKey: 'championHandicap.terms.importantTerms.title',
        items: [
            {
                id: 'eligibility',
                titleKey: 'championHandicap.terms.importantTerms.eligibility.title',
                descriptionKey: 'championHandicap.terms.importantTerms.eligibility.description',
            },
            {
                id: 'personal-use',
                titleKey: 'championHandicap.terms.importantTerms.personalUse.title',
                descriptionKey: 'championHandicap.terms.importantTerms.personalUse.description',
            },
            {
                id: 'compliance',
                titleKey: 'championHandicap.terms.importantTerms.compliance.title',
                descriptionKey: 'championHandicap.terms.importantTerms.compliance.description',
            },
            {
                id: 'acceptance',
                titleKey: 'championHandicap.terms.importantTerms.acceptance.title',
                descriptionKey: 'championHandicap.terms.importantTerms.acceptance.description',
            },
            {
                id: 'maximum-prize',
                titleKey: 'championHandicap.terms.importantTerms.maximumPrize.title',
                descriptionKey: 'championHandicap.terms.importantTerms.maximumPrize.description',
            },
            {
                id: 'abuse',
                titleKey: 'championHandicap.terms.importantTerms.abuse.title',
                descriptionKey: 'championHandicap.terms.importantTerms.abuse.description',
            },
            {
                id: 'final-rights',
                titleKey: 'championHandicap.terms.importantTerms.finalRights.title',
                descriptionKey: 'championHandicap.terms.importantTerms.finalRights.description',
            },
        ],
    },
    {
        id: 'safety-notice',
        titleKey: 'championHandicap.terms.safetyNotice.title',
        items: [
            { id: 'underage', titleKey: 'championHandicap.terms.safetyNotice.item0' },
            { id: 'responsible-gaming', titleKey: 'championHandicap.terms.safetyNotice.item1' },
            { id: 'risk', titleKey: 'championHandicap.terms.safetyNotice.item2' },
            { id: 'support', titleKey: 'championHandicap.terms.safetyNotice.item3' },
        ],
    },
];
