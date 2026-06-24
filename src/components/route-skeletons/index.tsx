import type { FC, ReactNode } from 'react';
import { cn } from '@/utils/common';

/**
 * 路由级骨架屏组件。
 *
 * 供 app router 各路由段的 `loading.tsx` 使用：导航点击后立即填充内容区，
 * 给出即时视觉反馈，避免“点了没反应”的卡顿感。所有组件为纯展示层、不含状态，
 * 使用全站统一的骨架令牌（animate-skeleton-pulse / bg-filltext-ft-a / bg-surface-1）。
 *
 * 布局说明：这些骨架渲染在各 Layout 的内容区（侧边栏 / 投注单等 Layout 外壳保持不变），
 * 故只需填充内容列本身。
 */

/** 骨架基础块：一个带脉冲动画的占位方块。 */
export const SkeletonBox: FC<{ className?: string }> = ({ className }) => (
    <div className={cn('animate-skeleton-pulse rounded-xs bg-filltext-ft-a', className)} />
);

/** 内容区统一外边距容器。 */
const SkeletonShell: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => (
    <div className={cn('flex w-full flex-col px-3 py-3 md:px-4 md:py-4', className)}>{children}</div>
);

/** 单条比赛卡片骨架（两队 + 三个赔率按钮）。 */
const SkeletonMatchRow: FC = () => (
    <div className="flex flex-col gap-2 rounded-sm bg-surface-1 p-3">
        <SkeletonBox className="h-3.5 w-40" />
        <div className="flex flex-col gap-2">
            <SkeletonBox className="h-[18px] w-48" />
            <SkeletonBox className="h-[18px] w-44" />
        </div>
        <div className="flex gap-2">
            {['a', 'b', 'c'].map((key) => (
                <SkeletonBox key={key} className="h-8 flex-1" />
            ))}
        </div>
    </div>
);

/** 一组比赛卡片骨架。 */
export const SkeletonMatchRows: FC<{ count?: number }> = ({ count = 6 }) => (
    <div className="flex flex-col gap-2 md:gap-3">
        {Array.from({ length: count }, (_, i) => `match-row-${i}`).map((key) => (
            <SkeletonMatchRow key={key} />
        ))}
    </div>
);

/** 体育首页 / 运动专题页骨架：Banner + 热门联赛轮播 + 比赛列表。 */
export const SkeletonSportsContent: FC = () => (
    <SkeletonShell className="gap-4 md:gap-6">
        <SkeletonBox className="h-32 w-full rounded-sm md:h-44" />
        <div className="flex flex-col gap-3">
            <SkeletonBox className="h-5 w-40" />
            <div className="flex gap-3 overflow-hidden">
                {['c1', 'c2', 'c3'].map((key) => (
                    <SkeletonBox key={key} className="h-[150px] w-full shrink-0 rounded-sm md:w-[402px]" />
                ))}
            </div>
        </div>
        <SkeletonMatchRows />
    </SkeletonShell>
);

/** 单一运动比赛列表骨架（运动详情页内容区，渲染在 MatchListShell 内）。 */
export const SkeletonMatchListContent: FC = () => (
    <SkeletonShell className="gap-3 md:gap-4">
        <SkeletonMatchRows count={8} />
    </SkeletonShell>
);

/** 单个市场分组骨架（标题 + 若干赔率按钮）。 */
const SkeletonMarketGroup: FC<{ rows?: number }> = ({ rows = 2 }) => (
    <div className="w-full overflow-hidden rounded-sm bg-surface-1">
        <div className="flex h-10 items-center justify-between border-filltext-ft-c border-b px-3">
            <SkeletonBox className="h-[18px] w-32" />
        </div>
        <div className="flex flex-col gap-3 px-3 py-3 md:py-4">
            {Array.from({ length: rows }, (_, i) => `market-row-${i}`).map((key) => (
                <div key={key} className="grid grid-cols-3 items-center gap-2">
                    {['x', 'y', 'z'].map((col) => (
                        <SkeletonBox key={col} className="h-8 min-w-0" />
                    ))}
                </div>
            ))}
        </div>
    </div>
);

/** 比赛详情页骨架：记分牌 + 市场 Tab + 市场列表。 */
export const SkeletonMatchDetail: FC = () => (
    <SkeletonShell className="gap-3 md:gap-4">
        <SkeletonBox className="h-28 w-full rounded-sm md:h-36" />
        <div className="flex gap-2">
            {['t1', 't2', 't3', 't4'].map((key) => (
                <SkeletonBox key={key} className="h-8 w-20" />
            ))}
        </div>
        <div className="flex flex-col gap-2 md:gap-4">
            <SkeletonMarketGroup rows={3} />
            <SkeletonMarketGroup rows={2} />
            <SkeletonMarketGroup rows={1} />
        </div>
    </SkeletonShell>
);

/** 联赛 / 赛事页骨架：标题头 + 比赛列表。 */
export const SkeletonLeagueContent: FC = () => (
    <SkeletonShell className="gap-3 md:gap-4">
        <div className="flex items-center gap-3">
            <SkeletonBox className="size-10 rounded-full" />
            <SkeletonBox className="h-6 w-48" />
        </div>
        <SkeletonMatchRows count={8} />
    </SkeletonShell>
);

/** 卡片网格骨架（赌场游戏 / 游戏详情等）。 */
export const SkeletonCardGrid: FC<{ count?: number }> = ({ count = 12 }) => (
    <SkeletonShell className="gap-3 md:gap-4">
        <SkeletonBox className="h-6 w-40" />
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
            {Array.from({ length: count }, (_, i) => `card-${i}`).map((key) => (
                <SkeletonBox key={key} className="aspect-[135/160] w-full rounded-sm" />
            ))}
        </div>
    </SkeletonShell>
);

/** 赌场游戏启动页骨架：大图占位 + 信息条。 */
export const SkeletonGameDetail: FC = () => (
    <SkeletonShell className="gap-4">
        <SkeletonBox className="aspect-video w-full rounded-md" />
        <div className="flex items-center gap-3">
            <SkeletonBox className="size-12 rounded-sm" />
            <div className="flex flex-col gap-2">
                <SkeletonBox className="h-5 w-40" />
                <SkeletonBox className="h-4 w-24" />
            </div>
        </div>
    </SkeletonShell>
);

/** 账户页骨架：粉色头部占位 + 表单 / 表格块。 */
export const SkeletonAccountContent: FC = () => (
    <SkeletonShell className="gap-4 md:gap-6">
        <SkeletonBox className="h-20 w-full rounded-sm md:h-24" />
        <div className="flex flex-col gap-3 rounded-sm bg-surface-1 p-4">
            {['f1', 'f2', 'f3', 'f4'].map((key) => (
                <div key={key} className="flex flex-col gap-2">
                    <SkeletonBox className="h-4 w-28" />
                    <SkeletonBox className="h-10 w-full rounded-xs" />
                </div>
            ))}
            <SkeletonBox className="mt-2 h-11 w-full rounded-sm md:w-40" />
        </div>
    </SkeletonShell>
);

/** 法律 / 富文本页骨架：标题 + 多行文本占位。 */
export const SkeletonLegalContent: FC = () => (
    <SkeletonShell className="gap-4">
        <SkeletonBox className="h-7 w-56" />
        <div className="flex flex-col gap-3">
            {Array.from({ length: 10 }, (_, i) => `line-${i}`).map((key, index) => (
                <SkeletonBox key={key} className={cn('h-4', index % 3 === 2 ? 'w-2/3' : 'w-full')} />
            ))}
        </div>
    </SkeletonShell>
);
