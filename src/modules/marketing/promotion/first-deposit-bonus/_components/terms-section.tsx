'use client';

import { useTranslations } from 'next-intl';
import { type ReactNode, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible/collapsible';
import { AnnouncementBoard, ArrowDown } from '@/components/icons';
import { cn } from '@/utils/common';
import { useAmount } from '../../_utils/useAmount';

const strongRenderer = { strong: (chunks: ReactNode) => <strong className="text-filltext-ft-h">{chunks}</strong> };

export const TermsSection = () => {
    const t = useTranslations('promotionFirstDepositBonus');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const formatAmount = useAmount();
    const withdrawalsItem3Amount1 = formatAmount(500);
    const withdrawalsItem3Amount2 = formatAmount(650);
    const withdrawalsItem3Amount3 = formatAmount(500);
    const withdrawalsItem3Amount4 = formatAmount(150);

    const RULES_CONFIG = [
        {
            key: 'general',
            title: t('rules.general.title'),
            items: [
                t('rules.general.item0'),
                t('rules.general.item1'),
                t('rules.general.item2'),
                t('rules.general.item3'),
            ],
        },
        {
            key: 'deadlines',
            title: t('rules.deadlines.title'),
            items: [
                t.rich('rules.deadlines.item0', strongRenderer),
                t.rich('rules.deadlines.item1', strongRenderer),
                t('rules.deadlines.item2'),
                t('rules.deadlines.item3'),
            ],
        },
        {
            key: 'sportsBetting',
            title: t('rules.sportsBetting.title'),
            items: [
                t('rules.sportsBetting.item0'),
                t.rich('rules.sportsBetting.item1', strongRenderer),
                t('rules.sportsBetting.item2'),
                t('rules.sportsBetting.item3'),
            ],
        },
        {
            key: 'casinoBetting',
            title: t('rules.casinoBetting.title'),
            items: [t('rules.casinoBetting.item0'), t('rules.casinoBetting.item1'), t('rules.casinoBetting.item2')],
        },
        {
            key: 'withdrawals',
            title: t('rules.withdrawals.title'),
            items: [
                t('rules.withdrawals.item0'),
                t('rules.withdrawals.item1'),
                t('rules.withdrawals.item2'),
                t('rules.withdrawals.item3', {
                    withdrawalsItem3Amount1,
                    withdrawalsItem3Amount2,
                    withdrawalsItem3Amount3,
                    withdrawalsItem3Amount4,
                }),
            ],
        },
        {
            key: 'restrictions',
            title: t('rules.restrictions.title'),
            items: [
                t('rules.restrictions.item0'),
                t('rules.restrictions.item1'),
                t('rules.restrictions.item2'),
                t('rules.restrictions.item3'),
                t('rules.restrictions.item4'),
            ],
        },
    ];

    return (
        <section className="w-full py-4 flex flex-col items-start">
            <div className="w-full max-w-(--main-content-max-width) mx-auto px-2.5 @lg:px-4 @3xl:px-6">
                {/* Header */}
                <div className="mb-8 text-left">
                    <div className="flex items-center justify-start gap-3 mb-2">
                        <AnnouncementBoard className="size-6 text-brand-red shrink-0" />
                        <h2 className="text-headline-sm text-filltext-ft-h">{t('rules.title')}</h2>
                    </div>
                    <p className="text-filltext-ft-f text-body-sm">{t('rules.subtitle')}</p>
                    <div
                        className="mt-4 h-px w-full @2xl:w-1/2 opacity-35"
                        style={{
                            background:
                                'linear-gradient(90deg, var(--brand-red) 0%, var(--brand-primary-1) 40%, transparent 100%)',
                        }}
                    />
                </div>

                <div className="rounded-md overflow-hidden border border-filltext-ft-b bg-surface-1/80 backdrop-blur-sm">
                    {RULES_CONFIG.map((rule, ruleIndex) => {
                        const isOpen = openIndex === ruleIndex;
                        const items = rule.items;

                        return (
                            <Collapsible
                                key={rule.key}
                                open={isOpen}
                                onOpenChange={() => setOpenIndex(isOpen ? null : ruleIndex)}
                                className={cn(
                                    'border-b border-filltext-ft-b last:border-0',
                                    rule.key === 'casinoBetting' && 'hidden',
                                )}
                            >
                                <CollapsibleTrigger asChild>
                                    <button
                                        type="button"
                                        className={cn(
                                            'group flex w-full cursor-pointer items-center justify-between py-4 px-4 text-left transition-colors',
                                            isOpen ? 'bg-surface-1/40' : 'bg-transparent',
                                        )}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <span className="text-body-sm pr-3 leading-snug text-filltext-ft-g truncate">
                                                {rule.title}
                                            </span>
                                        </div>
                                        <span className="flex-shrink-0 ml-2">
                                            <ArrowDown
                                                className={cn(
                                                    'size-4 transition-all duration-200',
                                                    isOpen ? 'rotate-180 text-brand-red' : 'text-filltext-ft-d',
                                                )}
                                            />
                                        </span>
                                    </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                    <div className="px-4 pb-4 pt-0 space-y-2">
                                        {items.map((item, i) => (
                                            <p
                                                key={i.toString()}
                                                className="text-body-sm text-filltext-ft-f leading-relaxed"
                                            >
                                                {item}
                                            </p>
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
