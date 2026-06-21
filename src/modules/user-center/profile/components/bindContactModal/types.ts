import type { OAuthProvider } from '@/api/models/user';

/** 绑定联系方式类型 */
export type BindContactType = 'email' | 'mobile';

/** 绑定资料类型，包括联系方式和第三方账号 */
export type BindProfileType = BindContactType | OAuthProvider;
