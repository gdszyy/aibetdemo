export const SPORTS_PREFIXES = ['/sports', '/matches', '/leagues', '/legal'];

export const CASINO_PREFIXES = ['/casino'];

export const checkIsSportsActive = (pathname: string) => {
    // Special case for live route - it should not highlight the main sports tab
    if (pathname.startsWith('/sports-live')) {
        return false;
    }

    const isMatched = SPORTS_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    const isHome = pathname === '/' || pathname === '';

    return isMatched || isHome;
};

export const checkIsSportsLiveActive = (pathname: string) => {
    return pathname.startsWith('/sports-live');
};

export const checkIsCasinoActive = (pathname: string) => {
    return CASINO_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

/** Check if the current path is an account route */
export const checkIsAccountRoute = (pathname: string) => pathname.startsWith('/account');

/** Routes that render a sidebar (sports/sports-live/casino/account) */
export const checkHasSidebar = (pathname: string) => {
    return (
        checkIsSportsActive(pathname) ||
        checkIsSportsLiveActive(pathname) ||
        checkIsCasinoActive(pathname) ||
        checkIsAccountRoute(pathname)
    );
};

// ─── Sidebar type Strategy ─────────────────────────────────────────

export type SidebarType = 'sports' | 'casino' | 'account';

/** Determine which sidebar module the current route belongs to */
export function getSidebarType(pathname: string): SidebarType {
    if (CASINO_PREFIXES.some((p) => pathname.startsWith(p))) return 'casino';
    if (pathname.startsWith('/account')) return 'account';
    return 'sports';
}
