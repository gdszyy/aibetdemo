import { fetchEventSource } from '@microsoft/fetch-event-source';
import { BroadcastChannel } from 'broadcast-channel';
import { config } from '@/constants/config';
import { captureRuntimeError } from '@/libs/observability/sentry';

/**
 * SSE (Server-Sent Events) client with Multi-tab consistency.
 */

type SSEEventHandler = (event: string, data: unknown) => void;
type SSEStatusHandler = (connected: boolean) => void;

interface SSEBroadcastMessage {
    type: 'message' | 'connection' | 'takeover';
    senderId: string;
    event?: string;
    data?: unknown;
    isConnected?: boolean;
}

const AUTH_ERROR_CODES = new Set([401, 403]);

export class SSEClient {
    private abortController: AbortController | null = null;
    private url = '';
    private readonly tabId =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `sse-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    private _isDirectlyConnected = false; // Whether THIS tab has an active network connection
    private _logicalConnected = false; // Whether ANY tab is connected (for UI)
    private _destroyed = false;
    private autoReconnect: boolean;
    private channel: BroadcastChannel<SSEBroadcastMessage> | null = null;

    constructor(
        private getToken: () => string | null,
        private onEvent: SSEEventHandler,
        private onStatusChange: SSEStatusHandler,
        options?: { autoReconnect?: boolean; channelName?: string },
    ) {
        this.autoReconnect = options?.autoReconnect ?? true;

        if (options?.channelName) {
            this.channel = new BroadcastChannel(options.channelName);
            this.channel.addEventListener('message', this.handleBroadcastMessage);
        }

        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
        }
    }

    private handleBroadcastMessage = (msg: SSEBroadcastMessage) => {
        if (msg.senderId === this.tabId) {
            return;
        }

        if (msg.type === 'takeover') {
            this.handleRemoteTakeover();
            return;
        }

        if (msg.type === 'message' && msg.event) {
            if (this._isDirectlyConnected) {
                return;
            }

            if (config.isDev) {
                console.log(`[SSE] Received broadcast for ${msg.event}`);
            }
            this.onEvent(msg.event, msg.data);
            this.setLogicalConnected(true);
            return;
        }

        if (msg.type === 'connection' && typeof msg.isConnected === 'boolean') {
            if (!this._isDirectlyConnected) {
                this.setLogicalConnected(msg.isConnected);
            }
        }
    };

    private handleRemoteTakeover(): void {
        if (config.isDev) {
            console.log('[SSE] Another tab took over the direct connection');
        }

        this.stopConnection();
        this.setLogicalConnected(false);
    }

    private handleVisibilityChange = () => {
        if (this._destroyed) return;

        if (document.visibilityState === 'visible') {
            if (config.isDev) console.log('[SSE] Tab visible: claiming SSE ownership');
            this.claimOwnershipAndConnect();
        } else {
            if (config.isDev) {
                console.log('[SSE] Tab hidden: releasing direct connection');
            }
            this.releaseDirectConnection();
        }
    };

    get connected(): boolean {
        return this._logicalConnected;
    }

    connect(url: string): void {
        this._destroyed = false;
        this.url = url;

        if (typeof document === 'undefined' || document.visibilityState === 'visible') {
            this.claimOwnershipAndConnect();
        }
    }

    disconnect(): void {
        this._destroyed = true;
        this.releaseDirectConnection();
        this.setLogicalConnected(false);

        if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        }

        if (this.channel) {
            this.channel.removeEventListener('message', this.handleBroadcastMessage);
            this.channel.close();
            this.channel = null;
        }
    }

    private claimOwnershipAndConnect(): void {
        if (this._destroyed || !this.url) return;

        if (this.channel) {
            this.channel.postMessage({
                type: 'takeover',
                senderId: this.tabId,
            });
        }

        void this.doConnect(true);
    }

    private releaseDirectConnection(): void {
        const wasDirectlyConnected = this._isDirectlyConnected;

        this.stopConnection();
        this.setLogicalConnected(false);

        if (wasDirectlyConnected) {
            this.broadcastStatusChange(false);
        }
    }

    private stopConnection(): void {
        this._isDirectlyConnected = false;
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    private async doConnect(forceReconnect = false): Promise<void> {
        if (this._destroyed || !this.url) return;

        if (this._isDirectlyConnected && !forceReconnect) return;

        const token = this.getToken();
        if (!token) return;

        this.stopConnection();
        this.abortController = new AbortController();
        const currentController = this.abortController;

        try {
            await fetchEventSource(this.url, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
                signal: currentController.signal,
                onopen: async (response) => {
                    if (currentController.signal.aborted) return;
                    if (response.ok) {
                        this._isDirectlyConnected = true;
                        this.setLogicalConnected(true);
                        this.broadcastStatusChange(true);
                        if (config.isDev) console.log('[SSE] ✅ Direct connection established');
                        return;
                    }
                    if (AUTH_ERROR_CODES.has(response.status)) {
                        this._destroyed = true;
                        this.stopConnection();
                        throw new Error('Auth failure');
                    }
                    throw new Error(`SSE Connection failed status ${response.status}`);
                },
                onmessage: (msg) => {
                    if (this._destroyed || currentController.signal.aborted) return;

                    let parsedData: unknown = msg.data;
                    try {
                        parsedData = JSON.parse(msg.data);
                    } catch {
                        /* raw */
                    }

                    const event = msg.event || 'message';

                    // 1. Local dispatch
                    this.onEvent(event, parsedData);

                    // 2. Broadcast to other (hidden) tabs
                    if (this.channel) {
                        this.channel.postMessage({
                            type: 'message',
                            senderId: this.tabId,
                            event,
                            data: parsedData,
                        });
                    }
                },
                onclose: () => {
                    if (currentController.signal.aborted) return;
                    this.stopConnection();
                    this.setLogicalConnected(false);
                    this.broadcastStatusChange(false);

                    if (!this.autoReconnect) {
                        throw new Error('SSE connection closed');
                    }
                },
                onerror: (err) => {
                    if (currentController.signal.aborted) return;
                    this._isDirectlyConnected = false;
                    this.setLogicalConnected(false);

                    if (!this.autoReconnect) {
                        this.stopConnection();
                        throw err;
                    }

                    if (this._destroyed) {
                        this.stopConnection();
                        throw err;
                    }
                },
            });
        } catch (err) {
            if (config.isDev && !(err instanceof Error && err.name === 'AbortError')) {
                console.error('[SSE] Connection error:', err);
            }

            if (!(err instanceof Error && err.name === 'AbortError')) {
                captureRuntimeError(err instanceof Error ? err : new Error('SSE connection error'), {
                    level: 'warning',
                    tags: { module: 'sse', action: 'connect' },
                    extra: {
                        autoReconnect: this.autoReconnect,
                        isDestroyed: this._destroyed,
                        url: this.url,
                    },
                });
            }
        }
    }

    private setLogicalConnected(value: boolean): void {
        if (this._logicalConnected !== value) {
            this._logicalConnected = value;
            this.onStatusChange(value);
        }
    }

    private broadcastStatusChange(isConnected: boolean): void {
        if (this.channel) {
            this.channel.postMessage({
                type: 'connection',
                senderId: this.tabId,
                isConnected,
            });
        }
    }
}
