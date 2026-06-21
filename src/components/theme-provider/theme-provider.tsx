'use client';

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';
import { type FC, type PropsWithChildren, useEffect } from 'react';
import { config } from '@/constants/config';

/**
 * 配色方案（scheme）清单 —— 多套配色方案而非明暗切换。
 * 每个值对应挂到 <html> 上的 class，并由 theme.css 中同名作用域提供配色覆盖。
 * - gtb：浅色 + 红，取值在 :root，无需额外 class 规则。
 * - 其他方案：对应 theme.css 中的 :root.<scheme> 覆盖块。
 * 新增方案：此处加一项 + scheme-meta.ts 登记 + theme.css 增加 :root.<name> 覆盖块。
 */
export const SCHEMES = [
    'gtb',
    'betbus',
    'match',
    'match-light',
    'superbet-light',
    'superbet-dark',
    'betano-light',
    'betano-dark',
] as const;
export type Scheme = (typeof SCHEMES)[number];
// 「直接复刻 betbus」转型已定调：默认即 betbus 深色方案；gtb 浅色红仅作可切换回退。
export const DEFAULT_SCHEME: Scheme = 'betbus';

const isScheme = (value: string | null): value is Scheme => {
    return value !== null && (SCHEMES as readonly string[]).includes(value);
};

const ThemeDevQuerySync: FC = () => {
    const { setTheme } = useNextTheme();

    useEffect(() => {
        if (!config.isDev && !config.isTest) return;

        const searchParams = new URLSearchParams(window.location.search);
        const requestedScheme = searchParams.get('scheme') ?? searchParams.get('theme');

        if (isScheme(requestedScheme)) {
            setTheme(requestedScheme);
        }
    }, [setTheme]);

    return null;
};

/**
 * Theme Provider — 基于 next-themes 的多配色方案容器。
 * attribute="class" → 选中方案名以 class 形式挂到 <html>；enableSystem 关闭（方案与系统明暗无关）。
 */
export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme={DEFAULT_SCHEME}
            themes={[...SCHEMES]}
            enableSystem={false}
            disableTransitionOnChange
        >
            <ThemeDevQuerySync />
            {children}
        </NextThemesProvider>
    );
};

/**
 * 配色方案 hook（透传 next-themes useTheme）。
 * @returns theme - 当前方案名（Scheme，如 'gtb' | 'betbus'）
 * @returns setTheme - 切换方案，setTheme('betbus')
 * @returns themes - 可用方案列表
 */
export const useTheme = useNextTheme;
