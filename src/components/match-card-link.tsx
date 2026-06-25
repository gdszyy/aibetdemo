'use client';

import { useLinkStatus } from 'next/link';
import { type ComponentProps, type FC, useEffect, useState } from 'react';
import { Loading } from '@/components/loading/loading';
import { Link } from '@/i18n';

/** pending 持续超过此延时（毫秒）才显示浮层，避免已预热路由瞬时跳转时一闪而过。 */
const PENDING_VISIBLE_DELAY_MS = 120;

/**
 * 导航 pending 浮层。
 *
 * 必须渲染在 <Link> 内部：通过 next/link 的 useLinkStatus 读取该链接的导航 pending
 * 状态，在点击后、路由提交前即给出"正在打开"的即时反馈——解决移动端（无 hover，
 * 点击到跳转之间存在网络等待）"点了没反应"的卡顿感。
 *
 * 浮层以 absolute inset-0 覆盖，依赖父级 <Link> 为定位元素（relative / absolute）。
 */
const NavPendingOverlay: FC = () => {
    const { pending } = useLinkStatus();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!pending) {
            setVisible(false);
            return;
        }
        const timer = setTimeout(() => setVisible(true), PENDING_VISIBLE_DELAY_MS);
        return () => clearTimeout(timer);
    }, [pending]);

    if (!visible) return null;

    return (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center rounded-[inherit] bg-surface-1/70"
        >
            <Loading className="size-6 text-brand-primary-0" />
        </span>
    );
};

type MatchCardLinkProps = ComponentProps<typeof Link>;

/**
 * 比赛卡片链接：在 `@/i18n` 的 Link 之上叠加"导航 pending 浮层"，提供点击即时反馈。
 *
 * 行为与普通 Link 完全一致（透传全部 props，包括 href / className / data-* / ref /
 * 意图预取处理器），仅额外在内部渲染加载态浮层。浮层需父级为定位元素，故使用方需
 * 确保链接带 `relative`（卡片主体覆盖型链接通常已是 `absolute`）。
 */
export const MatchCardLink: FC<MatchCardLinkProps> = ({ children, ...props }) => (
    <Link {...props}>
        {children}
        <NavPendingOverlay />
    </Link>
);
