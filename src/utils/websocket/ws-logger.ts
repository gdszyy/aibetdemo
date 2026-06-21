import { SHOW_WS_LOG } from '@/constants';
import type { IMessage } from './helper';

export const showWsLog = SHOW_WS_LOG;

export class WSLogger {
    private limit = 10000;
    private buffer: { time: number; cmd: number; text?: string; json?: unknown; eventId?: string }[] = [];
    private enabled = false;

    constructor() {
        if (typeof window !== 'undefined') {
            (window as any).__WS_LOGGER__ = this;
            this.enabled = showWsLog; // Enabled by default in development
        }
    }

    log(msg: IMessage) {
        if (!this.enabled) return;

        // Try to extract eventId
        let eventId: string | undefined;
        if (msg.json) {
            const data = msg.json as any;
            eventId = data?.event_id || data?.sport_event_id || data?.id;
        }

        this.buffer.push({
            time: Date.now(),
            cmd: msg.cmd,
            text: msg.text,
            json: msg.json,
            eventId: eventId ? String(eventId) : undefined,
        });

        // Maintain circular buffer
        if (this.buffer.length > this.limit) {
            this.buffer.shift();
        }
    }

    debug(name: string, payload?: unknown) {
        if (!this.enabled) return;

        if (payload === undefined) {
            console.log(`[ws][${name}]`);
            return;
        }

        console.log(`[ws][${name}] ${this.formatPayload(payload)}`);
    }

    private formatPayload(payload: unknown) {
        if (typeof payload === 'string') return payload;

        try {
            return JSON.stringify(payload);
        } catch {
            return '[unserializable-payload]';
        }
    }

    dump(eventId?: string | number) {
        if (!eventId) return this.buffer;
        const targetId = String(eventId);
        return this.buffer.filter((b) => b.eventId === targetId);
    }

    download(eventId?: string | number) {
        const data = this.dump(eventId);
        if (data.length === 0) {
            console.warn(`[WSLogger] No logs to download for event: ${eventId || 'ALL'}`);
            return;
        }

        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        a.download = `ws-logs-${eventId || 'all'}-${timestamp}.json`;
        a.href = url;
        a.click();

        URL.revokeObjectURL(url);
        console.log(`[WSLogger] Downloaded ${data.length} logs.`);
    }

    clear() {
        this.buffer = [];
        console.log('[WSLogger] Cleared logs.');
    }
}

export const wsLogger = new WSLogger();
