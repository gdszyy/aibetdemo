'use client';

import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/drawer/drawer';
import { CloseOutlined } from '@/components/icons2/CloseOutlined';
import { PromoParlayBoostWarn } from '@/components/icons2/PromoParlayBoostWarn';
import { Tooltip } from '@/components/tooltip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useIsDesktop } from '@/hooks/use-media-query';
import { cn } from '@/utils/common';
import type { ParlayBoostPayoutPreview } from '@/utils/parlay-boost-preview';

interface ParlayBoostPayoutWarnProps {
    /** 串关加赔派彩预览。 */
    payoutPreview: ParlayBoostPayoutPreview;
    /** 自定义类名。 */
    className?: string;
}

/** 串关加赔派彩截断警告：PC hover tooltip，H5 点击 sheet。 */
export const ParlayBoostPayoutWarn: FC<ParlayBoostPayoutWarnProps> = ({ payoutPreview, className }) => {
    const t = useTranslations('betSlip.parlayBoost');
    const isDesktop = useIsDesktop();
    const { formatCurrency } = useIntlFormatter();
    const [sheetOpen, setSheetOpen] = useState(false);

    if (!payoutPreview.truncated) {
        return null;
    }

    const message = t('payoutCapTooltip', {
        cap: formatCurrency(payoutPreview.boostCap),
    });

    const trigger = (
        <button
            type="button"
            onClick={isDesktop ? undefined : () => setSheetOpen(true)}
            className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-xs hover:bg-filltext-ft-a',
                !isDesktop && 'cursor-pointer active:scale-95',
                className,
            )}
        >
            <PromoParlayBoostWarn className="size-4 text-brand-red" />
        </button>
    );

    if (isDesktop) {
        return (
            <Tooltip content={message} side="top" align="end">
                {trigger}
            </Tooltip>
        );
    }

    return (
        <>
            {trigger}
            <Drawer open={sheetOpen} onOpenChange={setSheetOpen}>
                <DrawerContent
                    overlayClassName="bg-black/55"
                    className={cn(
                        'mx-auto flex max-h-[50vh] w-full max-w-[430px] flex-col overflow-hidden border border-neutral-white-h bg-surface-1 px-4 pb-6 pt-7',
                        'rounded-t-[24px] shadow-floating',
                        '[&>div:first-child]:hidden',
                    )}
                >
                    <DrawerTitle className="sr-only">{message}</DrawerTitle>

                    <div className="absolute left-1/2 top-2 h-[5px] w-[35px] -translate-x-1/2 rounded-[30px] bg-filltext-ft-d" />

                    <button
                        type="button"
                        onClick={() => setSheetOpen(false)}
                        className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-xs text-filltext-ft-f active:scale-95"
                    >
                        <CloseOutlined className="size-3" />
                        <span className="sr-only">{t('payoutCapSheetClose')}</span>
                    </button>

                    <p className="pt-8 text-body-sm text-filltext-ft-g">{message}</p>
                </DrawerContent>
            </Drawer>
        </>
    );
};
