'use client';

import type { FunctionComponent } from 'react';
import { AccountPageShell } from '@/modules/user-center';
import { Home } from './components/home';
import { InfoPanel } from './components/info-panel';
import { PageStore } from './components/page-store';

/** 提现 */
export const Withdraw: FunctionComponent = () => {
    return (
        <PageStore>
            <AccountPageShell titleKey="menus.withdraw" rightPanel={<InfoPanel />}>
                <Home />
            </AccountPageShell>
        </PageStore>
    );
};
