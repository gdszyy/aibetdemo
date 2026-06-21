'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { type ComponentProps, useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Notice, SportsEvents } from '@/components/icons';
import { PromotionOutlined } from '@/components/icons2/PromotionOutlined';
import { Toast } from '@/components/toast';
import { cn } from '@/utils/common';
import type { BonusStageKey } from '../../_constants/promotion-data';
import { useFirstRechargeConfigs } from '../services/use-first-recharge';

const PromoCodeRow = ({
    code,
    stageKey,
    bonus,
    index,
}: {
    stageKey: BonusStageKey;
    code: string;
    bonus: string;
    index: number;
}) => {
    const t = useTranslations('promotionFirstDepositBonus');
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const STAGE_LABEL_KEYS = {
        stage1: t('stages.stage1.label'),
        stage2: t('stages.stage2.label'),
        stage3: t('stages.stage3.label'),
    };

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).catch(() => Toast.error('Failed to copy', { id: 'copy-fail' }));
        setCopied(true);
        Toast.success(t('promoCodes.copyToast', { code }), { id: 'copy-code' });
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                'group flex rounded-sm overflow-hidden transition-transform bg-white border border-filltext-ft-b hover:-translate-y-2',
            )}
        >
            {/* Left panel — bonus percentage hero */}
            <div className="relative w-[72px] @2xl:w-[110px] shrink-0 bg-func-bonus/15 flex flex-col items-center justify-center py-2.5 @2xl:py-4 px-1.5">
                {/* Type icon */}
                <div className="size-5 @2xl:size-7 rounded-full flex items-center justify-center bg-white/80 mb-1">
                    <SportsEvents className="size-3 @2xl:size-3.5 text-func-win" />
                </div>
                {/* Bonus % */}
                <span className="text-title-md @2xl:text-headline-sm font-bold leading-none text-brand-red">
                    {bonus}
                </span>
                <span className="text-auxiliary-xs text-filltext-ft-f mt-0.5">{t('bonusDetails.bonusLabel')}</span>
            </div>

            {/* Scalloped divider — semicircle cutouts */}
            <div className="relative w-0 shrink-0">
                <div className="absolute -top-2 -translate-x-1/2 size-4 rounded-full bg-filltext-ft-a z-10" />
                <div className="absolute -bottom-2 -translate-x-1/2 size-4 rounded-full bg-filltext-ft-a z-10" />
                <div className="absolute inset-y-2 w-0 border-l border-dashed border-filltext-ft-c" />
            </div>

            {/* Right content */}
            <div className="flex items-center justify-between gap-2 flex-1 min-w-0 p-2.5 px-5 @2xl:p-4">
                {/* Stage + Type + Code in one row */}
                <div className="min-w-0">
                    <span className="text-auxiliary-md text-filltext-ft-e block">{STAGE_LABEL_KEYS[stageKey]}</span>
                    <span className="text-body-md text-filltext-ft-h">{t('bonusType.sport')}</span>
                </div>

                {/* Code + Copy — right-aligned */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="px-3 py-1 rounded-xs text-center font-bold tracking-wider text-auxiliary-md border border-brand-red/30 bg-white text-brand-red">
                        {code}
                    </div>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`p-2 rounded-full transition-all active:scale-95 cursor-pointer hover:opacity-85 shrink-0 ${
                            copied ? 'bg-func-win' : 'bg-brand-red'
                        } text-white`}
                        title={copied ? t('promoCodes.copied') : t('promoCodes.copyCode')}
                    >
                        <Copy className="size-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export const PromoCodesSection = () => {
    const t = useTranslations('promotionFirstDepositBonus');

    const configs = useFirstRechargeConfigs();

    const promoCodes: Omit<ComponentProps<typeof PromoCodeRow>, 'index'>[] = useMemo(() => {
        return (
            configs?.map((v, k) => {
                const index = k + 1;
                return {
                    stageKey: `stage${index}` as BonusStageKey,
                    code: v.promo_code,
                    bonus: `${Number(v.bonus_rate) * 100}%`,
                };
            }) || []
        );
    }, [configs]);

    return (
        <section className="w-full py-4 flex flex-col items-start">
            <div className="w-full max-w-(--main-content-max-width) mx-auto px-2.5 @lg:px-4 @3xl:px-6">
                {/* Header */}
                <div className="mb-5">
                    <div className="flex items-center gap-2.5 mb-1">
                        <PromotionOutlined className="size-6 shrink-0 text-func-bonus" />
                        <h2 className="text-headline-sm text-filltext-ft-h">{t('promoCodes.title')}</h2>
                    </div>
                    <p className="text-filltext-ft-f text-auxiliary-sm @lg:text-body-sm">{t('promoCodes.subtitle')}</p>
                    <div
                        className="mt-3 h-px w-full @2xl:w-1/2 opacity-35"
                        style={{
                            background:
                                'linear-gradient(90deg, var(--brand-red) 0%, var(--brand-primary-1) 40%, transparent 100%)',
                        }}
                    />
                </div>

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-sm p-4 mb-6 bg-surface-1/80 backdrop-blur-sm border border-filltext-ft-b flex gap-3 items-center"
                >
                    <div className="bg-filltext-ft-b p-2.5 rounded-sm shrink-0">
                        <Notice className="size-4 text-filltext-ft-f" />
                    </div>
                    <p className="text-auxiliary-sm @lg:text-body-sm text-filltext-ft-g leading-relaxed">
                        {t('promoCodes.infoText')}
                    </p>
                </motion.div>

                {/* Grouped by stage — each column = 1 stage (Casino + Sports stacked) */}
                <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-4">
                    {(['stage1', 'stage2', 'stage3'] as const).map((stageKey, si) => (
                        <div key={stageKey} className="flex flex-col gap-3">
                            {promoCodes
                                .filter((p) => p.stageKey === stageKey)
                                .map((promo, i) => (
                                    <PromoCodeRow key={promo.code} {...promo} index={si * 2 + i} />
                                ))}
                        </div>
                    ))}
                </div>

                {/* Usage note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-6 rounded-sm p-3.5 bg-brand-primary-1/80 backdrop-blur-sm border border-brand-red/20"
                >
                    <p className="text-auxiliary-sm text-filltext-ft-g leading-relaxed">
                        {t.rich('promoCodes.note', {
                            strong: (chunks) => <strong className="text-filltext-ft-h">{chunks}</strong>,
                        })}
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
