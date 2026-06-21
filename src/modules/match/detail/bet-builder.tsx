'use client';

import { useTranslations } from 'next-intl';
import { type FC, useCallback, useMemo, useState } from 'react';
import type { MatchWithMarkets } from '@/api/models/match';
import { Arrow } from '@/components/Arrow';
import { Collapsible, CollapsibleContent } from '@/components/collapsible/collapsible';
import { Toast } from '@/components/toast';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { cn } from '@/utils/common';

/**
 * Bet Builder（Crear Apuesta）自建注 —— 同场多选组合下注。
 *
 * ⚠️ MOCK：GTB 后端暂无 SGP（同场关联盘）定价/下单接口。这里的可选盘口与赔率为本地假数据，
 * 组合赔率在前端用「连乘 × 相关性折扣」估算，下注按钮只弹 Toast 演示。后端就绪后：
 *  1) 把 buildMockProps 换成真实 SGP 可选盘口接口；
 *  2) 组合赔率改用后端定价返回；
 *  3) 下注接入真实 order 接口（替换 handlePlaceBet 内的 Toast）。
 * 组件交互与结构保持不变。
 */

/** 单个可选玩法。 */
interface PropOption {
    id: string;
    /** 展示名（mock 市场数据，等同后端 outcome display_name，不走 i18n） */
    label: string;
    /** 小数赔率 */
    odds: number;
}

/** 一组玩法（同组单选）。 */
interface PropGroup {
    id: string;
    /** 组标题（mock 市场数据） */
    label: string;
    options: PropOption[];
}

// ─── ⚠️ MOCK 数据源 begin（后端就绪后整体替换为 SGP 可选盘口接口） ───
const buildMockProps = (homeName: string, awayName: string): PropGroup[] => [
    {
        id: 'result',
        label: 'Resultado Final',
        options: [
            { id: 'result-home', label: homeName, odds: 1.9 },
            { id: 'result-draw', label: 'Empate', odds: 3.4 },
            { id: 'result-away', label: awayName, odds: 4.2 },
        ],
    },
    {
        id: 'totals',
        label: 'Total de goles',
        options: [
            { id: 'totals-over', label: 'Mas de 2.5', odds: 1.85 },
            { id: 'totals-under', label: 'Menos de 2.5', odds: 1.95 },
        ],
    },
    {
        id: 'btts',
        label: 'Ambos equipos anotan',
        options: [
            { id: 'btts-yes', label: 'Si', odds: 1.7 },
            { id: 'btts-no', label: 'No', odds: 2.1 },
        ],
    },
    {
        id: 'cards',
        label: 'Tarjetas',
        options: [
            { id: 'cards-over', label: 'Mas de 3.5', odds: 1.95 },
            { id: 'cards-under', label: 'Menos de 3.5', odds: 1.8 },
        ],
    },
    {
        id: 'corners',
        label: 'Corners',
        options: [
            { id: 'corners-over', label: 'Mas de 9.5', odds: 1.9 },
            { id: 'corners-under', label: 'Menos de 9.5', odds: 1.85 },
        ],
    },
];

/** 相关性折扣：组合腿越多，越偏离单纯连乘（mock 估算）。 */
const CORRELATION_DISCOUNT = 0.95;
const QUICK_STAKES = [10, 50, 100];
// ─── ⚠️ MOCK 数据源 end ───

/** 仅保留数字与一个小数点。 */
const sanitizeStake = (raw: string): string => {
    const cleaned = raw.replace(/[^\d.]/g, '');
    const [intPart, ...rest] = cleaned.split('.');
    return rest.length ? `${intPart}.${rest.join('')}` : intPart;
};

interface BetBuilderProps {
    match: MatchWithMarkets;
    className?: string;
}

/** 自建注卡片（默认折叠）。 */
export const BetBuilder: FC<BetBuilderProps> = ({ match, className }) => {
    const t = useTranslations('matches');
    const { formatCurrency } = useIntlFormatter();

    const [open, setOpen] = useState(false);
    /** groupId → optionId（同组单选） */
    const [selected, setSelected] = useState<Record<string, string>>({});
    const [stake, setStake] = useState('');

    const homeName = match.home_competitor?.name ?? 'Local';
    const awayName = match.away_competitor?.name ?? 'Visitante';
    const groups = useMemo(() => buildMockProps(homeName, awayName), [homeName, awayName]);

    const selectedOptions = useMemo(() => {
        const list: PropOption[] = [];
        for (const group of groups) {
            const optionId = selected[group.id];
            const option = group.options.find((o) => o.id === optionId);
            if (option) {
                list.push(option);
            }
        }
        return list;
    }, [groups, selected]);

    const legCount = selectedOptions.length;

    /** 组合赔率 = 各腿连乘 × 相关性折扣（mock）。 */
    const combinedOdds = useMemo(() => {
        if (legCount < 2) {
            return 0;
        }
        const product = selectedOptions.reduce((acc, o) => acc * o.odds, 1);
        return product * CORRELATION_DISCOUNT ** (legCount - 1);
    }, [selectedOptions, legCount]);

    const stakeValue = Number(stake) || 0;
    const potentialWin = combinedOdds > 0 ? stakeValue * combinedOdds : 0;
    const canPlace = legCount >= 2 && stakeValue > 0;

    const handleToggleOption = useCallback((groupId: string, optionId: string) => {
        setSelected((prev) => {
            if (prev[groupId] === optionId) {
                const next = { ...prev };
                delete next[groupId];
                return next;
            }
            return { ...prev, [groupId]: optionId };
        });
    }, []);

    const handleClear = useCallback(() => {
        setSelected({});
        setStake('');
    }, []);

    const handlePlaceBet = useCallback(() => {
        if (!canPlace) {
            return;
        }
        // ⚠️ MOCK：后端就绪后替换为真实 SGP 下单接口
        Toast.success(t('betBuilder.added'), { id: 'bet-builder-demo' });
        handleClear();
    }, [canPlace, handleClear, t]);

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className={cn('overflow-hidden rounded-sm bg-surface-muted', className)}
        >
            {/* 头部（点击展开/收起） */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full cursor-pointer items-center gap-2 bg-surface-2 px-3 py-2.5"
            >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-brand-primary-0 text-auxiliary-md font-bold text-on-brand">
                    +
                </span>
                <span className="flex min-w-0 flex-col items-start">
                    <span className="flex items-center gap-1.5 text-body-md font-bold text-filltext-ft-h">
                        {t('betBuilder.title')}
                        <span className="rounded-xs bg-filltext-ft-c px-1 text-auxiliary-xxs font-bold text-filltext-ft-f">
                            {t('betBuilder.demoBadge')}
                        </span>
                    </span>
                    <span className="truncate text-auxiliary-md text-filltext-ft-f">{t('betBuilder.subtitle')}</span>
                </span>
                {legCount > 0 && (
                    <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-primary-0 text-auxiliary-md font-bold text-on-brand">
                        {legCount}
                    </span>
                )}
                <Arrow className="size-3 shrink-0 text-filltext-ft-f" direction={open ? 'up' : 'down'} />
            </button>

            <CollapsibleContent>
                <div className="flex flex-col gap-3 px-3 pb-3">
                    {/* 玩法分组 */}
                    {groups.map((group) => (
                        <div key={group.id} className="flex flex-col gap-1.5">
                            <span className="text-auxiliary-md font-medium text-filltext-ft-g">{group.label}</span>
                            <div className="flex flex-wrap gap-1.5">
                                {group.options.map((option) => {
                                    const isSelected = selected[group.id] === option.id;
                                    return (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => handleToggleOption(group.id, option.id)}
                                            className={cn(
                                                'flex items-center gap-2 rounded-sm border px-2.5 py-1.5 transition-colors',
                                                isSelected
                                                    ? 'border-brand-primary-0 bg-brand-primary-0/10'
                                                    : 'border-filltext-ft-c bg-surface-1 hover:border-filltext-ft-e',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'max-w-32 truncate text-body-sm',
                                                    isSelected ? 'text-brand-primary-0' : 'text-filltext-ft-g',
                                                )}
                                            >
                                                {option.label}
                                            </span>
                                            <span
                                                className={cn(
                                                    'text-body-sm font-bold',
                                                    isSelected ? 'text-brand-primary-0' : 'text-filltext-ft-h',
                                                )}
                                            >
                                                {option.odds.toFixed(2)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* 汇总 + 下注 */}
                    {legCount < 2 ? (
                        <p className="rounded-sm bg-surface-1 px-3 py-2 text-center text-auxiliary-md text-filltext-ft-f">
                            {t('betBuilder.empty')}
                        </p>
                    ) : (
                        <div className="flex flex-col gap-2 rounded-sm bg-surface-1 p-3">
                            <div className="flex items-center justify-between">
                                <span className="text-body-sm text-filltext-ft-g">{t('betBuilder.combinedOdds')}</span>
                                <span className="text-title-sm font-bold text-brand-primary-0">
                                    {combinedOdds.toFixed(2)}
                                </span>
                            </div>

                            {/* 金额输入 + 快捷金额 */}
                            <div className="flex flex-col gap-1.5">
                                <label className="flex items-center gap-2 rounded-sm border border-filltext-ft-c px-2.5 py-1.5">
                                    <span className="text-body-sm text-filltext-ft-f">{t('betBuilder.stake')}</span>
                                    <input
                                        value={stake}
                                        onChange={(e) => setStake(sanitizeStake(e.target.value))}
                                        inputMode="decimal"
                                        placeholder="0"
                                        className="min-w-0 flex-1 bg-transparent text-right text-body-md font-bold text-filltext-ft-h outline-none placeholder:text-filltext-ft-e"
                                    />
                                </label>
                                <div className="flex gap-1.5">
                                    {QUICK_STAKES.map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setStake((prev) => String((Number(prev) || 0) + value))}
                                            className="flex-1 cursor-pointer rounded-sm bg-surface-2 py-1 text-auxiliary-md font-medium text-filltext-ft-g transition-colors hover:text-filltext-ft-h"
                                        >
                                            +{value}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-body-sm text-filltext-ft-g">{t('betBuilder.potentialWin')}</span>
                                <span className="text-body-md font-bold text-func-win">
                                    {formatCurrency(potentialWin)}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="cursor-pointer rounded-sm bg-surface-2 px-3 py-2 text-body-sm font-medium text-filltext-ft-g transition-colors hover:text-filltext-ft-h"
                                >
                                    {t('betBuilder.clear')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePlaceBet}
                                    disabled={!canPlace}
                                    className={cn(
                                        'flex-1 rounded-sm py-2 text-body-md font-bold transition-colors',
                                        canPlace
                                            ? 'cursor-pointer bg-brand-primary-0 text-on-brand'
                                            : 'cursor-not-allowed bg-filltext-ft-c text-filltext-ft-e',
                                    )}
                                >
                                    {t('betBuilder.placeBet')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};
