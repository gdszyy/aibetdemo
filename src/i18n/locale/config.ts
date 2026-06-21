export const routing = {
    locales: ['en', 'pt', 'es'],
    defaultLocale: 'pt',
};

export type Locale = (typeof routing.locales)[number];

/** Type-safe locale check */
export function isValidLocale(value: string): value is Locale {
    return (routing.locales as readonly string[]).includes(value);
}
export type Timezone = string;
export type CurrencyCode = string;

/** language dict */
export const LANGUAGE_DICT: Record<Locale, string> = {
    en: 'English',
    pt: 'Português',
    es: 'Español',
};
