'use client';

import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible/collapsible';
import { ArrowDown } from '@/components/icons';
import type { TranslationKey } from '@/i18nV2/types';
import { cn } from '@/utils/common';

type LegalDocPageProps = {
    titleKey: TranslationKey<'legal'>;
    contentKey: TranslationKey<'legal'>;
};

export const LegalDocPage: FC<LegalDocPageProps> = ({ titleKey, contentKey }) => {
    const t = useTranslations('legal');
    const [open, setOpen] = useState(true);

    const raw = t.raw(contentKey) as unknown;
    const blocks = Array.isArray(raw)
        ? (raw as { title: string; subtitle?: string; content: string | { title: string; content: string }[] }[])
        : null;
    const first = blocks?.[0] ?? null;
    const pillTitle = first?.title || t(titleKey);
    const subtitleText = first?.subtitle ?? null;
    const contentValue = first?.content ?? null;

    const renderIndentedText = (text: string) => {
        const lines = text.split('\n');
        const isPageSeparator = (trimmed: string) => /^--\s*\d+\s+of\s+\d+\s*--$/.test(trimmed);
        const isBullet = (trimmed: string) => /^[-•●]/.test(trimmed);
        const isLevel3 = (trimmed: string) => /^\d+\.\d+\.\d+/.test(trimmed);
        const isLevel2 = (trimmed: string) => /^\d+\.\d+/.test(trimmed);
        const isLevel1 = (trimmed: string) => /^\d+\./.test(trimmed);
        const isRomanNumeral = (trimmed: string) => /^[IVXLC]+\./.test(trimmed);

        const isStructuralLine = (trimmed: string) =>
            isBullet(trimmed) || isLevel3(trimmed) || isLevel2(trimmed) || isLevel1(trimmed) || isRomanNumeral(trimmed);

        // PDF-to-text extraction usually inserts hard newlines at arbitrary wrap widths.
        // Merge non-structural line breaks into the previous line for a more readable layout.
        const normalizedLines: string[] = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) {
                normalizedLines.push('');
                continue;
            }

            if (isPageSeparator(trimmed)) continue;

            const last = normalizedLines[normalizedLines.length - 1];
            const prev = last ?? '';
            const prevEndsSentence = /[.!?]$/.test(prev);
            const nextStartsParen = trimmed.startsWith('(');
            const canMerge = prev !== '' && !isStructuralLine(trimmed) && !prevEndsSentence && !nextStartsParen;

            if (canMerge) {
                normalizedLines[normalizedLines.length - 1] = `${last} ${trimmed}`;
                continue;
            }

            normalizedLines.push(trimmed);
        }

        const lineKeyCounts = new Map<string, number>();
        return (
            <div className="flex flex-col gap-1">
                {normalizedLines.map((line) => {
                    const trimmed = line.trim();
                    const count = lineKeyCounts.get(trimmed) ?? 0;
                    lineKeyCounts.set(trimmed, count + 1);
                    const key = `${trimmed || 'blank'}-${count}`;

                    if (!trimmed) return <div key={key} className="h-2" />;

                    const bullet = isBullet(trimmed);
                    const level3 = isLevel3(trimmed);
                    const level2 = isLevel2(trimmed);
                    const level1 = isLevel1(trimmed);

                    return (
                        <p
                            key={key}
                            className={cn(
                                'text-body-md text-filltext-ft-f leading-6',
                                level3 ? 'pl-6' : level2 ? 'pl-4' : level1 || bullet ? 'pl-3' : 'pl-0',
                            )}
                        >
                            {trimmed}
                        </p>
                    );
                })}
            </div>
        );
    };

    const renderBlockContent = (content: string | { title: string; content: string }[]) => {
        if (typeof content === 'string') return renderIndentedText(content);

        return (
            <div className="flex flex-col gap-3">
                {content.map((item, idx) => (
                    <div key={`${item.title}-${idx}`}>
                        {item.title.trim() ? <div className="text-body-lg text-filltext-ft-g">{item.title}</div> : null}
                        <div className={item.title.trim() ? 'mt-2' : ''}>{renderIndentedText(item.content)}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section className="px-4 py-6 md:px-4 md:py-6">
            <div className="mx-auto w-full max-w-[var(--main-content-max-width,1200px)] ">
                <div className="rounded-md bg-surface-1 p-4 min-h-[var(--main-content-max-height,760px)]">
                    <div className="border-b border-filltext-ft-c pb-2">
                        <h1 className="text-headline-sm text-filltext-ft-g">{t(titleKey)}</h1>
                    </div>
                    <Collapsible open={open} onOpenChange={setOpen} className="mt-2">
                        <CollapsibleTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    'w-full flex items-center justify-between gap-4 rounded-full px-4 py-2 text-left transition-colors',
                                    'hover:bg-surface-1',
                                )}
                            >
                                <span
                                    className={cn('text-title-md', open ? 'text-filltext-ft-g' : 'text-filltext-ft-f')}
                                >
                                    {pillTitle}
                                </span>
                                {/* if only one block, hide CollapsibleTrigger */}
                                {blocks?.length && blocks.length > 1 && (
                                    <ArrowDown
                                        className={cn(
                                            'size-4 shrink-0 text-filltext-ft-f transition-transform',
                                            open && '-scale-y-100',
                                        )}
                                    />
                                )}
                            </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4">
                            {subtitleText && (
                                <div className="mt-2 text-body-md text-filltext-ft-g leading-6 whitespace-pre-wrap">
                                    {subtitleText}
                                </div>
                            )}

                            <div className="mt-3 rounded-md bg-filltext-ft-a p-3">
                                <div className="max-h-[400px] overflow-y-auto pr-2">
                                    {contentValue ? (
                                        renderBlockContent(contentValue)
                                    ) : (
                                        <div className="text-body-sm text-filltext-ft-f leading-6 whitespace-pre-wrap">
                                            {t(contentKey)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>
        </section>
    );
};
