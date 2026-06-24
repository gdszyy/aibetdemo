'use client';

import NumberFlow, { type Format } from '@number-flow/react';
import { useTranslations } from 'next-intl';
import type { FC, SVGProps } from 'react';
import { useMemo } from 'react';
import { Button } from '@/components/button/button';
import { ArrowRight, StackOfCoins, Trophy, Wallet2 } from '@/components/icons';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useRegionIntlLocale } from '@/i18nV2/store';
import { cn } from '@/utils/common';
import { BONUS_CARDS, type BonusCardConfig, FLOW_TIMING } from '../_constants/balance-overview';

// ─── Types ──────────────────────────────────────────────────────────

interface BalanceOverviewData {
    mainBalance: number;
    totalBuy: number;
    totalWin: number;
    sportBonus: number;
    casinoBonus: number;
    freeSport: number;
    freeSpin: number;
}

interface BalanceOverviewProps {
    data: BalanceOverviewData;
    onCardClick?: (type: string) => void;
    onDepositClick?: () => void;
}

// ─── Sub-components ─────────────────────────────────────────────────

/** Dark gradient hero card — main balance */
function BalanceHeroCard({
    balance,
    badgeLabel,
    symbol,
    numberFormat,
    depositLabel,
    onDepositClick,
}: {
    balance: number;
    badgeLabel: string;
    symbol: string;
    numberFormat: Format;
    depositLabel: string;
    onDepositClick?: () => void;
}) {
    const intlLocale = useRegionIntlLocale();

    return (
        <div className="relative flex flex-col justify-between overflow-hidden rounded-md p-6 h-[120px] md:h-[200px] bg-surface-shell">
            {/* Badge */}
            <div className="shrink-0">
                <span className="inline-block bg-filltext-ft-g text-neutral-white-h text-body-md px-4 py-1 rounded-tl-md rounded-br-md rounded-bl-xs rounded-tr-xs">
                    {badgeLabel}
                </span>
            </div>
            <Button
                type="button"
                className="absolute right-6 top-6 min-w-30 px-6 max-md:h-8 max-md:px-4 max-md:text-body-md"
                onClick={onDepositClick}
            >
                {depositLabel}
            </Button>

            {/* Amount — smaller grey symbol + animated number */}
            <span className="text-headline-lg text-content-primary flex items-baseline gap-1.5">
                <span className="text-headline-sm text-filltext-ft-f">{symbol}</span>
                <NumberFlow locales={intlLocale} value={balance} format={numberFormat} transformTiming={FLOW_TIMING} />
            </span>

            {/* Decorative watermark */}
            <div className="absolute -bottom-1 -right-5 pointer-events-none">
                <Wallet2 className="size-[140px]" />
            </div>
        </div>
    );
}

/** White stat card — Total Buy / Total Win */
function SummaryCard({
    label,
    value,
    labelColor,
    Icon,
    symbol,
    numberFormat,
    className,
}: {
    label: string;
    value: number;
    labelColor: string;
    Icon: FC<SVGProps<SVGSVGElement>>;
    symbol: string;
    numberFormat: Format;
    className?: string;
}) {
    const intlLocale = useRegionIntlLocale();

    return (
        <div
            className={cn(
                'relative flex flex-col overflow-clip rounded-md border border-filltext-ft-c bg-surface-1 p-4',
                className,
            )}
        >
            <div className="flex flex-col gap-2">
                <span className={cn('text-body-lg', labelColor)}>{label}</span>
                <span className="text-headline-md text-filltext-ft-h pl-0.5">
                    {/* // TODO 有bug，在手机自带浏览器上，货币符号覆盖了货币的值 */}
                    <NumberFlow
                        locales={intlLocale}
                        value={value}
                        format={numberFormat}
                        prefix={`${symbol} `}
                        transformTiming={FLOW_TIMING}
                    />
                </span>
            </div>

            {/* Decorative icon */}
            <div className="absolute bottom-2 right-2 pointer-events-none overflow-clip size-[60px]">
                <Icon className="size-full" />
            </div>
        </div>
    );
}

/** Bonus / free card — neutral default, category color on hover */
function BonusCard({
    config,
    label,
    value,
    numberFormat,
    symbol,
    onClick,
}: {
    config: BonusCardConfig;
    label: string;
    value: number;
    numberFormat: Format;
    symbol?: string;
    onClick?: () => void;
}) {
    const { SmallIcon, LargeIcon, hoverTextColor, hoverBorder, hoverShadow, hoverBadgeBg, hoverIconColor } = config;
    const intlLocale = useRegionIntlLocale();

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'group flex items-center justify-between overflow-clip rounded-md border border-filltext-ft-c bg-surface-1 px-6 py-4 cursor-pointer transition-all w-full text-left',
                hoverBorder,
                hoverShadow,
            )}
        >
            {/* Left: label + value */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {/* SmallIcon hidden by default, shown on hover */}
                        <SmallIcon
                            className={cn(
                                'size-3.5 shrink-0 text-filltext-ft-e hidden group-hover:block transition-all',
                                hoverIconColor,
                            )}
                        />
                        <span className={cn('text-body-lg text-filltext-ft-h transition-colors', hoverTextColor)}>
                            {label}
                        </span>
                    </div>
                    <ArrowRight className="size-3 text-filltext-ft-e" />
                </div>
                <span className="text-headline-md text-filltext-ft-h pl-0.5">
                    <NumberFlow
                        locales={intlLocale}
                        value={value}
                        format={numberFormat}
                        prefix={symbol ? `${symbol} ` : undefined}
                        transformTiming={FLOW_TIMING}
                    />
                </span>
            </div>

            {/* Right: icon badge — default neutral, hover category color */}
            <div
                className={cn(
                    'size-[58px] shrink-0 rounded-sm p-2 flex items-center justify-center bg-filltext-ft-a transition-all',
                    hoverBadgeBg,
                )}
            >
                <LargeIcon
                    className={cn('size-6 group-hover:size-7 text-filltext-ft-e transition-all', hoverIconColor)}
                />
            </div>
        </button>
    );
}

// ─── Main component ─────────────────────────────────────────────────

/** Balance tab — card grid overview of all wallet balances */
export const BalanceOverview: FC<BalanceOverviewProps> = ({ data, onCardClick, onDepositClick }) => {
    const t = useTranslations('transaction');
    const tUser = useTranslations('user');
    const { currencySymbolNarrow } = useIntlFormatter();

    const symbol = currencySymbolNarrow;
    const decimalFormat: Format = useMemo(
        () => ({ minimumFractionDigits: 2, maximumFractionDigits: 2, roundingMode: 'trunc' as const }),
        [],
    );
    const integerFormat: Format = useMemo(() => ({ maximumFractionDigits: 0 }), []);

    const valueMap: Record<string, number> = useMemo(
        () => ({
            sportBonus: data.sportBonus,
            casinoBonus: data.casinoBonus,
            freeSport: data.freeSport,
            freeSpin: data.freeSpin,
        }),
        [data.sportBonus, data.casinoBonus, data.freeSport, data.freeSpin],
    );

    return (
        <div className="flex flex-col gap-4 overflow-y-auto flex-1 overflow-y-auto">
            {/* Row 1: Balance hero + Total Buy + Total Win */}
            <div className="flex flex-wrap gap-4">
                <div className="flex-[2_1_300px]">
                    <BalanceHeroCard
                        balance={data.mainBalance}
                        badgeLabel={t('tabsBalance')}
                        symbol={symbol}
                        numberFormat={decimalFormat}
                        depositLabel={tUser('menus.deposit')}
                        onDepositClick={onDepositClick}
                    />
                </div>
                <SummaryCard
                    label={t('totalBet')}
                    value={data.totalBuy}
                    labelColor="text-brand-primary-0"
                    Icon={StackOfCoins}
                    symbol={symbol}
                    numberFormat={decimalFormat}
                    className="flex-[1_1_200px]"
                />
                <SummaryCard
                    label={t('totalWin')}
                    value={data.totalWin}
                    labelColor="text-func-win"
                    Icon={Trophy}
                    symbol={symbol}
                    numberFormat={decimalFormat}
                    className="flex-[1_1_200px]"
                />
            </div>

            {/* Row 2: Sport Bonus + Casino Bonus */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                {BONUS_CARDS.slice(0, 2).map((config) => (
                    <BonusCard
                        key={config.key}
                        config={config}
                        label={t(config.labelKey)}
                        value={valueMap[config.key]}
                        numberFormat={config.isCurrency ? decimalFormat : integerFormat}
                        symbol={config.isCurrency ? symbol : undefined}
                        onClick={() => onCardClick?.(config.key)}
                    />
                ))}
            </div>

            {/* Row 3: Free Sport + Free Spin */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                {BONUS_CARDS.slice(2, 4).map((config) => (
                    <BonusCard
                        key={config.key}
                        config={config}
                        label={t(config.labelKey)}
                        value={valueMap[config.key]}
                        numberFormat={config.isCurrency ? decimalFormat : integerFormat}
                        symbol={config.isCurrency ? symbol : undefined}
                        onClick={() => onCardClick?.(config.key)}
                    />
                ))}
            </div>
        </div>
    );
};
