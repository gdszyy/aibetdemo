'use client';

import type { FC } from 'react';
import { useEffect } from 'react';
import { useLiveChatSession } from '@/hooks/use-live-chat-session';
import { prepareLiveChat, pushContext } from '@/libs/livechat/client';

const PREPARE_IDLE_TIMEOUT_MS = 3000;

function scheduleIdlePrepare(run: () => void): () => void {
    if (typeof window.requestIdleCallback === 'function') {
        const idleId = window.requestIdleCallback(run, { timeout: PREPARE_IDLE_TIMEOUT_MS });
        return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(run, 0);
    return () => window.clearTimeout(timeoutId);
}

export const LiveChatProvider: FC = () => {
    const { isAvailable, license, groupId, getContext, clearContext } = useLiveChatSession();

    useEffect(() => {
        if (isAvailable) return;
        clearContext();
    }, [isAvailable, clearContext]);

    useEffect(() => {
        if (!isAvailable) return;
        return scheduleIdlePrepare(() => {
            prepareLiveChat(license, groupId).catch((error: unknown) => {
                if (process.env.NODE_ENV === 'development') {
                    console.error('[LiveChat] prepare failed', error);
                }
            });
        });
    }, [isAvailable, license, groupId]);

    useEffect(() => {
        if (!isAvailable) return;
        const context = getContext();
        if (context) pushContext(context);
    }, [isAvailable, getContext]);

    return null;
};

LiveChatProvider.displayName = 'LiveChatProvider';
