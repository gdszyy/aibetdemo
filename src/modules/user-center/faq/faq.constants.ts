import type { FaqLanguage } from '@/api/models/faq';
import { type Locale, routing } from '@/i18n';

const FAQ_LANGUAGE_BY_LOCALE: Record<Locale, FaqLanguage> = {
    pt: 'pt',
    es: 'es',
    en: 'en',
};

export const getFaqLanguageByLocale = (locale: string): FaqLanguage => {
    if (locale in FAQ_LANGUAGE_BY_LOCALE) {
        return FAQ_LANGUAGE_BY_LOCALE[locale as Locale];
    }

    return FAQ_LANGUAGE_BY_LOCALE[routing.defaultLocale];
};
