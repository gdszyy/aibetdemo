'use client';

import type { FC } from 'react';
import { AdPlacementType, type SidebarMenuAdPlacement } from '@/api/models/ad-placement';
import { SidebarItem } from '@/components/sidebar';
import { usePathname } from '@/i18n';
import { useAdPlacementNavigation } from '../_hooks/use-ad-placement-navigation';
import { useAdPlacements } from '../_hooks/use-ad-placements';

const SidebarRemoteIcon =
    (src: string, alt: string): FC<{ className?: string }> =>
    ({ className }) => <img src={src} alt={alt} className={className} />;

/**
 * 侧边栏广告菜单项。
 *
 * 后端可以通过 SidebarMenu 广告位动态插入菜单入口。
 * 图标使用远程地址，点击时走统一广告跳转逻辑，避免 SidebarItem 默认 href 丢失活动跳转类型。
 */
export const SidebarAdPlacementItems: FC = () => {
    const pathname = usePathname();
    const navigate = useAdPlacementNavigation();
    const { data: items = [] } = useAdPlacements({ types: [AdPlacementType.SidebarMenu] });

    return (
        <>
            {items
                .filter((item): item is SidebarMenuAdPlacement => item.activity_type === AdPlacementType.SidebarMenu)
                .map((item) => (
                    <SidebarItem
                        key={item.id}
                        icon={SidebarRemoteIcon(item.data.menu_icon ?? '', item.data.menu_name ?? item.activity_name)}
                        label={item.data.menu_name ?? item.activity_name}
                        href={item.data.jump_target || '#'}
                        isActive={!!item.data.jump_target && pathname.startsWith(item.data.jump_target)}
                        onClick={(event) => {
                            event.preventDefault();
                            navigate(item);
                        }}
                    />
                ))}
        </>
    );
};
