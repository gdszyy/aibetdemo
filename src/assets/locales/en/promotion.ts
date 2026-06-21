import championHandicap from './promotion-champion-handicap';

export default {
    hero: {
        title: 'Triple Bonus on Your First Deposits',
    },
    championHandicap,
    list: {
        title: 'Promotions',
        subtitle:
            'Unlock exciting rewards with our latest promotions!\nJoin now and take advantage of limited-time bonuses, special deals, and exclusive benefits.',
        tabs: {
            all: 'All',
            sport: 'Sport',
            casino: 'Casino',
        },
        joinNow: 'Join Now',
        hot: 'Super Hot',
        joined: 'Joined',
        empty: 'Coming Soon — Get ready for amazing promotions!',
        status: {
            active: 'Active',
            upcoming: 'Upcoming',
            ended: 'Ended',
        },
        cards: {
            firstDeposit: {
                title: '{appName} 5th Anniversary',
                description: 'Triple first deposit bonus, up to {amount} in rewards',
            },
            WorldCupPass: {
                title: 'World Cup Immersion',
                description: 'Activate the FIFA World Cup 2026™ Pass and win up to {amount}!',
            },
            championHandicap: {
                title: '{countryName} Champion Handicap',
                description: 'Back {countryName} in the World Cup and unlock miracle cashback protection',
            },
            luckyBetCode: {
                title: 'Lucky Bet is Live!',
                description: 'Win up to 777 USD every day!',
            },
            parlayBoost: {
                title: 'More Parlays, More Wins',
                description: 'Place eligible parlay bets and boost your payout up to {multiplier}',
            },
        },
        countryNames: {
            BR: 'Brazil',
            MX: 'Mexico',
        },
    },
};
