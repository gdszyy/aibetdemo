import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalDocPage } from '@/modules/docs/legal/legal-doc-page';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('legal');
    return { title: t('sections.amlKyc.title') };
}

export default function Page() {
    return <LegalDocPage titleKey="sections.amlKyc.title" contentKey="sections.amlKyc.content" />;
}
