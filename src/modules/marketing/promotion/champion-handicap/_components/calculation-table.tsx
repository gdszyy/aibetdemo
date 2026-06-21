'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Question } from '@/components/icons';
import { Tooltip } from '@/components/tooltip';
import { useIsDesktop } from '@/hooks/use-media-query';
import type { ChampionHandicapTable } from '../_constants/data';
import { useChampionHandicapTranslationValues } from '../_constants/region';

/** 表格单元格提示。 */
const CellTooltip = ({ content }: { content: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <Tooltip content={content} side="top" open={open} onOpenChange={setOpen}>
            <button type="button" className="inline-flex items-center" onClick={() => setOpen((v) => !v)}>
                {/* 增加一个空格的位置 */}
                <Question className="size-4 shrink-0 text-filltext-ft-e mr-0.5" />
            </button>
        </Tooltip>
    );
};

interface ChampionHandicapCalculationTableProps {
    table: ChampionHandicapTable;
}

export const ChampionHandicapCalculationTable = ({ table }: ChampionHandicapCalculationTableProps) => {
    const t = useTranslations('promotion');
    const isDesktop = useIsDesktop();
    const translationValues = useChampionHandicapTranslationValues();

    return (
        <article className="rounded-sm bg-filltext-ft-a">
            <header className="flex min-h-[62px] items-center border-filltext-ft-c border-b-[0.5px] px-4 py-4">
                <h3 className="text-title-md text-filltext-ft-h">{t(table.titleKey, translationValues)}</h3>
            </header>

            <div className="p-4">
                <div className="flex flex-col gap-2 overflow-hidden rounded-xs bg-filltext-ft-a">
                    <div className="flex min-h-10 flex-row items-center self-stretch rounded-sm bg-surface-1 px-4 gap-4">
                        {table.columns.map((columnKey, index) => (
                            <div
                                key={columnKey}
                                className={`flex-1 min-w-0 py-2 text-body-lg text-filltext-ft-h ${index === 1 ? 'text-right md:text-left' : 'text-left'}`}
                            >
                                {t(columnKey, translationValues)}
                            </div>
                        ))}
                    </div>

                    {table.rows.map((row) => (
                        <div
                            key={row.id}
                            className="flex min-h-10 flex-row items-center self-stretch rounded-sm bg-surface-1 px-4 gap-4"
                        >
                            {row.cells.map((cellKey, index) => {
                                const tooltipKey = row.cellTooltips?.[index];
                                const cellText = t(cellKey, translationValues);
                                const rawTooltip = tooltipKey ? t(tooltipKey, translationValues) : undefined;
                                // next-intl returns the key itself as fallback when translation is missing/empty
                                const tooltipText = rawTooltip && rawTooltip !== tooltipKey ? rawTooltip : undefined;
                                return (
                                    <div
                                        // biome-ignore lint/suspicious/noArrayIndexKey: fixed table cells never reorder
                                        key={index}
                                        className={`flex-1 min-w-0 py-2 text-body-md text-filltext-ft-g text-left ${index === 1 ? 'text-right md:text-left text-func-win' : 'text-left'}`}
                                    >
                                        {tooltipText ? (
                                            isDesktop ? (
                                                `${cellText} (${tooltipText})`
                                            ) : (
                                                <span className="inline-flex items-center gap-1">
                                                    {cellText}
                                                    <CellTooltip content={tooltipText} />
                                                </span>
                                            )
                                        ) : (
                                            cellText
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
};
