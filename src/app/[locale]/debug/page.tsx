'use client';

import type { FunctionComponent } from 'react';
import { ClientOnly } from '@/components/client-only';
import { Debug } from '@/modules/debug';

// debug页面
const App: FunctionComponent = () => {
    return (
        <ClientOnly>
            <Debug />
        </ClientOnly>
    );
};

export default App;
