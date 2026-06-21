/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry } from '@serwist/precaching';
import { ExpirationPlugin, NetworkFirst, Serwist } from 'serwist';

declare const self: ServiceWorkerGlobalScope & {
    __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
};

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        {
            matcher: /\/api\/v1\/(match|odds)/,
            handler: new NetworkFirst({
                cacheName: 'api-realtime',
                plugins: [new ExpirationPlugin({ maxAgeSeconds: 60 })],
            }),
        },
        ...defaultCache,
    ],
});

serwist.addEventListeners();
