import { create } from 'zustand';
import type { MessageHandler, SharedSocketState } from '@/utils/websocket/helper';
import { SharedWebSocket } from '@/utils/websocket/shared-web-socket';
import { showWsLog } from '@/utils/websocket/ws-logger';

// Create global SharedWebSocket instance
const sharedSocketInstance = new SharedWebSocket('websocket-channel');

// Periodically update connection state
let stateUpdateTimer: NodeJS.Timeout | null = null;

export const useSharedSocketStore = create<SharedSocketState>((set, get) => ({
    sharedSocket: sharedSocketInstance,
    isConnected: false,
    isLeader: false,
    connectionError: null,
    handlers: new Map<number, Set<MessageHandler>>(),

    connect: async (url) => {
        const { sharedSocket } = get();

        // Connect
        await sharedSocket.connect(url);

        // Start connection state update timer (check every second)
        if (!stateUpdateTimer) {
            stateUpdateTimer = setInterval(() => {
                get().updateConnectionState();
            }, 1000);
        }

        // Immediately update state once
        get().updateConnectionState();
    },

    disconnect: () => {
        const { sharedSocket } = get();
        sharedSocket.disconnect();

        // Clean up connection state update timer
        if (stateUpdateTimer) {
            clearInterval(stateUpdateTimer);
            stateUpdateTimer = null;
        }

        set({
            isConnected: false,
            isLeader: false,
            connectionError: null,
        });
    },

    send: (cmd, data) => {
        const { sharedSocket } = get();
        sharedSocket.send(cmd, data);
    },

    dispatchSimulatedMessage: (msg) => {
        const { sharedSocket } = get();
        sharedSocket.dispatchSimulatedMessage(msg);
    },

    on: (cmd, handler) => {
        const { sharedSocket } = get();
        return sharedSocket.on(cmd, handler);
    },

    off: (cmd, handler) => {
        const { sharedSocket } = get();
        sharedSocket.off(cmd, handler);
    },

    updateConnectionState: () => {
        const { sharedSocket } = get();
        const state = sharedSocket.getConnectionState();

        set({
            isConnected: state.isConnected,
            isLeader: state.isLeader,
            connectionError: state.connectionError,
        });
    },

    subscribeGame: (eventIds) => {
        const { sharedSocket } = get();
        sharedSocket.subscribeGame(eventIds);
    },

    unsubscribeGame: (eventIds) => {
        const { sharedSocket } = get();
        sharedSocket.unsubscribeGame(eventIds);
    },
}));

// Expose Store to window only in development for console-based WS message simulation
if (showWsLog && typeof window !== 'undefined') {
    // @ts-expect-error
    window.__SOCKET_STORE__ = useSharedSocketStore;
}
