import type { LeaderElector } from 'broadcast-channel';
import { BroadcastChannel, createLeaderElection } from 'broadcast-channel';
import { getClientLocale } from '@/i18n';
import { CMD_PING, CMD_SUBSCRIBE_GAME, CMD_UNSUBSCRIBE_GAME } from '@/libs/event-constants';
import { captureWebSocketError, WebSocketError } from '@/libs/observability/sentry';
import { getSessionToken } from '@/stores/session-store';
import { type IMessage, packMessage, unpackMessage } from './helper';
import { showWsLog, wsLogger } from './ws-logger';

/**
 * Heartbeat configuration
 */
const HEARTBEAT_INTERVAL = 30 * 1000; // Heartbeat interval: 30s
const READ_DEADLINE = (HEARTBEAT_INTERVAL + 2 * 1000) * 3; // Read timeout
const RECONCILE_INTERVAL = 30 * 1000; // Subscription reconciliation interval: 30s
const SYNC_DEBOUNCE_DELAY = 200; // sync-response collection window: 200ms

/**
 * BroadcastChannel message types
 */
interface BroadcastMessage {
    type:
        | 'message'
        | 'connection'
        | 'send'
        | 'disconnect'
        | 'game-subscribe'
        | 'game-sync-request'
        | 'game-sync-response';
    payload?: unknown;
}

/**
 * Game subscription message
 */
interface GameSubscribeMessage {
    eventIds: string[];
}

/**
 * Game sync response message
 */
interface GameSyncResponseMessage {
    eventIds: string[];
}

/**
 * Connection state message
 */
interface ConnectionMessage {
    isConnected: boolean;
    error?: string;
}

/**
 * Send message request
 */
interface SendMessageRequest {
    cmd: number;
    data?: Uint8Array;
}

type MessageHandler = (msg: IMessage) => void;

const captureSharedSocketError = (
    message: string,
    step: string,
    error?: unknown,
    level: 'error' | 'warning' = 'error',
    extra?: Record<string, unknown>,
) => {
    captureWebSocketError(
        new WebSocketError(message, {
            level,
            tags: {
                module: 'websocket',
                action: 'shared-socket',
                step,
            },
            extra: {
                ...extra,
                ...(error instanceof Error
                    ? {
                          originalErrorName: error.name,
                          originalErrorMessage: error.message,
                      }
                    : error !== undefined
                      ? {
                            originalError: String(error),
                        }
                      : {}),
            },
        }),
    );
};

/**
 * SharedWebSocket — multi-tab shared WebSocket connection via BroadcastChannel
 *
 * Features:
 * - Uses Leader Election so only the leader tab maintains a real WebSocket connection
 * - Other tabs send/receive messages via BroadcastChannel
 * - When the leader tab closes, a new leader is automatically elected to take over
 */
export class SharedWebSocket {
    private socket: WebSocket | null = null;
    private channel: BroadcastChannel<BroadcastMessage>;
    private elector: LeaderElector | null = null;
    private isLeader = false;
    private isConnected = false;
    private connectionError: string | null = null;
    private handlers: Map<number, Set<MessageHandler>> = new Map();

    private pingTimer: NodeJS.Timeout | null = null;
    private readDeadlineTimer: NodeJS.Timeout | null = null;

    private url = '';
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 20;
    private beforeUnloadHandler: (() => void) | null = null;

    // ============ Game subscription management ============
    /** Set of eventIds the leader has subscribed to on the server */
    private serverGameSubs: Set<string> = new Set();
    /** Set of eventIds this tab needs */
    private localGameSubs: Set<string> = new Set();
    /** Reconciliation timer */
    private reconcileTimer: NodeJS.Timeout | null = null;
    /** Collected sync-responses from all tabs */
    private syncResponses: string[][] = [];
    /** sync-response collection window debounce timer */
    private syncDebounceTimer: NodeJS.Timeout | null = null;

    constructor(channelName = 'websocket-channel') {
        // Create BroadcastChannel
        this.channel = new BroadcastChannel(channelName);

        // Listen for messages from other tabs
        this.channel.addEventListener('message', this.handleBroadcastMessage);
    }

    /**
     * Handle BroadcastChannel messages from other tabs
     */
    private handleBroadcastMessage = (msg: BroadcastMessage) => {
        switch (msg.type) {
            case 'message':
                // Received WebSocket message, dispatch to this tab's listeners
                if (showWsLog) {
                    wsLogger.log(msg.payload as IMessage);
                }
                this.dispatchMessage(msg.payload as IMessage);
                break;

            case 'connection': {
                // Connection state update
                const connMsg = msg.payload as ConnectionMessage;
                this.isConnected = connMsg.isConnected;
                this.connectionError = connMsg.error || null;
                break;
            }

            case 'send':
                // Non-leader tab send message request
                if (this.isLeader) {
                    const sendMsg = msg.payload as SendMessageRequest;
                    this.sendRaw(sendMsg.cmd, sendMsg.data);
                }
                break;

            case 'disconnect':
                // Disconnect request
                if (this.isLeader) {
                    this.disconnectRaw();
                }
                break;

            case 'game-subscribe':
                // Non-leader tab requesting game subscription
                if (this.isLeader) {
                    const subMsg = msg.payload as GameSubscribeMessage;
                    this.handleGameSubscribe(subMsg.eventIds);
                }
                break;

            case 'game-sync-request':
                // Leader initiated sync request — reply with this tab's local subscriptions
                this.handleSyncRequest();
                break;

            case 'game-sync-response':
                // Leader collecting sync responses from tabs
                if (this.isLeader) {
                    const syncMsg = msg.payload as GameSyncResponseMessage;
                    this.collectSyncResponse(syncMsg.eventIds);
                }
                break;
        }
    };

    /**
     * Dispatch message to this tab's listeners
     */
    private dispatchMessage(msg: IMessage) {
        const cmdHandlers = this.handlers.get(msg.cmd);
        if (cmdHandlers && cmdHandlers.size > 0) {
            cmdHandlers.forEach((handler) => {
                try {
                    handler(msg);
                } catch (err) {
                    console.error(`Error in handler for cmd ${msg.cmd}:`, err);
                    captureSharedSocketError('WebSocket handler execution failed', 'dispatch', err, 'error', {
                        cmd: msg.cmd,
                    });
                }
            });
        }
    }

    /**
     * Broadcast connection state to all tabs
     */
    private broadcastConnectionState(isConnected: boolean, error?: string) {
        this.channel.postMessage({
            type: 'connection',
            payload: { isConnected, error } as ConnectionMessage,
        });
    }

    /**
     * Broadcast WebSocket message to all tabs
     */
    private broadcastMessage(msg: IMessage) {
        this.channel.postMessage({
            type: 'message',
            payload: msg,
        });
    }

    /**
     * Clear heartbeat timers
     */
    private clearHeartbeatTimers() {
        if (this.pingTimer) {
            clearInterval(this.pingTimer);
            this.pingTimer = null;
        }
        if (this.readDeadlineTimer) {
            clearTimeout(this.readDeadlineTimer);
            this.readDeadlineTimer = null;
        }
    }

    /**
     * Start heartbeat mechanism
     */
    private startHeartbeat(socket: WebSocket) {
        this.clearHeartbeatTimers();

        // Start heartbeat timer
        this.pingTimer = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
                try {
                    const time = Math.floor(Date.now() / 1000);
                    const encoder = new TextEncoder();
                    const pingData = encoder.encode('ping');
                    const buffer = packMessage(CMD_PING, time, pingData);
                    socket.send(buffer);
                } catch (error) {
                    console.error('Failed to send ping:', error);
                    captureSharedSocketError('Failed to send WebSocket ping', 'ping', error, 'warning');
                    this.clearHeartbeatTimers();
                }
            } else {
                this.clearHeartbeatTimers();
            }
        }, HEARTBEAT_INTERVAL);

        // Start read deadline timer
        this.resetReadDeadline(socket);
    }

    /**
     * Reset read deadline timer
     */
    private resetReadDeadline(socket: WebSocket) {
        if (this.readDeadlineTimer) {
            clearTimeout(this.readDeadlineTimer);
        }

        this.readDeadlineTimer = setTimeout(() => {
            console.warn('⚠️ WebSocket read deadline exceeded, closing connection');
            captureSharedSocketError(
                'WebSocket read deadline exceeded, closing connection',
                'read-deadline',
                undefined,
                'warning',
            );
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
            this.clearHeartbeatTimers();
        }, READ_DEADLINE);
    }

    /**
     * After becoming leader tab, create the real WebSocket connection
     */
    private async becomeLeader() {
        wsLogger.debug('leader');
        this.isLeader = true;

        if (this.url) {
            this.connectRaw(this.url);
        }

        // Start subscription reconciliation and immediately run once to collect all tabs' subscriptions
        this.startReconciliation();
        this.doReconciliation();
    }

    /**
     * Create real WebSocket connection (leader tab only)
     */
    private connectRaw(url: string) {
        if (!this.isLeader) return;

        // Register page unload event listener
        if (!this.beforeUnloadHandler && typeof window !== 'undefined') {
            this.beforeUnloadHandler = () => {
                if (this.socket) {
                    this.disconnectRaw();
                }
            };
            window.addEventListener('beforeunload', this.beforeUnloadHandler);
        }

        try {
            // Use URL API for robust parameter concatenation
            const socketUrl = new URL(url);

            const language = getClientLocale();
            if (language) {
                socketUrl.searchParams.set('lang', language);
            }

            const authToken = getSessionToken();
            if (authToken) {
                socketUrl.searchParams.set('token', authToken);
            }

            // Initialize WebSocket
            const newSocket = new WebSocket(socketUrl.toString());
            newSocket.binaryType = 'arraybuffer';

            // Bind events
            newSocket.onopen = () => {
                wsLogger.debug('connected', { isLeader: true });
                this.isConnected = true;
                this.connectionError = null;
                this.reconnectAttempts = 0;

                // Broadcast connection state to all tabs
                this.broadcastConnectionState(true);

                // Start heartbeat mechanism
                this.startHeartbeat(newSocket);

                // Restore game subscriptions after reconnect
                this.resubscribeOnConnect();
            };

            newSocket.onclose = (event) => {
                wsLogger.debug('disconnected', { code: event.code, reason: event.reason });
                this.isConnected = false;
                this.clearHeartbeatTimers();

                // Broadcast disconnected state
                this.broadcastConnectionState(false);

                // Auto-reconnect
                if (this.isLeader && this.reconnectAttempts < this.maxReconnectAttempts) {
                    // Reconnect strategy: first attempt at 500ms, then exponential (1.5x), max 30s
                    // Avoids overly aggressive 2x backoff while ensuring fast first reconnect
                    const delay =
                        this.reconnectAttempts === 0 ? 500 : Math.min(1000 * 1.5 ** this.reconnectAttempts, 30000);

                    wsLogger.debug('reconnect', {
                        delay,
                        attempt: this.reconnectAttempts + 1,
                        maxAttempts: this.maxReconnectAttempts,
                    });
                    setTimeout(() => {
                        this.reconnectAttempts++;
                        this.connectRaw(this.url);
                    }, delay);
                } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    console.error('❌ Max reconnection attempts reached');
                    this.connectionError = 'Max reconnection attempts reached';
                    captureSharedSocketError(
                        'Max WebSocket reconnection attempts reached',
                        'reconnect',
                        undefined,
                        'error',
                        {
                            reconnectAttempts: this.reconnectAttempts,
                            maxReconnectAttempts: this.maxReconnectAttempts,
                        },
                    );
                    this.broadcastConnectionState(false, this.connectionError);
                }
            };

            newSocket.onerror = (error) => {
                console.warn('⚠️ WebSocket Error:', error);
                this.connectionError = 'WebSocket connection error';
                this.isConnected = false;
                captureSharedSocketError('WebSocket connection error', 'onerror', error, 'warning');
                this.broadcastConnectionState(false, this.connectionError);
            };

            newSocket.onmessage = (event) => {
                try {
                    const data = event.data as ArrayBuffer;
                    const msg = unpackMessage(data);

                    // Handle pong message
                    if (msg.cmd === CMD_PING) {
                        this.resetReadDeadline(newSocket);
                        return;
                    }

                    // Reset read deadline on any received message
                    this.resetReadDeadline(newSocket);

                    // Log the incoming message to debug system
                    if (showWsLog) {
                        wsLogger.log(msg);
                    }

                    // Dispatch to this tab
                    this.dispatchMessage(msg);

                    // Broadcast to other tabs
                    this.broadcastMessage(msg);
                } catch (err) {
                    console.error('Failed to parse message:', err);
                    captureSharedSocketError('Failed to parse WebSocket message', 'parse', err, 'warning');
                }
            };

            this.socket = newSocket;
        } catch (err) {
            console.error('⚠️ Failed to create WebSocket:', err);
            this.connectionError = err instanceof Error ? err.message : 'Unknown error';
            this.isConnected = false;
            captureSharedSocketError('Failed to create WebSocket', 'create', err, 'error', {
                url,
            });
            this.broadcastConnectionState(false, this.connectionError);
        }
    }

    /**
     * Disconnect real WebSocket connection (leader tab only)
     */
    private disconnectRaw() {
        this.clearHeartbeatTimers();
        this.stopReconciliation();

        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.isConnected = false;
            this.reconnectAttempts = 0;
        }

        // Remove page unload event listener
        if (this.beforeUnloadHandler && typeof window !== 'undefined') {
            window.removeEventListener('beforeunload', this.beforeUnloadHandler);
            this.beforeUnloadHandler = null;
        }
    }

    /**
     * Send raw message (leader tab only)
     */
    private sendRaw(cmd: number, data?: Uint8Array) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            const time = Math.floor(Date.now() / 1000);
            const buffer = packMessage(cmd, time, data);
            this.socket.send(buffer);
        } else {
            // console.warn('WebSocket not connected, message dropped:', cmd);
        }
    }

    // ============ Game subscription management (private) ============

    /**
     * Encode eventIds as binary payload
     * Protocol format: JSON string array ["event_id1", "event_id2"]
     */
    private encodeEventIds(eventIds: string[]): Uint8Array {
        return new TextEncoder().encode(JSON.stringify(eventIds));
    }

    /**
     * Leader handles subscription request: only sends new eventIds after diff
     */
    private handleGameSubscribe(eventIds: string[]) {
        const newIds = eventIds.filter((id) => !this.serverGameSubs.has(id));
        if (newIds.length === 0) return;

        for (const id of newIds) {
            this.serverGameSubs.add(id);
        }

        this.sendRaw(CMD_SUBSCRIBE_GAME, this.encodeEventIds(newIds));
        wsLogger.debug('subscribe', { eventIds: newIds });
    }

    /**
     * When non-leader receives sync-request, reply with this tab's local subscriptions
     */
    private handleSyncRequest() {
        const eventIds = Array.from(this.localGameSubs);
        this.channel.postMessage({
            type: 'game-sync-response',
            payload: { eventIds } as GameSyncResponseMessage,
        });
    }

    /**
     * Leader collects sync-responses, processes in batch after debounce
     */
    private collectSyncResponse(eventIds: string[]) {
        this.syncResponses.push(eventIds);

        if (this.syncDebounceTimer) {
            clearTimeout(this.syncDebounceTimer);
        }

        this.syncDebounceTimer = setTimeout(() => {
            this.handleSyncResponses();
        }, SYNC_DEBOUNCE_DELAY);
    }

    /**
     * Leader processes all collected sync-responses:
     * Computes union of all tabs' eventIds (including leader's own localGameSubs),
     * diffs against current serverGameSubs, sends subscribe/unsubscribe
     */
    private handleSyncResponses() {
        // Compute union of all tabs' eventIds
        const allEventIds = new Set<string>(this.localGameSubs);
        for (const response of this.syncResponses) {
            for (const id of response) {
                allEventIds.add(id);
            }
        }
        this.syncResponses = [];

        // EventIds that need new subscriptions
        const toSubscribe = Array.from(allEventIds).filter((id) => !this.serverGameSubs.has(id));
        // EventIds that need to be unsubscribed
        const toUnsubscribe = Array.from(this.serverGameSubs).filter((id) => !allEventIds.has(id));

        if (toSubscribe.length > 0) {
            for (const id of toSubscribe) {
                this.serverGameSubs.add(id);
            }
            this.sendRaw(CMD_SUBSCRIBE_GAME, this.encodeEventIds(toSubscribe));
            wsLogger.debug('reconcile-subscribe', { eventIds: toSubscribe });
        }

        if (toUnsubscribe.length > 0) {
            for (const id of toUnsubscribe) {
                this.serverGameSubs.delete(id);
            }
            this.sendRaw(CMD_UNSUBSCRIBE_GAME, this.encodeEventIds(toUnsubscribe));
            wsLogger.debug('unsubscribe', { eventIds: toUnsubscribe });
        }

        if (toSubscribe.length === 0 && toUnsubscribe.length === 0) {
            wsLogger.debug('reconcile', { eventIds: [], action: 'noop' });
        }
    }

    /**
     * Start reconciliation timer (leader only)
     */
    private startReconciliation() {
        this.stopReconciliation();
        this.reconcileTimer = setInterval(() => {
            this.doReconciliation();
        }, RECONCILE_INTERVAL);
    }

    /**
     * Stop reconciliation timer
     */
    private stopReconciliation() {
        if (this.reconcileTimer) {
            clearInterval(this.reconcileTimer);
            this.reconcileTimer = null;
        }
        if (this.syncDebounceTimer) {
            clearTimeout(this.syncDebounceTimer);
            this.syncDebounceTimer = null;
        }
        this.syncResponses = [];
    }

    /**
     * Execute one reconciliation: broadcast sync-request to all tabs
     */
    private doReconciliation() {
        this.syncResponses = [];
        this.channel.postMessage({ type: 'game-sync-request' });
        // Leader itself also participates: directly add localGameSubs to collection
        this.collectSyncResponse(Array.from(this.localGameSubs));
    }

    /**
     * Restore all known subscriptions after WS reconnect
     */
    private resubscribeOnConnect() {
        if (this.serverGameSubs.size > 0) {
            const allIds = Array.from(this.serverGameSubs);
            this.sendRaw(CMD_SUBSCRIBE_GAME, this.encodeEventIds(allIds));
            wsLogger.debug('resubscribe', { eventIds: allIds });
        }
        // Trigger one reconciliation to collect potentially changed subscriptions
        this.doReconciliation();
    }

    // ============ Public API ============

    /**
     * Connect WebSocket
     */
    async connect(url: string) {
        this.url = url;

        // Create Leader Elector
        if (!this.elector) {
            this.elector = createLeaderElection(this.channel);

            // Wait for leader election result
            this.elector.awaitLeadership().then(() => {
                this.becomeLeader();
            });

            // Listen for leadership changes
            this.elector.onduplicate = () => {
                if (showWsLog) {
                    console.warn('[ws][duplicate-leader]');
                }
            };
        }

        // If already leader, connect directly
        if (this.isLeader) {
            this.connectRaw(url);
        }
    }

    /**
     * Disconnect
     */
    disconnect() {
        // If leader tab, disconnect directly
        if (this.isLeader) {
            this.disconnectRaw();
        } else {
            // Non-leader tab sends disconnect request
            this.channel.postMessage({
                type: 'disconnect',
            });
        }

        // Clear all listeners
        this.handlers.clear();
    }

    /**
     * Send message
     */
    send(cmd: number, data?: Uint8Array) {
        if (this.isLeader) {
            // Leader tab sends directly
            this.sendRaw(cmd, data);
        } else {
            // Non-leader tab sends request via BroadcastChannel
            this.channel.postMessage({
                type: 'send',
                payload: { cmd, data } as SendMessageRequest,
            });
        }
    }

    /**
     * Dispatch a pre-parsed message (used for testing and replay)
     */
    dispatchSimulatedMessage(msg: IMessage) {
        this.dispatchMessage(msg);
    }

    /**
     * Listen for messages with a specific cmd
     */
    on(cmd: number, handler: MessageHandler): () => void {
        if (!this.handlers.has(cmd)) {
            this.handlers.set(cmd, new Set());
        }
        this.handlers.get(cmd)?.add(handler);

        // Return unsubscribe function
        return () => {
            this.off(cmd, handler);
        };
    }

    /**
     * Remove listener for a specific cmd
     */
    off(cmd: number, handler?: MessageHandler) {
        if (!handler) {
            this.handlers.delete(cmd);
        } else {
            this.handlers.get(cmd)?.delete(handler);
            if (this.handlers.get(cmd)?.size === 0) {
                this.handlers.delete(cmd);
            }
        }
    }

    /**
     * Subscribe to game event push
     * Updates this tab's localGameSubs and notifies the leader to send subscription to server
     * @param eventIds Game event ID list
     */
    subscribeGame(eventIds: string[]) {
        for (const id of eventIds) {
            this.localGameSubs.add(id);
        }

        if (this.isLeader) {
            this.handleGameSubscribe(eventIds);
        } else {
            this.channel.postMessage({
                type: 'game-subscribe',
                payload: { eventIds } as GameSubscribeMessage,
            });
        }
    }

    /**
     * Unsubscribe from game event push
     * Only updates this tab's localGameSubs; actual unsubscription is handled by reconciliation
     * @param eventIds Game event ID list
     */
    unsubscribeGame(eventIds: string[]) {
        for (const id of eventIds) {
            this.localGameSubs.delete(id);
        }
    }

    /**
     * Get this tab's current subscription list
     */
    getLocalGameSubscriptions(): string[] {
        return Array.from(this.localGameSubs);
    }

    /**
     * Get connection state
     */
    getConnectionState() {
        return {
            isConnected: this.isConnected,
            isLeader: this.isLeader,
            connectionError: this.connectionError,
        };
    }

    /**
     * Destroy instance
     */
    destroy() {
        this.stopReconciliation();
        this.serverGameSubs.clear();
        this.localGameSubs.clear();
        this.disconnect();

        // Clean up BroadcastChannel
        this.channel.removeEventListener('message', this.handleBroadcastMessage);
        this.channel.close();

        // Clean up Leader Elector
        if (this.elector) {
            this.elector.die();
            this.elector = null;
        }
    }
}
