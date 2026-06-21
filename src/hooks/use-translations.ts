import { useTranslations } from 'next-intl';

/** common翻译项的快捷方式 */
export const useCommonTranslations = () => {
    return useTranslations('common');
};
