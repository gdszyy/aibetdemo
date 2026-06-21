import { userFetcher } from '@/api/client';
import type { RegistrationAnalyticsParams } from '@/api/models/analytics';

/** Login type */
export enum LoginType {
    Mobile = 1,
    Google = 2,
    Facebook = 3,
    Email = 4,
}

export interface LoginParams {
    /** Login type */
    type: LoginType;
    /** Account */
    account: string;
    /** Verification code */
    code?: string;
    /** Verification code msgId */
    msgId?: string;
    /** Channel ID */
    ads_ch_code?: number;
    /** Channel params */
    ads_ch_params?: RegistrationAnalyticsParams;
}

/** Login */
export const LoginInterface = (params: LoginParams) => {
    return userFetcher.post<{
        /** Auth token */
        token: string;
    }>(`/v1/login`, params);
};

/** Send SMS verification code */
export const SendSmsCodeInterface = (params: { account: string }) => {
    return userFetcher.post<{ msgId: string }>(`/v1/sms/code`, params);
};

/** 发送邮箱登录验证码。 */
export const SendEmailCodeInterface = (params: { email: string }) => {
    return userFetcher.post<{ msgId: string }>(`/v1/email/code`, params);
};

/** Logout */
export const LogoutInterface = () => {
    return userFetcher.delete(`/v1/login`);
};

export interface CheckNewUserParams {
    /** 登录方式。 */
    type: LoginType;
    /** 账号，手机号需包含国家区号。 */
    account: string;
}

/** 登录前校验账号是否为新用户。 */
export const CheckNewUserInterface = (params: CheckNewUserParams) => {
    return userFetcher.get<{
        /** Whether the user is new */
        is_new: boolean;
    }>(`/v1/check/account`, params);
};

/** Check if logged in */
export const CheckLoginInterface = () => {
    return userFetcher.get<{
        /** Whether already logged in */
        is_login: boolean;
    }>(`/v1/check/login`);
};
