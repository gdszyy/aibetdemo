/** Analytics event type */
export enum AnalyticsEventType {
    /** Home page view */
    HomePageView = 1,
    /** Page load view (10 seconds) */
    PageLoadView = 2,
    /** User session engagement */
    SessionEngagement = 3,
}

/** Campaign attribution params persisted from landing URL */
export interface AnalyticsAttribution {
    /** Ad platform click identifier */
    clickid?: string;
    /** Channel identifier */
    ch?: string;
}

/** 注册归因参数，随新用户注册登录请求提交 */
export interface RegistrationAnalyticsParams extends AnalyticsAttribution {
    /** 当前浏览器 User-Agent */
    user_agent: string;
}

/** Login analytics payload — sent inside LoginParams */
export interface LoginAnalyticsAttribution {
    /** Channel ID */
    ads_ch_code: number;
    /** Channel params */
    ads_ch_params: RegistrationAnalyticsParams;
}

/** Analytics reporting payload for /v1/ads/track */
export interface AnalyticsReportParams extends AnalyticsAttribution {
    /** Current page pathname */
    pathname: string;
    /** Current browser user agent */
    user_agent: string;
}

/** Analytics reporting payload for /v1/ads/track */
export interface AnalyticsPayload {
    /** Event type: 1=HomePageView, 2=PageLoadView, 3=SessionEngagement */
    event_type: AnalyticsEventType;
    /** Channel ID */
    ch: number;
    /** Attribution params */
    params: AnalyticsReportParams;
}

/** Firebase Analytics 业务事件名。 */
export enum FirebaseAnalyticsEventName {
    /** 点击登录/注册入口。 */
    AuthPageEntryClick = 'auth_page_entry_click',
    /** 登录/注册弹窗或页面曝光。 */
    AuthPageView = 'auth_page_view',
    /** 关闭登录/注册弹窗。 */
    AuthPageClose = 'auth_page_close',
    /** 点击登录/注册提交按钮。 */
    AuthSubmitClick = 'auth_submit_click',
    /** 注册成功。 */
    RegisterSuccess = 'register_success',
    /** 注册失败。 */
    RegisterFail = 'register_fail',
    /** 登录成功。 */
    LoginSuccess = 'login_success',
    /** 登录失败。 */
    LoginFail = 'login_fail',
    /** 首次进入充值页。 */
    FirstDepositPageClick = 'first_deposit_page_click',
    /** 输入充值金额。 */
    DepositAmountInput = 'deposit_amount_input',
    /** 点击确认充值。 */
    DepositConfirmClick = 'deposit_confirm_click',
    /** 首次进入提现页。 */
    FirstWithdrawPageClick = 'first_withdraw_page_click',
    /** 首次进入 Casino 页。 */
    FirstCasinoPageClick = 'first_casino_page_click',
    /** 首次进入滚球页。 */
    FirstInplayPageClick = 'first_inplay_page_click',
}

/** Firebase Analytics 自定义参数值。 */
export type FirebaseAnalyticsParamValue = string | number | boolean;

/** Firebase Analytics 自定义参数。 */
export type FirebaseAnalyticsParams = Record<string, FirebaseAnalyticsParamValue>;
