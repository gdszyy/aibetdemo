'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { Button } from '@/components/button/button';
import {
    UcAffiliate,
    UcAffiliateActive,
    UcDeposit,
    UcDepositActive,
    UcGamblingGames,
    UcGamblingGamesActive,
    UcHelpFaq,
    UcHelpFaqActive,
    UcKyc,
    UcKycActive,
    UcLogout,
    UcNotification,
    UcNotificationActive,
    UcSecurityCenter,
    UcSecurityCenterActive,
    UcSetting,
    UcSettingActive,
    UcSupport,
    UcSupportActive,
    UcTransaction,
    UcTransactionActive,
    UcWithdraw,
    UcWithdrawActive,
    User,
} from '@/components/icons';
import { Modal } from '@/components/modal/modal';
import { SidebarGroup, SidebarItem } from '@/components/sidebar';
import { SidebarShell } from '@/components/sidebar/sidebar-shell';
import { ACCOUNT_ROUTES, getVisibleAccountRoutes } from '@/constants/account-routes';
import { UserCenterMenu } from '@/constants/user-center';
import { useKycRequiredToast } from '@/hooks/use-kyc-state';
import { useLogout } from '@/hooks/use-logout';
import { usePathname, useRouter } from '@/i18n';
import { useUser } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';

type IconComponent = FC<{ className?: string }>;

const ACCOUNT_ICON_MAP: Record<string, { default: IconComponent; active: IconComponent }> = {
    'uc-profile': { default: User, active: User },
    'uc-deposit': { default: UcDeposit, active: UcDepositActive },
    'uc-withdraw': { default: UcWithdraw, active: UcWithdrawActive },
    'uc-kyc': { default: UcKyc, active: UcKycActive },
    'uc-security-center': { default: UcSecurityCenter, active: UcSecurityCenterActive },
    'uc-affiliate': { default: UcAffiliate, active: UcAffiliateActive },
    'uc-transaction': { default: UcTransaction, active: UcTransactionActive },
    'uc-gambling-games': { default: UcGamblingGames, active: UcGamblingGamesActive },
    'uc-setting': { default: UcSetting, active: UcSettingActive },
    'uc-support': { default: UcSupport, active: UcSupportActive },
    'uc-notification': { default: UcNotification, active: UcNotificationActive },
    'uc-help-faq': { default: UcHelpFaq, active: UcHelpFaqActive },
    'uc-logout': { default: UcLogout, active: UcLogout },
};

function AccountSidebarContent() {
    const t = useTranslations('user');
    const router = useRouter();
    const pathname = usePathname();
    const user = useUser();
    const { logout, logoutConfirmProps } = useLogout();
    const visibleRoutes = getVisibleAccountRoutes(user?.kyc_status);

    const { checkKycRequired } = useKycRequiredToast();

    const onMenuClick = (menu: (typeof visibleRoutes)[0]) => {
        // check kyc required
        if (
            ACCOUNT_ROUTES.some((r) => menu.path.startsWith(r.path) && r.kycRequired) &&
            !checkKycRequired({
                ignoreSwitch: menu.path.includes('account/withdraw'),
            })
        ) {
            return;
        }

        // logout
        if (menu.menu === UserCenterMenu.LOGOUT) {
            logout();
            return;
        }

        router.push(menu.path);
    };

    return (
        <>
            <SidebarGroup>
                {visibleRoutes.map((route) => {
                    const iconEntry = ACCOUNT_ICON_MAP[route.icon];
                    return (
                        <SidebarItem
                            key={route.path}
                            icon={iconEntry?.default}
                            activeIcon={iconEntry?.active}
                            label={t(route.titleKey)}
                            href={route.path}
                            onClick={(e) => {
                                e.preventDefault();
                                onMenuClick(route);
                            }}
                            isActive={pathname === route.path || pathname.startsWith(`${route.path}/`)}
                        />
                    );
                })}
            </SidebarGroup>

            {/* Logout confirmation modal */}
            <Modal
                visible={logoutConfirmProps.visible}
                onClose={logoutConfirmProps.onCancel}
                closeButton={false}
                withBg={false}
            >
                <div className="w-[calc(100vw-2rem)] max-w-[435px] rounded-md bg-surface-raised p-6 flex flex-col gap-6">
                    <p className="text-title-md">{logoutConfirmProps.title}</p>
                    <div className="flex justify-end gap-[10px]">
                        <Button variant="secondary" onClick={logoutConfirmProps.onCancel} className="flex-1 h-10">
                            {logoutConfirmProps.cancelText}
                        </Button>
                        <Button
                            variant="primary"
                            onClick={logoutConfirmProps.onConfirm}
                            loading={logoutConfirmProps.loading}
                            className="flex-1 h-10"
                        >
                            {logoutConfirmProps.confirmText}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export function AccountSidebar({ collapsed, hideHeader }: { collapsed: boolean; hideHeader?: boolean }) {
    const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed);

    return (
        <SidebarShell collapsed={collapsed} onCollapsedChange={setSidebarCollapsed} hideHeader={hideHeader}>
            <AccountSidebarContent />
        </SidebarShell>
    );
}
