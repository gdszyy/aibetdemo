import { create } from 'zustand';
import type {
    AdPlacementTriggeredResponse,
    FloatingCardAdPlacement,
    GlobalModalAdPlacement,
} from '@/api/models/ad-placement';

interface AdPlacementStoreState {
    activeModal: GlobalModalAdPlacement | null;
    floatingCards: FloatingCardAdPlacement[];
    setActiveModal: (item: GlobalModalAdPlacement | null) => void;
    removeFloatingCard: (id: number) => void;
    setTriggeredAdPlacements: (items: AdPlacementTriggeredResponse) => void;
}

/**
 * 触发型广告的全局展示状态。
 *
 * activeModal 同一时间只保留一个弹窗；floatingCards 保留当前触发时机返回的悬浮卡片列表。
 * 常驻广告配置不放在这里，继续由 React Query 管理。
 */
export const useAdPlacementStore = create<AdPlacementStoreState>((set) => ({
    activeModal: null,
    floatingCards: [],
    setActiveModal: (item) => set({ activeModal: item }),
    removeFloatingCard: (id) =>
        set((state) => ({
            floatingCards: state.floatingCards.filter((item) => item.id !== id),
        })),
    setTriggeredAdPlacements: (items) =>
        set({
            activeModal: items.popup,
            floatingCards: items.float_cards,
        }),
}));
