import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalDocPage } from '@/modules/docs/legal/legal-doc-page';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('legal');
    return { title: t('sections.responsibleGaming.title') };
}

export default function Page() {
    return <LegalDocPage titleKey="sections.responsibleGaming.title" contentKey="sections.responsibleGaming.content" />;
}
