'use client';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { ComponentProps, FC, PropsWithChildren } from 'react';
import { MobileZoomLock } from '@/components/mobile-zoom-lock';
import { SchemeSwitcher } from '@/components/scheme-switcher/scheme-switcher';
import { TanstackProvider } from '@/components/tanstack-provider/tanstack-provider';
import { ThemeProvider } from '@/components/theme-provider/theme-provider';
import { EnvProvider } from '../env-provider';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * RootProviders - Client-side wrapper for all global providers.
 * Moving this to a client component can help reduce memory usage
 * during server-side compilation of the root layout.
 */
export const RootProviders: FC<
    PropsWithChildren<Pick<ComponentProps<typeof EnvProvider>, 'isMobile' | 'isDesktop'>>
> = ({ children, isMobile, isDesktop }) => {
    return (
        <EnvProvider isMobile={isMobile} isDesktop={isDesktop}>
            <ThemeProvider>
                <TanstackProvider>
                    <MobileZoomLock />
                    {children}
                </TanstackProvider>
                <SchemeSwitcher />
            </ThemeProvider>
        </EnvProvider>
    );
};
