import { MatchStatus } from '@/api/models/match';
import { usePathname } from '@/i18n';

/**
 * Returns a URL query suffix `?status=Live` when the current route is under `/sports-live`.
 * Used by sidebar and match-filter links to preserve live context when navigating.
 */
export const useLiveStatusSuffix = () => {
    const pathname = usePathname();
    return pathname.startsWith('/sports-live') ? `?status=${MatchStatus.Live}` : '';
};
