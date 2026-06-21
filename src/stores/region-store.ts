import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_REGION, getRegionByCode, type RegionCode, type RegionConfig } from '@/i18n';

interface RegionState {
    regionCode: RegionCode;
    config: RegionConfig;
    /** Set region by code (user selects from dropdown) */
    setRegion: (code: RegionCode) => void;
}

export const useRegionStore = create<RegionState>()(
    persist(
        (set) => ({
            regionCode: DEFAULT_REGION,
            config: getRegionByCode(DEFAULT_REGION),
            setRegion: (code: RegionCode) => set({ regionCode: code, config: getRegionByCode(code) }),
        }),
        {
            name: 'app-region',
            // Defer rehydration to useEffect to prevent SSR hydration mismatch
            skipHydration: true,
            // Only persist the regionCode, rehydrate config from registry
            partialize: (state) => ({ regionCode: state.regionCode }),
            merge: (persisted, current) => {
                const stored = persisted as { regionCode?: RegionCode } | undefined;
                const code = stored?.regionCode ?? current.regionCode;
                return {
                    ...current,
                    regionCode: code,
                    config: getRegionByCode(code),
                };
            },
        },
    ),
);

/** Shortcut: current region config (phoneCode, phonePattern, idType, etc.) */
export const useRegionConfig = () => useRegionStore((s) => s.config);

/** Shortcut: current region code */
export const useRegionCode = () => useRegionStore((s) => s.regionCode);
