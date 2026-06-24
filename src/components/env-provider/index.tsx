'use client';

import { createContext, type FC, type PropsWithChildren, useContext, useEffect, useState } from 'react';

/**
 * 桌面端断点：>=1024px 视为桌面端。
 * 与 bet-animation-utils / bet-actions 中既有的 1024 判断保持一致，
 * 也对应三栏桌面布局（侧边栏 + 内容 + 投注单）所需的最小宽度。
 */
const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';

interface EnvContextValue {
    /** 是否移动端布局 */
    isMobile: boolean;
    /** 是否桌面端布局 */
    isDesktop: boolean;
}

const EnvContext = createContext<EnvContextValue>({
    isMobile: false,
    isDesktop: false,
});

export const useEnvContext = (): EnvContextValue => useContext(EnvContext);

/**
 * 全局环境上下文：移动端 / 桌面端布局判定。
 *
 * 首屏种子值由服务端依据 UA 计算并透传（isMobile/isDesktop），保证 SSR 与客户端
 * 首次渲染一致、避免水合不一致和布局抖动。挂载后改为监听窗口宽度（matchMedia），
 * 跨越 1024px 断点时实时更新 —— 无需刷新即可在移动端 / 桌面端布局之间切换。
 */
export const EnvProvider: FC<PropsWithChildren<EnvContextValue>> = ({ children, isMobile, isDesktop }) => {
    // 以服务端 UA 结果作为首屏种子，确保首次渲染与 SSR 一致。
    const [env, setEnv] = useState<EnvContextValue>({ isMobile, isDesktop });

    useEffect(() => {
        const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

        const sync = (matchesDesktop: boolean): void => {
            // 仅在判定结果变化时更新，避免无谓的重渲染。
            setEnv((prev) =>
                prev.isDesktop === matchesDesktop
                    ? prev
                    : { isMobile: !matchesDesktop, isDesktop: matchesDesktop },
            );
        };

        // 挂载后立即用真实窗口宽度校正一次（UA 与实际宽度可能不一致）。
        sync(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent): void => sync(event.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
};
