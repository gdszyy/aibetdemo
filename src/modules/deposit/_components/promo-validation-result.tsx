'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { RechargeCodeErrorCode, type RechargeCodeValidationResult } from '@/api/models/recharge-code';
import { EmojiHappy, EmojiNeutral, EmojiSad } from '@/components/icons';
import { useCurrencySymbol } from '@/hooks/use-wallet';
import { useAmount } from '@/modules/marketing/promotion/_utils/useAmount';
import { cn } from '@/utils/common';

/** Strategy pattern: visual config for each validation state */
// Map backend error codes and "success" to display styles
type ValidationStyle = {
    bg: string;
    labelColor: string;
    messageColor: string;
    icon: FC<{ className?: string }>;
};

type ValidationPresenterContext = {
    validation: RechargeCodeValidationResult;
    t: ReturnType<typeof useTranslations>;
    formatCompactAmount: (value: number) => string;
    currencySymbol?: string;
};

type ValidationContentStrategy = {
    getPrimaryText: (context: ValidationPresenterContext) => string | undefined;
    getSecondaryText?: (context: ValidationPresenterContext) => string | undefined;
    showCodeBadge?: boolean;
};

const VALIDATION_STYLES: Record<number, ValidationStyle> = {
    [RechargeCodeErrorCode.SUCCESS]: {
        bg: 'bg-status-success-surface',
        labelColor: 'text-status-success-text',
        messageColor: 'text-filltext-ft-f',
        icon: EmojiHappy,
    },
    [RechargeCodeErrorCode.AMOUNT_LOW]: {
        bg: 'bg-status-danger-surface',
        labelColor: 'text-status-danger-text',
        messageColor: 'text-func-lost',
        icon: EmojiSad,
    },
    [RechargeCodeErrorCode.ORDER_CONFLICT]: {
        bg: 'bg-status-danger-surface',
        labelColor: 'text-status-danger-text',
        messageColor: 'text-func-lost',
        icon: EmojiNeutral,
    },
    [RechargeCodeErrorCode.ALREADY_USED]: {
        bg: 'bg-status-danger-surface',
        labelColor: 'text-status-danger-text',
        messageColor: 'text-func-lost',
        icon: EmojiSad,
    },
    [RechargeCodeErrorCode.INVALID_CODE]: {
        bg: 'bg-status-danger-surface',
        labelColor: 'text-status-danger-text',
        messageColor: 'text-func-lost',
        icon: EmojiSad,
    },
    [RechargeCodeErrorCode.TIMEOUT]: {
        bg: 'bg-status-danger-surface',
        labelColor: 'text-status-danger-text',
        messageColor: 'text-func-lost',
        icon: EmojiSad,
    },
    [RechargeCodeErrorCode.SYSTEM_ERROR]: {
        bg: 'bg-status-danger-surface',
        labelColor: 'text-status-danger-text',
        messageColor: 'text-func-lost',
        icon: EmojiSad,
    },
    [RechargeCodeErrorCode.INVALID_PARAMS]: {
        bg: 'bg-status-danger-surface',
        labelColor: 'text-status-danger-text',
        messageColor: 'text-func-lost',
        icon: EmojiSad,
    },
};

interface PromoValidationResultProps {
    validation: RechargeCodeValidationResult;
}

const DEFAULT_VALIDATION_CONTENT_STRATEGY: ValidationContentStrategy = {
    getPrimaryText: ({ validation, t }) => validation.message ?? t('invalidCode'),
    showCodeBadge: false,
};

const VALIDATION_CONTENT_STRATEGIES: Partial<Record<number, ValidationContentStrategy>> = {
    [RechargeCodeErrorCode.SUCCESS]: {
        getPrimaryText: ({ validation, t, formatCompactAmount }) =>
            t('codeApplied', {
                bonus_amount: validation.bonus_amount != null ? formatCompactAmount(validation.bonus_amount) : '--',
                turnover_requirement:
                    validation.turnover_requirement != null
                        ? formatCompactAmount(validation.turnover_requirement)
                        : '--',
            }),
        showCodeBadge: true,
    },
    [RechargeCodeErrorCode.AMOUNT_LOW]: {
        getPrimaryText: ({ validation, t, currencySymbol }) =>
            t('amountRange', {
                min: validation.min_deposit ?? '--',
                max: validation.max_deposit ?? '--',
                currencySymbol: currencySymbol || '',
            }),
        showCodeBadge: true,
    },
    [RechargeCodeErrorCode.ORDER_CONFLICT]: {
        getPrimaryText: ({ t }) => t('orderConflict'),
        showCodeBadge: true,
    },
    [RechargeCodeErrorCode.ALREADY_USED]: {
        getPrimaryText: ({ t }) => t('alreadyUsed'),
        showCodeBadge: true,
    },
    [RechargeCodeErrorCode.INVALID_CODE]: {
        getPrimaryText: ({ t }) => t('invalidCode'),
        showCodeBadge: false,
    },
    [RechargeCodeErrorCode.INVALID_PARAMS]: {
        getPrimaryText: ({ validation, t }) => validation.message ?? t('invalidCode'),
        showCodeBadge: false,
    },
    [RechargeCodeErrorCode.SYSTEM_ERROR]: {
        getPrimaryText: ({ validation, t }) => validation.message ?? t('invalidCode'),
        showCodeBadge: false,
    },
    [RechargeCodeErrorCode.TIMEOUT]: {
        getPrimaryText: ({ validation, t }) => validation.message ?? t('invalidCode'),
        showCodeBadge: false,
    },
};

export const PromoValidationResult: FC<PromoValidationResultProps> = ({ validation }) => {
    const t = useTranslations('deposit.promoCode');
    const stateKey = validation.code ?? RechargeCodeErrorCode.INVALID_CODE;
    const style = VALIDATION_STYLES[stateKey ?? RechargeCodeErrorCode.INVALID_CODE];
    const Icon = style.icon;
    const contentStrategy = VALIDATION_CONTENT_STRATEGIES[stateKey] ?? DEFAULT_VALIDATION_CONTENT_STRATEGY;

    const formatAmount = useAmount();

    const currencySymbol = useCurrencySymbol();

    const presenterContext = { validation, t, formatCompactAmount: formatAmount, currencySymbol };
    const primaryText = contentStrategy.getPrimaryText(presenterContext);
    const secondaryText = contentStrategy.getSecondaryText?.(presenterContext);
    const showCodeBadge = Boolean(validation.promo_code) && contentStrategy.showCodeBadge !== false;

    return (
        <div className={cn('flex items-start justify-between gap-2 rounded-sm p-2', style.bg)}>
            <div className="flex min-w-0 flex-1 items-start gap-1.5">
                <Icon className={cn('mt-0.5 size-3.5 shrink-0', style.labelColor)} />
                <div className="min-w-0 flex-1">
                    {primaryText && (
                        <div className={cn('text-auxiliary-md leading-4', style.labelColor)}>{primaryText}</div>
                    )}
                    {secondaryText && (
                        <div className={cn('mt-0.5 text-auxiliary-xs leading-4', style.messageColor)}>
                            {secondaryText}
                        </div>
                    )}
                </div>
            </div>

            {showCodeBadge && validation.promo_code && (
                <div className="flex shrink-0 items-center justify-center self-start rounded-xs bg-surface-1 px-1 py-0.5">
                    <span className="hidden whitespace-nowrap text-auxiliary-md leading-4 text-filltext-ft-e md:inline">
                        {t('code', { code: validation.promo_code })}
                    </span>
                    <div className="text-right text-auxiliary-md leading-4 text-filltext-ft-e md:hidden">
                        <div>{t('codeLabel')}</div>
                        <div>{validation.promo_code}</div>
                    </div>
                </div>
            )}
        </div>
    );
};
