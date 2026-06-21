import type { TranslationKey } from '@/i18nV2/types';

export enum UserCenterSourceEnum {
    PlaceBet = 'place_bet',
}

export type UserCenterSource = UserCenterSourceEnum;

/**
 * User Center Menu Enumeration
 *
 * @property {number} UNDEFINED - Undefined
 * @property {number} DEPOSIT - Deposit
 * @property {number} WITHDRAW - Withdraw
 * @property {number} KYC - KYC Verification
 * @property {number} SECURITY_CENTER - Security Center
 * @property {number} AFFILIATE - Affiliate
 * @property {number} TRANSACTION - Transaction Records
 * @property {number} SETTING - Setting
 * @property {number} SUPPORT - Support
 * @property {number} NOTIFICATION - Notification
 * @property {number} FAQ - FAQ
 * @property {number} LOGOUT - Logout
 * @property {number} PROFILE - User Profile
 */
export enum UserCenterMenu {
    UNDEFINED = 0,
    /** Deposit */
    DEPOSIT = 1,
    /** Withdraw */
    WITHDRAW = 2,
    /** KYC Verification */
    KYC = 3,
    /** Security Center */
    SECURITY_CENTER = 4,
    /** Affiliate */
    AFFILIATE = 5,
    /** Transaction Records */
    TRANSACTION = 6,
    /** Health Setting */
    HEALTH = 7,
    /** Setting */
    SETTING = 8,
    /** Support */
    SUPPORT = 9,
    /** Notification */
    NOTIFICATION = 10,
    /** FAQ */
    FAQ = 11,
    /** Logout */
    LOGOUT = 12,
    /** User Profile */
    PROFILE = 13,
}

/** Subtitle i18n keys for account menu items (within 'user' namespace) */
export const MENU_SUBTITLE_KEYS: Partial<Record<UserCenterMenu, TranslationKey<'user'>>> = {
    [UserCenterMenu.PROFILE]: 'menus.descProfile',
    [UserCenterMenu.TRANSACTION]: 'menus.descTransaction',
    [UserCenterMenu.KYC]: 'menus.descKyc',
    [UserCenterMenu.SECURITY_CENTER]: 'menus.descSecurityCenter',
    [UserCenterMenu.HEALTH]: 'menus.descHealth',
    [UserCenterMenu.AFFILIATE]: 'menus.descAffiliate',
    [UserCenterMenu.NOTIFICATION]: 'menus.descNotification',
    [UserCenterMenu.SUPPORT]: 'menus.descSupport',
    [UserCenterMenu.FAQ]: 'menus.descFaq',
    [UserCenterMenu.SETTING]: 'menus.descSetting',
};
