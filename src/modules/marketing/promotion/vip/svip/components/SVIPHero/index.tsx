import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import StarIcon from '../../assets/star_icon.svg';
import HeaderIcon from '../../assets/svip_header_icon.png';

const InvitationBadge: FC = () => {
    const t = useTranslations('vip');

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-func-bonus px-4 h-8 text-auxiliary-xs uppercase text-func-bonus font-poppins">
            <Image alt="" className="w-1.5 h-2" src={StarIcon} />
            <span>{t('banner.invitationOnly')}</span>
            <Image alt="" className="w-1.5 h-2" src={StarIcon} />
        </div>
    );
};

export const SVIPHero: FC = () => {
    const t = useTranslations('vip');

    return (
        <header className="relative overflow-hidden mt-4 text-center">
            <div className="relative z-10 flex flex-col items-center">
                <Image alt="" className="size-22.5" src={HeaderIcon} unoptimized />

                <div className="mt-8 flex w-full items-center justify-center h-16 px-0 md:px-11">
                    {/* left line */}
                    <span className="h-0.5 flex-1 rounded-full bg-[linear-gradient(270deg,#FFC31D_0%,rgba(0,0,0,0)_100%)]" />
                    <span className="h-1 w-1 rounded-full bg-func-bonus ml-4 md:ml-4"></span>
                    <h1 className="shrink-0 font-family-headline font-extrabold italic text-neutral-white-h md:text-[60px] text-[40px] tracking-[8%] px-10">
                        {t('banner.svipTitle')}
                    </h1>
                    <span className="h-1 w-1 rounded-full bg-func-bonus mr-4 md:mr-6"></span>
                    {/* right line */}
                    <span className="h-0.5 flex-1 rounded-full bg-[linear-gradient(90deg,#FFC31D_0%,rgba(0,0,0,0)_100%)]" />
                </div>

                <div className="mt-6">
                    <InvitationBadge />
                </div>

                <p className="mt-10 text-body-sm uppercase tracking-[20%] text-func-pending @md:tracking-[50%] px-4 md:px-11">
                    {t('svipPage.eyebrow')}
                </p>

                <p className="mt-1 text-[14px] md:text-[20px] font-light italic text-neutral-white-h px-4 md:px-11">
                    {t('svipPage.subtitle')}
                </p>
            </div>
        </header>
    );
};
