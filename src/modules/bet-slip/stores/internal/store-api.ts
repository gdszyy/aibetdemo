import type { StoreApi, UseBoundStore } from 'zustand';
import type { BetSlipState } from '../slices';

export type BetSlipStore = UseBoundStore<StoreApi<BetSlipState>>;
export type BetSlipStoreGetter = () => BetSlipStore;
