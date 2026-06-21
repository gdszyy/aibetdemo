'use client';

import type { FunctionComponent } from 'react';
import { AccountPageShell } from '@/modules/user-center';
import { InfoPanel } from './_components/info-panel';
import { Home } from './home';

export const Deposit: FunctionComponent = () => {
    return (
        <AccountPageShell titleKey="menus.deposit" rightPanel={<InfoPanel />}>
            <Home />
        </AccountPageShell>
    );
};

export { DepositModal } from './_components/deposit-modal';
