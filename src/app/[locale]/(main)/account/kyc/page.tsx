import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { FunctionComponent } from 'react';
import { KYCVerify } from '@/modules/user/kyc';
import { AccountPageShell } from '@/modules/user-center';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('user');
    return { title: t('menus.kyc') };
}

const KycHelpPanel: FunctionComponent = () => {
    const t = useTranslations('user');
    return (
        <div className="account-card">
            <h3 className="text-body-md text-filltext-ft-g mb-3">{t('kyc.helpTitle')}</h3>
            {/* Help content - placeholder until i18n keys are ready */}
        </div>
    );
};

export default function KycPage() {
    return (
        <AccountPageShell titleKey="menus.kyc" rightPanel={<KycHelpPanel />}>
            <KYCVerify />
        </AccountPageShell>
    );
}
