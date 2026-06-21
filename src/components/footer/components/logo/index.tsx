'use client';

import type { FunctionComponent } from 'react';
import { Logo as Logo1 } from '@/components/Logo';

export const Logo: FunctionComponent = () => {
    return (
        <div className="shrink-0 relative">
            <Logo1 className="w-43.25" variant="long" />
        </div>
    );
};
