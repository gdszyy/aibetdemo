import { isValidLocale, type Locale } from '@/i18n/locale/config';

/** LiveChat 后台创建的客服分组 ID。 */
export type LiveChatGroupId = 1 | 2;

/** LiveChat 语言到后台分组的映射：墨西哥=1，巴西=2，英文默认走巴西。 */
const LIVECHAT_GROUP_ID_BY_LOCALE: Record<Locale, LiveChatGroupId> = {
    en: 2,
    es: 1,
    pt: 2,
};

/** 根据当前语言选择 LiveChat 后台分组。 */
export function getLiveChatGroupId(locale: string): LiveChatGroupId {
    if (!isValidLocale(locale)) return LIVECHAT_GROUP_ID_BY_LOCALE.en;
    return LIVECHAT_GROUP_ID_BY_LOCALE[locale];
}
