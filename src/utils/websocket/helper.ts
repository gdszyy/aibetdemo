import { reportError } from '@/utils/error';
import type { SharedWebSocket } from './shared-web-socket';

/**
 * Message pack/unpack utility
 * Corresponds to backend packet.go encoding/decoding logic
 * Protocol format: cmd(4 bytes) + time(8 bytes) + data(variable length)
 */
const HEAD_LEN = 12; // Header length: 4(cmd) + 8(time)

export type MessageHandler = (msg: IMessage) => void;

/**
 * Message interface, corresponds to backend Message struct
 */
export interface IMessage {
    cmd: number; // 4-byte uint32
    time: number; // 8-byte uint64 (JavaScript uses number, max safe integer 2^53-1)
    data: Uint8Array; // Variable-length data (raw binary)
    text?: string; // UTF-8 decoded text
    json?: unknown; // JSON parsed data
}

export interface SharedSocketState {
    sharedSocket: SharedWebSocket;
    isConnected: boolean;
    isLeader: boolean;
    connectionError: string | null;
    handlers: Map<number, Set<MessageHandler>>;
    /**
     * Connect WebSocket
     * @param url WebSocket server URL (e.g., 'ws://api.example.com/ws' or 'wss://api.example.com/ws')
     */
    connect: (url: string) => void;

    /** Disconnect */
    disconnect: () => void;

    /** Send message (binary protocol) */
    send: (cmd: number, data?: Uint8Array) => void;

    /** Dispatch a pre-parsed message (used for testing and replay) */
    dispatchSimulatedMessage: (msg: IMessage) => void;

    /**
     * Listen for messages with a specific cmd
     * @param cmd Command ID
     * @param handler Message handler function
     * @returns Unsubscribe function
     */
    on: (cmd: number, handler: MessageHandler) => () => void;

    /**
     * Remove listener for a specific cmd
     * @param cmd Command ID
     * @param handler Handler to remove (omit to remove all listeners for this cmd)
     */
    off: (cmd: number, handler?: MessageHandler) => void;

    /** Update connection state (internal use) */
    updateConnectionState: () => void;

    /** Subscribe to game event push */
    subscribeGame: (eventIds: string[]) => void;

    /** Unsubscribe from game event push */
    unsubscribeGame: (eventIds: string[]) => void;
}

/**
 * Pack message (encode)
 * @param cmd Command ID (uint32)
 * @param time Timestamp (uint64)
 * @param data Data (optional)
 * @returns Binary data
 */
export function packMessage(cmd: number, time: number, data?: Uint8Array): ArrayBuffer {
    const dataLen = data?.length || 0;
    const buffer = new ArrayBuffer(HEAD_LEN + dataLen);
    const view = new DataView(buffer);

    // Write cmd (LittleEndian uint32)
    view.setUint32(0, cmd, true);

    // Write time (LittleEndian uint64)
    view.setBigUint64(4, BigInt(time), true);

    // Write data
    if (data && dataLen > 0) {
        const uint8View = new Uint8Array(buffer);
        uint8View.set(data, HEAD_LEN);
    }

    return buffer;
}

/**
 * Unpack message (decode)
 * @param binaryData Binary data
 * @returns Parsed message object
 */
export function unpackMessage(binaryData: ArrayBuffer): IMessage {
    const view = new DataView(binaryData);

    // Read cmd (LittleEndian uint32)
    const cmd = view.getUint32(0, true);

    // Read time (LittleEndian uint64)
    const time = Number(view.getBigUint64(4, true));

    // Read data (all remaining bytes)
    const dataLen = binaryData.byteLength - HEAD_LEN;
    const data = new Uint8Array(binaryData, HEAD_LEN, dataLen);

    // Try to decode as text
    let text: string | undefined;
    let json: unknown | undefined;

    if (dataLen > 0) {
        try {
            const decoder = new TextDecoder('utf-8');
            text = decoder.decode(data);

            // Try to parse as JSON
            if (text) {
                try {
                    json = JSON.parse(text);
                } catch {
                    // Not JSON format, ignore
                }
            }
        } catch (error) {
            reportError(error, {
                level: 'warning',
                tags: { module: 'websocket', step: 'text-decode' },
                extra: { cmd, dataLen },
            });
        }
    }

    return { cmd, time, data, text, json };
}
