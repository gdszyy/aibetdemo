'use client';

import { useEffect } from 'react';

const GESTURE_EVENTS = ['gesturestart', 'gesturechange', 'gestureend'] as const;
const DOUBLE_TAP_THRESHOLD_MS = 300;

function isTouchDevice() {
    return window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

export function MobileZoomLock() {
    useEffect(() => {
        if (!isTouchDevice()) {
            return;
        }

        let lastTouchEndAt = 0;

        const preventDefault = (event: Event) => {
            if (event.cancelable) {
                event.preventDefault();
            }
        };

        const preventPinchZoom = (event: TouchEvent) => {
            if (event.touches.length > 1 && event.cancelable) {
                event.preventDefault();
            }
        };

        const preventDoubleTapZoom = (event: TouchEvent) => {
            const now = Date.now();
            const isDoubleTap = now - lastTouchEndAt > 0 && now - lastTouchEndAt <= DOUBLE_TAP_THRESHOLD_MS;

            lastTouchEndAt = now;

            if (isDoubleTap && event.cancelable) {
                event.preventDefault();
            }
        };

        for (const eventName of GESTURE_EVENTS) {
            document.addEventListener(eventName, preventDefault, { passive: false });
        }

        document.addEventListener('touchmove', preventPinchZoom, { passive: false });
        document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

        return () => {
            for (const eventName of GESTURE_EVENTS) {
                document.removeEventListener(eventName, preventDefault);
            }

            document.removeEventListener('touchmove', preventPinchZoom);
            document.removeEventListener('touchend', preventDoubleTapZoom);
        };
    }, []);

    return null;
}
