import type { FC } from 'react';
import type { TranslationKey } from '@/i18nV2/types';

export const TRANSACTIONS_PAGE_SIZE = 10;

export interface ColumnConfig {
    key: TranslationKey<'transaction'>;
    width: string;
}

export const TRANSACTIONS_COLUMNS: ColumnConfig[] = [
    { key: 'transactionsCaptionTransactionType', width: 'w-[200px]' },
    { key: 'transactionsCaptionCurrencyType', width: 'w-[150px]' },
    { key: 'transactionsCaptionAmount', width: 'w-[140px]' },
    { key: 'transactionsCaptionTotalBalance', width: 'w-[140px]' },
    { key: 'transactionsCaptionNotice', width: 'min-w-[140px] flex-1' },
];

const RowSkeleton: FC = () => (
    <div className="bg-filltext-ft-b rounded-xs flex flex-col gap-1 px-4 py-2">
        <div className="flex justify-between h-5">
            <div className="h-4 w-32 animate-skeleton-pulse rounded bg-surface-raised/30" />
            <div className="h-4 w-64 animate-skeleton-pulse rounded bg-surface-raised/30" />
        </div>
        <div className="flex gap-2 items-center h-9">
            {TRANSACTIONS_COLUMNS.map((col) => (
                <div key={col.key} className={`${col.width} shrink-0`}>
                    <div className="h-4 w-20 animate-skeleton-pulse rounded bg-surface-raised/30" />
                </div>
            ))}
        </div>
    </div>
);

export const ListSkeleton: FC = () => (
    <div className="flex flex-col gap-2 min-w-fit">
        {[1, 2, 3, 4].map((i) => (
            <RowSkeleton key={i} />
        ))}
    </div>
);
