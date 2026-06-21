import type { FC } from 'react';
import { BetType } from '@/api/models/cart';
import { useIsDesktop, useIsMobile } from '@/hooks/use-media-query';
import { useBetCartStore } from '@/modules/bet-slip/stores/bet-cart-store';
import { cn } from '@/utils/common';
import { EmptySlip } from '../_components/empty-slip';
import { useAllSelections } from '../stores/bet-slip-store';
import { CloseSlipBtn } from './_components/close-slip-btn';
import { Parlay } from './parlay';
import { Single } from './single';

export const Cart: FC = () => {
    const selections = useAllSelections();
    const betMode = useBetCartStore((state) => state.betMode);
    const isEmpty = selections.length === 0;
    const isShowClass = isEmpty ? 'hidden' : '';
    const isDesktop = useIsDesktop();
    const isMobile = useIsMobile();

    // Layout: scrollable card area + fixed bottom footer
    return (
        <div
            className={cn(
                'flex min-h-0 flex-1 flex-col',
                isDesktop && 'w-full',
                isDesktop && !isEmpty && 'rounded-b-sm bg-[var(--slip-panel-bg,var(--filltext-ft-b))]',
                !isDesktop && 'w-full',
            )}
        >
            {isEmpty && (
                <div className="flex-1 flex flex-col">
                    <div
                        className={cn(
                            isDesktop
                                ? 'w-full'
                                : 'mx-2 w-[calc(100%-16px)] bg-[var(--slip-panel-bg,var(--filltext-ft-b))] px-2',
                        )}
                    >
                        <EmptySlip text="Cupón vacío" card className="mt-2" />
                    </div>
                    <div className="flex-1" />
                    {isMobile && (
                        <div className="flex items-center justify-center rounded-t-sm bg-[var(--slip-footer-bg,var(--surface-1))] px-13.5 py-4">
                            <CloseSlipBtn />
                        </div>
                    )}
                </div>
            )}
            {betMode === BetType.Single ? <Single className={isShowClass} /> : <Parlay className={isShowClass} />}
        </div>
    );
};
