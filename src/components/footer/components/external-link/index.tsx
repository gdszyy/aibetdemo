'use client';

import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { FC } from 'react';
import image18 from '@/assets/images/links/18.png';
import imageBetBlocker from '@/assets/images/links/bet-blocker.png';
import imageGamCare from '@/assets/images/links/gam-care.png';
import imageGambleAware from '@/assets/images/links/gamble-aware.png';
import imageGamblingCare from '@/assets/images/links/gambling-care.png';
import imageGamblingCommission from '@/assets/images/links/gambling-commission.png';
import imageGameStop from '@/assets/images/links/game-stop.png';
import imageGordonMoody from '@/assets/images/links/gordon-moody.png';
import imageIbas from '@/assets/images/links/ibas.png';
import { useIsMobile } from '@/hooks/use-media-query';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';
import { AnjSealMount } from '../anj-seal-mount';

const LINKS: {
    title: string;
    logo: string | StaticImageData;
    url: string;
    // target?: LinkProps['onClick']
}[] = [
    {
        title: 'GAMSTOP',
        logo: imageGameStop,
        url: 'https://www.gamstop.co.uk',
    },
    {
        title: 'GambleAware',
        logo: imageGambleAware,
        url: 'https://www.gambleaware.org',
    },
    {
        title: 'GAMBLINGCARE',
        logo: imageGamblingCare,
        url: 'https://gamblingcare.ie',
    },
    {
        title: 'Betblocker',
        logo: imageBetBlocker,
        url: 'https://www.betblocker.org',
    },
    {
        title: 'Gambling Commission',
        logo: imageGamblingCommission,
        url: 'https://www.gamblingcommission.gov.uk/public-register/business/detail/42647',
    },
    {
        title: 'IBAS',
        logo: imageIbas,
        url: 'https://ibas-uk.com',
    },
    {
        title: 'GamCare',
        logo: imageGamCare,
        url: 'https://www.gamcare.org.uk',
    },
    {
        title: 'Gordon Moody',
        logo: imageGordonMoody,
        url: 'https://gamblingtherapy.org',
    },
    {
        title: '18+',
        logo: image18,
        url: '/legal/responsible-gaming',
    },
];

export const ExternalLink: FC<{ className?: string }> = ({ className }) => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <div className={cn('flex flex-row justify-between flex-wrap gap-x-2 gap-y-6 pt-6 pb-6', className)}>
                {LINKS.map((v, k) => {
                    return (
                        <Link
                            key={k.toString()}
                            className="w-[106px] shrink-0 inline-flex justify-center items-center hover:bg-filltext-ft-a overflow-hidden"
                            href={v.url}
                            rel="noopener noreferrer"
                        >
                            <Image src={v.logo} alt={v.title} width={106} />
                        </Link>
                    );
                })}
                <div className="w-[106px] h-8">
                    <AnjSealMount />
                </div>
            </div>
        );
    }

    return (
        <div className={cn('flex justify-center flex-wrap gap-6', className)}>
            {LINKS.map((v, k) => {
                return (
                    <Link
                        key={k.toString()}
                        className="w-40 h-10 inline-flex justify-center items-center hover:bg-filltext-ft-a overflow-hidden"
                        href={v.url}
                        rel="noopener noreferrer"
                    >
                        <Image src={v.logo} alt={v.title} height={38} />
                    </Link>
                );
            })}
            <div className="w-40 h-10 inline-flex justify-center items-center hover:bg-filltext-ft-a overflow-hidden">
                <AnjSealMount />
            </div>
        </div>
    );
};
