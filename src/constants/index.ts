/** Cache keys */
export enum StorageEnum {
    /** User - Login Token */
    UserToken = 'user_token',
    /** User - Login Info */
    UserInfo = 'user_info',
    /** One-time flag for generic post-login UI flow */
    PostLogin = '__post_login__',
    /** One-time flag to auto-open bet slip after login cart restore */
    PostLoginAutoOpenBetSlip = '__post_login_auto_open_bet_slip__',
    /** One-time flag to auto-open bet slip after returning from deposit flow */
    PostDepositAutoOpenBetSlip = '__post_deposit_auto_open_bet_slip__',
    /** One-time ad placement trigger to recover SSE activity after reload */
    PendingAdPlacementTrigger = '__pending_ad_placement_trigger__',
    /** User-selected current currency */
    UserCurrency = 'user_currency',
    /** Persisted analytics attribution params */
    AnalyticsAttribution = 'analytics_attribution',
    /** Auth page entry timestamp for analytics duration */
    AnalyticsAuthPageEnterAt = 'analytics_auth_page_enter_at',
    /** Firebase Analytics view session cache */
    AnalyticsViewSession = 'analytics_view_session',
    /** First deposit page analytics flag */
    AnalyticsFirstDepositPageClick = 'analytics_first_deposit_page_click',
    /** First withdraw page analytics flag */
    AnalyticsFirstWithdrawPageClick = 'analytics_first_withdraw_page_click',
    /** First casino page analytics flag */
    AnalyticsFirstCasinoPageClick = 'analytics_first_casino_page_click',
    /** First in-play page analytics flag */
    AnalyticsFirstInplayPageClick = 'analytics_first_inplay_page_click',
}

/** Global DOM IDs */
export enum DomIdEnum {
    /** App Container */
    AppContainer = '__root-dom-app-container',
    /** Modal Container */
    ModalContainer = '__root-dom-modal-container',
    /** Toast Container */
    ToastContainer = '__root-dom-toast-container',
}

/**
 * API Error Code Constants
 * Used for handling different types of authentication and API errors
 */
export const ERROR_CODE = {
    /** Token expired - silent handling (no error message shown) */
    TOKEN_EXPIRED_SILENT: 1000,
    /** Token expired - show error message and close user center */
    TOKEN_EXPIRED_WITH_MESSAGE: 1001,
} as const;

/**
 * Fixed locale for internal formatting / parsing (Intl API).
 * NOT user-facing — guarantees consistent output (dot decimal, MM/DD/YYYY)
 * regardless of the user's display locale.
 */
export const INVARIANT_LOCALE = 'en-US';

/** App display name — sourced from NEXT_PUBLIC_APP_NAME env var */
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'GOTOBET';

/** WebSocket debug log switch — sourced from NEXT_PUBLIC_SHOW_WS_LOG env var */
export const SHOW_WS_LOG = process.env.NEXT_PUBLIC_SHOW_WS_LOG === 'true';
