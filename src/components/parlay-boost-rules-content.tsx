'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC, ReactNode } from 'react';
import { Fragment, useCallback } from 'react';
import type { ParlayBoostRule, ParlayBoostScopeRule } from '@/api/models/parlay-boost';
import parlayBoostHero from '@/assets/images/promotion/parlay-boost-modal-hero.png';
import { Arrow } from '@/components/Arrow';
import { AtOdds } from '@/components/icons';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useRegionConfig } from '@/i18nV2';
import { useRegionIntlLocale } from '@/i18nV2/store';
import type { TicketDisplayStatus } from '@/modules/bet-slip/ticket/ticket.types';
import { TicketLegStatusNode } from '@/modules/bet-slip/ticket/ticket-leg-status-node';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { formatDatetime } from '@/utils/intl-formatter';
import { formatOddsByFormat } from '@/utils/odds-format';
import {
    formatParlayBoostExcludedMarketsValue,
    formatParlayBoostMultiplier,
    formatParlayBoostPercent,
    getParlayBoostMaxLegs,
    getSortedParlayBoostLadder,
    isParlayBoostSelectionQualified,
    toParlayBoostNumber,
} from '@/utils/parlay-boost-preview';
import { buildParlayBoostContributionRows, type ParlayBoostRulesBetContext } from '@/utils/parlay-boost-rules-context';

type ParlayBoostRulesModalMode = 'bet' | 'activity';
type ParlayBoostRulesLayout = 'desktop' | 'mobile';

interface ParlayBoostRulesContentProps {
    /** bet：投注场景完整规则；activity：活动说明（不含投注贡献与 payout 计算） */
    mode?: ParlayBoostRulesModalMode;
    /** desktop：PC 弹窗间距；mobile：H5 sheet 间距与分隔线 */
    layout?: ParlayBoostRulesLayout;
    /** 后端活动规则，缺省时使用静态说明。 */
    rule?: ParlayBoostRule | null;
    /** 购物车实时数据；传入时 Contribution / Calculation 与档位高亮按当前合规腿数展示。 */
    betContext?: ParlayBoostRulesBetContext;
    /** 是否展示 Your bet's contribution 区块。 */
    showContributionSection?: boolean;
    /** 是否展示派彩计算区块（Open 注单列表关闭）。 */
    showPayoutCalculation?: boolean;
    /** 是否展示 Markets included in the boost 区块（Open 注单列表关闭）。 */
    showMarketsSection?: boolean;
    className?: string;
}

interface SectionProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

interface TierRowProps {
    legs: string;
    boost: string;
    hitLabel: string;
    active?: boolean;
}

interface MarketRowProps {
    label: string;
    value: string;
    variant?: 'default' | 'excluded';
}

interface ContributionRowProps {
    legStatus: TicketDisplayStatus;
    cardStatus?: TicketDisplayStatus;
    hasPendingSelection?: boolean;
    isQualifying: boolean;
    match: string;
    market: string;
    odds: string;
}

interface CalculationRowProps {
    label: string;
    value: string;
    /** 完整金额，与购物车 footer 一致用于 hover title */
    valueTitle?: string;
}

const TIER_KEYS = ['three', 'four', 'five', 'six'] as const;
const CALCULATION_ROWS = ['basePayout', 'hitTier', 'boostAmount', 'cap'] as const;
const MARKET_ROWS = ['marketTypes', 'minOdds', 'activityPeriod', 'excluded'] as const;

const getExcludedMarketsRowValue = (
    rule: ParlayBoostRule | null | undefined,
    t: ReturnType<typeof useTranslations<'common.parlayBoostModal'>>,
): string => {
    return formatParlayBoostExcludedMarketsValue(rule, {
        base: t('markets.rows.excluded.valueBase'),
        inPlay: t('markets.rows.excluded.inPlay'),
        preMatch: t('markets.rows.excluded.preMatch'),
    });
};

const formatRuleNumber = (value: string | number | undefined): string => {
    return toParlayBoostNumber(value)
        .toFixed(2)
        .replace(/\.?0+$/, '');
};

/** 活动期：沿用 formatDatetime 展示样式，时区与 Promotion List 一致（regionConfig.timezone）。 */
const useParlayBoostActivityPeriodFormat = (): ((date: Date) => string) => {
    const regionConfig = useRegionConfig();
    const locale = useRegionIntlLocale();

    return useCallback(
        (date: Date) => formatDatetime(date, locale, regionConfig?.timezone || 'UTC'),
        [locale, regionConfig?.timezone],
    );
};

/** 活动起止区间文案。 */
const formatRuleActivityPeriod = (rule: ParlayBoostRule, formatPeriod: (date: Date) => string): string => {
    return `${formatPeriod(new Date(rule.start_time * 1000))} - ${formatPeriod(new Date(rule.end_time * 1000))}`;
};

type ParlayBoostModalTranslate = ReturnType<typeof useTranslations<'common.parlayBoostModal'>>;

const getParlayBoostComboSubtitle = (
    rule: ParlayBoostRule | null | undefined,
    t: ParlayBoostModalTranslate,
    fallback: string,
): string => {
    const firstTier = rule ? getSortedParlayBoostLadder(rule)[0] : undefined;
    if (!rule || !firstTier) {
        return fallback;
    }

    return t('howItWorks.subtitleDynamic', { minLegs: firstTier.legs, maxLegs: getParlayBoostMaxLegs(rule) });
};

const getHowItWorksNote = (
    mode: ParlayBoostRulesModalMode,
    betContext: ParlayBoostRulesBetContext | undefined,
    t: ParlayBoostModalTranslate,
): string => {
    if (mode !== 'bet') {
        return t('howItWorks.activityNote');
    }
    if (!betContext) {
        return t('howItWorks.note');
    }

    const { preview, selections } = betContext;
    if (!preview.currentTier) {
        return t('howItWorks.noteNoTier');
    }

    const excludedLegs = betContext.fromOrderDetail
        ? selections.length - preview.qualifyingCount
        : selections.length - preview.qualifyingSelectionIds.size;
    if (excludedLegs > 0) {
        return t('howItWorks.noteDynamic', {
            excludedLegs,
            totalLegs: selections.length,
            countedLegs: preview.qualifyingCount,
        });
    }

    return t('howItWorks.activityNote');
};

const getRuleScopeRulesByMode = (
    rule: ParlayBoostRule | null | undefined,
    mode: ParlayBoostScopeRule['mode'],
): ParlayBoostScopeRule[] => {
    return rule?.scope_include.filter((scope) => scope.mode === mode) ?? [];
};

const getScopePart = (value: string | number | undefined): string => {
    return value == null ? '' : String(value).trim();
};

const getScopeCategoryId = (scope: ParlayBoostScopeRule): string => {
    return getScopePart(scope.category_id) || getScopePart(scope.region_id);
};

const getScopeTournamentId = (scope: ParlayBoostScopeRule): string => {
    return getScopePart(scope.tournament_id) || getScopePart(scope.league_id);
};

/** 将 scope 快照格式化为 Sport > Category > Tournament > Event。 */
const formatScopeBreadcrumb = (scope: ParlayBoostScopeRule, t: ParlayBoostModalTranslate): string => {
    const sportId = getScopePart(scope.sport_id);
    const categoryId = getScopeCategoryId(scope);
    const tournamentId = getScopeTournamentId(scope);
    const eventId = getScopePart(scope.event_id);
    const parts = [
        getScopePart(scope.sport_name) || (sportId ? t('scope.sportId', { sportId }) : ''),
        getScopePart(scope.category_name) || (categoryId ? t('scope.categoryId', { categoryId }) : ''),
        getScopePart(scope.tournament_name) || (tournamentId ? t('scope.tournamentId', { tournamentId }) : ''),
        getScopePart(scope.event_name) || (eventId ? t('scope.eventId', { eventId }) : ''),
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(' > ') : t('scope.all');
};

const getScopeBreadcrumbs = (scopeRules: ParlayBoostScopeRule[], t: ParlayBoostModalTranslate): string[] => {
    return Array.from(new Set(scopeRules.map((scope) => formatScopeBreadcrumb(scope, t))));
};

/** Figma 红色标题竖线 + 标题/副标题区块 */
const Section: FC<SectionProps> = ({ title, subtitle, children }) => (
    <section className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
                <span className="h-4 w-1 shrink-0 bg-brand-primary-0" />
                <h3 className="text-title-md text-filltext-ft-h">{title}</h3>
            </div>
            <p className="text-body-sm text-filltext-ft-f">{subtitle}</p>
        </div>
        {children}
    </section>
);

/** 手机端 sheet 大区块之间的分隔线 */
const RulesSectionDivider: FC = () => <div className="h-px w-full shrink-0 bg-filltext-ft-c opacity-50" />;

/** 档位行：默认灰底，命中档位红框红字 + Your hit 胶囊 */
const TierRow: FC<TierRowProps> = ({ legs, boost, hitLabel, active = false }) => (
    <div
        className={cn(
            'flex h-10 items-center gap-3 rounded-sm px-3 py-2',
            active ? 'border border-brand-primary-0 bg-brand-primary-1' : 'bg-filltext-ft-a',
        )}
    >
        <span
            className={cn(
                'min-w-[52px] shrink-0 whitespace-nowrap text-body-lg font-bold leading-[18px]',
                active ? 'text-brand-primary-0' : 'text-filltext-ft-h',
            )}
        >
            {legs}
        </span>
        <Arrow
            direction="right"
            className={cn('size-3.5 shrink-0', active ? 'text-brand-primary-0' : 'text-filltext-ft-g')}
        />
        <span
            className={cn(
                'shrink-0 whitespace-nowrap text-body-lg font-bold leading-[18px]',
                active ? 'text-brand-primary-0' : 'text-filltext-ft-h',
            )}
        >
            {boost}
        </span>
        {active && (
            <span className="ml-auto inline-flex h-5 min-w-14 shrink-0 items-center justify-center rounded-full bg-brand-primary-0 px-2 text-auxiliary-md font-semibold text-neutral-white-h">
                {hitLabel}
            </span>
        )}
    </div>
);

/** Markets 区块顶部的档位摘要行 */
const MarketTierRow: FC<{ legs: string; boost: string }> = ({ legs, boost }) => (
    <div className="flex h-10 items-center gap-3 rounded-sm bg-filltext-ft-a px-3 py-2">
        <span className="min-w-[52px] shrink-0 whitespace-nowrap text-body-lg font-bold leading-[18px] text-filltext-ft-h">
            {legs}
        </span>
        <Arrow direction="right" className="size-3.5 shrink-0 text-filltext-ft-g" />
        <span className="shrink-0 whitespace-nowrap text-body-lg font-bold leading-[18px] text-filltext-ft-h">
            {boost}
        </span>
    </div>
);

/** Markets 条件行 */
const MarketRow: FC<MarketRowProps> = ({ label, value, variant = 'default' }) => (
    <div
        className={cn(
            'flex min-h-10 items-start justify-between gap-3 rounded-sm px-3 py-2 text-body-sm leading-[18px]',
            variant === 'excluded' ? 'bg-func-bonus/15' : 'bg-filltext-ft-a',
        )}
    >
        <span className="shrink-0 text-filltext-ft-h">{label}</span>
        <strong
            className={cn(
                'min-w-0 flex-1 whitespace-normal text-right wrap-break-word',
                variant === 'excluded' ? 'text-func-pending' : 'text-filltext-ft-h',
            )}
        >
            {value}
        </strong>
    </div>
);

/** 单个投注项是否计入加赔的展示行 */
const ContributionRow: FC<ContributionRowProps> = ({
    legStatus,
    cardStatus,
    hasPendingSelection,
    isQualifying,
    match,
    market,
    odds,
}) => (
    <div
        className={cn(
            'flex h-14 items-center justify-between rounded-sm bg-surface-1 px-2',
            !isQualifying && 'opacity-60',
        )}
    >
        <div className="flex min-w-0 items-center gap-3">
            <TicketLegStatusNode status={legStatus} cardStatus={cardStatus} hasPendingSelection={hasPendingSelection} />
            <div className="flex min-w-0 flex-col">
                <span className="truncate text-auxiliary-sm text-filltext-ft-h">{match}</span>
                <span className="truncate text-auxiliary-xs text-filltext-ft-f">{market}</span>
            </div>
        </div>
        <span className="flex shrink-0 items-center gap-0.5 text-body-lg font-bold text-filltext-ft-g">
            <AtOdds className="size-3" />
            {odds}
        </span>
    </div>
);

/** 计算明细单行 */
const CalculationRow: FC<CalculationRowProps> = ({ label, value, valueTitle }) => (
    <div className="flex flex-col gap-0.5">
        <span className="text-auxiliary-xs text-filltext-ft-f">{label}</span>
        <span className="text-auxiliary-md text-filltext-ft-h" title={valueTitle}>
            {value}
        </span>
    </div>
);

const CalculationDivider: FC = () => <div className="h-px bg-filltext-ft-f/50" />;

/** Hero 区块：活动状态、标题、有效期与当前加赔比例 */
export const ParlayBoostModalHero: FC<{
    layout?: ParlayBoostRulesLayout;
    mode?: ParlayBoostRulesModalMode;
    rule?: ParlayBoostRule | null;
    betContext?: ParlayBoostRulesBetContext;
}> = ({ layout = 'desktop', mode = 'bet', rule, betContext }) => {
    const t = useTranslations('common.parlayBoostModal');
    const formatPeriod = useParlayBoostActivityPeriodFormat();
    const isMobile = layout === 'mobile';
    const showCurrentBoost = mode === 'bet' && betContext != null;
    const period = rule ? formatRuleActivityPeriod(rule, formatPeriod) : t('hero.period');

    return (
        <div
            className={cn('relative w-full shrink-0 overflow-hidden rounded-md', isMobile ? 'h-[120px]' : 'h-[200px]')}
        >
            <Image
                src={parlayBoostHero}
                alt=""
                fill
                sizes={isMobile ? '359px' : '906px'}
                className="object-cover object-center"
            />
            <div
                className={cn(
                    'absolute flex flex-col text-neutral-white-h',
                    isMobile ? 'left-3 top-2 gap-0.5' : 'left-[41px] top-9 gap-2',
                )}
            >
                <div className="flex flex-col gap-0.5">
                    <span
                        className={cn(
                            'flex items-center gap-1',
                            isMobile ? 'text-body-sm leading-4' : 'text-body-sm leading-[18px]',
                        )}
                    >
                        <span className="size-1.5 rounded-full bg-func-win" />
                        {t('hero.status')}
                    </span>
                    <span
                        className={cn(isMobile ? 'text-body-md font-bold leading-[18px]' : 'text-title-sm leading-5')}
                    >
                        {rule?.name || t('hero.title')}
                    </span>
                    <span className="text-auxiliary-sm leading-4">{period}</span>
                </div>
                {showCurrentBoost ? (
                    <div className="flex flex-col gap-0.5 font-bold">
                        <span
                            className={cn(
                                isMobile ? 'text-auxiliary-sm font-semibold leading-4' : 'text-title-sm leading-5',
                            )}
                        >
                            {t('hero.currentBoost')}
                        </span>
                        <span
                            className={cn(
                                'text-promo-parlay-boost-bg',
                                isMobile ? 'text-[32px] leading-[34px]' : 'text-[40px] leading-[44px]',
                            )}
                        >
                            {formatParlayBoostPercent(betContext.preview.currentTier)}
                        </span>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

/** How it work 区块 */
const HowItWorksSection: FC<{
    mode: ParlayBoostRulesModalMode;
    rule?: ParlayBoostRule | null;
    betContext?: ParlayBoostRulesBetContext;
}> = ({ mode, rule, betContext }) => {
    const t = useTranslations('common.parlayBoostModal');
    const isBetMode = mode === 'bet';
    const ladder = rule ? getSortedParlayBoostLadder(rule) : [];
    const preview = betContext?.preview;

    return (
        <Section
            title={t('howItWorks.title')}
            subtitle={getParlayBoostComboSubtitle(rule, t, t('howItWorks.subtitle'))}
        >
            <div className="flex flex-col gap-2">
                {ladder.length > 0
                    ? ladder.map((tier) => (
                          <TierRow
                              key={tier.legs}
                              legs={t('howItWorks.tierLegs', { legs: tier.legs })}
                              boost={formatParlayBoostPercent(tier)}
                              hitLabel={t('howItWorks.yourHit')}
                              active={preview?.currentTier?.legs === tier.legs}
                          />
                      ))
                    : TIER_KEYS.map((key) => (
                          <TierRow
                              key={key}
                              legs={t(`howItWorks.tiers.${key}.legs`)}
                              boost={t(`howItWorks.tiers.${key}.boost`)}
                              hitLabel={t('howItWorks.yourHit')}
                              active={isBetMode && !betContext && key === 'five'}
                          />
                      ))}
                <p className="rounded-sm bg-brand-primary-1 p-2 text-body-sm leading-[18px] text-filltext-ft-g">
                    <strong className="font-bold text-brand-primary-0">{t('howItWorks.noteTitle')}</strong>
                    {getHowItWorksNote(mode, betContext, t)}
                </p>
            </div>
        </Section>
    );
};

/** Applicable scope 区块 */
const ScopeSection: FC<{ rule?: ParlayBoostRule | null }> = ({ rule }) => {
    const t = useTranslations('common.parlayBoostModal');
    const eligibleItems = getScopeBreadcrumbs(getRuleScopeRulesByMode(rule, 'include'), t);
    const ineligibleItems = getScopeBreadcrumbs(getRuleScopeRulesByMode(rule, 'exclude'), t);

    const renderScopeGroup = (label: string, items: string[], muted = false) => (
        <div className="flex flex-col gap-1.5 rounded-sm bg-filltext-ft-a px-3 py-2">
            <span className="text-auxiliary-sm font-semibold text-filltext-ft-h">{label}</span>
            {items.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {items.map((item) => (
                        <span
                            key={item}
                            className={cn(
                                'text-body-sm leading-[18px]',
                                muted ? 'text-filltext-ft-f' : 'text-filltext-ft-g',
                            )}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            ) : (
                <span className="text-body-sm text-filltext-ft-f">-</span>
            )}
        </div>
    );

    return (
        <Section title={t('scope.title')} subtitle={t('scope.subtitle')}>
            <div className="flex flex-col gap-2">
                {renderScopeGroup(t('scope.eligible'), eligibleItems)}
                {renderScopeGroup(t('scope.ineligible'), ineligibleItems, true)}
            </div>
        </Section>
    );
};

/** Markets included in the boost 区块 */
const MarketsSection: FC<{
    rule?: ParlayBoostRule | null;
    betContext?: ParlayBoostRulesBetContext;
}> = ({ rule, betContext }) => {
    const t = useTranslations('common.parlayBoostModal');
    const formatPeriod = useParlayBoostActivityPeriodFormat();
    const displayTier = betContext?.preview.currentTier;
    const activityPeriod = rule ? formatRuleActivityPeriod(rule, formatPeriod) : t('markets.rows.activityPeriod.value');

    let marketTypesValue = t('markets.rows.marketTypes.value');
    const excludedValue = getExcludedMarketsRowValue(rule, t);
    if (rule && betContext && betContext.selections.length > 0) {
        const includedMarketNames = new Set<string>();

        for (const selection of betContext.selections) {
            const marketName = selection.marketName.trim();
            if (!marketName) {
                continue;
            }

            const isQualified = isParlayBoostSelectionQualified(
                {
                    eventId: selection.eventId,
                    marketId: selection.marketId,
                    productId: selection.productId,
                    specifiers: selection.specifiers,
                    outcome: {
                        id: selection.outcome.id,
                        odds: selection.outcome.odds,
                        active: selection.outcome.active,
                    },
                    tournamentId: selection.tournamentId,
                    categoryId: selection.categoryId,
                    productRaw: selection.productRaw,
                    isOutright: selection.isOutright,
                    sportId: selection.sportId,
                    lineStatus: selection.lineStatus,
                },
                rule,
            );

            if (isQualified) {
                includedMarketNames.add(marketName);
            }
        }

        const includedList = [...includedMarketNames].sort();

        if (includedList.length > 0) {
            marketTypesValue = includedList.join('/');
        }
    }
    const dynamicRows: MarketRowProps[] = rule
        ? [
              {
                  label: t('markets.rows.marketTypes.label'),
                  value: marketTypesValue,
              },
              {
                  label: t('markets.rows.minOdds.label'),
                  value: t('markets.rows.minOdds.dynamicValue', { odds: formatRuleNumber(rule.min_odds_per_leg) }),
              },
              {
                  label: t('markets.rows.activityPeriod.label'),
                  value: activityPeriod,
              },
              {
                  label: t('markets.rows.cap.label'),
                  value:
                      toParlayBoostNumber(rule.boost_cap_per_bet) > 0
                          ? formatRuleNumber(rule.boost_cap_per_bet)
                          : t('markets.noCap'),
              },
              {
                  label: t('markets.rows.excluded.label'),
                  value: excludedValue,
                  variant: 'excluded',
              },
          ]
        : [];

    return (
        <Section title={t('markets.title')} subtitle={t('markets.subtitle')}>
            <div className="flex flex-col gap-2">
                {displayTier ? (
                    <MarketTierRow
                        legs={t('howItWorks.tierLegs', { legs: displayTier.legs })}
                        boost={formatParlayBoostPercent(displayTier)}
                    />
                ) : !rule ? (
                    <MarketTierRow legs={t('markets.rows.threeLegs.label')} boost={t('markets.rows.threeLegs.value')} />
                ) : null}
                {dynamicRows.length > 0
                    ? dynamicRows.map((row) => (
                          <MarketRow key={row.label} label={row.label} value={row.value} variant={row.variant} />
                      ))
                    : MARKET_ROWS.map((key) => (
                          <MarketRow
                              key={key}
                              label={t(`markets.rows.${key}.label`)}
                              value={
                                  key === 'excluded'
                                      ? getExcludedMarketsRowValue(rule, t)
                                      : t(`markets.rows.${key}.value`)
                              }
                              variant={key === 'excluded' ? 'excluded' : 'default'}
                          />
                      ))}
            </div>
        </Section>
    );
};

/** Contribution 区块 */
const ContributionSection: FC<{
    betContext: ParlayBoostRulesBetContext;
    rule?: ParlayBoostRule | null;
}> = ({ betContext, rule }) => {
    const t = useTranslations('common.parlayBoostModal');
    const oddsFormat = useOddsFormat();
    const contributionRows = buildParlayBoostContributionRows(betContext, (odds) =>
        formatOddsByFormat(odds, oddsFormat),
    );
    const totalLegs = betContext.selections.length;
    const countedLegs = betContext.preview.qualifyingCount;
    const maxLegs = rule ? getParlayBoostMaxLegs(rule) : betContext.preview.maxLegs;

    return (
        <Section
            title={t('contribution.title')}
            subtitle={t('contribution.subtitleDynamic', { totalLegs, countedLegs })}
        >
            <div className="flex flex-col gap-2">
                {contributionRows.map((row) => (
                    <ContributionRow
                        key={row.selectionId}
                        legStatus={row.legStatus}
                        cardStatus={betContext.parlayCardStatus}
                        hasPendingSelection={betContext.hasPendingSelection}
                        isQualifying={row.isQualifying}
                        match={row.match}
                        market={row.market}
                        odds={row.odds}
                    />
                ))}
                <div className="flex items-center justify-between rounded-sm bg-brand-primary-1 p-2 text-body-sm leading-[18px]">
                    <span className="text-filltext-ft-g">{t('contribution.countedLegs')}</span>
                    <div className="flex items-center gap-0.5">
                        <strong className="font-bold text-brand-primary-0">{countedLegs}</strong>
                        <span className="text-filltext-ft-g">/</span>
                        <span className="text-filltext-ft-g">{maxLegs}</span>
                    </div>
                </div>
            </div>
        </Section>
    );
};

/** Calculation 区块 */
const getCalculationCapValue = (
    payoutPreview: ParlayBoostRulesBetContext['payoutPreview'],
    t: ParlayBoostModalTranslate,
    formatAmount: (amount: number) => string,
): string => {
    if (payoutPreview.boostCap <= 0) {
        return t('calculation.rows.cap.noCap', { boostAmount: formatAmount(payoutPreview.boostAmount) });
    }
    if (payoutPreview.truncated) {
        return t('calculation.rows.cap.truncated', {
            rawBoost: formatAmount(payoutPreview.boostAmount),
            cap: formatAmount(payoutPreview.boostCap),
            boostAmount: formatAmount(payoutPreview.payableBoostAmount),
        });
    }

    return t('calculation.rows.cap.notTruncated', {
        boostAmount: formatAmount(payoutPreview.boostAmount),
        cap: formatAmount(payoutPreview.boostCap),
    });
};

const CalculationSection: FC<{
    betContext: ParlayBoostRulesBetContext;
    rule?: ParlayBoostRule | null;
}> = ({ betContext, rule }) => {
    const t = useTranslations('common.parlayBoostModal');
    const oddsFormat = useOddsFormat();
    const { currencySymbolNarrow, formatCompactAmount, formatNumber } = useIntlFormatter();
    const { preview, payoutPreview, stake, parlayOdds } = betContext;
    const currentTier = preview.currentTier;

    /** 与购物车 parlay footer 一致：窄符号 + compact 金额 */
    const formatPayoutAmount = (amount: number): string => `${currencySymbolNarrow}${formatCompactAmount(amount)}`;
    const formatPayoutAmountTitle = (amount: number): string => formatNumber(amount);
    const formatOdds = (odds: number): string => formatOddsByFormat(odds, oddsFormat);

    const rowValues = {
        basePayout: t('calculation.rows.basePayout.dynamicValue', {
            stake: formatPayoutAmount(stake),
            totalOdds: formatOdds(parlayOdds),
            basePayout: formatPayoutAmount(payoutPreview.basePayout),
        }),
        basePayoutTitle: formatPayoutAmountTitle(payoutPreview.basePayout),
        hitTier: currentTier
            ? t('calculation.rows.hitTier.dynamicValue', {
                  legs: currentTier.legs,
                  boost: formatParlayBoostPercent(currentTier),
                  multiplier: formatParlayBoostMultiplier(currentTier),
              })
            : t('calculation.rows.hitTier.locked'),
        boostAmount: currentTier
            ? t('calculation.rows.boostAmount.dynamicValue', {
                  boostPercent: formatParlayBoostPercent(currentTier, { signed: false }),
                  basePayout: formatPayoutAmount(payoutPreview.boostBasePayout),
                  boostRate: formatNumber(toParlayBoostNumber(currentTier.boost)),
                  boostAmount: formatPayoutAmount(payoutPreview.boostAmount),
              })
            : t('calculation.rows.boostAmount.empty'),
        boostAmountTitle: currentTier ? formatPayoutAmountTitle(payoutPreview.boostAmount) : undefined,
        cap: getCalculationCapValue(payoutPreview, t, formatPayoutAmount),
        capTitle:
            payoutPreview.boostCap > 0
                ? formatPayoutAmountTitle(payoutPreview.boostCap)
                : formatPayoutAmountTitle(payoutPreview.boostAmount),
    };

    return (
        <Section
            title={t('calculation.title')}
            subtitle={getParlayBoostComboSubtitle(rule, t, t('calculation.subtitle'))}
        >
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 rounded-sm bg-filltext-ft-a px-3 py-2">
                    {CALCULATION_ROWS.map((key, index) => (
                        <div key={key} className="flex flex-col gap-2">
                            {index > 0 && <CalculationDivider />}
                            <CalculationRow
                                label={t(`calculation.rows.${key}.label`)}
                                value={rowValues[key]}
                                valueTitle={
                                    key === 'basePayout'
                                        ? rowValues.basePayoutTitle
                                        : key === 'boostAmount'
                                          ? rowValues.boostAmountTitle
                                          : key === 'cap'
                                            ? rowValues.capTitle
                                            : undefined
                                }
                            />
                        </div>
                    ))}
                    <CalculationDivider />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-auxiliary-md text-filltext-ft-h">{t('calculation.final.label')}</span>
                        <span
                            className="text-auxiliary-md text-filltext-ft-h"
                            title={formatPayoutAmountTitle(payoutPreview.finalPayout)}
                        >
                            {t('calculation.final.dynamicPrefix', {
                                basePayout: formatPayoutAmount(payoutPreview.basePayout),
                                boostAmount: formatPayoutAmount(payoutPreview.payableBoostAmount),
                            })}{' '}
                            <strong className="text-body-lg font-bold text-brand-primary-0">
                                {formatPayoutAmount(payoutPreview.finalPayout)}
                            </strong>
                        </span>
                    </div>
                </div>
                <p className="rounded-sm bg-brand-primary-1 p-2 text-body-sm leading-[18px] text-filltext-ft-g">
                    <strong className="font-bold text-brand-primary-0">{t('calculation.noteTitle')}</strong>
                    {t('calculation.note')}
                </p>
            </div>
        </Section>
    );
};

/** 规则正文：各说明区块（不含 Hero） */
export const ParlayBoostRulesBody: FC<{
    mode: ParlayBoostRulesModalMode;
    layout?: ParlayBoostRulesLayout;
    rule?: ParlayBoostRule | null;
    betContext?: ParlayBoostRulesBetContext;
    showContributionSection?: boolean;
    showPayoutCalculation?: boolean;
    showMarketsSection?: boolean;
}> = ({
    mode,
    layout = 'desktop',
    rule,
    betContext,
    showContributionSection = true,
    showPayoutCalculation = true,
    showMarketsSection = true,
}) => {
    const isBetMode = mode === 'bet';
    const isMobile = layout === 'mobile';

    const sectionItems: { key: string; node: ReactNode }[] = [
        { key: 'how-it-works', node: <HowItWorksSection mode={mode} rule={rule} betContext={betContext} /> },
        { key: 'scope', node: <ScopeSection rule={rule} /> },
    ];

    if (showMarketsSection) {
        sectionItems.push({ key: 'markets', node: <MarketsSection rule={rule} betContext={betContext} /> });
    }

    if (isBetMode && betContext && showContributionSection) {
        sectionItems.push({
            key: 'contribution',
            node: <ContributionSection betContext={betContext} rule={rule} />,
        });
    }

    if (isBetMode && betContext && showPayoutCalculation) {
        sectionItems.push({
            key: 'calculation',
            node: <CalculationSection betContext={betContext} rule={rule} />,
        });
    }

    return (
        <>
            {sectionItems.map((item, index) => (
                <Fragment key={item.key}>
                    {item.node}
                    {isMobile && index < sectionItems.length - 1 ? <RulesSectionDivider /> : null}
                </Fragment>
            ))}
        </>
    );
};

/** 串关加赔规则内容，可在弹窗、sheet 或促销详情页复用 */
export const ParlayBoostRulesContent: FC<ParlayBoostRulesContentProps> = ({
    mode = 'bet',
    layout = 'desktop',
    rule,
    betContext,
    showContributionSection = true,
    showPayoutCalculation = true,
    showMarketsSection = true,
    className,
}) => {
    const isMobile = layout === 'mobile';

    return (
        <div className={cn('flex flex-col', isMobile ? 'gap-4' : 'gap-8', className)}>
            <ParlayBoostModalHero layout={layout} mode={mode} rule={rule} betContext={betContext} />
            <div className={cn('flex flex-col', isMobile ? 'gap-4' : 'gap-6')}>
                <ParlayBoostRulesBody
                    mode={mode}
                    layout={layout}
                    rule={rule}
                    betContext={betContext}
                    showContributionSection={showContributionSection}
                    showPayoutCalculation={showPayoutCalculation}
                    showMarketsSection={showMarketsSection}
                />
            </div>
        </div>
    );
};

const SkeletonBlock: FC<{ className?: string }> = ({ className }) => (
    <div className={cn('animate-skeleton-pulse rounded-sm bg-filltext-ft-d/20', className)} />
);

const SKELETON_SECTION_KEYS = ['how-it-works', 'scope', 'markets', 'contribution', 'calculation'] as const;

/** 串关加赔规则弹窗骨架，占位结构从真实区块抽象，避免维护 1:1 假布局。 */
export const ParlayBoostRulesSkeleton: FC<{
    layout?: ParlayBoostRulesLayout;
    mode?: ParlayBoostRulesModalMode;
    showContributionSection?: boolean;
    showPayoutCalculation?: boolean;
    showMarketsSection?: boolean;
    className?: string;
}> = ({
    layout = 'desktop',
    mode = 'bet',
    showContributionSection = true,
    showPayoutCalculation = true,
    showMarketsSection = true,
    className,
}) => {
    const isMobile = layout === 'mobile';
    const sectionKeys: (typeof SKELETON_SECTION_KEYS)[number][] = ['how-it-works', 'scope'];

    if (showMarketsSection) {
        sectionKeys.push('markets');
    }
    if (mode === 'bet' && showContributionSection) {
        sectionKeys.push('contribution');
    }
    if (mode === 'bet' && showPayoutCalculation) {
        sectionKeys.push('calculation');
    }

    return (
        <div className={cn('flex flex-col', isMobile ? 'gap-4' : 'gap-8', className)}>
            <SkeletonBlock className={cn('w-full shrink-0 rounded-md', isMobile ? 'h-[120px]' : 'h-[200px]')} />
            <div className={cn('flex flex-col', isMobile ? 'gap-4' : 'gap-6')}>
                {sectionKeys.map((key, index) => (
                    <Fragment key={key}>
                        <section className="flex w-full flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1">
                                    <SkeletonBlock className="h-4 w-1 shrink-0" />
                                    <SkeletonBlock className="h-5 w-36" />
                                </div>
                                <SkeletonBlock className="h-4 w-56 max-w-full" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <SkeletonBlock className="h-10 w-full" />
                                <SkeletonBlock className="h-10 w-full" />
                                {index === 0 ? <SkeletonBlock className="h-[52px] w-full" /> : null}
                            </div>
                        </section>
                        {isMobile && index < sectionKeys.length - 1 ? <RulesSectionDivider /> : null}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

export type { ParlayBoostRulesBetContext } from '@/utils/parlay-boost-rules-context';
export type { ParlayBoostRulesLayout, ParlayBoostRulesModalMode };
