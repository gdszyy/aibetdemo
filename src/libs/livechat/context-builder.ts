/** User + pathname → LiveChat customer / session_variables。 */
import type { User } from '@/api/models/user';
import { UserKycStatus } from '@/api/models/user';
import type { LiveChatContext } from './types';

type LiveChatDevice = 'web' | 'h5_pwa';

const LIVECHAT_GUEST_USER_TYPE = 'guest';

const KYC_STATUS_TEXT: Record<UserKycStatus, string> = {
    [UserKycStatus.Unverified]: 'unverified',
    [UserKycStatus.Pending]: 'pending',
    [UserKycStatus.Success]: 'approved',
    [UserKycStatus.Failed]: 'failed',
};

function hashUserId(uid: string): string {
    let h = 5381;
    for (let i = 0; i < uid.length; i++) {
        h = ((h << 5) + h + uid.charCodeAt(i)) | 0;
    }
    return `u_${(h >>> 0).toString(36)}`;
}

/** 登录用户优先使用 username 作为客服展示名，避免 nickname 覆盖最新账号名。 */
function getLiveChatCustomerName(user: User): string | undefined {
    return user.username || user.nickname || undefined;
}

/** 将站内路径归类为 LiveChat 会话变量里的页面类型。 */
function getPageType(pathname: string): string {
    const p = pathname.toLowerCase();
    if (p.includes('/signin') || p.includes('/sign-in') || p.includes('/sign-up') || p.includes('/login')) {
        return 'auth';
    }
    if (p.includes('/deposit') || p.includes('/recharge')) return 'cashier-deposit';
    if (p.includes('/withdraw')) return 'cashier-withdraw';
    if (p.includes('/bet-history') || p.includes('/bet-record')) return 'bet-history';
    if (p.includes('/kyc') || p.includes('/identity')) return 'kyc';
    if (p.includes('/sports')) return 'sports';
    if (p.includes('/casino')) return 'casino';
    if (p.includes('/user-center') || p.includes('/account')) return 'user-center';
    return 'other';
}

export function buildContext(
    user: User,
    pathname: string,
    extra: { device: LiveChatDevice; locale: string },
): LiveChatContext {
    return {
        name: getLiveChatCustomerName(user),
        email: user.email || undefined,
        vars: {
            user_id_hash: hashUserId(user.uid),
            locale: extra.locale,
            kyc_status: KYC_STATUS_TEXT[user.kyc_status] ?? 'unverified',
            vip_level: String(user.vip_id ?? 0),
            page_type: getPageType(pathname),
            device: extra.device,
        },
    };
}

/** 构建未登录访客的 LiveChat 上下文，用于 H5 登录页客服入口。 */
export function buildGuestContext(
    pathname: string,
    extra: { device: LiveChatDevice; locale: string },
): LiveChatContext {
    return {
        vars: {
            locale: extra.locale,
            page_type: getPageType(pathname),
            device: extra.device,
            user_type: LIVECHAT_GUEST_USER_TYPE,
        },
    };
}
