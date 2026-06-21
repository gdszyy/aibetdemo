import Dexie, { type Table } from 'dexie';

export type LogType = 'API' | 'QUERY' | 'STORE' | 'WS';

export interface ReplaySession {
    id?: number;
    name: string;
    startTime: number;
    endTime?: number;
}

export interface ReplayLog {
    id?: number;
    sessionId: number;
    type: LogType;
    timestamp: number;
    matchId?: string | number; // Added for grouping
    target: string; // URL for API, QueryKey for Query, StoreName for Store
    payload: unknown; // Request params, or State difference
    result?: unknown; // Response data, or State snapshot
}

export class ReplayDatabase extends Dexie {
    sessions!: Table<ReplaySession>;
    logs!: Table<ReplayLog>;

    constructor() {
        super('ReplayDB');
        this.version(2).stores({
            sessions: '++id, startTime',
            logs: '++id, sessionId, type, timestamp, matchId',
        });
    }
}

export const db = new ReplayDatabase();
