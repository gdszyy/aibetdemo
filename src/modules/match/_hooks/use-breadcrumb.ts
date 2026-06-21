import { useQuery } from '@tanstack/react-query';
import { GetBreadcrumbInterface } from '@/api/handlers/matches';

interface UseBreadcrumbParams {
    sportId?: string;
    tournamentId?: string;
    matchId?: string;
}

/**
 * Shared breadcrumb data hook.
 *
 * Wraps `GetBreadcrumbInterface` in a `useQuery` so that any component
 * needing breadcrumb data (Breadcrumb nav, MatchDetail, etc.) shares
 * the same cache entry and avoids duplicate requests.
 */
export function useBreadcrumb({ sportId, tournamentId, matchId }: UseBreadcrumbParams) {
    return useQuery({
        queryKey: ['breadcrumb', sportId, tournamentId, matchId],
        queryFn: () =>
            GetBreadcrumbInterface({
                sport_id: sportId,
                tournament_id: tournamentId,
                event_id: matchId,
            }),
        enabled: !!sportId || !!tournamentId || !!matchId,
    });
}
