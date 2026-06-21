import { useEffect } from 'react';
import { config, resolveServiceUrl } from '@/constants/config';
import { globalEventObserver } from '@/hooks/use-socket-listener';
import { getSessionToken, useIsLogin } from '@/stores/session-store';
import { SSEClient } from '@/utils/sse';
/**
 * Connects to SSE when user is logged in, disconnects on logout.
 *
 * Responsibilities:
 * 1. Lifecycle: Connect/Disconnect based on auth status.
 * 2. Dispatching: Routes all incoming raw SSE messages to `globalEventObserver`
 *    as `sse:{eventName}`.
 *
 * Business logic should subscribe to `sse:{eventName}` in their respective domains.
 */
export function useSSEConnection() {
    const isLogin = useIsLogin();

    useEffect(() => {
        const sseUrl = resolveServiceUrl(process.env.NEXT_PUBLIC_SSE_SERVICE);
        if (!isLogin || !sseUrl) return;

        const client = new SSEClient(
            getSessionToken,
            (event, data) => {
                if (config.isDev) {
                    console.log(`[SSE] Event: ${event}, Data: ${JSON.stringify(data)}`);
                }
                // Emit raw event to global observer
                globalEventObserver.notify(`sse:${event}`, data);
            },
            (connected) => {
                if (config.isDev) console.log(`[SSE] ${connected ? 'Connected' : 'Disconnected'}`);
            },
            { channelName: 'sse-client-channel' },
        );

        client.connect(`${sseUrl}/v1/sse/subscribe`);

        return () => {
            client.disconnect();
        };
    }, [isLogin]);
}
