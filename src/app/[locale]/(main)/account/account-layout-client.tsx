'use client';

import { useEffect, useMemo } from 'react';
import { UserKycStatus } from '@/api/models/user';
import { Footer } from '@/components/footer';
import { ACCOUNT_ROUTES } from '@/constants/account-routes';
import { useIsDesktop } from '@/hooks/use-media-query';
import { usePathname, useRouter } from '@/i18n';
import { DepositModal } from '@/modules/deposit';
import { RightAside } from '@/modules/home/_components/right-aside';
import { AccountSidebar } from '@/modules/user-center/_components/account-sidebar';
import { SessionStatusEnum, useSessionStore, useUser } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';

export function AccountLayoutClient({ children }: Readonly<{ children: React.ReactNode }>) {
    const isDesktop = useIsDesktop();
    const sessionStatus = useSessionStore((s) => s.status);
    const router = useRouter();
    const pathname = usePathname();
    const user = useUser();
    const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
    const depositModalOpen = useUIStore((s) => s.depositModalOpen);
    const closeDepositModal = useUIStore((s) => s.closeDepositModal);

    const routeRequiresKyc = useMemo(
        () => ACCOUNT_ROUTES.some((r) => pathname.startsWith(r.path) && r.kycRequired),
        [pathname],
    );

    // Auth guard: redirect to home only after session confirms unauthenticated
    useEffect(() => {
        if (sessionStatus === SessionStatusEnum.Unauthenticated) {
            router.push('/');
        }
    }, [sessionStatus, router]);

    // KYC guard: redirect to KYC page when accessing KYC-required routes without verification
    useEffect(() => {
        if (sessionStatus !== SessionStatusEnum.Authenticated) return;
        if (!routeRequiresKyc) return;
        if (user?.kyc_status === UserKycStatus.Success) return;
        router.replace('/account/kyc');
    }, [sessionStatus, routeRequiresKyc, user?.kyc_status, router]);

    if (sessionStatus !== SessionStatusEnum.Authenticated) {
        return null;
    }

    return (
        <>
            <div className="flex flex-1 w-full relative">
                {/* Desktop account sidebar - pinned to top (Fixed top-0) */}
                {isDesktop && (
                    <div
                        className={cn(
                            'shrink-0 transition-[width] duration-200 ease-in-out fixed top-[calc(72px+var(--header-strip-height))] left-0 h-[calc(100vh-72px-var(--header-strip-height))] z-50 overflow-y-auto overscroll-y-contain',
                            sidebarCollapsed ? 'w-[var(--sidebar-width-collapse)]' : 'w-[var(--sidebar-width-expand)]',
                        )}
                    >
                        <AccountSidebar collapsed={sidebarCollapsed} hideHeader />
                    </div>
                )}

                {/* Content area */}
                <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex flex-1">
                        <div className="@container flex min-w-0 flex-1 flex-col relative">
                            <div className="max-w-[var(--main-content-max-width)] w-full mx-auto flex-auto">
                                {children}
                            </div>
                            {isDesktop && <Footer />}
                        </div>

                        {/* Right column - toolbar */}
                        {isDesktop && (
                            <div className="flex flex-col sticky top-[calc(72px+var(--header-strip-height))] h-[calc(100vh-72px-var(--header-strip-height))] shrink-0 z-20">
                                <aside className="flex flex-1 min-h-0 shrink-0 border-l-[0.5px] border-filltext-ft-c bg-surface-1">
                                    <RightAside />
                                </aside>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {!isDesktop && <DepositModal visible={depositModalOpen} onClose={closeDepositModal} />}
        </>
    );
}
