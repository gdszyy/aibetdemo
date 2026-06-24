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

const GENERATED_HOME_ASSET_PATH = '/static/generated/home-assets';

const MOCK_TEAM_LOGOS: Record<string, string> = {
    'Lisbon Reds': `${GENERATED_HOME_ASSET_PATH}/teams/lisbon-reds.svg`,
    'Madrid Azul': `${GENERATED_HOME_ASSET_PATH}/teams/madrid-azul.svg`,
    'London City': `${GENERATED_HOME_ASSET_PATH}/teams/london-city.svg`,
    'Milan Club': `${GENERATED_HOME_ASSET_PATH}/teams/milan-club.svg`,
    'Hamburg Anchor': `${GENERATED_HOME_ASSET_PATH}/teams/hamburg-anchor.svg`,
    'Athens Olympians': `${GENERATED_HOME_ASSET_PATH}/teams/athens-olympians.svg`,
    'Paris Étoile': `${GENERATED_HOME_ASSET_PATH}/teams/paris-etoile.svg`,
    'Paris 脡toile': `${GENERATED_HOME_ASSET_PATH}/teams/paris-etoile.svg`,
    'Porto Lions': `${GENERATED_HOME_ASSET_PATH}/teams/porto-lions.svg`,
    'Porto Waves': `${GENERATED_HOME_ASSET_PATH}/teams/porto-waves.svg`,
    'Rome Legion': `${GENERATED_HOME_ASSET_PATH}/teams/rome-legion.svg`,
    'Naples Bay': `${GENERATED_HOME_ASSET_PATH}/teams/naples-bay.svg`,
    'Munich Stars': `${GENERATED_HOME_ASSET_PATH}/teams/munich-stars.svg`,
    'Lyon Wolves': `${GENERATED_HOME_ASSET_PATH}/teams/lyon-wolves.svg`,
    'Seville Sun': `${GENERATED_HOME_ASSET_PATH}/teams/seville-sun.svg`,
    'Turin Bulls': `${GENERATED_HOME_ASSET_PATH}/teams/turin-bulls.svg`,
    'Vienna Eagles': `${GENERATED_HOME_ASSET_PATH}/teams/vienna-eagles.svg`,
};

const MOCK_LEAGUE_LOGOS: Record<string, Record<'live' | 'upcoming', string>> = {
    [LSPORTS_SPORT_ID_BY_TYPE.football]: {
        live: `${GENERATED_HOME_ASSET_PATH}/leagues/live-picks-football.svg`,
        upcoming: `${GENERATED_HOME_ASSET_PATH}/leagues/upcoming-picks-football.svg`,
    },
    [LSPORTS_SPORT_ID_BY_TYPE.basketball]: {
        live: `${GENERATED_HOME_ASSET_PATH}/leagues/live-picks-basketball.svg`,
        upcoming: `${GENERATED_HOME_ASSET_PATH}/leagues/upcoming-picks-basketball.svg`,
    },
    [LSPORTS_SPORT_ID_BY_TYPE.tennis]: {
        live: `${GENERATED_HOME_ASSET_PATH}/leagues/live-picks-tennis.svg`,
        upcoming: `${GENERATED_HOME_ASSET_PATH}/leagues/upcoming-picks-tennis.svg`,
    },
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
    { home: 'Hamburg Anchor', away: 'Athens Olympians', odds: [1.74, 3.6, 4.6], offsetMinutes: 180, score: [2, 1] },
    { home: 'Paris Étoile', away: 'Rome Legion', odds: [1.96, 3.3, 3.95], offsetMinutes: 260, score: [1, 0] },
    { home: 'Porto Lions', away: 'Naples Bay', odds: [2.05, 3.2, 3.7], offsetMinutes: 75, score: [2, 1] },
    { home: 'Munich Stars', away: 'Lyon Wolves', odds: [1.65, 3.9, 5.1], offsetMinutes: 95, score: [0, 1] },
    { home: 'Seville Sun', away: 'Turin Bulls', odds: [2.4, 3.15, 2.9], offsetMinutes: 150, score: [1, 1] },
    { home: 'Vienna Eagles', away: 'Porto Waves', odds: [1.92, 3.4, 4.05], offsetMinutes: 210, score: [3, 0] },
];

const getMockSportName = (sportId: string): string => MOCK_SPORT_NAMES[sportId] ?? 'Football';

const getMockTeamLogo = (teamName: string): string => MOCK_TEAM_LOGOS[teamName] ?? '';

const getMockTournamentLogo = (sportId: string, variant: 'live' | 'upcoming'): string =>
    MOCK_LEAGUE_LOGOS[sportId]?.[variant] ?? MOCK_LEAGUE_LOGOS[LSPORTS_SPORT_ID_BY_TYPE.football][variant];

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
            logo: getMockTeamLogo(spec.home),
            name: spec.home,
            score: isLive ? spec.score[0] : 0,
        },
        away_competitor: {
            competitor_id: `${eventId}-away-team`,
            logo: getMockTeamLogo(spec.away),
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
    matchesPerGroup = 2,
): TournamentGroup[] => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const sportIds = requestedSportId
        ? [requestedSportId]
        : [LSPORTS_SPORT_ID_BY_TYPE.football, LSPORTS_SPORT_ID_BY_TYPE.basketball];
    const groupSize = Math.max(1, matchesPerGroup);

    return sportIds.map((sportId, groupIndex) => {
        // Window into MOCK_MATCHES, wrapping with modulo so larger counts stay populated.
        const groupMatches = Array.from({ length: groupSize }, (_, slot) => {
            const specIndex = (groupIndex * groupSize + slot) % MOCK_MATCHES.length;
            return MOCK_MATCHES[specIndex];
        });

        return {
            sport_id: sportId,
            sport_name: getMockSportName(sportId),
            category_id: `mock-category-${sportId}`,
            category_name: 'Featured',
            tournament_id: `mock-tournament-${variant}-${sportId}`,
            tournament_name: variant === 'live' ? 'Live Picks' : 'Upcoming Picks',
            tournament_logo: getMockTournamentLogo(sportId, variant),
            market_columns: [{ id: String(MOCK_MARKET_ID), name: '1x2', outcome_count: 3 }],
            events: groupMatches.map((spec, slot) =>
                createMockMatch(spec, groupIndex * groupSize + slot, variant, sportId, nowSeconds),
            ),
        };
    });
};

const TOP_LIVE_TOTALS_MARKET_ID = 2;
const TOP_LIVE_DYNAMIC_MARKET_ID = 3;

const TOP_LIVE_TOTALS: { over: number; total: number; under: number }[] = [
    { total: 1.5, over: 1.3, under: 3.4 },
    { total: 2.5, over: 1.95, under: 1.85 },
    { total: 3.5, over: 3.2, under: 1.34 },
];

/** Over / Under market with multiple lines — drives the Top Live line switcher (Row 2). */
const createTopLiveTotalsMarket = (eventId: string, nowSeconds: number): MarketGroup => ({
    id: TOP_LIVE_TOTALS_MARKET_ID,
    name: 'Over / Under',
    col: ['Over', 'Under'],
    lines: TOP_LIVE_TOTALS.map(({ over, total, under }, index) => {
        const label = total.toFixed(1);
        return {
            id: 200 + index,
            product: ProductEnum.Live,
            product_raw: ProductRawEnum.Inplay,
            specifiers: `total=${label}`,
            row: label,
            is_main_line: total === 2.5,
            line_status: LineStatus.Active,
            outcomes: [
                {
                    id: `${eventId}-ou-${label}-over`,
                    name: 'Over',
                    quick_name: 'Over',
                    odds: over,
                    line: label,
                    active: OutcomeActiveEnum.Active,
                    sorted: 1,
                    last_update: nowSeconds,
                },
                {
                    id: `${eventId}-ou-${label}-under`,
                    name: 'Under',
                    quick_name: 'Under',
                    odds: under,
                    line: label,
                    active: OutcomeActiveEnum.Active,
                    sorted: 2,
                    last_update: nowSeconds,
                },
            ],
        };
    }),
});

/** Single-line "dynamic" market that shifts with match progress (Row 3). */
const createTopLiveNextGoalMarket = (eventId: string, nowSeconds: number): MarketGroup => ({
    id: TOP_LIVE_DYNAMIC_MARKET_ID,
    name: 'Next Goal',
    col: ['1', 'X', '2'],
    lines: [
        {
            id: 310,
            product: ProductEnum.Live,
            product_raw: ProductRawEnum.Inplay,
            specifiers: '',
            line_status: LineStatus.Active,
            outcomes: [
                {
                    id: `${eventId}-ng-home`,
                    name: 'Home',
                    quick_name: '1',
                    odds: 2.1,
                    line: '',
                    active: OutcomeActiveEnum.Active,
                    sorted: 1,
                    last_update: nowSeconds,
                },
                {
                    id: `${eventId}-ng-none`,
                    name: 'No Goal',
                    quick_name: 'X',
                    odds: 6.5,
                    line: '',
                    active: OutcomeActiveEnum.Active,
                    sorted: 2,
                    last_update: nowSeconds,
                },
                {
                    id: `${eventId}-ng-away`,
                    name: 'Away',
                    quick_name: '2',
                    odds: 2.4,
                    line: '',
                    active: OutcomeActiveEnum.Active,
                    sorted: 3,
                    last_update: nowSeconds,
                },
            ],
        },
    ],
});

/**
 * Enriches a mock match with two extra markets so Top Live cards render all three
 * rows (1X2 / Over-Under with switcher / dynamic). Scoped to Top Live only — keeps
 * 1X2 at markets[0] and leaves market_columns/market_ids untouched.
 */
export const withTopLiveMockMarkets = (match: MatchEvent): MatchEvent => {
    const extras = [
        createTopLiveTotalsMarket(match.event_id, match.timestamp),
        createTopLiveNextGoalMarket(match.event_id, match.timestamp),
    ];
    return {
        ...match,
        markets: [...match.markets, ...extras],
        popularMarkets: [...match.popularMarkets, ...extras],
    };
};
