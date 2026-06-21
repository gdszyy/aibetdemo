import { useEffect } from 'react';

/** Message types sent by the game callback page via postMessage */
interface GameMessage {
    type: 'GAME_CLOSED';
}

/**
 * Listens for postMessage events from the game iframe (callback page).
 * Only active when `enabled` is true (iframe is mounted).
 */
export const useGameMessage = (options: { enabled: boolean; onClose: () => void }) => {
    const { enabled, onClose } = options;

    useEffect(() => {
        if (!enabled) return;

        const handler = (event: MessageEvent) => {
            // Only accept messages from our own origin (callback page)
            if (event.origin !== window.location.origin) return;

            const msg = event.data as GameMessage;
            if (msg?.type === 'GAME_CLOSED') {
                onClose();
            }
        };

        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [enabled, onClose]);
};
