import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { Link } from '@/i18n';
import Icon from './assets/svip_bottom_icon.svg';

export const SVIPCTA: FC = () => {
    const t = useTranslations('vip');

    return (
        <section className="mx-4 mt-6 md:mt-16 rounded-md p-px bg-linear-to-br from-[#3C3C3C] to-[#533612] mb-4 md:mb-37.25">
            <div className="px-3 md:px-5 py-8 flex flex-col items-center text-center rounded-md bg-[#221A16]">
                <Image alt="" aria-hidden="true" className="mx-auto size-6.5" src={Icon} />

                <h2 className="mt-2 text-center font-family-headline text-xs md:text-title-lg font-normal tracking-[10%] text-func-bonus">
                    {t('svipPage.cta.title')}
                </h2>

                <p className="text-auxiliary-xxs md:text-body-sm text-neutral-white-h">
                    {t('svipPage.cta.description')}
                </p>
                <Link
                    className="mt-8 flex h-10 items-center justify-center rounded-full bg-[linear-gradient(90deg,#D18800_0%,#FFBE0F_49.52%,#D28900_100%)] px-6 text-body-lg uppercase text-filltext-ft-h shadow-[0_1px_8px_#B18118]"
                    href="/sports/vip"
                >
                    {t('svipPage.cta.action')}
                </Link>
            </div>
        </section>
    );
};
