'use client';

import { useTranslations } from 'next-intl';
import { type FC, useMemo, useState } from 'react';
import { CloseOutlined } from '@/components/icons2/CloseOutlined';
import { UserOutlined } from '@/components/icons2/UserOutlined';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { cn } from '@/utils/common';

/**
 * 首页「近期中奖」横向滚动条。
 *
 * ⚠️ MOCK：当前数据来自本地 buildMockWinnings 假数据，后端就绪后只需把
 * `entries` 的来源换成「近期中奖」feed（建议 WS 频道或轮询接口），
 * 组件结构与样式保持不变即可。
 */

/** 单条中奖记录。 */
interface WinningEntry {
    id: string;
    /** 打码后的用户名 */
    user: string;
    /** 中奖金额 */
    amount: number;
}

// ─── ⚠️ MOCK 数据源 begin（后端就绪后整体替换） ───
const MOCK_USERS = [
    'User673',
    'Melisa',
    'Jara',
    'Rockof',
    'Ackzz',
    'Oscar20',
    'Israel',
    'ricardo',
    'Luis Iann',
    'JAVO100',
    'Elena',
    'consue',
    'Papel B',
    'User289',
    'Marlol',
];

/** 由种子生成稳定伪随机数，保证 SSR/CSR 输出一致、避免水合抖动。 */
const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

/** 生成一批假中奖记录。 */
const buildMockWinnings = (count: number): WinningEntry[] =>
    Array.from({ length: count }, (_, i) => {
        const r = seededRandom(i + 1);
        const r2 = seededRandom(i + 100);
        return {
            id: `w-${i}`,
            user: MOCK_USERS[Math.floor(r * MOCK_USERS.length)],
            amount: Math.round((500 + r2 * 19500) * 100) / 100,
        };
    });
// ─── ⚠️ MOCK 数据源 end ───

/** 单个中奖药丸。 */
const WinningPill: FC<{ entry: WinningEntry; amountText: string }> = ({ entry, amountText }) => (
    <div className="flex shrink-0 items-center gap-2 rounded-sm bg-surface-1 px-2 py-1">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-filltext-ft-c">
            <UserOutlined className="size-3 text-filltext-ft-g" />
        </span>
        <span className="max-w-20 truncate text-auxiliary-md text-filltext-ft-g">{entry.user}</span>
        <span className="text-auxiliary-md font-bold text-func-win">{amountText}</span>
    </div>
);

/** 近期中奖滚动条。 */
export const WinningsTicker: FC = () => {
    const t = useTranslations('home');
    const { formatCurrency } = useIntlFormatter();
    const [closed, setClosed] = useState(false);

    const entries = useMemo(() => buildMockWinnings(24), []);
    // 复制一份用于无缝循环滚动
    const loopEntries = useMemo(() => [...entries, ...entries], [entries]);

    if (closed) {
        return null;
    }

    return (
        <div className="relative flex items-center gap-2 overflow-hidden rounded-sm bg-surface-1 px-3 py-2">
            <span className="flex shrink-0 items-center gap-1.5 text-body-sm font-bold text-filltext-ft-h">
                <span className="size-2 rounded-full bg-func-win" />
                {t('recentWinnings.title')}
            </span>
            <div
                className={cn(
                    'relative min-w-0 flex-1 overflow-hidden',
                    '[mask-image:linear-gradient(90deg,transparent,#000_24px,#000_calc(100%-24px),transparent)]',
                )}
            >
                <div
                    className="flex w-max items-center gap-2"
                    style={{ animation: 'gtb-winnings-marquee 40s linear infinite' }}
                >
                    {loopEntries.map((entry, i) => (
                        <WinningPill key={`${entry.id}-${i}`} entry={entry} amountText={formatCurrency(entry.amount)} />
                    ))}
                </div>
            </div>
            <button
                type="button"
                onClick={() => setClosed(true)}
                className="flex size-5 shrink-0 cursor-pointer items-center justify-center text-filltext-ft-f transition-colors hover:text-filltext-ft-h"
            >
                <CloseOutlined className="size-3" />
            </button>
            {/* 跑马灯关键帧（就近内联，避免污染全局 CSS）。translateX(-50%) 对应复制一份的无缝循环。 */}
            <style>
                {'@keyframes gtb-winnings-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}'}
            </style>
        </div>
    );
};
