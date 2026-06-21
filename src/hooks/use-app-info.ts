import { useEffect } from 'react';
import { useAppInfoStore } from '@/stores/app-info-store';

/**
 * Initialize application information.
 * Fetches application configuration from the server and updates the store.
 */
export const useInitAppInfo = () => {
    const dispatchMatchStatusDict = useAppInfoStore((s) => s.dispatchMatchStatusDict);

    useEffect(() => {
        dispatchMatchStatusDict();
    }, [dispatchMatchStatusDict]);
};
