import { z } from 'zod';
import { userFetcher } from '@/api/client';
import { type OAuthProvider, type User, type UserBindings, UserBindingsSchema, UserSchema } from '@/api/models/user';

/** Get user profile */
export const GetProfileInterface = () => {
    return userFetcher.get<{ profile: User }>(
        `/v1/profile`,
        {},
        {
            schema: z.object({ profile: UserSchema }),
            label: 'GetProfile',
        },
    );
};

/** 获取用户绑定状态列表。 */
export const GetUserBindingsInterface = () => {
    return userFetcher.get<UserBindings>(
        `/v1/user/bindings`,
        {},
        {
            schema: UserBindingsSchema,
            label: 'GetUserBindings',
        },
    );
};

/** 发送绑定邮箱验证码，绑定前无需登录。 */
export const SendBindEmailCodeInterface = (params: {
    /** 待绑定邮箱地址。 */
    email: string;
}) => {
    return userFetcher.post<{ msgId: string }>(`/v1/bind/email/code`, params);
};

/** 绑定邮箱，后端会发送激活链接，用户点击后最终生效。 */
export const BindEmailInterface = (params: {
    /** 待绑定邮箱地址。 */
    email: string;
    /** 邮箱验证码。 */
    code: string;
}) => {
    return userFetcher.post<{ success: boolean }>(`/v1/bind/email`, params);
};

/** 发送绑定手机号短信验证码。 */
export const SendBindMobileCodeInterface = (params: {
    /** 待绑定手机号，包含国家区号。 */
    account: string;
}) => {
    return userFetcher.post<{ msgId: string }>(`/v1/bind/mobile/sms/code`, params);
};

/** 绑定手机号。 */
export const BindMobileInterface = (params: {
    /** 待绑定手机号，包含国家区号。 */
    mobile: string;
    /** 短信验证码。 */
    code: string;
}) => {
    return userFetcher.post<{ success: boolean }>(`/v1/bind/mobile`, params);
};

/** 绑定 Google/Facebook 第三方账号。 */
export const BindOAuthInterface = (params: {
    /** 第三方账号提供方。 */
    provider: OAuthProvider;
    /** 第三方登录返回的 ID Token。 */
    id_token: string;
}) => {
    return userFetcher.post<{ success: boolean }>(`/v1/bind/oauth`, params);
};

/** 解绑 Google/Facebook 第三方账号。 */
export const UnbindOAuthInterface = (params: {
    /** 第三方账号提供方。 */
    provider: OAuthProvider;
}) => {
    return userFetcher.post<{ success: boolean }>(`/v1/unbind/oauth`, params);
};

/** Password settings check */
export const GetUserPasswordCheckInterface = () => {
    return userFetcher.get<{
        /** Whether user password is being set for the first time (true = first time) */
        user_password_isnew: boolean;
        /** Whether wallet password is being set for the first time (true = first time) */
        wallet_password_isnew: boolean;
    }>(`/v1/password/check`);
};

/** Set user password */
export const SetUserPasswordInterface = (params: {
    /** New user password */
    user_password: string;
    /** Old user password, used when not first-time change */
    old_user_password?: string;
    /** OTP SMS verification code, used for first-time change */
    code?: string;
    /** OTP msgId returned by server, used for first-time change */
    msgId?: string;
}) => {
    return userFetcher.post<{ uid: string }>(`/v1/user/password`, params);
};

/** Set wallet password */
export const SetWalletPasswordInterface = (params: {
    /** Wallet password */
    wallet_password: string;
    /** Old wallet password, used when not first-time change */
    old_wallet_password?: string;
    /** OTP SMS verification code, used for first-time change */
    code?: string;
    /** OTP msgId returned by server, used for first-time change */
    msgId?: string;
}) => {
    return userFetcher.post<{ uid: string }>(`/v1/wallet/password`, params);
};

/** Send user password change verification code */
export const SendUserPasswordCodeInterface = () => {
    return userFetcher.post<{ msgId: string }>(`/v1/user/password/sms/code`);
};

/** Send wallet password change verification code */
export const SendWalletPasswordCodeInterface = () => {
    return userFetcher.post<{ msgId: string }>(`/v1/wallet/password/sms/code`);
};
