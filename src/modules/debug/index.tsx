'use client';

import type { FunctionComponent } from 'react';
import { Language } from './components/language';
import { Region } from './components/region';

export const Debug: FunctionComponent = () => {
    return (
        <div className="p-20 flex flex-col gap-y-4">
            <Region />
            <Language />
        </div>
    );
};
