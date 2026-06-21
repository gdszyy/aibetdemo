'use client';

import { useEffect } from 'react';
import { Loading } from '@/components/loading/loading';
import { useRouter } from '@/i18n';

/**
 * Lightweight callback page used as `return_url` for game providers.
 *
 * When loaded inside an iframe: sends postMessage to parent window
 * so the game detail page can unmount the iframe and restore the cover.
 *
 * When loaded directly (not in iframe): redirects to casino lobby.
 */
export default function GameCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        if (window.parent !== window) {
            // Loaded inside iframe — notify parent that game has ended
            window.parent.postMessage({ type: 'GAME_CLOSED' }, window.location.origin);
        } else {
            // Direct access (not in iframe) — redirect to casino lobby
            router.push('/casino');
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <Loading />
        </div>
    );
}
