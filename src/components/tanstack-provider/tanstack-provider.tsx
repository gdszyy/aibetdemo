'use client';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FunctionComponent, PropsWithChildren } from 'react';
import { config } from '@/constants/config';
import { ApiError, sanitizeForSentry } from '@/libs/observability/sentry';
import { applyQueryKeyGovernance } from './services/query-key-governance';

const TANSTACK_ERROR_STYLE = 'color: #F44336; font-weight: bold;';
const DEFAULT_QUERY_STALE_TIME = 15_000;
const shouldLogTanStackError = config.isDev;

const logTanStackError = (label: string, error: unknown) => {
    if (!shouldLogTanStackError) {
        return;
    }

    if (error instanceof ApiError) {
        const sanitizedApiError = {
            name: error.name,
            message: sanitizeForSentry(error.message),
            stack: sanitizeForSentry(error.stack),
            context: sanitizeForSentry(error.context),
            options: sanitizeForSentry(error.options),
        };

        console.warn(label, TANSTACK_ERROR_STYLE);
        console.warn('[TanStack Query] ApiError Detail:', sanitizedApiError);
        return;
    }

    console.error(label, TANSTACK_ERROR_STYLE);
    if (error instanceof Error) {
        console.error(error);
    } else {
        console.error(String(error));
    }
};

/** Global query cache handler */
const queryCache = new QueryCache({
    onError: (error, query) => {
        const label = `%c[TanStack Query] Error: ${JSON.stringify(query.queryKey)}`;
        logTanStackError(label, error);
    },
});

/** Global mutation cache handler */
const mutationCache = new MutationCache({
    onError: (error, _variables, _context, mutation) => {
        const label = `%c[TanStack Query] Mutation Error: ${JSON.stringify(mutation.options.mutationKey)}`;
        logTanStackError(label, error);
        console.log('Mutation Key:', mutation.options.mutationKey);
    },
});

// TODO 用户切换、语言切换、国别切换，都清空所有缓存。
/** Global TanStack Query client instance */
export const QUERY_CLIENT = new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions: {
        queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: DEFAULT_QUERY_STALE_TIME,
            retry: 0,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
});

/** 在全局单例上接入 queryKey 治理，避免业务侧逐个调用点改造。 */
applyQueryKeyGovernance(QUERY_CLIENT);

/**
 * Tanstack Query provider
 */
export const TanstackProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
    return <QueryClientProvider client={QUERY_CLIENT}>{children}</QueryClientProvider>;
};
