'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { wsLogger } from '@/utils/websocket/ws-logger';
import { db, type ReplayLog } from './db';
import { replayManager } from './manager';

export function ReplayControl() {
    const [isRecording, setIsRecording] = useState(false);
    const [isReplaying, setIsReplaying] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [targetEventId, setTargetEventId] = useState('');

    const sessions = useLiveQuery(() => db.sessions.orderBy('startTime').reverse().toArray());

    const handleToggleRecord = async () => {
        if (isRecording) {
            replayManager.stopRecording();
            setIsRecording(false);
        } else {
            await replayManager.startRecording();
            setIsRecording(true);
        }
    };

    const handlePlay = async (sessionId: number) => {
        if (isRecording) return;
        setIsReplaying(true);
        setSelectedSessionId(sessionId);
        await replayManager.startReplay(sessionId);
    };

    const handleStopReplay = () => {
        replayManager.stopReplay();
        setIsReplaying(false);
        setSelectedSessionId(null);
    };

    const [selectedMatchId, setSelectedMatchId] = useState<string | number | null>(null);
    const [viewingSessionId, setViewingSessionId] = useState<number | null>(null);

    const viewingLogs = useLiveQuery(
        async () => {
            if (!viewingSessionId) return null;
            return await db.logs.where('sessionId').equals(viewingSessionId).sortBy('timestamp');
        },
        [viewingSessionId],
        null,
    );

    const handleViewLogs = (sessionId: number) => {
        setViewingSessionId(sessionId);
        setSelectedMatchId(null);
    };

    const handleClearAll = async () => {
        if (confirm('Are you sure you want to delete all recordings?')) {
            await db.sessions.clear();
            await db.logs.clear();
        }
    };

    const getUniqueMatchIds = () => {
        if (!viewingLogs) return [];
        const ids = new Set<string>();
        viewingLogs.forEach((log) => {
            if (log.matchId) ids.add(String(log.matchId));
        });
        return Array.from(ids);
    };

    const getMatchLogs = (matchId: string | number) => {
        if (!viewingLogs) return { queryLogs: [], wsLogs: [] };
        const matchLogs = viewingLogs.filter((l) => String(l.matchId) === String(matchId));
        return {
            queryLogs: matchLogs.filter((l) => l.type === 'QUERY'),
            wsLogs: matchLogs.filter((l) => l.type === 'WS'),
        };
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-4 right-4 z-[9999]">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition"
                    type="button"
                >
                    🎥 Replay
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex gap-4 items-end">
            {/* Logs Viewer Modal/Panel */}
            {viewingLogs && viewingSessionId && (
                <div className="bg-white text-black p-4 rounded-md shadow-2xl w-[800px] border border-gray-200 h-[600px] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            {selectedMatchId && (
                                <button
                                    onClick={() => setSelectedMatchId(null)}
                                    className="text-blue-500 hover:underline text-sm"
                                    type="button"
                                >
                                    ← Back
                                </button>
                            )}
                            <h3 className="font-bold text-lg">
                                {selectedMatchId
                                    ? `Match ${selectedMatchId}`
                                    : `Select Match (${viewingLogs.length} logs)`}
                            </h3>
                        </div>
                        <button
                            onClick={() => setViewingSessionId(null)}
                            className="text-gray-500 hover:text-black"
                            type="button"
                        >
                            ✕
                        </button>
                    </div>

                    {!selectedMatchId ? (
                        <div className="flex-1 overflow-y-auto">
                            <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Recorded Matches</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {getUniqueMatchIds().map((mid) => (
                                    <button
                                        key={mid}
                                        onClick={() => setSelectedMatchId(mid)}
                                        className="p-3 bg-gray-50 hover:bg-blue-50 border rounded text-left"
                                        type="button"
                                    >
                                        <div className="font-bold text-sm">Match ID: {mid}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {viewingLogs.filter((l) => l.matchId === mid).length} events
                                        </div>
                                    </button>
                                ))}
                                {getUniqueMatchIds().length === 0 && (
                                    <div className="col-span-3 text-center text-gray-400 py-8">
                                        No specific match data found in this session.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-hidden flex gap-4">
                            {(() => {
                                const { queryLogs, wsLogs } = getMatchLogs(selectedMatchId);
                                const startTime = viewingLogs[0]?.timestamp || 0;

                                const renderLogCard = (log: ReplayLog) => {
                                    const d = new Date(log.timestamp);
                                    const pad = (n: number, len = 2) => String(n).padStart(len, '0');
                                    const timeStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getMilliseconds(), 3)}`;

                                    const isError = (log.payload as any)?.filteredSnapshot?.length === 0;

                                    const CopyButton = ({ text }: { text: string }) => (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(text);
                                            }}
                                            className="ml-2 px-1 text-[10px] border border-blue-200 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                            type="button"
                                        >
                                            Copy
                                        </button>
                                    );

                                    return (
                                        <div
                                            key={log.id}
                                            className={`border p-2 rounded bg-gray-50 text-xs mb-2 ${
                                                isError ? 'border-red-500 ring-1 ring-red-500' : ''
                                            }`}
                                        >
                                            <div className="flex justify-between font-bold text-gray-600 mb-1">
                                                <span>{timeStr}</span>
                                                <span>+{log.timestamp - startTime}ms</span>
                                            </div>
                                            <div className="break-all text-gray-800 font-mono mb-1">{log.target}</div>
                                            {log.payload !== null && (
                                                <details>
                                                    <summary className="cursor-pointer text-blue-500 flex items-center">
                                                        <span>Payload</span>
                                                        <CopyButton text={JSON.stringify(log.payload, null, 2)} />
                                                    </summary>
                                                    <pre className="mt-1 bg-gray-100 p-1 overflow-x-auto max-h-40">
                                                        {JSON.stringify(log.payload, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                            {log.result !== undefined && log.result !== null && (
                                                <details className="mt-1">
                                                    <summary className="cursor-pointer text-green-500 flex items-center">
                                                        <span>State Snapshot</span>
                                                        <CopyButton text={JSON.stringify(log.result, null, 2)} />
                                                    </summary>
                                                    <pre className="mt-1 bg-gray-100 p-1 overflow-x-auto max-h-40">
                                                        {JSON.stringify(log.result, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    );
                                };

                                return (
                                    <>
                                        <div className="flex-1 flex flex-col min-w-0">
                                            <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase border-b pb-1">
                                                Match State (Query) ({queryLogs.length})
                                            </h4>
                                            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
                                                {queryLogs.map(renderLogCard)}
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col min-w-0">
                                            <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase border-b pb-1">
                                                WS Messages ({wsLogs.length})
                                            </h4>
                                            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
                                                {wsLogs.map(renderLogCard)}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>
            )}

            {/* Main Control Panel - Kept mostly same but ensures it doesn't overlap weirdly */}
            <div className="bg-white text-black p-4 rounded-md shadow-2xl w-80 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Replay System</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black" type="button">
                        ✕
                    </button>
                </div>

                <div className="mb-4 space-y-2">
                    {/* Recording Control */}
                    {!isReplaying && (
                        <button
                            onClick={handleToggleRecord}
                            className={`w-full py-2 rounded font-bold text-white transition ${
                                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                            }`}
                            type="button"
                        >
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                    )}
                    {isRecording && (
                        <div className="text-center text-xs text-red-500 mt-2 animate-pulse">● Recording...</div>
                    )}

                    {/* Replay Control */}
                    {isReplaying && (
                        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
                            <div className="text-sm font-bold text-yellow-700 mb-2">Replaying Session...</div>
                            <button
                                onClick={handleStopReplay}
                                className="w-full py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                type="button"
                            >
                                Stop Replay
                            </button>
                        </div>
                    )}
                </div>

                <div className="max-h-60 overflow-y-auto border-t pt-2 scrollbar-thin scrollbar-thumb-gray-300">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-semibold text-gray-400">SESSIONS</h4>
                        {sessions && sessions.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-xs text-red-400 hover:text-red-600 hover:underline"
                                type="button"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                    {sessions?.length === 0 && <p className="text-sm text-gray-400">No sessions recorded.</p>}

                    <ul className="space-y-2">
                        {sessions?.map((session) => (
                            <li
                                key={session.id}
                                className={`text-sm border-b pb-2 last:border-0 p-2 rounded ${
                                    selectedSessionId === session.id ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium truncate flex-1 block" title={session.name}>
                                        {session.name}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                                        {new Date(session.startTime).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-500">
                                        {session.endTime
                                            ? `${((session.endTime - session.startTime) / 1000).toFixed(1)}s`
                                            : '...'}
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => session.id && handleViewLogs(session.id)}
                                            className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-xs rounded text-gray-700"
                                            type="button"
                                        >
                                            View
                                        </button>
                                        <button
                                            disabled={isRecording || isReplaying}
                                            onClick={() => session.id && handlePlay(session.id)}
                                            className="px-2 py-0.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-xs rounded text-white"
                                            type="button"
                                        >
                                            Play
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Live WS Logger Section */}
                <div className="border-t pt-3 mt-3">
                    <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Live WS Monitor (10k buffer)</h4>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Event ID (Optional)"
                            className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 min-w-0 focus:border-blue-500"
                            value={targetEventId}
                            onChange={(e) => setTargetEventId(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="bg-blue-500 text-white px-2 py-1.5 text-xs font-medium rounded hover:bg-blue-600 flex-1 transition"
                            onClick={() => wsLogger.download(targetEventId)}
                            type="button"
                        >
                            Download
                        </button>
                        <button
                            className="bg-teal-500 text-white px-2 py-1.5 text-xs font-medium rounded hover:bg-teal-600 flex-1 transition"
                            onClick={() => {
                                const logs = wsLogger.dump(targetEventId);
                                console.log('[WSLogger UI Dump]', logs);
                                alert(`Dumped ${logs.length} logs to console.`);
                            }}
                            type="button"
                        >
                            Console Dump
                        </button>
                        <button
                            className="bg-red-500 text-white px-2 py-1.5 text-xs font-medium rounded hover:bg-red-600 flex-none transition"
                            onClick={() => wsLogger.clear()}
                            title="Clear Buffer"
                            type="button"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
