import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalDocPage } from '@/modules/docs/legal/legal-doc-page';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('legal');
    return { title: t('sections.terms.title') };
}

export default function Page() {
    return <LegalDocPage titleKey="sections.terms.title" contentKey="sections.terms.content" />;
}
