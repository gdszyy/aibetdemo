import type { FC } from 'react';
import { cn } from '@/utils/common';

/**
 * SuperOdd「加成」标识的造型枚举。
 * 按品牌主题切换造型（颜色由父级 `currentColor` 决定）。
 * - bolt：闪电，保留 Superbet 原生小闪电身份（superbet）
 * - flame：火焰，热门/连胜
 * - boost：上扬双箭头，赔率加成（betano）
 * - spark：四角星芒，精选高光（match / 默认）
 * - star：五角星，置顶推荐（betbus）
 */
export type BoostMotifKind = 'bolt' | 'flame' | 'boost' | 'spark' | 'star';

interface BoostMotifProps {
    /** 造型类型，由各品牌 skin 决定。 */
    kind: BoostMotifKind;
    /** 额外类名，通常用于设置尺寸与 `text-[color]`（驱动 currentColor）。 */
    className?: string;
}

/**
 * 首页 SuperOdd 卡片的「加成」图标。替换 Superbet 原生小闪电：每个品牌主题渲染不同造型，
 * 颜色继承自父级 `currentColor`（由 skin 的 `boostMotifClassName` 设定），因此明暗/品牌自动适配。
 */
export const BoostMotif: FC<BoostMotifProps> = ({ kind, className }) => {
    const base = cn('block shrink-0', className);

    if (kind === 'bolt') {
        return (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className={base}>
                <path d="M14.5 2 4 14h6l-1.5 8L20 10h-6l.5-8Z" fill="currentColor" />
            </svg>
        );
    }

    if (kind === 'flame') {
        return (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className={base}>
                <path
                    d="M13.6 2.4c.7 3.2.3 5.3-1.4 7.2-1.8 2-4.2 3.3-4.2 6.6a6 6 0 0 0 12 .2c0-2.6-1.1-4.4-2.4-6 .2 1.5-.6 2.4-1.6 2.8 1.2-2.8.5-6.7-2.4-10.8Z"
                    fill="currentColor"
                />
                <path
                    d="M12 13.2c1.5 1.3 2.3 2.5 2.3 3.9a2.3 2.3 0 0 1-4.6 0c0-1.4.9-2.6 2.3-3.9Z"
                    fill="currentColor"
                    opacity="0.5"
                />
            </svg>
        );
    }

    if (kind === 'boost') {
        return (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className={base}>
                <path
                    d="M5 12.8 12 6l7 6.8"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M5 17.6 12 10.8l7 6.8"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.5"
                />
            </svg>
        );
    }

    if (kind === 'spark') {
        return (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className={base}>
                <path d="M12 2.2 13.9 10.1 21.8 12 13.9 13.9 12 21.8 10.1 13.9 2.2 12 10.1 10.1Z" fill="currentColor" />
                <path
                    d="M18.6 3 19.3 5.4 21.7 6.1 19.3 6.8 18.6 9.2 17.9 6.8 15.5 6.1 17.9 5.4Z"
                    fill="currentColor"
                    opacity="0.55"
                />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className={base}>
            <path
                d="M12 2.4 14.6 8.7 21.4 9.2 16.2 13.6 17.9 20.2 12 16.6 6.1 20.2 7.8 13.6 2.6 9.2 9.4 8.7Z"
                fill="currentColor"
            />
        </svg>
    );
};
