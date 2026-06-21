import Cookies from 'js-cookie';
import { CacheKey } from '@/constants/cache';
import { config } from '@/constants/config';
import { isValidLocale, routing } from './config';

// TODO 应该放到 i18nV2 store中
/**
 * Get client's current locale
 * Priority: URL Path > Cookie > Default (pt)
 * Note: This function should only be used in client environment
 */
export const getClientLocale = () => {
    // 1. Try to get from URL path (Source of Truth)
    if (typeof window !== 'undefined') {
        const pathParts = window.location.pathname.split('/');
        const firstPart = pathParts[1]; // /en/home -> en
        if (isValidLocale(firstPart)) {
            // if (config.isDev) console.log('[i18n] Locale found in URL:', firstPart);
            return firstPart;
        }
    }

    // 2. Fallback to cookie
    const cookieLocale = Cookies.get(CacheKey.I18nLanguage);
    if (cookieLocale && isValidLocale(cookieLocale)) {
        return cookieLocale;
    }

    // 3. Fallback assertion (throw error in development)
    if (config.isDev) {
        // Only throw in browser environment to avoid breaking SSR or edge cases
        // In practice, fetcher and socketStore mostly run on the client side
        if (typeof window !== 'undefined') {
            throw new Error('Locale not found in URL or Cookie!');
        }
    }
    return routing.defaultLocale;
};
