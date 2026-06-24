import type { PlayerPropCategoryMeta, PlayerPropEntry, PlayerPropGoldenSubstitution } from './types';

export const PLAYER_PROP_CATEGORIES: PlayerPropCategoryMeta[] = [
    { id: 'goals', label: 'Goals' },
    { id: 'shots', label: 'Shots' },
    { id: 'assists', label: 'Assists' },
    { id: 'cards', label: 'Cards' },
];

/**
 * 球员盘口 mock 数据：纯前端假数据，仅用于在四套品牌 × 明暗下预览结构与「接选注」交互。
 * 不接生产 API；odds 字符串会经 ReferenceOddsButton 进入本地投注单。
 */
export const PLAYER_PROP_ENTRIES: PlayerPropEntry[] = [
    {
        id: 'pp-vinicius',
        name: 'Vinicius Jr.',
        team: 'Brazil',
        teamAbbr: 'BRA',
        teamColor: '#1e9e57',
        position: 'FWD',
        matchTitle: 'Brazil vs Mexico',
        eventId: 'pp-event-bra-mex',
        featured: true,
        boostLabel: 'BOOST 30%',
        markets: [
            {
                id: 'shots',
                category: 'shots',
                label: 'Shots',
                shortLabel: 'SHO',
                nudge: 'Scored in 4 of last 5 matches',
                popularity: '🔥 8k+ backing',
                thresholds: [
                    { id: 'shots-1', label: '1+', value: '1.20' },
                    { id: 'shots-2', label: '2+', value: '1.72' },
                    { id: 'shots-3', label: '3+', value: '2.65' },
                    { id: 'shots-4', label: '4+', value: '4.30' },
                ],
            },
            {
                id: 'goals',
                category: 'goals',
                label: 'Anytime Goalscorer',
                shortLabel: 'GOL',
                nudge: '6 goals in last 8 internationals',
                popularity: '🔥 12k+ backing',
                thresholds: [
                    { id: 'goal-anytime', label: 'Anytime', value: '1.95' },
                    { id: 'goal-2', label: '2+', value: '5.40' },
                    { id: 'goal-first', label: 'First', value: '4.10' },
                ],
            },
        ],
    },
    {
        id: 'pp-bellingham',
        name: 'Jude Bellingham',
        team: 'England',
        teamAbbr: 'ENG',
        teamColor: '#3b5bdb',
        position: 'MID',
        matchTitle: 'England vs Korea Republic',
        eventId: 'pp-event-eng-kor',
        boostLabel: 'BOOST 25%',
        markets: [
            {
                id: 'shots-on-target',
                category: 'shots',
                label: 'Shots on Target',
                shortLabel: 'SOT',
                nudge: 'On target in 3 straight games',
                popularity: '🔥 5k+ backing',
                thresholds: [
                    { id: 'sot-1', label: '1+', value: '1.55' },
                    { id: 'sot-2', label: '2+', value: '2.80' },
                    { id: 'sot-3', label: '3+', value: '5.20' },
                ],
            },
            {
                id: 'assists',
                category: 'assists',
                label: 'To Assist',
                shortLabel: 'AST',
                nudge: '4 assists in last 6 matches',
                thresholds: [
                    { id: 'assist-1', label: '1+', value: '2.45' },
                    { id: 'assist-2', label: '2+', value: '7.50' },
                ],
            },
        ],
    },
    {
        id: 'pp-mbappe',
        name: 'Kylian Mbappé',
        team: 'France',
        teamAbbr: 'FRA',
        teamColor: '#1f3a93',
        position: 'FWD',
        matchTitle: 'France vs USA',
        eventId: 'pp-event-fra-usa',
        featured: true,
        boostLabel: 'BOOST 40%',
        markets: [
            {
                id: 'goals',
                category: 'goals',
                label: 'Anytime Goalscorer',
                shortLabel: 'GOL',
                nudge: 'Scored in 7 of last 9',
                popularity: '🔥 15k+ backing',
                thresholds: [
                    { id: 'goal-anytime', label: 'Anytime', value: '1.62' },
                    { id: 'goal-2', label: '2+', value: '3.90' },
                    { id: 'goal-hattrick', label: 'Hat-trick', value: '11.0' },
                ],
            },
            {
                id: 'shots',
                category: 'shots',
                label: 'Shots',
                shortLabel: 'SHO',
                nudge: 'Avg 4.2 shots per game',
                thresholds: [
                    { id: 'shots-2', label: '2+', value: '1.40' },
                    { id: 'shots-3', label: '3+', value: '1.95' },
                    { id: 'shots-5', label: '5+', value: '3.60' },
                ],
            },
        ],
    },
    {
        id: 'pp-rodri',
        name: 'Rodri',
        team: 'Spain',
        teamAbbr: 'ESP',
        teamColor: '#c0392b',
        position: 'MID',
        matchTitle: 'Spain vs Japan',
        eventId: 'pp-event-esp-jpn',
        markets: [
            {
                id: 'cards',
                category: 'cards',
                label: 'To Be Carded',
                shortLabel: 'CRD',
                nudge: 'Carded in 3 of last 5',
                popularity: '🔥 3k+ backing',
                thresholds: [
                    { id: 'card-yes', label: 'Yes', value: '2.90' },
                    { id: 'card-first', label: 'First', value: '9.00' },
                ],
            },
            {
                id: 'shots',
                category: 'shots',
                label: 'Shots',
                shortLabel: 'SHO',
                thresholds: [
                    { id: 'shots-1', label: '1+', value: '1.70' },
                    { id: 'shots-2', label: '2+', value: '3.10' },
                ],
            },
        ],
    },
];

export const PLAYER_PROP_GOLDEN_SUBSTITUTION: PlayerPropGoldenSubstitution = {
    title: 'Golden Substitution',
    description: "If your player is subbed off before scoring, this leg is refunded as a Free Bet.",
    cta: 'How it works',
};
