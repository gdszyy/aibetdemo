import type { FunctionComponent } from 'react';
import { useCurrencyCode } from '@/hooks/use-wallet';
import type { CurrencyCode } from '@/i18nV2';
import { useRegionIntlLocale } from '@/i18nV2/store';
import { cn } from '@/utils/common';

interface Props {
    variant?: 'small' | 'medium' | 'compact';
    reward: number;
    currencyCode?: CurrencyCode;
    intlLocale?: string;
    className?: string;
    arrowClassName?: string;
}

const Main: FunctionComponent<Props> = ({
    variant = 'medium',
    reward,
    currencyCode: originCurrencyCode,
    intlLocale: originIntlLocale,
    className,
    arrowClassName,
}) => {
    const globalIntlLocale = useRegionIntlLocale();
    const globalCurrencyCode = useCurrencyCode();
    const intlLocale = originIntlLocale || globalIntlLocale;
    const currencyCode = originCurrencyCode || globalCurrencyCode;

    const parts = new Intl.NumberFormat(intlLocale, {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
        roundingMode: 'trunc',
    }).formatToParts(reward);

    const symbol = parts
        .filter((p) => p.type === 'currency')
        .map((p) => p.value)
        .join('');
    const number = parts
        .filter((p) => p.type !== 'currency' && p.type !== 'literal')
        .map((p) => p.value)
        .join('');

    const isSmall = variant === 'small';
    const isMedium = variant === 'medium';
    const isCompact = variant === 'compact';

    return (
        <div
            className={cn(
                'pointer-events-none rounded-xs px-1 inline-flex items-center justify-center bg-auxiliary-blue',
                isCompact ? 'h-3.5' : 'h-4',
                'absolute',
                className,
            )}
        >
            <span className={cn('text-neutral-white-h', isCompact ? 'text-auxiliary-xxs' : 'text-auxiliary-md')}>
                {symbol}+{number}
            </span>
            <svg
                className={cn(
                    'absolute right-2 bottom-0 translate-y-full text-auxiliary-blue w-2',
                    (isMedium || isCompact) && 'inline-block',
                    isSmall && 'hidden',
                    isCompact && 'h-1',
                    arrowClassName,
                )}
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                viewBox="0 0 8 6"
                fill="none"
            >
                <path
                    d="M3.16795 4.75192C3.56377 5.34566 4.43623 5.34566 4.83205 4.75192L8 0H0L3.16795 4.75192Z"
                    fill="currentColor"
                />
            </svg>
        </div>
    );
};

/** 充值奖励角标 */
export const DepositReward: FunctionComponent<Props> = (props) => {
    if (!props.reward) {
        return null;
    }

    return <Main {...props} />;
};
