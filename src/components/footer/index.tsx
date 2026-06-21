'use client';

import type { FunctionComponent } from 'react';
import { useIsMobile } from '@/hooks/use-media-query';
import { H5 } from './h5';
import { PC } from './pc';

export const Footer: FunctionComponent = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <H5 />;
    }

    return <PC />;
};
