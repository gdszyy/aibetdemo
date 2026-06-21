'use client';

import { useUser } from '@/stores/session-store';
import { readAnalyticsAttribution } from '@/utils/analytics';

/** 根据登录态和本地归因解析埋点渠道。 */
export const resolveAnalyticsChannel = (profileChannel?: string | number): string | undefined => {
    if (profileChannel !== undefined && profileChannel !== null && String(profileChannel).length > 0) {
        return String(profileChannel);
    }

    return readAnalyticsAttribution().ch;
};

/** 读取当前埋点渠道，登录后优先使用 profile.ads_ch_code，未登录使用本地归因 ch。 */
export const useAnalyticsChannel = (): string | undefined => {
    const user = useUser();
    return resolveAnalyticsChannel(user?.ads_ch_code);
};
