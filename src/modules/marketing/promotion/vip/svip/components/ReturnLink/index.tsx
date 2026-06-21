import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { ArrowLeft } from '@/components/icons';
import { Link } from '@/i18n';

export const ReturnLink: FC = () => {
    const t = useTranslations('vip');

    return (
        <Link
            className="inline-flex h-8 items-center gap-2 px-2 rounded-sm font-poppins text-body-sm text-neutral-white-h transition-colors hover:text-func-bonus hover:bg-neutral-black-h"
            href="/sports/vip"
        >
            <ArrowLeft className="size-3 " />
            <span>{t('svipPage.return')}</span>
        </Link>
    );
};
