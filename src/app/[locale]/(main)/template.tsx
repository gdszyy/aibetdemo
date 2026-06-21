import type { ReactNode } from 'react';

import ScrollToTopOnNav from './scroll-to-top-on-nav';

export default function MainTemplate({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <ScrollToTopOnNav />
            {children}
        </>
    );
}
