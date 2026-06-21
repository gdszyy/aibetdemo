export default {
    hero: {
        // title: 'The FIFA World Cup 2026™ Pass',
        subtitlePrefix: 'Exclusive Rewards & Bonuses, Win up to',
        subtitleAmount: '{amount}',
    },
    level: {
        current: 'Current',
        weeklyLimit: 'Weekly Limit',
        weeklyLimitRemoved: 'From {time}, the weekly experience cap will be removed.',
    },
    progress: {
        title: 'Rewards Track',
        claimAll: 'CLAIM ALL',
        rewards: 'REWARDS',
        freePass: 'FREE PASS',
        premiumPass: 'PREMIUM PASS',
        backToCurrentLevel: 'Back to Current Level',
    },
    claimSuccess: {
        title: 'REWARDS COLLECTED!',
        description: 'SUCCESSFULLY ADDED TO YOUR WALLET',
        levelReward: 'LV{level} Reward',
        rewardValue: '{amount} {type}{count, plural, =1 {} other { x{count}}}',
        confirm: 'Confirm',
    },
    eventEnded: {
        title: 'EVENT ENDED',
        description:
            "We're sorry, this event has already concluded. Please stay tuned for our next exciting promotion!",
        confirm: 'OKAY, UNDERSTOOD',
    },
    eventNotStarted: {
        title: 'Promotion Unavailable',
        description:
            "This promotion isn't available right now.\nExplore our other promotions to find one that's right for you.",
        confirm: 'OKAY, UNDERSTOOD',
    },
    unlock: {
        title: 'Upgrade to Premium',
        description: 'Unlock exclusive bonuses, higher limits, and premium rewards.',
        unlockFor: 'UNLOCK FOR',
        unlockPremium: 'UNLOCK PREMIUM',
        modalDescription:
            'Unlock <highlight>The Premium Pass</highlight> and start claiming exclusive rewards immediately.',
        currentBalance: 'CURRENT BALANCE',
        payNow: 'PAY {amount} NOW',
        processingPayment: 'Processing payment...',
        successTitle: 'Purchase Successful!',
        successDescription: 'Congratulations! You have successfully unlocked <highlight>The Premium Pass</highlight>.',
        startClaimingRewards: 'START CLAIMING REWARDS',
        insufficientBalancePrompt: 'INSUFFICIENT BALANCE?',
        depositHere: 'DEPOSIT HERE',
        insufficientBalanceHint: 'INSUFFICIENT BALANCE? DEPOSIT HERE',
        insufficientBalanceTitle: 'Insufficient Funds',
        depositToUnlock: 'DEPOSIT TO UNLOCK',
    },
    missions: {
        title: 'Missions',
        dailyTitle: 'Daily Missions',
        weeklyTitle: 'Weekly Missions',
        fallbackDailyTitle: 'Daily Mission #{missionType}',
        fallbackWeeklyTitle: 'Weekly Mission #{missionType}',
        fallbackCondition: 'Condition: {condition}',
        units: {
            bets: 'Bets',
            times: 'Times',
            days: 'Days',
        },
        daily: {
            completeSportsBet: {
                title: 'Complete 1 Sports Bet',
                description: 'Single bet ≥ {amount}',
            },
            sportsTurnover: {
                title: 'Daily Sports Turnover',
                description: 'Daily valid sports turnover ≥ {amount}',
            },
            highTurnoverBonus: {
                title: 'High Daily Turnover Bonus',
                description: 'Daily valid sports turnover ≥ {amount}',
            },
            login: {
                title: 'Daily Login',
                description: 'Log in daily',
            },
            betsTarget: {
                title: 'Daily Bets Target',
                description: 'Daily sports bets ≥ {count}',
            },
            depositTarget: {
                title: 'Daily Deposit Target',
                description: 'Daily deposit ≥ {amount}',
            },
        },
        weekly: {
            turnover: {
                title: 'Weekly Turnover',
                description: 'Weekly valid sports turnover ≥ {amount}',
            },
            betsTarget: {
                title: 'Weekly Bets Target',
                description: 'Weekly sports bets ≥ {count}',
            },
            consecutiveDailyTasks: {
                title: 'Consecutive Daily Tasks',
                description: 'Complete all daily tasks for ≥ {count} days',
            },
            consecutiveBettingDays: {
                title: 'Consecutive Betting Days',
                description: 'Bet for ≥ {days} days & valid daily turnover ≥ {amount}',
            },
            consecutiveLogins: {
                title: 'Consecutive Logins',
                description: 'Login for ≥ {count} days',
            },
            depositTarget1: {
                title: 'Weekly Deposit Target I',
                description: 'Weekly deposit ≥ {amount}',
            },
            depositTarget2: {
                title: 'Weekly Deposit Target II',
                description: 'Weekly deposit ≥ {amount}',
            },
        },
    },
    rules: {
        title: 'Rules & Info',
        sections: {
            guidelines: {
                title: 'Event Guidelines',
                item1: 'Purchasing the Premium Pass unlocks the premium reward track. Complete tasks to earn EXP, level up your pass, and unlock rewards for each level.',
                item2: 'EXP required per level: 200 EXP',
                item3: 'Total EXP required for max level (Level 50): 10,000 EXP',
                item4: 'Maximum weekly EXP limit: 2,000 EXP',
                item5: 'Starting from the 5th week of the event, the weekly EXP limit will be lifted.',
                // item6: 'After reaching the max level, Premium users can claim a {amount} Bonus for every additional level up, up to Level 100.',
                // item7: 'The Premium Pass costs {amount} and can be purchased via deposit or balance deduction.',
                item8: 'This event is only open to users with ≥ 1 historical bet.',
                item9: 'Tasks will be automatically calculated from the start of the event. Irregular betting will result in disqualification.',
            },
            rewardDetails: {
                title: 'Reward Details',
                item1: 'Sport Bonus is for sports betting only, can be used once, valid for 7 days, and cannot be withdrawn directly. Odds must be ≥ 1.60x and ≤ 2.5. Settled sports bets count towards turnover; unsettled bets do not. Only cash bets are counted; Free Sport wagers do not count towards turnover.',
                item2: 'Free Spin is limited to specified games only. Free Spin wagers do not count towards turnover, can be used once, valid for 7 days, and cannot be withdrawn directly.',
                item3: 'Claimed Bonus rewards require a 5x turnover before withdrawal, are limited to sports betting only, and are valid for 7 days.',
                item4: 'All rewards for this event must be manually claimed by the user on the event page. Any unclaimed rewards will be reclaimed by the platform after the event ends. Please check your inventory before the event concludes.',
            },
            importantTerms: {
                title: 'Important Terms',
                item1: 'Each {identityDocument}, account, device, IP, bank account, and email can only participate once.',
                item2: 'Bonuses are for personal use only and are strictly prohibited from being transferred, gifted, or resold. GOTO.BET will continuously monitor betting behavior; please participate rationally.',
                item3: 'Please standardize your betting. GOTO.BET will review abnormal betting behaviors in accordance with anti-money laundering and anti-fraud policies. Please play reasonably.',
                item4: 'Participation implies agreement with the platform\'s "General Terms and Conditions" and Privacy Policy. If the "General Terms and Conditions" are violated, GOTO.BET may revoke all rewards and freeze the account.',
                item5: "Reaching the platform's target number of participants will automatically trigger the maximum prize.",
                item6: 'For any violations aimed at malicious arbitrage, the platform reserves the right to review and adjust the event based on actual circumstances, revoke issued rewards, and strictly handle the violations.',
                item7: 'The platform reserves the right of final interpretation for this event. Due to legal, regulatory, or technical reasons, GOTO.BET may modify, suspend, or terminate this event without prior notice.',
            },
            safetyStatement: {
                title: 'Safety Statement',
                item1: 'Participation in gambling activities is prohibited for individuals under 18 years old.',
                item2: 'Gambling can be addictive; please bet rationally.',
                item3: 'This event does not guarantee profit. All bets involve financial risk; please participate in moderation.',
            },
        },
    },
    rewardCard: {
        claimed: 'Claimed',
        claimable: 'Claimable',
        locked: 'Locked',
        gear: 'Reward',
        premiumGear: 'Premium reward',
        rewardTypes: {
            cash: 'CASH',
            sportBonus: 'SPORT BONUS',
            freeSport: 'FREE SPORT',
            casinoBonus: 'CASINO BONUS',
            freeSpin: 'FREESPIN',
        },
    },
};
