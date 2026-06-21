'use client';

import { useEffect, useState } from 'react';

const useDetectKeyboardOpen = (minKeyboardHeight = 300, defaultValue = false) => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(defaultValue);

    useEffect(() => {
        const listener = () => {
            const viewport = window.visualViewport;

            if (viewport == null) {
                return;
            }

            const newState = window.screen.height - minKeyboardHeight > viewport.height;

            setIsKeyboardOpen((prev) => (prev !== newState ? newState : prev));
        };

        const viewport = window.visualViewport;

        if (viewport != null) {
            viewport.addEventListener('resize', listener);
        }

        return () => {
            if (viewport != null) {
                viewport.removeEventListener('resize', listener);
            }
        };
    }, [minKeyboardHeight]);

    return isKeyboardOpen;
};

export default useDetectKeyboardOpen;
