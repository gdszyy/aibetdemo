'use client';

import type { FC } from 'react';

/**
 * iOS26 液态玻璃折射滤镜定义（全局唯一、隐藏、惰性）。
 *
 * 仅被 `src/assets/css/glass.css` 中 `:root.glass-*` 作用域的
 * `backdrop-filter: ... url(#glass-refraction)` / `url(#glass-edge)` 引用；
 * 其它 8 套 scheme 不引用这两个 id，等于不存在，零副作用。
 *
 * 算法：feTurbulence 生成平滑分形噪声 → feGaussianBlur 抹成连续的「透镜场」→
 * feDisplacementMap 按该场对背景像素做位移，形成玻璃的液态折射。
 * `glass-edge` 位移幅度更大，配合 glass.css 里的描边遮罩，把折射集中到圆角边缘，
 * 复刻液态玻璃「边缘把背景掰弯」的观感。
 */
export const GlassFilterDefs: FC = () => {
    return (
        <svg
            aria-hidden
            focusable="false"
            width="0"
            height="0"
            style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
        >
            <defs>
                <filter
                    id="glass-refraction"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                    colorInterpolationFilters="sRGB"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.008 0.012"
                        numOctaves="2"
                        seed="11"
                        result="noise"
                    />
                    <feGaussianBlur in="noise" stdDeviation="2" result="smooth" />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="smooth"
                        scale="14"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
                <filter id="glass-edge" x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.01 0.018"
                        numOctaves="2"
                        seed="7"
                        result="noise"
                    />
                    <feGaussianBlur in="noise" stdDeviation="1.4" result="smooth" />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="smooth"
                        scale="34"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>
        </svg>
    );
};
