import { create } from 'zustand';

/**
 * Base modal level management
 */
export const useModalLevel = create<{
    /** All modal IDs */
    modalIds: string[];
    /** Add a modal ID */
    addModalId: () => string;
    /** Remove a modal ID */
    removeModalId: (id: string) => void;
    /** Get modal z-level */
    getModalLevel: (id: string) => number;
}>((set, get) => {
    return {
        modalIds: [],
        /** Add a modal ID */
        addModalId: () => {
            const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
            set({ modalIds: [...get().modalIds, id] });
            return id;
        },
        /** Remove a modal ID */
        removeModalId: (id) => set({ modalIds: get().modalIds.filter((item) => item !== id) }),
        /** Get modal z-level */
        getModalLevel: (id) => {
            const level = get().modalIds.indexOf(id);
            return level === -1 ? 0 : level;
        },
    };
});
