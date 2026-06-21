'use client';

import { type FC, type PropsWithChildren, useEffect } from 'react';
import { useSessionStore } from '@/stores/session-store';

export const DeviceEffect: FC<PropsWithChildren> = ({ children }) => {
    const deviceId = useSessionStore((state) => state.deviceId);
    const initDeviceId = useSessionStore((state) => state.initDeviceId);
    useEffect(() => {
        initDeviceId();
    }, [initDeviceId]);

    if (!deviceId) {
        return null;
    }

    return children;
};
