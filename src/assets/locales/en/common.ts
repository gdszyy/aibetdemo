/** General */
export default {
    /** General Messages */
    message: {
        networkError: 'Network error, please try again',
        networkSignalWeakTitle: 'Weak signal',
        networkSignalWeakDesc:
            'The current network connection is unstable, which may affect operations such as placing bets. Please check your network and try again.',
        coming: 'Coming soon 🚀',
        TBC: 'To Be Continued.',
        success: 'Success',
        error: 'Error',
        copySuccess: 'Copy successfully',
        copyFailed: 'Copy failed',
        /** 空数据默认文案 */
        emptyDesc: 'No information available',
    },

    /** Actions */
    action: {
        all_delete: 'Delete All',
        all_read: 'Read All',
        close: 'Close',
        viewAll: 'view all',
        all: 'All',
        search: 'Search',
    },

    /** Dialog */
    dialog: {
        confirmBtnText: 'Confirm',
        cancelBtnText: 'Cancel',
        ariaTitle: 'Dialog',
        ariaDescription: 'Dialog content.',
    },

    /** Main Menu */
    mainMenu: {
        home: 'Home',
        sport: 'Sports',
        live: 'Live',
        casino: 'Casino',
        betSlip: 'Slips',
        profile: 'Profile',
        transmision: 'Live TV',
        myBets: 'My Bets',
    },

    /** Navigation */
    navigation: {
        home: 'Home',
        back: 'Back',
        menuTitle: 'Navigation Menu',
        menuDescription: 'Browse sections and open the match sidebar.',
    },

    /** List Status */
    list: {
        loading: 'Loading...',
        loadMore: 'Scroll to load more',
    },

    /** Metadata (page titles) */
    metadata: {
        matchDetail: 'Match Detail',
        tournament: 'Tournament',
    },

    /** Page-level */
    page: {
        notFound: 'Not Found.',
        somethingWentWrong: 'Something went wrong',
        tryAgain: 'Try again',
    },

    /** Language Modal */
    languageModal: {
        title: 'Language',
        search: 'Search',
        selectedLabel: 'Selected Language:',
    },

    /** Parlay boost badge labels (recommend card, bet history, bet slip ticket). */
    parlayBoostBadge: {
        boost: 'PARLAY BOOST',
    },
    recommendCardBadge: {
        superOdd: 'SUPERODD',
        followBet: 'FOLLOW BET',
    },

    /** Parlay boost rules modal */
    parlayBoostModal: {
        sheetTitle: 'Activity Rules & Payout',
        close: 'Close',
        detailError: 'Failed to load parlay boost details. Please try again.',
        hero: {
            status: 'Active',
            title: 'World Cup Group Stage - Parlay Boost',
            period: '01/06/2026 - 30/06/2026',
            currentBoost: 'Current boost',
        },
        howItWorks: {
            title: 'How it works',
            subtitle: 'Parlay 3-6 · all legs must win',
            subtitleDynamic: 'Parlay {minLegs}-{maxLegs} · all legs must win',
            tierLegs: '{legs} Legs',
            yourHit: 'Your hit',
            noteTitle: 'Tier selection',
            note: ' - the tier is based on eligible legs inside the activity. Out-of-scope legs do not count.',
            noteDynamic: ' - out-of-scope legs: {excludedLegs}/{totalLegs}. The {countedLegs}-leg tier applies.',
            noteNoTier:
                ' - add more eligible legs to unlock a boost tier. Each leg must meet the minimum odds and activity scope.',
            activityNote:
                ' - the tier is based on eligible legs inside the activity. All eligible legs must win to unlock the boost.',
            tiers: {
                three: {
                    legs: '3 Legs',
                    boost: '+10%',
                },
                four: {
                    legs: '4 Legs',
                    boost: '+15%',
                },
                five: {
                    legs: '5 Legs',
                    boost: '+25%',
                },
                six: {
                    legs: '6 Legs',
                    boost: '+50%',
                },
            },
        },
        scope: {
            title: 'Applicable scope',
            subtitle: 'Sports - leagues - activity window',
            eligible: 'Eligible',
            ineligible: 'Ineligible',
            sportId: 'Sport {sportId}',
            categoryId: 'Category {categoryId}',
            tournamentId: 'Tournament {tournamentId}',
            eventId: 'Event {eventId}',
            all: 'All',
        },
        markets: {
            title: 'Markets included in the boost',
            subtitle: 'conditions per leg',
            rows: {
                threeLegs: {
                    label: '3 Legs',
                    value: '+10%',
                },
                marketTypes: {
                    label: 'Market types',
                    value: '1x2/Handicap/Over-Under',
                },
                minOdds: {
                    label: 'Min odds per leg',
                    value: '≥ 1.60',
                    dynamicValue: '≥ {odds}',
                },
                activityPeriod: {
                    label: 'Activity period',
                    value: 'Within activity window',
                },
                cap: {
                    label: 'Per-bet cap',
                },
                excluded: {
                    label: 'Excluded',
                    valueBase: 'Outrights/Futures',
                    inPlay: 'In-play',
                    preMatch: 'Pre-match',
                },
            },
            noCap: 'No cap',
        },
        contribution: {
            title: "Your bet's contribution",
            subtitleDynamic: '{totalLegs} legs - {countedLegs} counted',
            countedLegs: 'Counted legs',
        },
        calculation: {
            title: 'How the boost payout is calculated',
            subtitle: 'Parlay 3-6 · all legs must win',
            rows: {
                basePayout: {
                    label: 'Base payout',
                    dynamicValue: 'stake × total odds = {stake} × {totalOdds} = {basePayout}',
                },
                hitTier: {
                    label: 'Hit tier',
                    dynamicValue: '{legs} legs · {boost} ({multiplier})',
                    locked: 'Not unlocked yet',
                },
                boostAmount: {
                    label: 'Boost amount',
                    dynamicValue: 'base × {boostPercent} = {basePayout} × {boostRate} = {boostAmount}',
                    empty: 'No boost until a tier is unlocked',
                },
                cap: {
                    label: 'Per-bet cap',
                    notTruncated: 'Boost {boostAmount} ≤ cap {cap} · not truncated',
                    truncated: 'Boost {rawBoost} exceeds cap {cap} · trimmed to {boostAmount}',
                    noCap: 'Boost {boostAmount} · no cap',
                },
            },
            final: {
                label: 'Final payout',
                dynamicPrefix: '{basePayout} + {boostAmount} =',
            },
            noteTitle: 'Note',
            note: ' - the boost is added only to winnings; your stake stays unchanged. If any leg is voided at settlement, the remaining eligible legs may move the bet to a lower tier. The final tier is confirmed at settlement.',
        },
    },

    /** Relative date labels */
    date: {
        today: 'Today',
        tomorrow: 'Tomorrow',
        dateRange: 'Date range',
        dateRangePlaceholder: 'Select date range',
        previousMonth: 'Previous month',
        nextMonth: 'Next month',
        previousYear: 'Previous year',
        nextYear: 'Next year',
    },

    /** Sidebar */
    sidebar: {
        topSports: 'Top Sports',
        allSports: 'All Sports (A-Z)',
        top: 'Top',
        az: '(A-Z)',
        lobby: 'Lobby',
        promotions: 'Promotions',
        vip: 'VIP',
        favorite: 'Favorite',
        hotTournament: 'Popular Leagues',
    },

    /** Footer */
    footer: {
        brand: '{appName}',
        licenseTitle1: 'Operator & Licensing',
        licenseText1:
            'This website is operated by SAFEPLAY TECHNOLOGY LTD, a company incorporated in Belize under registration number 000041280, with its registered address at Sea Urchin Street, San Pedro, Ambergris Caye, Belize (the "Company").\n' +
            'The Company is duly licensed and regulated in the State of Anjouan under the Computer Gaming Licensing Act 007 of 2005, holding License No. ALSI-152496042-F14, authorizing the provision of online gaming services.',
        licenseTitle2: 'Eligibility & Jurisdiction',
        licenseText2:
            'Access to and use of this website is restricted to individuals who are 18 years of age or older (or the legal age in their jurisdiction, if higher).\n' +
            'It is the responsibility of the user to ensure that participation in online gaming activities is lawful in their jurisdiction.\n' +
            'The Company does not accept players from jurisdictions where online gaming is prohibited or restricted by applicable law.\n' +
            'Responsible Gaming\n' +
            'The Company is committed to promoting responsible gaming and encourages users to play responsibly.\n' +
            'Gaming should be undertaken for entertainment purposes only and not as a means of generating income.\n' +
            'If you believe that you may have a gambling problem, please seek assistance from relevant support organizations.\n' +
            'Risk Disclosure\n' +
            'Participation in online gaming involves financial risk.\n' +
            'Players may lose funds, and outcomes are determined by chance and/or skill depending on the nature of the game.\n' +
            'No guarantees of winnings are provided.',
        columns: {
            sports: 'Sports',
            casino: 'Casino',
            legal: 'Legal',
            support: 'Support',
        },
        links: {
            liveSports: 'Live Sports',
            sportHome: 'Sports Home',
            sportsRules: 'Sports Rules',
            casinoHome: 'Casino Home',
            slots: 'Slots',
            promotions: 'Promotions',
            termsOfService: 'Terms of Service',
            privacyPolicy: 'Privacy Policy',
            amlKycPolicy: 'AML / KYC Policy',
            responsibleGaming: 'Responsible Gaming',
            faq: 'FAQ',
            contactUs: 'Contact Us',
            depositWithdrawal: 'Deposit & Withdrawal',
        },
    },

    /** Promotions */
    promotions: {
        title: 'Promotions',
    },
};
