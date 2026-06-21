import { headers } from 'next/headers';
import type { MenuSport } from '@/api/models/menu';
import { getHostFromHeaders, resolveServiceUrl } from '@/constants/config';
import { captureRuntimeError, NetworkError } from '@/libs/observability/sentry';
import { reportError } from '@/utils/error';
import type { ErrorReject } from './types';
import { getRejectError } from './utils';

/** SSR-safe fetch with Number(code) normalization and error fallback */
export async function ssrFetchList<T>(path: string, locale: string, revalidate = 300): Promise<T[]> {
    const headersList = await headers();
    const uofBase = resolveServiceUrl(process.env.NEXT_PUBLIC_UOF_SERVICE, getHostFromHeaders(headersList));
    if (!uofBase) return [];
    const requestUrl = `${uofBase}${path}`;
    try {
        const res = await fetch(requestUrl, {
            headers: { 'Accept-Language': locale },
            next: { revalidate },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return Number(json.code) === 0 ? json.data : [];
    } catch (error) {
        reportError(
            new NetworkError('SSR fetch failed', {
                url: requestUrl,
                method: 'GET',
                query: {
                    locale,
                },
                response: {
                    revalidate,
                    originalError: error instanceof Error ? error.message : String(error),
                },
            }),
            {
                tags: { module: 'ssr-fetch', action: 'fetch-list' },
                extra: { locale, path, revalidate },
            },
        );
        return [];
    }
}

/** Fetch allSports + topSports with merge (shared by sports & legal layouts) */
export async function fetchSportsLayoutData(locale: string) {
    const [allSports, topSports] = await Promise.all([
        ssrFetchList<MenuSport>('/v1/menu/sports', locale),
        ssrFetchList<MenuSport>('/v1/menu/sports/top', locale),
    ]);
    // Merge: ensure topSports are present in allSports (backend consistency fallback)
    const allIds = new Set(allSports.map((s) => s.sport_id));
    const mergedAllSports = [...allSports, ...topSports.filter((s) => !allIds.has(s.sport_id))];
    return { allSports: mergedAllSports, topSports };
}

/** 请求接口，处理异常时返回默认值 */
export const queryWithoutError = async <T extends (...args: any) => Promise<any>>(
    apiFn: T,
    defaultValue?: (T extends () => Promise<infer U> ? U : never) | null,
): Promise<Awaited<ReturnType<T>> | null> => {
    try {
        const res = await apiFn();
        return res;
    } catch (e) {
        // TODO 日志收集错误
        console.error('queryWithoutError error', getRejectError(e as ErrorReject), e);
        captureRuntimeError(e instanceof Error ? e : new Error('queryWithoutError failed'), {
            level: 'warning',
            tags: {
                module: 'query-without-error',
                action: 'fallback',
            },
            extra: {
                apiFnName: apiFn.name || 'anonymous',
                fallbackUsed: true,
                hasDefaultValue: defaultValue !== undefined,
                rejectError: getRejectError(e as ErrorReject),
            },
        });
        return Promise.resolve(defaultValue || null);
    }
};
