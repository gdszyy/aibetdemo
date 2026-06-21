import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { FunctionComponent, PropsWithChildren } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const p = await params;
    const t = await getTranslations({ locale: p.locale, namespace: 'auth' });
    return { title: t('login.title') };
}

interface LayoutProps extends PropsWithChildren {
    params: Promise<{ locale: string }>;
}

const SigninLayout: FunctionComponent<LayoutProps> = ({ children }) => {
    return <>{children}</>;
};

export default SigninLayout;
