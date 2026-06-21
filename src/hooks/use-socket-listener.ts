import { useEffect, useEffectEvent, useRef } from 'react';
import { useSharedSocketStore } from '@/stores/shared-socket-store';
import { reportError } from '@/utils/error';
import type { IMessage } from '@/utils/websocket/helper';

/**
 * WebSocket Message Listener Hook
 * @param cmd Command identifier
 * @param callback Callback function when a message is received
 */
export const useSocketListener = <T = unknown>(cmd: number, callback: (data: T, message: IMessage) => void) => {
    const on = useSharedSocketStore((s) => s.on);
    const callbackRef = useRef(callback);

    // 1. Always keep the callback as the latest reference
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // 2. Bind event
    useEffect(() => {
        const handler = (msg: IMessage) => {
            // Priority: json, then text, finally data
            const data = msg.json ?? msg.text ?? msg.data;
            callbackRef.current(data as T, msg);
        };

        const off = on(cmd, handler);

        // Unsubscribe when component unmounts
        return off;
    }, [cmd, on]);
};

/**
 * Observer Pattern Core: Event Manager
 * Manages registration, unregistration, and notification of event listeners.
 */
class EventObserver<T = unknown> {
    private listeners: Map<string, Set<(data: T) => void>> = new Map();

    /**
     * Subscribe to an event (add observer)
     * @param event Event name
     * @param listener Listener function
     * @returns Unsubscribe function
     */
    subscribe(event: string, listener: (data: T) => void): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.add(listener);
        }

        // Return unsubscribe function
        return () => this.unsubscribe(event, listener);
    }

    /**
     * Unsubscribe from an event (remove observer)
     * @param event Event name
     * @param listener Listener function
     */
    unsubscribe(event: string, listener: (data: T) => void): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.delete(listener);
            if (eventListeners.size === 0) {
                this.listeners.delete(event);
            }
        }
    }

    /**
     * Notify all observers (trigger event)
     * @param event Event name
     * @param data Event data
     */
    notify(event: string, data: T): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach((listener) => {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`Error in event listener for "${event}":`, error);
                    reportError(error, {
                        level: 'error',
                        tags: {
                            module: 'event-observer',
                            action: 'notify-listener',
                            trigger: 'observer-event',
                        },
                        extra: { event },
                    });
                }
            });
        }
    }

    /**
     * Get the number of listeners for a specific event
     * @param event Event name
     */
    getListenerCount(event: string): number {
        return this.listeners.get(event)?.size ?? 0;
    }

    /**
     * Clear all listeners
     */
    clear(): void {
        this.listeners.clear();
    }

    /**
     * Clear all listeners for a specific event
     * @param event Event name
     */
    clearEvent(event: string): void {
        this.listeners.delete(event);
    }
}

// Global event observer instance
const globalEventObserver = new EventObserver();

export { EventObserver, globalEventObserver };

/**
 * Hook to listen for local events (Pure Observer pattern, no Socket dependency)
 * Used for cross-component communication
 * @param event Event name
 * @param handler Event handler function
 */
export const useEventObserver = <T = unknown>(event: string | undefined, handler: (data: T) => void) => {
    const callback = useEffectEvent((data: T) => {
        handler(data);
    });

    useEffect(() => {
        if (!event) return;
        const listener = (data: unknown) => {
            callback(data as T);
        };

        // Subscribe to event
        const unsubscribe = globalEventObserver.subscribe(event, listener);

        // Unsubscribe when component unmounts
        return unsubscribe;
    }, [event]);
};

/**
 * Hook to trigger local events (used for sending events)
 * @returns emit function to trigger events
 */
export const useEventEmitter = () => {
    const emit = useEffectEvent(<T = unknown>(event: string, data: T) => {
        globalEventObserver.notify(event, data);
    });

    return { emit };
};
