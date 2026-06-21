'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 布局实验开关（betbus 转型对比用）。
 *
 * 为了在不重新构建的前提下 live 对比「betbus 新布局 vs 旧布局」，这里用持久化 store
 * 控制两处结构性改造的运行时模式。默认全部为 betbus 模式（floating / topic）——
 * 「直接复刻 betbus」转型已定调，betbus 即默认体验；旧模式（fixed / sidebar）仅保留作对比回退。
 *
 * persist version 升到 1：丢弃此前持久化的旧默认（fixed / sidebar），让用户拿到 betbus 新默认。
 * 转型彻底定稿后：移除开关与旧分支即可。
 */

/** 投注单形态：固定右列（旧） / 右下角悬浮（betbus）。 */
export type BetSlipMode = 'fixed' | 'floating';
/** 体育导航形态：侧栏三级树（旧） / 运动专题页（betbus，含 A–Z、12h/24h）。 */
export type SportNavMode = 'sidebar' | 'topic';

interface LayoutExperimentState {
    betSlipMode: BetSlipMode;
    sportNavMode: SportNavMode;
    setBetSlipMode: (mode: BetSlipMode) => void;
    setSportNavMode: (mode: SportNavMode) => void;
}

export const useLayoutExperimentStore = create<LayoutExperimentState>()(
    persist(
        (set) => ({
            betSlipMode: 'floating',
            sportNavMode: 'topic',
            setBetSlipMode: (betSlipMode) => set({ betSlipMode }),
            setSportNavMode: (sportNavMode) => set({ sportNavMode }),
        }),
        { name: 'gtb-layout-experiment', version: 1 },
    ),
);

/** 当前投注单形态。 */
export const useBetSlipMode = (): BetSlipMode => useLayoutExperimentStore((s) => s.betSlipMode);
/** 当前体育导航形态。 */
export const useSportNavMode = (): SportNavMode => useLayoutExperimentStore((s) => s.sportNavMode);
