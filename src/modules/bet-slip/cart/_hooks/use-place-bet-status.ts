import { useMemo } from 'react';
import { CartStatus } from '@/api/models/cart';
import { useCartStatus } from '../../stores/bet-slip-store';
import { PlaceBetStatus } from '../_constants';

export function usePlaceBetStatus(hasException: boolean) {
    const cartStatus = useCartStatus();

    const isLocked = cartStatus === CartStatus.Locked;
    const status = useMemo(() => {
        if (isLocked) return PlaceBetStatus.Locked;
        if (hasException) return PlaceBetStatus.Exception;
        return PlaceBetStatus.Normal;
    }, [isLocked, hasException]);
    return status;
}
