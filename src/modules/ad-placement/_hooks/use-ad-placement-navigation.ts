import { useRouter as useNextRouter } from 'next/navigation';
import { useCallback } from 'react';
import { type AdPlacementItem, AdPlacementJumpType } from '@/api/models/ad-placement';
import { useRouter } from '@/i18n';
import { useIsLogin } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';

/** 将后端活动 ID 转换为站内促销详情页路径。 */
const resolveActivityPath = (target: string) => `/sports/promotions/${target}`;
// TODO: 当前账户路由登录判断是临时逻辑，后续应收敛到统一的路由权限配置。
const ACCOUNT_ROUTE_PREFIX = '/account';

/** 同站外链转换为站内路由路径，不同站点或协议链接保持外部跳转。 */
const resolveSameHostPath = (target: string): string | undefined => {
    const url = new URL(target, window.location.origin);

    if (url.host !== window.location.host) {
        return undefined;
    }

    return `${url.pathname}${url.search}${url.hash}`;
};

/**
 * 统一处理广告位点击跳转。
 *
 * 广告位可能跳站内路由、外部链接或活动详情。集中在这里处理可以保证：
 * 站内跳转使用 i18n router 保留 locale；外部链接在当前标签页打开；
 * 无跳转广告直接忽略点击。
 */
export const useAdPlacementNavigation = () => {
    const router = useRouter();
    const nextRouter = useNextRouter();
    const isLogin = useIsLogin();
    const openLoginModal = useUIStore((state) => state.openLoginModal);

    return useCallback(
        (item: Pick<AdPlacementItem, 'data'>) => {
            if (item.data.jump_type === AdPlacementJumpType.None || !item.data.jump_target) {
                return;
            }

            if (item.data.jump_type === AdPlacementJumpType.ExternalUrl) {
                const sameHostPath = resolveSameHostPath(item.data.jump_target);
                if (sameHostPath) {
                    nextRouter.push(sameHostPath);
                    return;
                }

                window.location.assign(item.data.jump_target);
                return;
            }

            const target =
                item.data.jump_type === AdPlacementJumpType.Activity
                    ? resolveActivityPath(item.data.jump_target)
                    : item.data.jump_target;
            if (
                item.data.jump_type === AdPlacementJumpType.InternalRoute &&
                target.startsWith(ACCOUNT_ROUTE_PREFIX) &&
                !isLogin
            ) {
                openLoginModal();
                return;
            }

            router.push(target);
        },
        [isLogin, openLoginModal, router, nextRouter],
    );
};
