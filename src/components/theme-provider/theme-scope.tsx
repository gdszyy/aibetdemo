'use client';

import type { CSSProperties, ReactNode } from 'react';
import { getBrandUiSkin } from './brand-ui-skin';
import { resolveThemeProfile } from './component-profile';
import { useSchemeMeta } from './scheme-meta';

interface ThemeScopeProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

/**
 * 主题级 CSS 变量的统一注入点。
 *
 * 一次性把 brandUiSkin.style（`--brand-*`）+ profile.style（`--component-*`）注入到一个
 * 容器上，后代 DOM 通过 CSS 继承自动拿到，无需各组件再 `style={{ ...componentProfile.style }}`
 * 逐个自注入。同时挂 `data-brand-ui` / `data-brand-mode`，与既有 CSS 钩子保持一致。
 *
 * Portal 注意：抽屉 / 底部弹层 / Toast 经 Portal 渲染到 `body`，会脱离本 scope 子树、
 * 拿不到继承变量。需给 Portal 容器同样包一层 ThemeScope，或让这些组件继续局部注入自身 skin。
 *
 * 现状：本组件为脚手架，尚未挂载到 layout。挂载 + Portal 包裹 + 回收各处冗余注入为下一步。
 */
export const ThemeScope = ({ children, className, style }: ThemeScopeProps) => {
    const meta = useSchemeMeta();
    const profile = resolveThemeProfile(meta);
    const brandSkin = getBrandUiSkin(meta);

    return (
        <div
            data-brand-ui={meta.brand}
            data-brand-mode={meta.mode}
            style={{ ...brandSkin.style, ...profile.style, ...style }}
            className={className}
        >
            {children}
        </div>
    );
};
