import Cookies from 'js-cookie';
import { create } from 'zustand';
import { CacheKey } from '@/constants/cache';

interface TimezoneState {
    timezone: string;
}

export const useTimezoneStore = create<TimezoneState>(() => {
    return {
        timezone: Cookies.get(CacheKey.I18nTimezone) || '',
    };
});
