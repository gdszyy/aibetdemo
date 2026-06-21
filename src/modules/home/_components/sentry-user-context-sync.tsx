'use client';

import { type FC, useEffect } from 'react';
import { syncSentryUserContext } from '@/libs/observability/sentry';
import { useUser } from '@/stores/session-store';

/**
 * Sentry 用户上下文同步组件。
 *
 * 挂在应用初始化阶段，把当前 session user.uid 同步到 Sentry scope，
 * 这样自动捕获和手动上报都能带上统一的 `user.id`。
 */
export const SentryUserContextSync: FC = () => {
    const user = useUser();

    useEffect(() => {
        syncSentryUserContext({
            uid: user?.uid,
        });
    }, [user?.uid]);

    return null;
};
