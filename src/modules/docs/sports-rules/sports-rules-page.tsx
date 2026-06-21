'use client';

import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible/collapsible';
import { ArrowDown } from '@/components/icons';
import type { TranslationFunction, TranslationKey } from '@/i18nV2/types';
import { cn } from '@/utils/common';

type RuleContentBlock = {
    title: string;
    content: string;
};

type RuleSectionKey =
    | 'generalRules'
    | 'specialRulesForSports'
    | 'specialRulesForEsports'
    | 'esportsBetSettlementRules'
    | 'virtualSportsRules';

interface RuleSection {
    key: RuleSectionKey;
    titleKey: TranslationKey<'sportsRules'>;
    contentKey: TranslationKey<'sportsRules'>;
}

const DEFAULT_OPEN_SECTION: RuleSectionKey = 'generalRules';

const SECTIONS: RuleSection[] = [
    { key: 'generalRules', titleKey: 'sections.generalRules.title', contentKey: 'sections.generalRules.content' },
    {
        key: 'specialRulesForSports',
        titleKey: 'sections.specialRulesForSports.title',
        contentKey: 'sections.specialRulesForSports.content',
    },
    {
        key: 'specialRulesForEsports',
        titleKey: 'sections.specialRulesForEsports.title',
        contentKey: 'sections.specialRulesForEsports.content',
    },
    {
        key: 'esportsBetSettlementRules',
        titleKey: 'sections.esportsBetSettlementRules.title',
        contentKey: 'sections.esportsBetSettlementRules.content',
    },
    {
        key: 'virtualSportsRules',
        titleKey: 'sections.virtualSportsRules.title',
        contentKey: 'sections.virtualSportsRules.content',
    },
];

function isRuleContentBlockArray(value: unknown): value is RuleContentBlock[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                typeof item === 'object' &&
                item !== null &&
                'title' in item &&
                'content' in item &&
                typeof (item as { title?: unknown }).title === 'string' &&
                typeof (item as { content?: unknown }).content === 'string',
        )
    );
}

function renderIndentedText(text: string) {
    const lines = text.split('\n');
    const lineKeyCounts = new Map<string, number>();
    return (
        <div className="flex flex-col gap-1">
            {lines.map((line) => {
                const trimmed = line.trim();
                if (!trimmed) {
                    const count = lineKeyCounts.get(trimmed) ?? 0;
                    lineKeyCounts.set(trimmed, count + 1);
                    const key = `${trimmed || 'blank'}-${count}`;
                    return <div key={key} className="h-2" />;
                }

                const count = lineKeyCounts.get(trimmed) ?? 0;
                lineKeyCounts.set(trimmed, count + 1);
                const key = `${trimmed}-${count}`;

                const level3 = /^\d+\.\d+\.\d+\./.test(trimmed);
                const level2 = /^\d+\.\d+\./.test(trimmed);

                return (
                    <p
                        key={key}
                        className={cn(
                            'text-body-md text-filltext-ft-f leading-6',
                            level3 ? 'pl-6' : level2 ? 'pl-4' : 'pl-0',
                        )}
                    >
                        {trimmed}
                    </p>
                );
            })}
        </div>
    );
}

function RuleSectionContent({
    contentKey,
    t,
}: {
    contentKey: TranslationKey<'sportsRules'>;
    t: TranslationFunction<'sportsRules'>;
}) {
    const raw = t.raw(contentKey) as unknown;

    if (isRuleContentBlockArray(raw)) {
        return (
            <div className="flex flex-col gap-3">
                {raw.map((block) => (
                    <div key={block.title}>
                        <div className="text-body-lg text-filltext-ft-g">{block.title}</div>
                        <div className="mt-2">{renderIndentedText(block.content)}</div>
                    </div>
                ))}
            </div>
        );
    }

    return <div className="text-body-sm text-filltext-ft-f leading-6 whitespace-pre-wrap">{t(contentKey)}</div>;
}

export const SportsRulesPage: FC = () => {
    const t = useTranslations('sportsRules');
    const [openKey, setOpenKey] = useState<RuleSectionKey | null>(DEFAULT_OPEN_SECTION);

    return (
        <section className="px-4 py-6 md:px-4 md:py-6">
            <div className="mx-auto w-full max-w-[var(--main-content-max-width,1200px)]">
                <div className="rounded-md bg-surface-1 p-4 min-h-[var(--main-content-max-height,760px)]">
                    <div className="border-b border-filltext-ft-c pb-2">
                        <h1 className="text-headline-sm text-filltext-ft-g">{t('title')}</h1>
                    </div>

                    <div className="mt-2 flex flex-col">
                        {SECTIONS.map((sec) => {
                            const isOpen = openKey === sec.key;
                            return (
                                <Collapsible
                                    key={sec.key}
                                    open={isOpen}
                                    onOpenChange={(nextOpen) => setOpenKey(nextOpen ? sec.key : null)}
                                >
                                    <CollapsibleTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                'w-full flex items-center justify-start rounded-full px-4 py-2 text-left transition-colors cursor-pointer',
                                                'hover:bg-surface-1',
                                            )}
                                        >
                                            <span className="flex items-center gap-4">
                                                <span
                                                    className={cn(
                                                        'text-title-md',
                                                        isOpen ? 'text-filltext-ft-g' : 'text-filltext-ft-f',
                                                    )}
                                                >
                                                    {t(sec.titleKey)}
                                                </span>
                                                <ArrowDown
                                                    className={cn(
                                                        'size-4 shrink-0 text-filltext-ft-f transition-transform',
                                                        isOpen && '-scale-y-100',
                                                    )}
                                                />
                                            </span>
                                        </button>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <div className="mt-2 rounded-md bg-filltext-ft-a p-3 mx-4">
                                            <div className="max-h-[400px] overflow-y-auto pr-2">
                                                <RuleSectionContent contentKey={sec.contentKey} t={t} />
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
