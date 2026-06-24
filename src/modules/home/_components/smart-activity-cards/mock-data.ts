import { LineStatus, OutcomeActiveEnum } from '@/api/models/market';
import type { RecommendCardSelection } from '@/api/models/recommend-card';
import worldCupFuturesImage from './assets/world-cup-card-futures.png';
import worldCupParlayImage from './assets/world-cup-card-parlay.png';
import worldCupSpotlightImage from './assets/world-cup-card-spotlight.png';
import type { ActivityStyleItem, FollowBetProfile, LeaderboardRow, PopularBetProfile, QuickBetItem } from './types';

type SmartCardsMessageKey =
    | 'activityStyles.sportsPoster.eyebrow'
    | 'activityStyles.sportsPoster.title'
    | 'activityStyles.sportsPoster.description'
    | 'activityStyles.sportsPoster.metric'
    | 'activityStyles.sportsPoster.action'
    | 'activityStyles.sportsTicket.eyebrow'
    | 'activityStyles.sportsTicket.title'
    | 'activityStyles.sportsTicket.description'
    | 'activityStyles.sportsTicket.metric'
    | 'activityStyles.sportsTicket.action'
    | 'activityStyles.promoOffer.eyebrow'
    | 'activityStyles.promoOffer.title'
    | 'activityStyles.promoOffer.description'
    | 'activityStyles.promoOffer.metric'
    | 'activityStyles.promoOffer.action'
    | 'activityStyles.promoSheet.eyebrow'
    | 'activityStyles.promoSheet.title'
    | 'activityStyles.promoSheet.description'
    | 'activityStyles.promoSheet.metric'
    | 'activityStyles.promoSheet.action'
    | 'activityStyles.worldCupCrest.eyebrow'
    | 'activityStyles.worldCupCrest.title'
    | 'activityStyles.worldCupCrest.description'
    | 'activityStyles.worldCupCrest.metric'
    | 'activityStyles.worldCupCrest.action'
    | 'activityStyles.worldCupMission.eyebrow'
    | 'activityStyles.worldCupMission.title'
    | 'activityStyles.worldCupMission.description'
    | 'activityStyles.worldCupMission.metric'
    | 'activityStyles.worldCupMission.action'
    | 'quickBet.single.badge'
    | 'quickBet.single.title'
    | 'quickBet.single.subtitle'
    | 'quickBet.single.market'
    | 'quickBet.single.outcome'
    | 'quickBet.parlay.badge'
    | 'quickBet.parlay.title'
    | 'quickBet.parlay.subtitle'
    | 'quickBet.parlay.market'
    | 'quickBet.parlay.outcome'
    | 'quickBet.parlay.legA'
    | 'quickBet.parlay.marketA'
    | 'quickBet.parlay.outcomeA'
    | 'quickBet.parlay.legB'
    | 'quickBet.parlay.marketB'
    | 'quickBet.parlay.outcomeB'
    | 'quickBet.parlay.legC'
    | 'quickBet.parlay.marketC'
    | 'quickBet.parlay.outcomeC'
    | 'quickBet.outright.badge'
    | 'quickBet.outright.title'
    | 'quickBet.outright.subtitle'
    | 'quickBet.outright.market'
    | 'quickBet.outright.outcome'
    | 'followBet.name'
    | 'followBet.tag'
    | 'followBet.pickTitle'
    | 'followBet.pickMeta'
    | 'followBet.marketA'
    | 'followBet.outcomeA'
    | 'followBet.legB'
    | 'followBet.marketB'
    | 'followBet.outcomeB'
    | 'followBet.streak'
    | 'leaderboard.userA'
    | 'leaderboard.userB'
    | 'leaderboard.userC'
    | 'leaderboard.me'
    | 'leaderboard.prizeA'
    | 'leaderboard.prizeB'
    | 'leaderboard.prizeC'
    | 'leaderboard.prizeMe'
    | 'popularBets.eyebrow'
    | 'popularBets.title'
    | 'popularBets.pick'
    | 'popularBets.itemA.league'
    | 'popularBets.itemA.bettor'
    | 'popularBets.itemA.stake'
    | 'popularBets.itemA.popularity'
    | 'popularBets.itemA.period'
    | 'popularBets.itemA.home'
    | 'popularBets.itemA.away'
    | 'popularBets.itemA.selection'
    | 'popularBets.itemB.league'
    | 'popularBets.itemB.bettor'
    | 'popularBets.itemB.stake'
    | 'popularBets.itemB.popularity'
    | 'popularBets.itemB.period'
    | 'popularBets.itemB.home'
    | 'popularBets.itemB.away'
    | 'popularBets.itemB.selection'
    | 'popularBets.itemC.league'
    | 'popularBets.itemC.bettor'
    | 'popularBets.itemC.stake'
    | 'popularBets.itemC.popularity'
    | 'popularBets.itemC.period'
    | 'popularBets.itemC.home'
    | 'popularBets.itemC.away'
    | 'popularBets.itemC.selection';

type SmartCardsTranslator = (key: SmartCardsMessageKey) => string;

interface SelectionInput {
    id: number;
    title: string;
    marketName: string;
    outcomeName: string;
    odds: number;
    line?: string;
    eventType?: string;
}

const splitMatchTitle = (title: string): { home: string; away: string } => {
    const [home = title, away = ''] = title.split(' vs ');
    return { home, away };
};

/** 构造首页展示用推荐投注项，后续可替换为真实推荐接口返回。 */
const createSelection = ({
    id,
    title,
    marketName,
    outcomeName,
    odds,
    line = '',
    eventType = 'match',
}: SelectionInput): RecommendCardSelection => {
    const { home, away } = splitMatchTitle(title);

    return {
        event_id: `smart-event-${id}`,
        event_id_type: eventType,
        match_status: 0,
        product: '3',
        product_raw: 'prematch',
        market_id: `${3000 + id}`,
        specifiers: line,
        specifiers_status: LineStatus.Active,
        timestamp: 1782000000000 + id,
        outcome_id: `smart-outcome-${id}`,
        outcome_odds: odds.toFixed(2),
        outcome_active: OutcomeActiveEnum.Active,
        outcome_line: line,
        outcome_name: outcomeName,
        outcome_name_alias: outcomeName,
        title,
        market_name: marketName,
        home_competitor_name: home,
        away_competitor_name: away,
        sport_id: '6046',
        category_id: '1',
        tournament_id: `smart-tournament-${id}`,
    };
};

export const buildActivityStyleItems = (t: SmartCardsTranslator): ActivityStyleItem[] => [
    {
        id: 'sports-poster',
        eyebrow: t('activityStyles.sportsPoster.eyebrow'),
        title: t('activityStyles.sportsPoster.title'),
        description: t('activityStyles.sportsPoster.description'),
        metric: t('activityStyles.sportsPoster.metric'),
        action: t('activityStyles.sportsPoster.action'),
        variant: 'poster',
        visualImage: worldCupSpotlightImage,
        visualPosition: 'center',
    },
    {
        id: 'sports-ticket',
        eyebrow: t('activityStyles.sportsTicket.eyebrow'),
        title: t('activityStyles.sportsTicket.title'),
        description: t('activityStyles.sportsTicket.description'),
        metric: t('activityStyles.sportsTicket.metric'),
        action: t('activityStyles.sportsTicket.action'),
        variant: 'ticket',
        visualImage: worldCupParlayImage,
        visualPosition: 'center',
    },
    {
        id: 'promo-offer',
        eyebrow: t('activityStyles.promoOffer.eyebrow'),
        title: t('activityStyles.promoOffer.title'),
        description: t('activityStyles.promoOffer.description'),
        metric: t('activityStyles.promoOffer.metric'),
        action: t('activityStyles.promoOffer.action'),
        variant: 'offer',
        visualImage: worldCupSpotlightImage,
        visualPosition: 'right center',
    },
    {
        id: 'promo-sheet',
        eyebrow: t('activityStyles.promoSheet.eyebrow'),
        title: t('activityStyles.promoSheet.title'),
        description: t('activityStyles.promoSheet.description'),
        metric: t('activityStyles.promoSheet.metric'),
        action: t('activityStyles.promoSheet.action'),
        variant: 'sheet',
        visualImage: worldCupParlayImage,
        visualPosition: 'center',
    },
    {
        id: 'world-cup-crest',
        eyebrow: t('activityStyles.worldCupCrest.eyebrow'),
        title: t('activityStyles.worldCupCrest.title'),
        description: t('activityStyles.worldCupCrest.description'),
        metric: t('activityStyles.worldCupCrest.metric'),
        action: t('activityStyles.worldCupCrest.action'),
        variant: 'crest',
        visualImage: worldCupFuturesImage,
        visualPosition: 'right center',
    },
    {
        id: 'world-cup-mission',
        eyebrow: t('activityStyles.worldCupMission.eyebrow'),
        title: t('activityStyles.worldCupMission.title'),
        description: t('activityStyles.worldCupMission.description'),
        metric: t('activityStyles.worldCupMission.metric'),
        action: t('activityStyles.worldCupMission.action'),
        variant: 'mission',
        visualImage: worldCupFuturesImage,
        visualPosition: 'center',
    },
];

export const buildQuickBetItems = (t: SmartCardsTranslator): QuickBetItem[] => {
    const singleTitle = t('quickBet.single.title');
    const parlayLegA = t('quickBet.parlay.legA');
    const parlayLegB = t('quickBet.parlay.legB');
    const parlayLegC = t('quickBet.parlay.legC');
    const outrightTitle = t('quickBet.outright.title');

    return [
        {
            id: 'quick-single',
            kind: 'single',
            badge: t('quickBet.single.badge'),
            title: singleTitle,
            subtitle: t('quickBet.single.subtitle'),
            marketLabel: t('quickBet.single.market'),
            outcomeLabel: t('quickBet.single.outcome'),
            odds: 2.12,
            defaultStake: 50,
            selections: [
                createSelection({
                    id: 1,
                    title: singleTitle,
                    marketName: t('quickBet.single.market'),
                    outcomeName: t('quickBet.single.outcome'),
                    odds: 2.12,
                }),
            ],
        },
        {
            id: 'quick-parlay',
            kind: 'parlay',
            badge: t('quickBet.parlay.badge'),
            title: t('quickBet.parlay.title'),
            subtitle: t('quickBet.parlay.subtitle'),
            marketLabel: t('quickBet.parlay.market'),
            outcomeLabel: t('quickBet.parlay.outcome'),
            odds: 5.86,
            defaultStake: 30,
            selections: [
                createSelection({
                    id: 2,
                    title: parlayLegA,
                    marketName: t('quickBet.parlay.marketA'),
                    outcomeName: t('quickBet.parlay.outcomeA'),
                    odds: 1.72,
                }),
                createSelection({
                    id: 3,
                    title: parlayLegB,
                    marketName: t('quickBet.parlay.marketB'),
                    outcomeName: t('quickBet.parlay.outcomeB'),
                    odds: 1.95,
                }),
                createSelection({
                    id: 4,
                    title: parlayLegC,
                    marketName: t('quickBet.parlay.marketC'),
                    outcomeName: t('quickBet.parlay.outcomeC'),
                    odds: 1.75,
                }),
            ],
        },
        {
            id: 'quick-outright',
            kind: 'outright',
            badge: t('quickBet.outright.badge'),
            title: outrightTitle,
            subtitle: t('quickBet.outright.subtitle'),
            marketLabel: t('quickBet.outright.market'),
            outcomeLabel: t('quickBet.outright.outcome'),
            odds: 7.5,
            defaultStake: 20,
            selections: [
                createSelection({
                    id: 5,
                    title: outrightTitle,
                    marketName: t('quickBet.outright.market'),
                    outcomeName: t('quickBet.outright.outcome'),
                    odds: 7.5,
                    eventType: 'outright',
                }),
            ],
        },
    ];
};

export const buildFollowBetProfile = (t: SmartCardsTranslator): FollowBetProfile => {
    const pickTitle = t('followBet.pickTitle');

    return {
        id: 'follow-alpha',
        name: t('followBet.name'),
        tag: t('followBet.tag'),
        pickTitle,
        pickMeta: t('followBet.pickMeta'),
        winRate: '68%',
        roi: '+18.4%',
        followers: '12.8K',
        streak: t('followBet.streak'),
        selections: [
            createSelection({
                id: 6,
                title: pickTitle,
                marketName: t('followBet.marketA'),
                outcomeName: t('followBet.outcomeA'),
                odds: 1.84,
            }),
            createSelection({
                id: 7,
                title: t('followBet.legB'),
                marketName: t('followBet.marketB'),
                outcomeName: t('followBet.outcomeB'),
                odds: 1.68,
            }),
        ],
    };
};

export const buildPopularBetItems = (t: SmartCardsTranslator): PopularBetProfile[] => [
    {
        id: 'popular-a',
        league: t('popularBets.itemA.league'),
        bettorName: t('popularBets.itemA.bettor'),
        stake: t('popularBets.itemA.stake'),
        popularity: t('popularBets.itemA.popularity'),
        period: t('popularBets.itemA.period'),
        minute: "45'",
        home: { name: t('popularBets.itemA.home'), score: 1 },
        away: { name: t('popularBets.itemA.away'), score: 1 },
        selection: t('popularBets.itemA.selection'),
        odds: '1.50',
        href: '/sports/6046',
    },
    {
        id: 'popular-b',
        league: t('popularBets.itemB.league'),
        bettorName: t('popularBets.itemB.bettor'),
        stake: t('popularBets.itemB.stake'),
        popularity: t('popularBets.itemB.popularity'),
        period: t('popularBets.itemB.period'),
        minute: "67'",
        home: { name: t('popularBets.itemB.home'), score: 2 },
        away: { name: t('popularBets.itemB.away'), score: 0 },
        selection: t('popularBets.itemB.selection'),
        odds: '1.85',
        href: '/sports/6046',
    },
    {
        id: 'popular-c',
        league: t('popularBets.itemC.league'),
        bettorName: t('popularBets.itemC.bettor'),
        stake: t('popularBets.itemC.stake'),
        popularity: t('popularBets.itemC.popularity'),
        period: t('popularBets.itemC.period'),
        minute: "33'",
        home: { name: t('popularBets.itemC.home'), score: 0 },
        away: { name: t('popularBets.itemC.away'), score: 1 },
        selection: t('popularBets.itemC.selection'),
        odds: '2.40',
        href: '/sports/6046',
    },
];

export const buildLeaderboardRows = (t: SmartCardsTranslator): LeaderboardRow[] => [
    { rank: 1, name: t('leaderboard.userA'), amount: 128400, prize: t('leaderboard.prizeA'), trend: 'stable' },
    { rank: 2, name: t('leaderboard.userB'), amount: 96480, prize: t('leaderboard.prizeB'), trend: 'up' },
    { rank: 3, name: t('leaderboard.userC'), amount: 78220, prize: t('leaderboard.prizeC'), trend: 'new' },
    {
        rank: 18,
        name: t('leaderboard.me'),
        amount: 18460,
        prize: t('leaderboard.prizeMe'),
        trend: 'up',
        isCurrentUser: true,
    },
];
