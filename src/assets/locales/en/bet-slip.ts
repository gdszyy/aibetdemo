/** Bet Slip Module */
export default {
    /** Tab Labels */
    tabs: {
        slip: 'Cart',
        open: 'Open',
        settled: 'Settled',
    },

    /** Mode */
    mode: {
        single: 'Singles',
        parlay: 'Parlay',
        tooltip:
            'Toggle between placing independent single bets or combining them into a parlay/multi for higher potential returns.',
    },

    /** Buttons */
    button: {
        placeBet: 'Place Bet',
        deposit: 'Top up',
        goDeposit: 'Go to deposit',
        cancel: 'Cancel',
        clearAll: 'Clear all',
        remove: 'Remove Bet',
        clearException: 'Clear Exception',
    },

    banner: {
        insufficientBalance: 'Insufficient balance - <amount></amount> short',
    },

    modal: {
        title: 'Insufficient balance',
        currentBalance: 'Current balance',
        body: 'This bet is {total}.<br></br>You need {difference} more to place it.',
    },

    /** Labels */
    label: {
        toReturn: 'To Return',
        betOnAll: 'Bet on All',
        totalStake: 'Total Stake',
        payout: 'Payout',
        noSelections: 'Betslip is Empty',
        noOpenBets: 'No open bets',
        noSettledBets: 'No settled bets',
    },

    /** Mobile sticky summary */
    summary: {
        odds: 'ODDS',
        stake: 'STAKE',
        potentialWin: 'POTENTIAL WIN',
    },

    /** Settings Panel */
    settings: {
        title: 'Cart Setting',
        oddsChange: 'Odds Changes',
        showMoreOptions: 'Show More Options',
        oddsFormat: 'Odds Format',
        quickBuyAmountConfiguration: 'Quick Buy Amount Configuration',
        amountConfigHints: {
            quickBuy: 'Add stake to the slip',
        },
        /** Odds Change Policy */
        oddsPolicy: {
            acceptAll: 'Automatically accept all odds changes',
            acceptHigher: 'Only accept better odds',
            acceptNone: 'Do not accept any odds changes',
            /** Hints */
            hints: {
                acceptAll:
                    'Automatically accepts any changes (higher or lower) to the odds during the placement process to ensure the fastest possible bet confirmation.',
                acceptHigher:
                    'The system will automatically proceed if the odds improve in your favor. If the odds drop, you will be asked to review and confirm before the bet is placed.',
                acceptNone:
                    'Provides total control by requiring you to manually re-confirm your bet if the odds change by any amount during the placement process.',
            },
        },
        /** Odds Format */
        format: {
            decimal: 'Decimal',
            american: 'American',
            fractional: 'Fractional',
        },
    },

    guide: {
        quickBuy: {
            tooltip: 'Set your favorite stakes here to apply them to all slips at once.',
            cta: 'Set Defaults',
        },
        betOnAll: {
            tooltip: 'Tap to stake! Customise these buttons to add your preferred amounts quickly.',
            cta: 'Customize',
        },
    },

    /** Parlay boost progress */
    parlayBoost: {
        unlock: {
            prefix: 'Just',
            middle: ' more {count, plural, one {bet} other {bets}} to go to unlock a',
            suffix: 'boost!',
        },
        nextTier: {
            prefix: 'Just',
            middle: ' more {count, plural, one {bet} other {bets}} to go to unlock a',
            suffix: 'boost!',
        },
        maxTier: {
            prefix: 'Max boost',
            suffix: 'unlocked!',
        },
        minOdds: 'Min odds: {odds}',
        rules: 'A parlay of {minLegs}-{maxLegs} bets, all in scope, all winning unlocks extra boost. Each bet odds must be at least {minOdds}.',
        payoutCapTooltip: 'Max extra payout: {cap}',
        payoutCapSheetClose: 'Close',
    },

    /** Messages */
    message: {
        insufficientBalance: 'Insufficient balance for this bet.',
        bettingUnavailable: 'Betting is temporarily unavailable. Please try again later.',
        waitOrderComplete: 'Please wait for the current order to complete.',
        invalidStake: 'Please enter a valid stake amount.',
        orderPlacedSuccessfully: 'Order placed successfully',
        orderRejected: 'Order rejected',
        minParlaySelections: 'Select at least 2 outcomes for a parlay bet.',
        gotoSetting: 'Go to Settings',
    },

    toast: {
        removed_single: 'Removed {part}',
        removed_two: 'Removed {part1} and {part2}',
        removed_three: 'Removed {part1}, {part2}, and {part3}',
        conflicts_plural: '{count, plural, one {{count} Conflict} other {{count} Conflicts}}',
        locked_plural: '{count, plural, one {{count} Locked} other {{count} Locked}}',
        invalid_plural: '{count, plural, one {{count} Invalid} other {{count} Invalid}}',
        inactive_plural: '{count, plural, one {{count} Inactive} other {{count} Inactive}}',
        non_compliant_plural: '{count, plural, one {{count} Non-compliant} other {{count} Non-compliant}}',
        tooManySelectionsWarning: 'Too many bets at once may result in rejection',
        maxSelectionsReached: 'Maximum {count} selections reached',
    },

    /** Ticket */
    ticket: {
        single: 'Single',
        accumulator: '{count}-Fold Accumulator',
        settledProgress: '{settled}/{total} settled',
        showMore: 'Show {count} more',
        showLess: 'Show less',
        settleTime: 'Settlement Time:',
        stake: 'Stake',
        payout: 'Payout',
        maxPayout: 'Max. Payout',
        status: {
            won: 'Won',
            lost: 'Lost',
            halfWon: 'Half Won',
            halfLost: 'Half Lost',
            pending: 'Pending',
            crediting: 'Crediting...',
            void: 'Void',
        },
    },
};
