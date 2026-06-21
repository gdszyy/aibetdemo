import { create } from 'zustand';

/** 节流刷新网页 */
export const useLocationReloadStore = create<{
    /** 刷新页面 */
    reload: (
        /** 延迟时间，单位毫秒 */
        wait?: number,
    ) => void;
}>(() => {
    let handle: ReturnType<typeof setTimeout> | null = null;

    const reload = (wait: number = 200) => {
        if (handle) {
            clearTimeout(handle);
        }
        handle = setTimeout(() => {
            handle = null;
            console.log('[LocationReload] Reloading page...');
            window.location.reload();
        }, wait);
    };

    return { reload };
});

/** 刷新页面 */
export const useLocationReload = () => {
    return useLocationReloadStore((s) => s.reload);
};
