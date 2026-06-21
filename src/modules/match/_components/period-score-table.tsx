'use client';

import type { FC } from 'react';
import type { PeriodScoreCell } from '@/modules/match/_utils/match-utils';
import { cn } from '@/utils/common';

type PeriodScoreTableProps = {
    homeCells: PeriodScoreCell[];
    awayCells: PeriodScoreCell[];
    className?: string;
};

const getHeaderCellClassName = (): string =>
    cn('min-w-7 pb-2.5 text-center whitespace-nowrap text-auxiliary-sm text-filltext-ft-e');

const getBodyCellClassName = (cell: PeriodScoreCell, className?: string): string =>
    cn(
        'min-w-7 text-center tabular-nums',
        className,
        cell.strong ? 'text-body-lg text-filltext-ft-h' : 'text-body-sm text-filltext-ft-f',
    );

export const PeriodScoreTable: FC<PeriodScoreTableProps> = ({ homeCells, awayCells, className }) => {
    if (homeCells.length === 0) {
        return null;
    }

    return (
        <table className={cn('inline-table border-separate border-spacing-x-1 border-spacing-y-0', className)}>
            <thead>
                <tr>
                    {homeCells.map((cell) => (
                        <th key={cell.key} scope="col" className={getHeaderCellClassName()}>
                            {cell.label || '\u00A0'}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {homeCells.map((cell) => (
                        <td key={cell.key} className={getBodyCellClassName(cell, 'pb-2')}>
                            {cell.score ?? ''}
                        </td>
                    ))}
                </tr>
                <tr>
                    {awayCells.map((cell) => (
                        <td key={cell.key} className={getBodyCellClassName(cell)}>
                            {cell.score ?? ''}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    );
};
