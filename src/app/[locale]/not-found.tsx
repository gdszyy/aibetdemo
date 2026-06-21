'use client';

import { useTranslations } from 'next-intl';

export default function NotFound() {
    const t = useTranslations('common');
    return <p>{t('page.notFound')}</p>;
}
