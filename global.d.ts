import type en from '@/assets/locales/en';
import type { routing } from '@/i18n/locale/config';

type Messages = typeof en;

declare global {
    // Use type safe message keys with `next-intl`
    interface IntlMessages extends Messages {}
}

// v4 针对 ts 版本类型提示
declare module 'next-intl' {
    interface AppConfig {
        Locale: (typeof routing.locales)[number];
        Messages: Messages;
    }
}
