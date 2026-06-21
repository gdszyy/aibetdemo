'use client';

import Decimal from 'decimal.js-light';
import { merge } from 'lodash-es';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { DeepPartial } from 'react-hook-form';
import { CasinoBuyBonusActive, Game, Notice, SportsEvents, Success } from '@/components/icons';
import { useFirstRechargeCode } from '@/hooks/use-recharge-code';
import { cn } from '@/utils/common';
import type { BonusStage, BonusType } from '../../_constants/promotion-data';
import { useAmount } from '../../_utils/useAmount';

const StageCard = ({ data, index }: { data: BonusStage; index: number }) => {
    const t = useTranslations('promotionFirstDepositBonus');
    const [tab, setTab] = useState<BonusType>('sport');
    const bonus = tab === 'casino' ? data.casino : data.sport;

    const BONUS_STAGE_COPY_KEYS = {
        stage1: {
            label: t('stages.stage1.label'),
            sublabel: t('stages.stage1.sublabel'),
        },
        stage2: {
            label: t('stages.stage2.label'),
            sublabel: t('stages.stage2.sublabel'),
        },
        stage3: {
            label: t('stages.stage3.label'),
            sublabel: t('stages.stage3.sublabel'),
        },
    };

    const BONUS_TYPE_KEY_MAP = {
        casino: t('bonusType.casino'),
        sport: t('bonusType.sport'),
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className={cn(
                'rounded-md overflow-hidden flex flex-col h-full bg-surface-1/80 backdrop-blur-sm',
                data.best ? 'border-2 border-brand-red' : 'border border-filltext-ft-d',
            )}
        >
            {/* Header */}
            <div
                className={cn('px-4 pt-4 pb-3 relative', !data.best && 'bg-filltext-ft-a')}
                style={
                    data.best
                        ? { background: 'linear-gradient(135deg, var(--brand-red) 0%, var(--brand-primary-4) 100%)' }
                        : undefined
                }
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <span
                            className={cn(
                                'inline-block text-auxiliary-md px-2.5 py-0.5 rounded-full mb-1 tracking-wide',
                                data.best
                                    ? 'bg-white/20 text-white border border-white/30'
                                    : 'bg-func-bonus/20 text-amber-700 border border-func-bonus/40',
                            )}
                        >
                            {BONUS_STAGE_COPY_KEYS[data.stageKey].label}
                        </span>
                        <p
                            className={cn(
                                'text-auxiliary-sm truncate',
                                data.best ? 'text-white/60' : 'text-filltext-ft-f',
                            )}
                        >
                            {BONUS_STAGE_COPY_KEYS[data.stageKey].sublabel}
                        </p>
                    </div>

                    {/* Ratio */}
                    <div className="text-right shrink-0">
                        <div
                            className={cn(
                                'text-[24px] font-bold leading-none',
                                data.best ? 'text-white' : 'text-brand-red',
                            )}
                        >
                            {bonus.ratio}
                        </div>
                        <p
                            className={cn(
                                'text-auxiliary-xs mt-0.5',
                                data.best ? 'text-white/50' : 'text-filltext-ft-f',
                            )}
                        >
                            {t('bonusDetails.bonusLabel')}
                        </p>
                    </div>
                </div>

                {/* Deposit range & BEST Badge */}
                <div className="mt-2.5 flex items-end justify-between gap-2">
                    <div
                        className={cn(
                            'flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-auxiliary-sm',
                            data.best ? 'text-white/65' : 'text-filltext-ft-f',
                        )}
                    >
                        <span>{t('bonusDetails.deposit')}</span>
                        <span className={cn('text-auxiliary-md', data.best ? 'text-white' : 'text-filltext-ft-g')}>
                            {data.minDeposit}
                        </span>
                        <span className={data.best ? 'text-white/40' : 'text-filltext-ft-d'}>—</span>
                        <span className={cn('text-auxiliary-md', data.best ? 'text-white' : 'text-filltext-ft-g')}>
                            {data.maxDeposit}
                        </span>
                    </div>

                    {data.best && (
                        <div className="text-auxiliary-md px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 tracking-wider shrink-0">
                            {t('bonusDetails.best')}
                        </div>
                    )}
                </div>
            </div>

            {/* Tab switcher */}
            <div className="flex border-b border-filltext-ft-d" role="tablist">
                {(['casino', 'sport'] as const).map((bonusType) => {
                    const active = bonusType === tab;
                    const isCasino = bonusType === 'casino';
                    return (
                        <button
                            key={bonusType}
                            type="button"
                            role="tab"
                            onClick={() => setTab(bonusType)}
                            className={cn(
                                'flex-1 py-2.5 text-auxiliary-md transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1.5 hover:opacity-80',
                                isCasino && 'hidden',
                                active
                                    ? isCasino
                                        ? 'text-brand-red border-brand-red bg-brand-red/[0.04]'
                                        : 'text-func-win border-func-win bg-func-win/[0.04]'
                                    : 'text-filltext-ft-f border-transparent bg-transparent',
                            )}
                        >
                            {isCasino ? (
                                <Game className="size-3.5 shrink-0" />
                            ) : (
                                <SportsEvents className="size-3.5 shrink-0" />
                            )}
                            {BONUS_TYPE_KEY_MAP[bonusType]}
                        </button>
                    );
                })}
            </div>

            {/* Details */}
            <div className="px-4 py-4 space-y-3 flex-1">
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-sm p-3 bg-filltext-ft-a border border-filltext-ft-b">
                        <p className="text-auxiliary-xs text-filltext-ft-f mb-1.5">{t('bonusDetails.requirement')}</p>
                        <p className="text-body-lg text-filltext-ft-h">
                            {bonus.wagering}
                            {t('bonusDetails.wageringUnit')}
                        </p>
                    </div>
                    <div className="rounded-sm p-3 bg-filltext-ft-a border border-filltext-ft-b">
                        <p className="text-auxiliary-xs text-filltext-ft-f mb-1.5">{t('bonusDetails.maxWithdraw')}</p>
                        <p className="text-body-lg text-func-win">{bonus.maxWithdraw}</p>
                    </div>
                </div>

                {bonus.odds && (
                    <div className="flex items-center gap-2 rounded-sm px-3 py-2.5 bg-filltext-ft-a border border-filltext-ft-b">
                        <Success className="size-3.5 text-func-win shrink-0" />
                        <span className="text-auxiliary-sm text-filltext-ft-g">
                            {t('bonusDetails.validOdds')}{' '}
                            <strong className="text-body-lg text-filltext-ft-h">{bonus.odds}</strong>
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export const BonusDetailsSection = () => {
    const t = useTranslations('promotionFirstDepositBonus');
    const promotionItem = useFirstRechargeCode();
    const firstPromotionItemConfig = promotionItem?.configs?.[0];

    const formatAmount = useAmount();

    const generateStage = useCallback(
        (item: NonNullable<typeof promotionItem>['configs'][number]) => {
            const res: DeepPartial<BonusStage> = {
                best: false,
                minDeposit: formatAmount(Number(item.min_deposit) || 0),
                maxDeposit: formatAmount(Number(item.max_depositCap) || 0),
                sport: {
                    ratio: `${new Decimal(Number(item.bonus_rate) || 0).mul(100)}%`,
                    wagering: item.wager_multiplier.toString(),
                    maxWithdraw: formatAmount(Number(item.max_withdraw) || 0),
                },
            };

            return res as unknown as BonusStage;
        },
        [formatAmount],
    );

    const bonusStages = useMemo(() => {
        const item1 = promotionItem?.configs?.[0];
        const item2 = promotionItem?.configs?.[1];
        const item3 = promotionItem?.configs?.[2];

        if (!item1 || !item2 || !item3) {
            return [];
        }

        const res: BonusStage[] = [
            merge(generateStage(item1), {
                stageKey: 'stage1',
                sport: {
                    odds: '>=1.60x',
                },
            }),
            merge(generateStage(item2), {
                stageKey: 'stage2',
                sport: {
                    odds: '>=1.60x',
                },
            }),
            merge(generateStage(item3), {
                stageKey: 'stage3',
                best: true,
                sport: {
                    odds: '>=1.60x',
                },
            }),
        ];

        return res;
    }, [promotionItem?.configs?.[0], generateStage]);

    const exampleAmount = 100;

    return (
        <section className="w-full py-4 flex flex-col items-start">
            <div className="w-full max-w-(--main-content-max-width) mx-auto px-2.5 @lg:px-4 @3xl:px-6">
                {/* Header */}
                <div className="mb-5 text-left">
                    <div className="flex items-center justify-start gap-2.5 mb-1">
                        <CasinoBuyBonusActive className="size-6 text-brand-red shrink-0" />
                        <h2 className="text-headline-sm text-filltext-ft-h">{t('bonusDetails.title')}</h2>
                    </div>
                    <p className="text-filltext-ft-f text-auxiliary-sm @lg:text-body-sm">
                        {t('bonusDetails.subtitle')}
                    </p>
                    <div
                        className="mt-3 h-px w-full @2xl:w-1/2 opacity-35"
                        style={{
                            background:
                                'linear-gradient(90deg, var(--brand-red) 0%, var(--brand-primary-1) 40%, transparent 100%)',
                        }}
                    />
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-4 @4xl:gap-6">
                    {bonusStages.map((stage, i) => (
                        <StageCard key={stage.stageKey} data={stage} index={i} />
                    ))}
                </div>

                {/* Example box */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-8 rounded-sm p-4 bg-surface-1/80 backdrop-blur-sm border border-filltext-ft-b flex flex-row gap-3 items-start"
                >
                    <div className="bg-filltext-ft-b p-2.5 rounded-sm shrink-0">
                        <Notice className="size-4 text-filltext-ft-f" />
                    </div>
                    <div>
                        <p className="text-body-md text-filltext-ft-h mb-1">{t('bonusDetails.exampleTitle')}</p>
                        <p className="text-auxiliary-sm text-filltext-ft-f leading-relaxed">
                            {!!firstPromotionItemConfig &&
                                t.rich('bonusDetails.exampleText', {
                                    receive: formatAmount(exampleAmount),
                                    requirement: firstPromotionItemConfig.wager_multiplier,
                                    wager: formatAmount(
                                        new Decimal(exampleAmount)
                                            .mul(firstPromotionItemConfig.wager_multiplier)
                                            .toNumber(),
                                    ),
                                    strong: (chunks: ReactNode) => (
                                        <strong className="text-filltext-ft-h">{chunks}</strong>
                                    ),
                                })}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
