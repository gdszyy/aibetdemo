'use client';

import { type FC, type PropsWithChildren, Suspense } from 'react';
import { ClientOnly } from '@/components/client-only';
import { AdPlacementLayer } from '@/modules/ad-placement';
import AppInitializer from './app-initializer';

/**
 * AppShell - Main Layout Shell (Server Component)
 *
 * Keeping this as a Server Component ensures that the basic HTML
 * structure is stable and identical between SSR and CSR.
 */
export const AppShell: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex min-h-screen w-full max-w-none mx-auto px-0 flex-col bg-fixed">
            <Suspense fallback={null}>
                <main className="flex-1 min-h-0">{children}</main>
            </Suspense>
            <ClientOnly>
                <AppInitializer />
            </ClientOnly>
            <AdPlacementLayer />
        </div>
    );
};
