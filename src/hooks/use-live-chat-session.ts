'use client';

import { useLocale } from 'next-intl';
import { useCallback, useMemo } from 'react';
import { AUTH_ROUTE_PATHS } from '@/constants/auth-routes';
import { useIsMobile } from '@/hooks/use-media-query';
import { usePathname } from '@/i18n';
import { clearLiveChatContext, ensureLauncherSuppressed, hide, openLiveChatWidget } from '@/libs/livechat/client';
import { buildContext, buildGuestContext } from '@/libs/livechat/context-builder';
import { getLiveChatGroupId, type LiveChatGroupId } from '@/libs/livechat/groups';
import { getLiveChatLicense, isLiveChatEnvEnabled } from '@/libs/livechat/should-enable';
import type { LiveChatContext } from '@/libs/livechat/types';
import { useIsLogin, useUser } from '@/stores/session-store';

interface UseLiveChatSessionReturn {
    /** 当前环境、登录态、用户资料是否允许打开 LiveChat。 */
    isAvailable: boolean;
    /** LiveChat license number。 */
    license: string;
    /** 当前语言对应的 LiveChat 后台客服分组 ID。 */
    groupId: LiveChatGroupId;
    /** 构建当前用户上下文；不可用时返回 null。 */
    getContext: () => LiveChatContext | null;
    /** 用户主动打开 LiveChat，并同步上下文。 */
    openLiveChat: () => Promise<boolean>;
    /** 隐藏 LiveChat widget。 */
    hide: () => void;
    /** 清理本地与第三方 LiveChat 会话上下文。 */
    clearContext: () => void;
}

/** 同步 LiveChat 会话上下文，并在业务入口打开 widget。 */
export function useLiveChatSession(): UseLiveChatSessionReturn {
    const isLogin = useIsLogin();
    const user = useUser();
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const locale = useLocale();
    const license = getLiveChatLicense();
    const groupId = useMemo((): LiveChatGroupId => getLiveChatGroupId(locale), [locale]);
    const isGuestSigninLiveChat = !isLogin && isMobile && pathname === AUTH_ROUTE_PATHS.Signin;

    const isAvailable = useMemo(
        () => isLiveChatEnvEnabled() && Boolean(license) && ((isLogin && Boolean(user)) || isGuestSigninLiveChat),
        [license, isLogin, user, isGuestSigninLiveChat],
    );

    const getContext = useCallback((): LiveChatContext | null => {
        if (!isAvailable) return null;
        const extra = {
            device: isMobile ? 'h5_pwa' : 'web',
            locale,
        } as const;

        if (isLogin && user) return buildContext(user, pathname, extra);
        if (isGuestSigninLiveChat) return buildGuestContext(pathname, extra);
        return null;
    }, [isAvailable, isLogin, user, pathname, isMobile, locale, isGuestSigninLiveChat]);

    const openLiveChat = useCallback(async (): Promise<boolean> => {
        const context = getContext();
        if (!context) return false;
        const didOpen = await openLiveChatWidget(license, groupId, context);
        if (didOpen && isMobile) ensureLauncherSuppressed();
        return didOpen;
    }, [getContext, license, groupId, isMobile]);

    return { isAvailable, license, groupId, getContext, openLiveChat, hide, clearContext: clearLiveChatContext };
}
