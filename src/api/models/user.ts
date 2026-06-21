import { z } from 'zod';

export enum UserKycStatus {
    Unverified = 0,
    Success = 1,
    Failed = 2,
    Pending = 3,
}

const StatusEnum = z.union([z.literal(0), z.literal(1)]);

/** 第三方 OAuth 账号提供方。 */
export enum OAuthProvider {
    /** Google 账号。 */
    Google = 'google',
    /** Facebook 账号。 */
    Facebook = 'facebook',
}

/** Zod Schema for User Profile */
export const UserSchema = z.object({
    uid: z.string(),
    status: StatusEnum,
    username: z.string(),
    nickname: z.string(),
    avatar: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    id_number: z.string(),
    currency_id: z.number(),
    kyc_status: z.union([
        z.literal(UserKycStatus.Unverified),
        z.literal(UserKycStatus.Success),
        z.literal(UserKycStatus.Failed),
        z.literal(UserKycStatus.Pending),
    ]),
    kyc_status_text: z.string(),
    vip_id: z.number().optional(),
    /** 用户注册归属渠道，登录后用于前端埋点。 */
    ads_ch_code: z.string().optional(),
});

/** Infer TypeScript type from Zod Schema - Single Source of Truth */
export type User = z.infer<typeof UserSchema>;

/** 用户第三方与联系方式绑定状态。 */
export const UserBindingsSchema = z.object({
    email: z.boolean(),
    email_value: z.string(),
    facebook: z.boolean(),
    facebook_value: z.string(),
    google: z.boolean(),
    google_value: z.string(),
    mobile: z.boolean(),
    mobile_value: z.string(),
});

/** 用户第三方与联系方式绑定状态类型。 */
export type UserBindings = z.infer<typeof UserBindingsSchema>;
