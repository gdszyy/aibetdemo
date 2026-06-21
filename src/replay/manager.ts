import { type FetchOptions, fetcher } from '@/api/client';
import type { OutrightMarketsResponse } from '@/api/handlers/tournament';
import type { MatchWithMarkets } from '@/api/models/match';
import {
    type FixtureChangePayload,
    type MatchStatusPayload,
    normalizeFixtureChangePayload,
    normalizeOddsChangePayload,
    type OddsChangePayload,
    type RawFixtureChangePayload,
    type RawOddsChangePayload,
} from '@/api/models/ws';
import { QUERY_CLIENT } from '@/components/tanstack-provider/tanstack-provider';
import { CMD_FIXTURE_CHANGE, CMD_MATCH_STATUS, CMD_ODDS_CHANGE } from '@/libs/event-constants';
import { useBetSlipStore } from '@/modules/bet-slip/stores/bet-slip-store';
import { applySelectionSnapshot } from '@/modules/bet-slip/stores/internal/selection-snapshot';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { filterMarkets } from '@/modules/match/_utils/match-utils';
import { useSharedSocketStore } from '@/stores/shared-socket-store';
import type { IMessage } from '@/utils/websocket/helper';
import { db, type ReplayLog } from './db';

// Define a compatible type for the fetcher.get method
type FetcherGet = <T>(url: string, params?: unknown, options?: FetchOptions) => Promise<T>;

/** Query key prefixes that replay should capture */
const MATCH_QUERY_PREFIXES = ['match-item', 'match-detail', 'outright'] as const;
type MatchQueryPrefix = (typeof MATCH_QUERY_PREFIXES)[number];
const isMatchQueryPrefix = (value: string): value is MatchQueryPrefix =>
    MATCH_QUERY_PREFIXES.includes(value as MatchQueryPrefix);
const isMatchQuery = (queryKey: unknown[]): boolean =>
    queryKey.length === 2 && typeof queryKey[0] === 'string' && isMatchQueryPrefix(queryKey[0]);
const isOddsEntityList = (value: unknown): value is OddsEntity[] => Array.isArray(value);

class ReplayManager {
    private isRecording = false;
    private currentSessionId: number | null = null;
    private originalFetcherGet: FetcherGet | null = null;
    private queryUnsubscribe: (() => void) | null = null;
    private storeUnsubscribe: (() => void) | null = null;
    private wsUnsubscribes: (() => void)[] = [];

    private isReplaying = false;
    private replayLogs: ReplayLog[] = [];
    private replayTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Start recording a new session
     */
    async startRecording(name = `Session ${new Date().toLocaleString()}`) {
        if (this.isRecording || this.isReplaying) return;

        // Create Session
        const session = await db.sessions.add({
            name,
            startTime: Date.now(),
        });
        this.currentSessionId = Number(session);
        this.isRecording = true;

        console.log('[Replay] Started recording session:', this.currentSessionId);

        // 1. Intercept API
        this.interceptApi();

        // 2. Intercept WebSocket (OddsChange)
        this.interceptWebSocket();

        // 3. Intercept React Query (Match Item)
        this.interceptQuery();

        // 4. Intercept Store
        this.interceptStore();

        // 5. Snapshot existing Cache state
        const cache = QUERY_CLIENT.getQueryCache();
        const existingQueries = cache.findAll();
        existingQueries.forEach((query) => {
            const queryKey = query.queryKey;
            if (Array.isArray(queryKey) && isMatchQuery(queryKey) && query.state.data) {
                const entityId = queryKey[1] as string | number;
                console.log('[Replay] Snapshotting initial state for:', queryKey[0], entityId);

                // Calculate filtered snapshot
                const data = query.state.data as MatchWithMarkets;
                const filteredSnapshot =
                    data?.markets && Array.isArray(data.markets) ? filterMarkets(data.markets) : undefined;

                this.log('QUERY', JSON.stringify(queryKey), { filteredSnapshot }, query.state.data, entityId);
            }
        });
    }

    /**
     * Stop recording
     */
    stopRecording() {
        if (!this.isRecording) return;

        this.restoreOriginals();

        // Update Session EndTime
        if (this.currentSessionId) {
            db.sessions.update(this.currentSessionId, { endTime: Date.now() });
        }

        this.isRecording = false;
        this.currentSessionId = null;
        console.log('[Replay] Stopped recording.');
    }

    /**
     * Start Replay
     */
    async startReplay(sessionId: number) {
        if (this.isRecording || this.isReplaying) return;

        console.log('[Replay] Starting replay for session:', sessionId);
        this.currentSessionId = sessionId;
        this.isReplaying = true;

        // 1. Load Logs
        const logs = await db.logs.where('sessionId').equals(sessionId).sortBy('timestamp');
        this.replayLogs = logs;

        if (logs.length === 0) {
            console.warn('[Replay] No logs found for session');
            this.stopReplay();
            return;
        }

        // 2. Mock API & Disconnect real WS
        this.replayApi();
        useSharedSocketStore.getState().disconnect();

        // 3. Schedule Events
        this.scheduleReplayEvents(logs);
    }

    stopReplay() {
        if (!this.isReplaying) return;

        console.log('[Replay] Stopping replay.');
        this.restoreOriginals();
        if (this.replayTimer) {
            clearTimeout(this.replayTimer);
            this.replayTimer = null;
        }
        this.isReplaying = false;
        this.currentSessionId = null;
    }

    private restoreOriginals() {
        // Restore API
        if (this.originalFetcherGet) {
            fetcher.get = this.originalFetcherGet;
            this.originalFetcherGet = null;
        }

        // Unsubscribe Query
        if (this.queryUnsubscribe) {
            this.queryUnsubscribe();
            this.queryUnsubscribe = null;
        }

        // Unsubscribe Store
        if (this.storeUnsubscribe) {
            this.storeUnsubscribe();
            this.storeUnsubscribe = null;
        }

        // Unsubscribe WS
        if (this.wsUnsubscribes.length > 0) {
            this.wsUnsubscribes.forEach((unsub) => {
                unsub();
            });
            this.wsUnsubscribes = [];
        }
    }

    private async log(
        type: 'API' | 'QUERY' | 'STORE' | 'WS',
        target: string,
        payload: unknown,
        result?: unknown,
        matchId?: string | number,
    ) {
        if (!this.currentSessionId) return;

        try {
            await db.logs.add({
                sessionId: this.currentSessionId,
                type,
                timestamp: Date.now(),
                target,
                payload,
                result,
                matchId,
            });
        } catch (error) {
            console.error('[Replay] Failed to log event:', error);
        }
    }

    private interceptApi() {
        // Save original method
        this.originalFetcherGet = fetcher.get;

        // Monkey patch
        fetcher.get = async <T>(url: string, params?: unknown, options?: FetchOptions): Promise<T> => {
            if (!this.originalFetcherGet) throw new Error('Original fetcher lost');

            // 1. Execute original request
            const promise = this.originalFetcherGet<T>(url, params, options);

            // 2. Check if target URL
            const isTarget =
                url.includes('/v1/match') || // covers list and detail
                url.includes('/v1/season/') || // covers outright
                url.includes('/v1/mts/cart');

            if (isTarget) {
                promise
                    .then((data) => {
                        this.log('API', url, params, data);
                    })
                    .catch((_err) => {
                        console.warn('[Replay] API request failed, not logging response:', url);
                    });
            }

            return promise;
        };
    }

    private replayApi() {
        // Save original method
        this.originalFetcherGet = fetcher.get;

        // Mock fetcher
        fetcher.get = async <T>(url: string, _params?: unknown, _options?: FetchOptions): Promise<T> => {
            console.log('[Replay] Mocking API request:', url);

            // Find matching log (simple next available strategy)
            const log = this.replayLogs.find((l) => l.type === 'API' && l.target === url);

            if (log?.result) {
                return Promise.resolve(log.result as T);
            }

            console.warn('[Replay] No matching log found for:', url);
            return Promise.reject(new Error('[Replay] No matching log found'));
        };
    }

    private scheduleReplayEvents(logs: ReplayLog[]) {
        if (logs.length === 0) return;

        const startTime = logs[0].timestamp;

        logs.forEach((log) => {
            if (log.type === 'API') return; // API handled by fetcher mock

            const delay = log.timestamp - startTime;
            this.replayTimer = setTimeout(() => {
                this.applyEvent(log);
            }, delay);
        });
    }

    private applyEvent(log: ReplayLog) {
        console.log('[Replay] Applying event:', log.type, log.target);

        if (log.type === 'QUERY') {
            const queryKey = JSON.parse(log.target);
            QUERY_CLIENT.setQueryData(queryKey, log.result);
        } else if (log.type === 'STORE') {
            if (log.target === 'betSlipStore/selections') {
                applySelectionSnapshot(useBetSlipStore, {
                    selections: isOddsEntityList(log.result) ? log.result : [],
                    hasPendingSync: false,
                });
            }
        } else if (log.type === 'WS') {
            const cmdConstMap: Record<string, number> = {
                CMD_ODDS_CHANGE: CMD_ODDS_CHANGE,
                CMD_MATCH_STATUS: CMD_MATCH_STATUS,
                CMD_FIXTURE_CHANGE: CMD_FIXTURE_CHANGE,
            };
            const cmd = cmdConstMap[log.target];
            if (cmd) {
                const msg: IMessage = {
                    cmd,
                    time: Date.now(),
                    data: new Uint8Array(),
                    json: log.payload,
                };
                useSharedSocketStore.getState().dispatchSimulatedMessage(msg);
            }
        }
    }

    private interceptQuery() {
        const cache = QUERY_CLIENT.getQueryCache();
        this.queryUnsubscribe = cache.subscribe((event) => {
            if (event.type === 'updated' && event.action?.type === 'success') {
                const queryKey = event.query.queryKey;
                if (Array.isArray(queryKey) && isMatchQuery(queryKey)) {
                    const entityId = queryKey[1] as string | number;
                    const data = event.action.data as MatchWithMarkets;

                    // Calculate filtered snapshot
                    const filteredSnapshot =
                        data?.markets && Array.isArray(data.markets) ? filterMarkets(data.markets) : undefined;

                    this.log('QUERY', JSON.stringify(queryKey), { filteredSnapshot }, data, entityId);
                }
            }
        });
    }

    private interceptStore() {
        this.storeUnsubscribe = useBetSlipStore.subscribe((state, prevState) => {
            if (state.selections !== prevState.selections) {
                this.log('STORE', 'betSlipStore/selections', null, state.selections);
            }
        });
    }

    private interceptWebSocket() {
        const socketInternal = useSharedSocketStore.getState();
        const cache = QUERY_CLIENT.getQueryCache();

        // Helper to check if we are "listening" to this event_id
        // For match-item / match-detail: event_id === queryKey[1]
        // For outright: event_id is stored in cached outright market events
        const isMatchActive = (eventId: string | number) => {
            return cache.getAll().some((q) => {
                const key = q.queryKey;
                if (!Array.isArray(key) || key.length !== 2) return false;
                if (key[0] === 'match-item' || key[0] === 'match-detail') {
                    return String(key[1]) === String(eventId);
                }
                if (key[0] === 'outright' && q.state.data) {
                    return (q.state.data as OutrightMarketsResponse).some(
                        (event) => String(event.event_id) === String(eventId),
                    );
                }
                return false;
            });
        };

        // Listen for Odds Change
        const unsubOdds = socketInternal.on(CMD_ODDS_CHANGE, (msg: IMessage) => {
            const data: OddsChangePayload = normalizeOddsChangePayload(msg.json as RawOddsChangePayload);
            if (data?.event_id && isMatchActive(data.event_id)) {
                this.log('WS', 'CMD_ODDS_CHANGE', data, null, data.event_id);
            }
        });

        // Listen for Match Status
        const unsubStatus = socketInternal.on(CMD_MATCH_STATUS, (msg: IMessage) => {
            const data = msg.json as MatchStatusPayload;
            if (data?.sport_event_id && isMatchActive(data.sport_event_id)) {
                this.log('WS', 'CMD_MATCH_STATUS', data, null, data.sport_event_id);
            }
        });

        // Listen for Fixture Change
        const unsubFixture = socketInternal.on(CMD_FIXTURE_CHANGE, (msg: IMessage) => {
            const data: FixtureChangePayload = normalizeFixtureChangePayload(msg.json as RawFixtureChangePayload);
            if (data?.event_id && isMatchActive(data.event_id)) {
                this.log('WS', 'CMD_FIXTURE_CHANGE', data, null, data.event_id);
            }
        });

        this.wsUnsubscribes.push(unsubOdds, unsubStatus, unsubFixture);
    }
}

export const replayManager = new ReplayManager();
