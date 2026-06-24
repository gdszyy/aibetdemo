'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { DomIdEnum } from '@/constants';
import { BetSlipDrawer } from '@/modules/bet-slip';
import { cn } from '@/utils/common';
import { getPortalContainer } from '@/utils/dom';

interface BetSlipBottomSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const BetSlipBottomSheet: FC<BetSlipBottomSheetProps> = ({ open, onOpenChange }) => {
    const t = useTranslations('common');
    const componentProfile = useThemeComponentProfile();
    const isCtaLedSheet = componentProfile.betSlip.mobileFlow === 'cta-led-sheet';

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                showCloseButton={false}
                container={getPortalContainer(DomIdEnum.AppContainer)}
                overlayClassName="bottom-0 z-40 bg-[var(--mobile-sheet-overlay-bg)] backdrop-blur-0"
                className={cn(
                    'bottom-[env(safe-area-inset-bottom)] z-40',
                    isCtaLedSheet
                        ? 'h-[calc(100dvh-8px)] max-h-[calc(100dvh-8px)]'
                        : // 少量卡片时按内容高度展开（不顶满），上方留出蒙层空间；卡片多时封顶 72dvh 内部滚动
                          'h-auto max-h-[72dvh]',
                    'overflow-hidden rounded-t-[var(--mobile-sheet-radius)] border border-b-0 border-[color:var(--mobile-summary-bar-border)] bg-[var(--mobile-sheet-bg)] [box-shadow:var(--mobile-sheet-shadow)]',
                )}
                data-bet-slip-profile={componentProfile.betSlip.profile}
                data-mobile-bet-placement={componentProfile.betSlip.mobilePlacement}
                data-mobile-bet-flow={componentProfile.betSlip.mobileFlow}
                style={componentProfile.style}
                onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    (event.currentTarget as HTMLElement | null)?.focus();
                }}
            >
                <SheetTitle className="sr-only">{t('mainMenu.betSlip')}</SheetTitle>
                <SheetDescription className="sr-only">{t('dialog.ariaDescription')}</SheetDescription>
                <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--mobile-sheet-inner-bg)]">
                    <BetSlipDrawer className="min-h-0 w-full flex-1" />
                </div>
            </SheetContent>
        </Sheet>
    );
};
