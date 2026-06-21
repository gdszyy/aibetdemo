/** Deposit */
export default {
    title: 'Deposit',
    subTitle: 'Add funds to your account',
    channelLabel: 'Deposit Channel',
    channelMaintenance: 'Channel under maintenance',
    amountLabel: 'Amount',
    inputPlaceholder: '{currency} {min}-{max}',
    inputEmptyError: 'Please enter the payment amount',
    inputInvalidError: 'Deposit Limit: {min}~{max}',
    agreement:
        'I authorize saving my bank account details for future transactions after this transaction is completed.',
    agreementError: 'Please agree to the Deposit and Withdrawal Agreement before proceeding.',

    confirmBtnText: 'Confirm',

    depositPendingToast: 'Order successful. Processing deposit.',
    depositSuccessToast: 'Success! Please check your balance.',
    depositFailedToast: 'Failed! Please check the details and try again.',
    modal: {
        payWithMethod: 'Pay with {method}',
        paymentFrameTitle: 'Deposit payment page',
        processingPayment: 'Processing payment. We will update your balance after confirmation.',
        cancel: 'Cancel',
    },
    infoPanel: {
        availableMethods: 'Available Deposit Methods',
        questionsTitle: 'Deposit Questions',
    },

    promoCode: {
        placeholder: 'Enter Promo Code (Optional)',
        codeApplied:
            'Code applied. Bonus Amount: {bonus_amount}. Turnover Requirement: {turnover_requirement}. Minimum odds ≥ 1.6.',
        amountRange: 'Requirements not met. Valid on deposits of {min}-{max} {currencySymbol}.',
        orderConflict: 'Requirements not met. Please use the First, Second, and Third Deposit coupons in order.',
        alreadyUsed: 'Already Used.',
        invalidCode: 'Invalid code.',
        code: 'Code: {code}',
        codeLabel: 'Code',
    },
};
