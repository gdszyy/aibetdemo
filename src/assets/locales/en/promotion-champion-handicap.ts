export default {
    common: {
        brazil: 'Brazil',
        mexico: 'Mexico',
    },
    metadata: {
        title: 'Champion Handicap',
        description:
            'Join the World Cup promotion and crown your passion!\nIf {teamName} wins the championship, we will refund a percentage of your net losses during the tournament.',
    },
    hero: {
        badge: 'Champion Handicap',
        title: 'If {teamName} wins, your losses get covered',
        exclusive: '2026 FIFA WORLD CUP EXCLUSIVE',
        planName: 'Champion Protection Plan · {teamName} Miracle Cashback',
        maximumPayout: 'Maximum Payout',
        amount: '{maximumPayout}',
        currency: '{currency}',
        subtitle: 'Back {teamName} in the 2026 FIFA World Cup and unlock miracle protection.',
        description:
            'Join the World Cup event and crown your passion!\nIf {teamName} wins, we’ll refund a percentage of your net losses during the tournament.',
        validityLabel: 'Event Period',
    },
    cta: {
        joinNow: 'Join Now',
        deposit: 'Deposit',
        viewSports: 'Go to Sports',
        goToBet: 'Go to bet',
        joined: 'Joined',
        loginToJoin: 'Log in to Join',
    },
    rewards: {
        title: 'Rewards',
        subtitle: 'Loss compensation is issued as a sports bonus after settlement.',
        compensation: {
            title: 'Loss Compensation',
            value: 'Cashback bonus',
            description: 'Eligible net losses are converted into a bonus according to the promotion rules.',
        },
        minimumLoss: {
            title: 'Minimum Net Loss',
            value: '{minimumNetLoss} {currency}',
            description: 'Net losses < {minimumNetLoss} {currency} are not eligible for cashback.',
        },
        wagering: {
            title: 'Wagering Requirement',
            value: '10x',
            description: 'Issued bonuses must meet a 10x wagering requirement before withdrawal.',
        },
    },
    calculation: {
        title: 'Fair and Transparent Calculation System',
        claimRecords: {
            title: 'Claim Records',
            netLossRange: 'Net Loss Range',
            cashbackRate: 'Cashback Rate',
            rows: {
                loss0_1000: { range: '0 – 1,000', rate: '60%' },
                loss1001_5000: { range: '1,001 – 5,000', rate: '50%', rateTooltip: 'Excess only' },
                loss5001_20000: { range: '5,001 – 20,000', rate: '40%', rateTooltip: 'Excess only' },
                loss20001Plus: {
                    range: '> 20,000',
                    rate: '30%',
                    rateTooltip: 'Cap: {maximumPayout} {currency} · Excess only',
                },
            },
        },
        oddsWeighting: {
            title: 'Odds Weighting Rules',
            oddsRange: 'Odds Range',
            contributionRate: 'Contribution Rate',
            rows: {
                under1_2: { range: '≤ 1.2', rate: '0%' },
                r1_2_1_5: { range: '1.2 – 1.5 (=1.5)', rate: '10%' },
                r1_5_2_5: { range: '1.5 – 2.5 (=2.5)', rate: '30%' },
                r2_5Plus: { range: '> 2.5', rate: '50%' },
            },
        },
    },
    steps: {
        title: 'How to Get Cashback?',
        subtitle: 'Lock in Your Miracle Protection in Just 3 Steps',
        signUp: {
            title: 'Sign Up',
            description:
                'Click the "Join Now" button to activate your Champion Protection instantly.\nOnly bets placed after signing up will qualify.',
        },
        bet: {
            title: 'Bet on the World Cup',
            description:
                'Place real-money bets during the 2026 FIFA World Cup and immerse yourself in the excitement of every match.',
        },
        cashback: {
            title: 'Unlock the Miracle Cashback',
            description:
                'If {teamName} wins the championship, the system will automatically calculate your net losses and refund a percentage as a bonus.',
        },
    },
    terms: {
        title: 'Terms',
        termsAndConditions: {
            title: 'Terms & Conditions',
            registration: {
                title: 'Registration is required to participate.',
                description:
                    'Click the "Join Now" button to enter the promotion. Only bets placed after your first bet following registration will be counted toward the calculation of net losses.',
            },
            matches: {
                title: 'Only valid for 2026 FIFA World Cup official matches.',
                description: 'Only settled bets on World Cup markets during the promotion period will be considered.',
            },
            settlement: {
                title: 'Final settlement condition.',
                description:
                    'After the 2026 FIFA World Cup Final concludes, if {teamName} wins the championship, the system will automatically calculate your net losses. In case of match postponement or cancellation, the settlement will be delayed accordingly.',
            },
            eligibleBets: {
                title: 'Eligible bets criteria.',
                description:
                    'Only settled real-money World Cup bets placed during the promotion period are counted. The following will not be included: canceled, voided, refunded, or invalid bets, as well as Free Bets, Bonus Bets, and voucher bets. Cash Out bets will be calculated based on the actual payout amount.',
            },
            netLoss: {
                title: 'Net loss calculation rules.',
                description:
                    'Net losses ≤ {minimumNetLoss} {currency} are not eligible for cashback. Net loss is calculated based on the stake amount adjusted by odds weighting.',
            },
            minimumBets: {
                title: 'The user must have at least 1 bet related to {teamName}.',
            },
        },
        rewardTerms: {
            title: 'Reward Terms',
            compensation: {
                title: 'Compensation Method',
                description: 'Rewards are issued as loss compensation bonuses.',
            },
            deadline: {
                title: 'Reward Distribution Deadline',
                description: 'Bonuses will be issued no later than {deadline}.',
            },
            wagering: {
                title: 'Wagering Requirement',
                description:
                    'Bonuses are subject to a 10x wagering requirement before withdrawal.\nA minimum net loss of ≥ {minimumNetLoss} {currency} is required to qualify.\nIf the net loss is < {minimumNetLoss} {currency}, no refund will be issued either.',
            },
            odds: {
                title: 'Bonus Betting Odds Requirement',
                description: 'Bets placed using bonus funds must have minimum odds of 1.6',
            },
            hedging: {
                title: 'No Hedging Allowed',
                description: 'Bonus funds cannot be used for hedging bets on the same market.',
            },
            validity: {
                title: 'Usage Scope & Validity',
                description: 'Bonuses are valid for sports betting only and must be used within 14 days.',
            },
            cap: {
                title: 'Claim Requirement & Cap',
                description:
                    'Bonuses must be claimed on this page. The bonus amount is capped at ≤ 30% of the user’s total deposits.',
            },
            platformLimit: {
                title: 'Platform Payout Limits',
                description:
                    'Platform total payout limit: {platformTotalPayout} {currency}\nMaximum payout per user: {maximumPayout} {currency}',
            },
            betRestriction: {
                title: 'Bet Type Restriction',
                description:
                    'Only single bets and double bets (2-fold) are eligible for this promotion. Champion market bets do not participate in this activity.',
            },
            oddsAbuse: {
                title: 'Abnormal Betting',
                description:
                    'The platform reserves the right to reduce the cashback proportion for bets with abnormally low odds, and to reassess effective losses and final reward eligibility in cases of irregular betting, arbitrage, low-risk hedging bets, or any non-natural gaming behavior.',
            },
        },
        importantTerms: {
            title: 'Important Terms',
            eligibility: {
                title: 'Eligibility Restrictions',
                description:
                    'Each CPF, account, device, IP address, bank account, and email address may participate only once.',
            },
            personalUse: {
                title: 'Personal Use Only',
                description:
                    'Bonuses are for personal use only and may not be transferred, gifted, or resold. GOTOBET reserves the right to monitor all betting activities. Please participate responsibly.',
            },
            compliance: {
                title: 'Fair Play & Compliance',
                description:
                    'All bets must comply with fair gaming standards. GOTOBET will review any suspicious activity in accordance with its Anti-Money Laundering (AML) and Anti-Fraud policies.',
            },
            acceptance: {
                title: 'Acceptance of Terms',
                description:
                    'Participation constitutes acceptance of the platform’s General Terms & Conditions and Privacy Policy. Any violation may result in the cancellation of rewards and account suspension.',
            },
            maximumPrize: {
                title: 'Maximum Prize Trigger',
                description:
                    'The maximum reward tier will be automatically activated once the participation threshold set by the platform is reached.',
            },
            abuse: {
                title: 'Abuse & Arbitrage',
                description:
                    'Any fraudulent behavior or bonus abuse/arbitrage may result in review, adjustment of rewards, cancellation of bonuses, and further disciplinary action at the platform’s discretion.',
            },
            finalRights: {
                title: 'Final Rights & Amendments',
                description:
                    'GOTOBET reserves the right of final interpretation of this promotion. The platform may modify, suspend, or terminate this promotion at any time due to legal, regulatory, or technical reasons without prior notice.',
            },
        },
        safetyNotice: {
            title: 'Safety Notice',
            item0: 'Under 18s are strictly prohibited from participating in any gambling activities.',
            item1: 'Gambling can be addictive. Please play responsibly.',
            item2: 'This promotion does not guarantee profit.',
            item3: 'All bets involve financial risk. If you need assistance, please contact customer support.',
        },
    },
};
