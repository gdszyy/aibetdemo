'use client';

import { useTranslations } from 'next-intl';
import { Dialog, VisuallyHidden } from 'radix-ui';
import { type FC, useState } from 'react';
import { Close } from '@/components/icons';
import { MenuOutlined } from '@/components/icons2/MenuOutlined';
import { Logo } from '@/components/Logo';
import { Link, usePathname } from '@/i18n';
import { getSidebarType } from '@/libs/navigation';
import { CasinoSidebar } from '@/modules/casino/_components/casino-sidebar';
import { Sidebar } from '@/modules/match/sidebar';
import { AccountSidebar } from '@/modules/user-center/_components/account-sidebar';
import { cn } from '@/utils/common';

export const MobileNav: FC = () => {
    const t = useTranslations('common');
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const sidebarType = getSidebarType(pathname);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                <button
                    type="button"
                    className={cn(
                        'flex size-9 items-center justify-center rounded-[9px] border transition-colors active:[opacity:var(--mobile-touch-active-opacity)]',
                        open
                            ? 'border-brand-primary-0 bg-brand-primary-0 text-on-brand'
                            : 'border-[color:var(--mobile-menu-border)] bg-[var(--mobile-menu-bg)] text-filltext-ft-h',
                    )}
                >
                    <MenuOutlined className="size-4" />
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--mobile-drawer-overlay-bg)] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content
                    className={cn(
                        'fixed inset-y-0 left-0 z-50 h-full w-[250px] max-w-[80vw] overflow-hidden border-r border-[color:var(--mobile-drawer-border)] bg-[var(--mobile-drawer-bg)] transition ease-in-out [box-shadow:var(--mobile-drawer-shadow)] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-left-100 data-[state=open]:slide-in-from-left-100 duration-300',
                    )}
                >
                    <Dialog.Title asChild>
                        <VisuallyHidden.Root>{t('navigation.menuTitle')}</VisuallyHidden.Root>
                    </Dialog.Title>
                    <Dialog.Description asChild>
                        <VisuallyHidden.Root>{t('navigation.menuDescription')}</VisuallyHidden.Root>
                    </Dialog.Description>
                    <Dialog.Close
                        className="absolute top-3 right-3 z-10 grid size-7.5 cursor-pointer place-items-center rounded-[8px] border border-[color:var(--mobile-drawer-close-border)] bg-[var(--mobile-drawer-close-bg)] text-filltext-ft-f transition-colors hover:text-filltext-ft-h active:[opacity:var(--mobile-touch-active-opacity)]"
                        aria-label="Close"
                    >
                        <Close className="size-3.5" />
                    </Dialog.Close>

                    {/* Sidebar content */}
                    <div className="flex h-full flex-col">
                        <div className="shrink-0 border-filltext-ft-c/50 border-b px-4 pt-[env(safe-area-inset-top)]">
                            <div className="flex h-14 items-center">
                                <Link href="/" onClick={() => setOpen(false)} className="inline-block">
                                    <Logo className="w-30" variant="long" />
                                </Link>
                            </div>
                        </div>
                        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {sidebarType === 'casino' ? (
                                <CasinoSidebar
                                    className="w-full bg-transparent border-none backdrop-blur-none"
                                    hideHeader
                                />
                            ) : sidebarType === 'account' ? (
                                <AccountSidebar collapsed={false} hideHeader />
                            ) : (
                                <Sidebar className="w-full bg-transparent border-none backdrop-blur-none" hideHeader />
                            )}
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
