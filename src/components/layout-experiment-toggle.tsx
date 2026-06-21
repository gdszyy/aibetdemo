'use client';

import { type FC, type ReactNode, useEffect, useState } from 'react';
import { SCHEMES, type Scheme, useTheme } from '@/components/theme-provider/theme-provider';
import { type BetSlipMode, type SportNavMode, useLayoutExperimentStore } from '@/stores/layout-experiment-store';
import { cn } from '@/utils/common';

/**
 * 布局/配色实验切换面板（betbus 转型对比用，临时内部工具）。
 *
 * 固定在左下角的「单一」调试面板，合并了配色方案切换与两处结构性布局开关
 * （投注单形态、体育导航形态）。此前配色切换器与布局切换器各自独立悬浮在左下角，
 * 会相互重叠；合并为一个面板后彻底消除重叠。
 * 默认即 betbus（深色 + 悬浮投注单 + 专题页导航）；可在此实时切回旧 GTB 形态做对比。
 * 转型彻底定稿后整体删除本组件。
 */

/** 多选一分段控件。 */
const Segmented = <T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: { value: T; label: string }[];
    onChange: (value: T) => void;
}): ReactNode => (
    <div className="flex items-center justify-between gap-3">
        <span className="text-auxiliary-md text-filltext-ft-g">{label}</span>
        <div className="flex overflow-hidden rounded-sm border border-filltext-ft-c">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={cn(
                        'px-2 py-1 text-auxiliary-md capitalize transition-colors',
                        value === option.value
                            ? 'bg-brand-primary-0 font-bold text-on-brand'
                            : 'bg-surface-1 text-filltext-ft-g',
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    </div>
);

export const LayoutExperimentToggle: FC = () => {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const betSlipMode = useLayoutExperimentStore((s) => s.betSlipMode);
    const sportNavMode = useLayoutExperimentStore((s) => s.sportNavMode);
    const setBetSlipMode = useLayoutExperimentStore((s) => s.setBetSlipMode);
    const setSportNavMode = useLayoutExperimentStore((s) => s.setSportNavMode);

    // 仅客户端渲染，避免持久化 store / next-themes 造成水合不一致
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const activeScheme = (theme as Scheme) ?? SCHEMES[0];

    return (
        <div className="fixed bottom-20 left-3 z-[9999] flex flex-col items-start gap-2 md:bottom-4">
            {open && (
                <div className="flex w-60 flex-col gap-2 rounded-md border border-filltext-ft-c bg-surface-1 p-3 shadow-lg">
                    <span className="text-body-sm font-bold text-filltext-ft-h">Layout · betbus 对比</span>
                    <Segmented<Scheme>
                        label="配色"
                        value={activeScheme}
                        onChange={setTheme}
                        options={SCHEMES.map((scheme) => ({ value: scheme, label: scheme }))}
                    />
                    <Segmented<BetSlipMode>
                        label="投注单"
                        value={betSlipMode}
                        onChange={setBetSlipMode}
                        options={[
                            { value: 'floating', label: '悬浮' },
                            { value: 'fixed', label: '固定列' },
                        ]}
                    />
                    <Segmented<SportNavMode>
                        label="体育导航"
                        value={sportNavMode}
                        onChange={setSportNavMode}
                        options={[
                            { value: 'topic', label: '专题页' },
                            { value: 'sidebar', label: '侧栏树' },
                        ]}
                    />
                </div>
            )}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-9 items-center gap-1.5 rounded-full border border-filltext-ft-c bg-surface-1 px-3 text-auxiliary-md font-bold text-filltext-ft-h shadow-lg"
            >
                <span className="size-2 rounded-full bg-brand-primary-0" />
                betbus
            </button>
        </div>
    );
};
