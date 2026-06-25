import type { FC, ReactNode } from 'react';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { cn } from '@/utils/common';

interface ShortCut {
    amount: number;
    badge?: ReactNode;
}

export const DEFAULT_SHORTCUTS: ShortCut[] = [50, 100, 300, 500, 1000, 5000].map((v) => ({ amount: v }));

interface Props {
    /** Current input amount */
    curAmount: number;
    /** Shortcut amount button click callback */
    onShortcutClick: (amount: number) => void;
    /** Shortcut amount list */
    shortcutList?: ShortCut[];
    /** Hide shortcuts below this amount */
    minAmount?: number;
    /** Hide shortcuts above this amount */
    maxAmount?: number;
    className?: string;
}
/**
 * Amount shortcut button list
 * @returns
 */
export const FunsSelectShortCutList: FC<Props> = ({
    curAmount,
    onShortcutClick,
    shortcutList = DEFAULT_SHORTCUTS,
    minAmount,
    maxAmount,
    className,
}) => {
    const { currencySymbolNarrow } = useIntlFormatter();

    return (
        <div className={cn('grid w-full grid-cols-3 gap-[10px]', className)}>
            {shortcutList
                .filter((v) => {
                    const amount = v.amount;
                    const isLowerOK = typeof minAmount === 'number' ? amount >= minAmount : true;
                    const isUpperOK = typeof maxAmount === 'number' ? amount <= maxAmount : true;
                    return isLowerOK && isUpperOK;
                })
                .map((v) => {
                    const amount = v.amount;
                    const isActive = amount === curAmount;

                    return (
                        <button
                            type="button"
                            key={amount}
                            className={cn(
                                'relative',
                                'group flex h-10 w-full cursor-pointer items-center justify-between rounded-sm p-2 transition-colors',
                                'text-body-md font-poppins',
                                'bg-filltext-ft-a text-filltext-ft-g',
                                'hover:bg-brand-primary-1 hover:text-brand-primary-0',
                                'active:bg-brand-primary-0 active:text-on-brand',
                                isActive && 'bg-brand-primary-0 text-on-brand',
                            )}
                            onClick={() => onShortcutClick(amount)}
                        >
                            <span>{currencySymbolNarrow}</span>
                            <span className={cn('text-current')}>{amount}</span>
                            {v.badge || null}
                        </button>
                    );
                })}
        </div>
    );
};
