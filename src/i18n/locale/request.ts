import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { locales } from '@/assets/locales';
import { CacheKey } from '@/constants/cache';
import { isValidLocale, routing } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !isValidLocale(locale)) {
        locale = routing.defaultLocale;
    }

    const cookieStore = await cookies();
    const timeZone = cookieStore.get(CacheKey.I18nTimezone)?.value;

    return {
        locale,
        timeZone,
        messages: locales[locale as keyof typeof locales],
    };
});
