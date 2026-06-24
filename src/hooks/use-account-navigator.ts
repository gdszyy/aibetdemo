import { useEffect, useMemo } from 'react';
import { ACCOUNT_ROUTES } from '@/constants/account-routes';
import { useRouter } from '@/i18n';
import type { AccountNavigatorStrategy } from '@/libs/account-navigator';
import { RouteAccountNavigator } from '@/libs/account-navigator';

const ACCOUNT_PREFETCH_PATHS = ACCOUNT_ROUTES.map((route) => route.path).filter((path) => path !== '#');

/**
 * Returns a navigator that opens account pages via route-based navigation.
 */
export function useAccountNavigator(): AccountNavigatorStrategy {
    const router = useRouter();

    useEffect(() => {
        ACCOUNT_PREFETCH_PATHS.forEach((path) => {
            router.prefetch(path);
        });
    }, [router]);

    return useMemo(() => {
        return new RouteAccountNavigator((path) => router.push(path));
    }, [router]);
}
