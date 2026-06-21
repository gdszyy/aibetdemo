import { useMemo } from 'react';
import { useRouter } from '@/i18n';
import type { AccountNavigatorStrategy } from '@/libs/account-navigator';
import { RouteAccountNavigator } from '@/libs/account-navigator';

/**
 * Returns a navigator that opens account pages via route-based navigation.
 */
export function useAccountNavigator(): AccountNavigatorStrategy {
    const router = useRouter();

    return useMemo(() => {
        return new RouteAccountNavigator((path) => router.push(path));
    }, [router]);
}
