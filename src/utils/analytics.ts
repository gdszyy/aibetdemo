import type {
    AnalyticsAttribution,
    AnalyticsEventType,
    AnalyticsPayload,
    LoginAnalyticsAttribution,
} from '@/api/models/analytics';
import { StorageEnum } from '@/constants';

const ATTRIBUTION_QUERY_KEYS = ['ch'] as const;
const CLICK_ID_QUERY_KEYS = ['clickid', 'ttclid', 'click_id', 'fbclid'] as const;
const ATTRIBUTION_CLEAR_QUERY_KEYS = [...ATTRIBUTION_QUERY_KEYS, ...CLICK_ID_QUERY_KEYS] as const;
const ANALYTICS_SESSION_ENGAGED_KEY = 'analytics_session_engaged';
const ANALYTICS_PAGE_EVENT_KEY_PREFIX = 'analytics_page_event';
const ANALYTICS_PAGE_EVENT_DEDUP_MS = 1000;
const ANALYTICS_VIEW_SESSION_TTL_MS = 60 * 60 * 1000;

type SearchParamSource = Pick<URLSearchParams, 'get'>;
type SessionEngagementByChannel = Record<string, string>;

interface AnalyticsPageContext {
    pathname: string;
    search: string;
}

/** Firebase Analytics 访问会话缓存。 */
interface AnalyticsViewSession {
    /** 当前访问会话 ID。 */
    view_id: string;
    /** 最近活跃时间。 */
    active_at: number;
}

const hasValue = (value?: string) => typeof value === 'string' && value.length > 0;

const canUseStorage = () => typeof window !== 'undefined';

/** 生成 Firebase Analytics 访问会话 ID。 */
const createAnalyticsViewId = (): string => crypto.randomUUID();

/** 获取当前访问会话 ID，超过 1 小时未活跃则重新生成。 */
export const getAnalyticsViewId = (): string | undefined => {
    if (!canUseStorage()) return undefined;

    const now = Date.now();
    try {
        const raw = window.localStorage.getItem(StorageEnum.AnalyticsViewSession);
        const parsed = raw ? (JSON.parse(raw) as Partial<AnalyticsViewSession>) : null;

        if (
            parsed?.view_id &&
            parsed.active_at &&
            Number.isFinite(parsed.active_at) &&
            now - parsed.active_at <= ANALYTICS_VIEW_SESSION_TTL_MS
        ) {
            const nextSession: AnalyticsViewSession = {
                view_id: parsed.view_id,
                active_at: now,
            };
            window.localStorage.setItem(StorageEnum.AnalyticsViewSession, JSON.stringify(nextSession));
            return nextSession.view_id;
        }
    } catch {
        window.localStorage.removeItem(StorageEnum.AnalyticsViewSession);
    }

    const nextSession: AnalyticsViewSession = {
        view_id: createAnalyticsViewId(),
        active_at: now,
    };
    window.localStorage.setItem(StorageEnum.AnalyticsViewSession, JSON.stringify(nextSession));
    return nextSession.view_id;
};

/** Read auth page enter timestamp for analytics duration */
export const readAnalyticsAuthPageEnterAt = (): number | undefined => {
    if (!canUseStorage()) return undefined;

    const value = Number(sessionStorage.getItem(StorageEnum.AnalyticsAuthPageEnterAt) || '0');
    return Number.isFinite(value) && value > 0 ? value : undefined;
};

/** Save auth page enter timestamp for analytics duration */
export const markAnalyticsAuthPageEnterAt = (): number => {
    const enterAt = Date.now();
    if (canUseStorage()) {
        sessionStorage.setItem(StorageEnum.AnalyticsAuthPageEnterAt, String(enterAt));
    }
    return enterAt;
};

/** Calculate duration from auth page enter timestamp */
export const getAnalyticsAuthDurationMs = (): number | undefined => {
    const enterAt = readAnalyticsAuthPageEnterAt();
    return enterAt ? Math.max(Date.now() - enterAt, 0) : undefined;
};

/** Mark a first-time analytics event in window.localStorage */
export const markFirstAnalyticsEvent = (storageKey: StorageEnum): boolean => {
    if (!canUseStorage()) return false;
    if (window.localStorage.getItem(storageKey)) return false;

    window.localStorage.setItem(storageKey, String(Date.now()));
    return true;
};

const readSessionEngagementByChannel = (): SessionEngagementByChannel => {
    if (!canUseStorage()) return {};

    try {
        const raw = window.localStorage.getItem(ANALYTICS_SESSION_ENGAGED_KEY);
        if (!raw) return {};

        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return {};
        }

        const sessionEngagementByChannel: SessionEngagementByChannel = {};
        for (const [channel, value] of Object.entries(parsed)) {
            if (hasValue(channel) && hasValue(typeof value === 'string' ? value : undefined)) {
                sessionEngagementByChannel[channel] = value;
            }
        }

        return sessionEngagementByChannel;
    } catch {
        return {};
    }
};

const getQueryParamValue = (searchParams: SearchParamSource, keys: readonly string[]) => {
    for (const key of keys) {
        const value = searchParams.get(key);
        if (hasValue(value ?? undefined)) {
            return value ?? undefined;
        }
    }

    return undefined;
};

/** Read persisted attribution params */
export const readAnalyticsAttribution = (): AnalyticsAttribution => {
    if (!canUseStorage()) return {};

    try {
        const raw = window.localStorage.getItem(StorageEnum.AnalyticsAttribution);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as AnalyticsAttribution;
        return {
            clickid: hasValue(parsed.clickid) ? parsed.clickid : undefined,
            ch: hasValue(parsed.ch) ? parsed.ch : undefined,
        };
    } catch {
        return {};
    }
};

/** Persist attribution params from URL query if present */
export const persistAnalyticsAttribution = (searchParams: SearchParamSource): AnalyticsAttribution => {
    const incoming: AnalyticsAttribution = {};
    for (const key of ATTRIBUTION_QUERY_KEYS) {
        const value = searchParams.get(key);
        if (hasValue(value ?? undefined)) {
            incoming[key] = value ?? undefined;
        }
    }
    const clickId = getQueryParamValue(searchParams, CLICK_ID_QUERY_KEYS);
    if (hasValue(clickId)) {
        // fbclid特殊处理
        if (searchParams.get('fbclid')) {
            incoming.clickid = `fb.1.${Date.now()}.${clickId}`;
        } else {
            incoming.clickid = clickId;
        }
    }

    // No attribution params in URL — keep existing storage as-is
    if (!incoming.ch) return readAnalyticsAttribution();

    // New ch arrived — full replace (don't merge with previous attribution)
    const current = readAnalyticsAttribution();
    const next = current.ch === incoming.ch ? { ...current, ...incoming } : incoming;

    if (!canUseStorage()) return next;

    if (!next.clickid && !next.ch) {
        window.localStorage.removeItem(StorageEnum.AnalyticsAttribution);
        return {};
    }

    window.localStorage.setItem(StorageEnum.AnalyticsAttribution, JSON.stringify(next));
    return next;
};

/** Capture attribution params from current browser URL */
export const persistAnalyticsAttributionFromLocation = () => {
    if (!canUseStorage()) return {};
    return persistAnalyticsAttribution(new URLSearchParams(window.location.search));
};

/** Registration payload derived from persisted attribution */
export const getRegistrationAttributionPayload = (): LoginAnalyticsAttribution | undefined => {
    const attribution = readAnalyticsAttribution();
    const channel = Number(attribution.ch);

    if (!Number.isInteger(channel)) {
        return undefined;
    }

    return {
        ads_ch_code: channel,
        ads_ch_params: {
            ...(attribution.clickid ? { clickid: attribution.clickid } : {}),
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        },
    };
};

/** Build analytics payload for the reporting API */
export const buildAnalyticsPayload = (
    event: AnalyticsEventType,
    context: AnalyticsPageContext,
): AnalyticsPayload | null => {
    const attribution = readAnalyticsAttribution();
    const channel = Number(attribution.ch);

    if (!Number.isInteger(channel)) {
        return null;
    }

    return {
        event_type: event,
        ch: channel,
        params: {
            ...(attribution.clickid ? { clickid: attribution.clickid } : {}),
            pathname: context.pathname,
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        },
    };
};

/** Deduplicate a page-scoped analytics event within a short time window */
export const markPageAnalyticsEventSent = (event: AnalyticsEventType, context: AnalyticsPageContext) => {
    if (typeof sessionStorage === 'undefined') return true;

    const key = `${ANALYTICS_PAGE_EVENT_KEY_PREFIX}:${event}:${context.pathname}?${context.search}`;
    const lastSentAt = Number(sessionStorage.getItem(key) || '0');
    const now = Date.now();

    if (lastSentAt && now - lastSentAt < ANALYTICS_PAGE_EVENT_DEDUP_MS) {
        return false;
    }

    sessionStorage.setItem(key, String(now));
    return true;
};

/** Clear analytics caches and URL query params after successful registration */
export const clearAnalyticsAfterRegistration = () => {
    if (!canUseStorage()) return;
    window.localStorage.removeItem(StorageEnum.AnalyticsAttribution);
    window.localStorage.removeItem(ANALYTICS_SESSION_ENGAGED_KEY);

    // Strip attribution params from URL so they don't survive the post-login reload
    const url = new URL(window.location.href);
    let changed = false;
    for (const key of ATTRIBUTION_CLEAR_QUERY_KEYS) {
        if (url.searchParams.has(key)) {
            url.searchParams.delete(key);
            changed = true;
        }
    }
    if (changed) {
        window.history.replaceState(history.state, '', url);
    }
};

/** Detect if the current page load is a browser reload (F5 / Ctrl+R) */
export const isPageReload = (): boolean => {
    const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    return entry?.type === 'reload';
};

/** Track the engagement event once per calendar day for the current channel */
export const markSessionEngagementSent = (channel: number) => {
    if (!canUseStorage()) return true;

    const today = new Date().toISOString().slice(0, 10);
    const channelKey = String(channel);
    const sessionEngagementByChannel = readSessionEngagementByChannel();

    if (sessionEngagementByChannel[channelKey] === today) return false;

    window.localStorage.setItem(
        ANALYTICS_SESSION_ENGAGED_KEY,
        JSON.stringify({
            ...sessionEngagementByChannel,
            [channelKey]: today,
        }),
    );

    return true;
};
