import { UserKycStatus } from '@/api/models/user';
import type { TranslationKey } from '@/i18nV2/types';
import { config } from './config';
import { UserCenterMenu } from './user-center';

export interface AccountRouteConfig {
    menu: UserCenterMenu;
    /** Route path, e.g. '/account/deposit' */
    path: string;
    /** i18n key within 'user' namespace */
    titleKey: TranslationKey<'user'>;
    /** Icon component name (kebab-case, maps to `uc-*` icons) */
    icon: string;
    /** Whether KYC verification is required to access this route */
    kycRequired?: boolean;
    /** Visual group number (separator rendered between different groups) */
    group: number;
}

export const ACCOUNT_ROUTES: AccountRouteConfig[] = [
    {
        menu: UserCenterMenu.PROFILE,
        path: '/account/profile',
        titleKey: 'menus.profile',
        icon: 'uc-profile',
        group: 0,
    },
    {
        menu: UserCenterMenu.DEPOSIT,
        path: '/account/deposit',
        titleKey: 'menus.deposit',
        icon: 'uc-deposit',
        kycRequired: true && !config.disableKycVerify,
        group: 0,
    },
    {
        menu: UserCenterMenu.WITHDRAW,
        path: '/account/withdraw',
        titleKey: 'menus.withdraw',
        icon: 'uc-withdraw',
        kycRequired: true,
        group: 0,
    },
    { menu: UserCenterMenu.KYC, path: '/account/kyc', titleKey: 'menus.kyc', icon: 'uc-kyc', group: 0 },
    {
        menu: UserCenterMenu.TRANSACTION,
        path: '/account/transactions',
        titleKey: 'menus.transaction',
        icon: 'uc-transaction',
        group: 1,
    },
    {
        menu: UserCenterMenu.SECURITY_CENTER,
        path: '/account/security',
        titleKey: 'menus.securityCenter',
        icon: 'uc-security-center',
        group: 1,
    },
    {
        menu: UserCenterMenu.HEALTH,
        path: '/account/gambling-games',
        titleKey: 'menus.gambling',
        icon: 'uc-gambling-games',
        group: 2,
    },
    {
        menu: UserCenterMenu.AFFILIATE,
        path: '/account/affiliate',
        titleKey: 'menus.affiliate',
        icon: 'uc-affiliate',
        group: 2,
    },
    {
        menu: UserCenterMenu.SETTING,
        path: '/account/settings',
        titleKey: 'menus.setting',
        icon: 'uc-setting',
        group: 2,
    },
    { menu: UserCenterMenu.SUPPORT, path: '/account/support', titleKey: 'menus.support', icon: 'uc-support', group: 3 },
    {
        menu: UserCenterMenu.NOTIFICATION,
        path: '/account/notifications',
        titleKey: 'menus.notification',
        icon: 'uc-notification',
        group: 3,
    },
    { menu: UserCenterMenu.FAQ, path: '/account/faq', titleKey: 'menus.faq', icon: 'uc-help-faq', group: 3 },
    {
        menu: UserCenterMenu.LOGOUT,
        path: '#',
        titleKey: 'menus.logout',
        icon: 'uc-logout',
        group: 4,
    },
];

/** All account route prefixes, used by navigation.ts to determine sidebar visibility */
export const ACCOUNT_PREFIXES = ACCOUNT_ROUTES.map((r) => r.path);

/** Look up route path by menu enum */
export function getAccountPath(menu: UserCenterMenu): string {
    return ACCOUNT_ROUTES.find((r) => r.menu === menu)?.path ?? '/account/deposit';
}

/** Filter account routes by user state (e.g. hide KYC when verified) */
export function getVisibleAccountRoutes(kycStatus?: number): AccountRouteConfig[] {
    return ACCOUNT_ROUTES.filter((route) => {
        if (route.menu === UserCenterMenu.KYC && kycStatus === UserKycStatus.Success) return false;
        return true;
    });
}
