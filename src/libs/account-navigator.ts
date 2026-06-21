import Cookies from 'js-cookie';
import { getAccountPath } from '@/constants/account-routes';
import { CacheKey } from '@/constants/cache';
import type { UserCenterSource } from '@/constants/user-center';
import { UserCenterMenu } from '@/constants/user-center';

// ─── Strategy Interface ───

export interface AccountNavigateOptions {
    source?: UserCenterSource;
    data?: { initialTab?: string };
}

export interface AccountNavigatorStrategy {
    open(menu: UserCenterMenu, options?: AccountNavigateOptions): void;
    close(): void;
}

// ─── Route Strategy ───

export class RouteAccountNavigator implements AccountNavigatorStrategy {
    constructor(private push: (path: string) => void) {}

    open(menu: UserCenterMenu, options?: AccountNavigateOptions) {
        const path = menu === UserCenterMenu.UNDEFINED ? '/account' : buildAccountUrl(menu, options);
        this.push(path);
    }

    close() {
        // Route mode: no-op — use browser back or navigate elsewhere
    }
}

// ─── Static navigator for non-React contexts ───

/**
 * Navigate to account page from non-React contexts (e.g. Zustand actions, callbacks).
 */
export function navigateToAccount(menu: UserCenterMenu, options?: AccountNavigateOptions) {
    const path = menu === UserCenterMenu.UNDEFINED ? '/account' : buildAccountUrl(menu, options);
    const locale = Cookies.get(CacheKey.I18nLanguage);
    window.location.href = `/${locale}${path}`;
}

// ─── Helpers ───

function buildAccountUrl(menu: UserCenterMenu, options?: AccountNavigateOptions): string {
    let path = getAccountPath(menu);
    const params = new URLSearchParams();
    if (options?.source) params.set('source', options.source);
    if (options?.data?.initialTab) params.set('tab', options.data.initialTab);
    const qs = params.toString();
    if (qs) path += `?${qs}`;
    return path;
}
