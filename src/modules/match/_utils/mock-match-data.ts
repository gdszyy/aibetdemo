import { LineStatus, type MarketGroup, OutcomeActiveEnum, ProductEnum, ProductRawEnum } from '@/api/models/market';
import { MatchClockStatus } from '@/api/models/match';
import { type MatchEvent, MatchStatus, type TournamentGroup } from '@/api/models/match-game';
import { LSPORTS_SPORT_ID_BY_TYPE } from '@/constants/sports';

const MOCK_MARKET_ID = 1;

const MOCK_SPORT_NAMES: Record<string, string> = {
    [LSPORTS_SPORT_ID_BY_TYPE.football]: 'Football',
    [LSPORTS_SPORT_ID_BY_TYPE.basketball]: 'Basketball',
    [LSPORTS_SPORT_ID_BY_TYPE.tennis]: 'Tennis',
};

type MockMatchSpec = {
    away: string;
    home: string;
    odds: [number, number, number];
    offsetMinutes: number;
    score: [number, number];
};

const MOCK_MATCHES: MockMatchSpec[] = [
    { home: 'Lisbon Reds', away: 'Madrid Azul', odds: [1.88, 3.45, 4.2], offsetMinutes: 45, score: [1, 0] },
    { home: 'London City', away: 'Milan Club', odds: [2.12, 3.1, 3.55], offsetMinutes: 120, score: [0, 0] },
    { home: 'Berlin Hoops', away: 'Athens Stars', odds: [1.74, 12.5, 2.08], offsetMinutes: 180, score: [42, 39] },
    { home: 'Paris Court', away: 'Rome Aces', odds: [1.96, 9.5, 1.86], offsetMinutes: 260, score: [3, 2] },
];

const getMockSportName = (sportId: string): string => MOCK_SPORT_NAMES[sportId] ?? 'Football';

const createMockMarket = (
    eventId: string,
    product: ProductEnum,
    odds: [number, number, number],
    nowSeconds: number,
): MarketGroup => ({
    id: MOCK_MARKET_ID,
    name: '1x2',
    col: ['1', 'X', '2'],
    lines: [
        {
            id: product === ProductEnum.Live ? 101 : 301,
            product,
            product_raw: product === ProductEnum.Live ? ProductRawEnum.Inplay : ProductRawEnum.PreMatch,
            specifiers: '',
            line_status: LineStatus.Active,
            outcomes: [
                {
                    id: `${eventId}-home`,
                    name: 'Home',
                    quick_name: '1',
                    odds: odds[0],
                    line: '',
                    active: OutcomeActiveEnum.Active,
                    sorted: 1,
                    last_update: nowSeconds,
                },
                {
                    id: `${eventId}-draw`,
                    name: 'Draw',
                    quick_name: 'X',
                    odds: odds[1],
                    line: '',
                    active: OutcomeActiveEnum.Active,
                    sorted: 2,
                    last_update: nowSeconds,
                },
                {
                    id: `${eventId}-away`,
                    name: 'Away',
                    quick_name: '2',
                    odds: odds[2],
                    line: '',
                    active: OutcomeActiveEnum.Active,
                    sorted: 3,
                    last_update: nowSeconds,
                },
            ],
        },
    ],
});

const createMockMatch = (
    spec: MockMatchSpec,
    index: number,
    variant: 'live' | 'upcoming',
    sportId: string,
    nowSeconds: number,
): MatchEvent => {
    const isLive = variant === 'live';
    const eventId = `mock-${variant}-${sportId}-${index + 1}`;
    const market = createMockMarket(eventId, isLive ? ProductEnum.Live : ProductEnum.PreMatch, spec.odds, nowSeconds);

    return {
        event_id: eventId,
        event_id_type: 'match',
        start_time: nowSeconds + spec.offsetMinutes * 60,
        status: isLive ? MatchStatus.Live : MatchStatus.NotStarted,
        match_status: isLive ? 6 : 0,
        home_competitor: {
            competitor_id: `${eventId}-home-team`,
            logo: '',
            name: spec.home,
            score: isLive ? spec.score[0] : 0,
        },
        away_competitor: {
            competitor_id: `${eventId}-away-team`,
            logo: '',
            name: spec.away,
            score: isLive ? spec.score[1] : 0,
        },
        timestamp: nowSeconds,
        live_score_timestamp: nowSeconds,
        match_clock: isLive
            ? {
                  status: MatchClockStatus.Running,
                  seconds: 34 * 60,
                  timestamp: nowSeconds,
              }
            : null,
        period_score: isLive
            ? [
                  {
                      period_id: 1,
                      description: '1st half',
                      short_name: 'H1',
                      home_score: spec.score[0],
                      away_score: spec.score[1],
                  },
              ]
            : [],
        curr_time: nowSeconds,
        match_clock_offset: 0,
        markets: [market],
        popularMarkets: [market],
        live_market_count: 12,
        live_market_total: 12,
        market_ids: [String(MOCK_MARKET_ID)],
    };
};

export const createMockTournamentGroups = (
    variant: 'live' | 'upcoming' = 'upcoming',
    requestedSportId?: string,
): TournamentGroup[] => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const sportIds = requestedSportId
        ? [requestedSportId]
        : [LSPORTS_SPORT_ID_BY_TYPE.football, LSPORTS_SPORT_ID_BY_TYPE.basketball];

    return sportIds.map((sportId, groupIndex) => {
        const groupMatches = MOCK_MATCHES.slice(groupIndex * 2, groupIndex * 2 + 2);

        return {
            sport_id: sportId,
            sport_name: getMockSportName(sportId),
            category_id: `mock-category-${sportId}`,
            category_name: 'Featured',
            tournament_id: `mock-tournament-${variant}-${sportId}`,
            tournament_name: variant === 'live' ? 'Live Picks' : 'Upcoming Picks',
            market_columns: [{ id: String(MOCK_MARKET_ID), name: '1x2', outcome_count: 3 }],
            events: groupMatches.map((spec, index) =>
                createMockMatch(spec, groupIndex * 2 + index, variant, sportId, nowSeconds),
            ),
        };
    });
};
