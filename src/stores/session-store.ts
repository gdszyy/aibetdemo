import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { CheckLoginInterface } from '@/api/handlers/passport';
import { GetProfileInterface } from '@/api/handlers/user';
import type { InterfaceResponse } from '@/api/lib/types';
import { StorageEnum } from '@/constants';
import { config } from '@/constants/config';
import { captureRuntimeError } from '@/libs/observability/sentry';

export enum SessionStatusEnum {
    Authenticated = 'authenticated',
    Unauthenticated = 'unauthenticated',
    Loading = 'loading',
}

type LoginUser = InterfaceResponse<typeof GetProfileInterface>['profile'];

export interface Session {
    user: LoginUser;
    accessToken?: string;
}

// TODO 瞎设想架构，不要用AI瞎写！！！
interface SessionState {
    /** 设备id，浏览器指纹 */
    deviceId: string;
    /** 初始化设备id */
    initDeviceId: () => void;

    data: Session | null;
    status: SessionStatusEnum;

    /** Reloads the session data (e.g. fetch user profile) */
    update: () => Promise<Session | null>;

    /** Sign in with a token — fetch profile then full page reload for clean slate */
    signIn: (token: string) => Promise<void>;

    /** Sign out — clear storage then full page reload for clean slate */
    signOut: () => Promise<void>;

    /** Silently update token in localStorage (backend header rotation, no state change) */
    refreshToken: (token: string) => void;

    /** Clear session state without reload (token expiry / system kick) */
    clearSession: () => void;

    /** Initialize session from storage (internal use) */
    initialize: () => Promise<void>;
}

const LOGIN_TOKEN_KEY = StorageEnum.UserToken;
const LOGIN_LOGIN_USER_KEY = StorageEnum.UserInfo;
const POST_LOGIN_KEY = StorageEnum.PostLogin;
const POST_LOGIN_AUTO_OPEN_BET_SLIP_KEY = StorageEnum.PostLoginAutoOpenBetSlip;

// Throttle mechanism for update() function
let lastUpdateTime = 0;
let pendingUpdatePromise: Promise<Session | null> | null = null;
const UPDATE_THROTTLE_MS = 2000; // Prevent calls within 2 seconds

export const useSessionStore = create<SessionState>((set, get) => ({
    /** 设备id，浏览器指纹 */
    deviceId: '',
    initDeviceId: async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const deviceId = result.visitorId || '_empty_';
        // console.log('==deviceId', deviceId);
        set({ deviceId });
    },
    data: null,
    status: SessionStatusEnum.Loading,

    initialize: async () => {
        try {
            const token = window.localStorage.getItem(LOGIN_TOKEN_KEY);

            // 1. Restore local cache first
            const cachedUserStr = window.localStorage.getItem(LOGIN_LOGIN_USER_KEY);
            const cachedUser = cachedUserStr ? JSON.parse(cachedUserStr) : null;

            if (token && cachedUser) {
                set({
                    data: { user: cachedUser, accessToken: token },
                    status: SessionStatusEnum.Authenticated,
                });
            } else if (token) {
                // Has token but no user, still consider loading or tentatively authenticated
                // but without user data, status usually remains 'loading' until verified or 'authenticated' if we trust token existence.
                // mirroring original logic: just set token first if needed?
                // next-auth usually waits until validated.
            } else {
                set({ status: SessionStatusEnum.Unauthenticated, data: null });
                return;
            }

            // 2. Validate token and refresh profile
            if (token) {
                try {
                    const { is_login } = await CheckLoginInterface();
                    if (is_login) {
                        await get().update();
                        set({ status: SessionStatusEnum.Authenticated });
                    } else {
                        // Token invalid — clear local state only, no reload during init
                        window.localStorage.removeItem(LOGIN_TOKEN_KEY);
                        window.localStorage.removeItem(LOGIN_LOGIN_USER_KEY);
                        set({ data: null, status: SessionStatusEnum.Unauthenticated });
                    }
                } catch (error) {
                    // Network error or other check failed, might want to keep local session or sign out?
                    // For now, if validation fails, we assume error or invalid.
                    // Original logic: just called dispatchLoginUser if is_login.
                    captureRuntimeError(
                        error instanceof Error ? error : new Error('Failed to validate session token'),
                        {
                            level: 'warning',
                            tags: { module: 'session-store', action: 'validate-token' },
                        },
                    );
                }
            } else {
                set({ status: SessionStatusEnum.Unauthenticated });
            }
        } catch (error) {
            console.error('Session initialization error', error);
            captureRuntimeError(error instanceof Error ? error : new Error('Session initialization error'), {
                level: 'error',
                tags: { module: 'session-store', action: 'initialize' },
            });
            set({ status: SessionStatusEnum.Unauthenticated });
        }
    },

    update: async () => {
        const token = window.localStorage.getItem(LOGIN_TOKEN_KEY);
        if (!token) return null;

        const now = Date.now();

        // If there's a pending update call, return that promise
        if (pendingUpdatePromise) {
            if (config.isDev) console.log('[SessionStore] Reusing pending update call');
            return pendingUpdatePromise;
        }

        // If called too soon after last update, return cached data
        if (now - lastUpdateTime < UPDATE_THROTTLE_MS) {
            if (config.isDev) console.log('[SessionStore] Skipping update - too soon');
            return get().data;
        }

        if (config.isDev) console.log('[SessionStore] Making profile API call');
        lastUpdateTime = now;

        // Create the promise and store it
        pendingUpdatePromise = (async () => {
            try {
                const { profile } = await GetProfileInterface();
                const newData: Session = {
                    user: profile,
                    accessToken: token,
                };

                set({ data: newData });
                window.localStorage.setItem(LOGIN_LOGIN_USER_KEY, JSON.stringify(profile));
                return newData;
            } catch (error) {
                console.error('Failed to update session', error);
                captureRuntimeError(error instanceof Error ? error : new Error('Failed to update session'), {
                    level: 'error',
                    tags: { module: 'session-store', action: 'update' },
                });
                return null;
            } finally {
                // Clear pending promise after completion
                pendingUpdatePromise = null;
            }
        })();

        return pendingUpdatePromise;
    },

    signIn: async (token: string) => {
        window.localStorage.setItem(LOGIN_TOKEN_KEY, token);

        // Set post-login flag FIRST — before any async, so it survives regardless
        window.localStorage.setItem(POST_LOGIN_KEY, 'true');
        window.localStorage.setItem(POST_LOGIN_AUTO_OPEN_BET_SLIP_KEY, 'true');

        // Keep status Loading — do NOT set Authenticated before reload
        // This prevents current-page React effects from firing prematurely
        set({ status: SessionStatusEnum.Loading });

        // Pre-fetch profile so it's cached in window.localStorage for post-reload initialize()
        await get().update();
    },

    signOut: async () => {
        window.localStorage.removeItem(LOGIN_TOKEN_KEY);
        window.localStorage.removeItem(LOGIN_LOGIN_USER_KEY);
        set({ data: null, status: SessionStatusEnum.Unauthenticated });
    },

    refreshToken: (token: string) => {
        window.localStorage.setItem(LOGIN_TOKEN_KEY, token);
    },

    clearSession: () => {
        window.localStorage.removeItem(LOGIN_TOKEN_KEY);
        window.localStorage.removeItem(LOGIN_LOGIN_USER_KEY);
        set({ data: null, status: SessionStatusEnum.Unauthenticated });
    },
}));

/** 是否初始化完成，已判断完是否登录 */
export const useSessionReady = () => {
    const status = useSessionStore((s) => s.status);
    return status !== SessionStatusEnum.Loading;
};

/**
 * React Hook mimicking next-auth's useSession
 */
export const useSession = () => {
    return useSessionStore(
        useShallow((state) => ({
            data: state.data,
            status: state.status,
            update: state.update,
        })),
    );
};

/**
 * Helper to get the token outside of React components
 */
export const getSessionToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(LOGIN_TOKEN_KEY);
};

/**
 * React Hook to get the current user
 */
export const useUser = () => {
    return useSessionStore((state) => state.data?.user);
};

/**
 * React Hook to check if the user is authenticated
 */
export const useIsLogin = () => {
    return useSessionStore((state) => state.status === SessionStatusEnum.Authenticated);
};

/**
 * React Hook to check if session has resolved to unauthenticated.
 * Use for unauthenticated-only UI (e.g. mobile login bar) — hide during Loading.
 */
export const useIsUnauthenticated = () => {
    return useSessionStore((state) => state.status === SessionStatusEnum.Unauthenticated);
};
