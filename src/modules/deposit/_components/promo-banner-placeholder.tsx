'use client';

import Image, { type StaticImageData } from 'next/image';
import type { FC } from 'react';
import promoDepositBR from '@/assets/images/promotion/first-deposit.br.png';
import promoDepositMX from '@/assets/images/promotion/first-deposit.mx.png';
import promoDepositMobileBR from '@/assets/images/promotion/first-deposit-mobile.br.png';
import promoDepositMobileMX from '@/assets/images/promotion/first-deposit-mobile.mx.png';
import { Link } from '@/i18n';
import { type RegionCode, useRegionCode } from '@/i18nV2';

interface PromoBannerPlaceholderProps {
    bannerLink?: string;
}

export const PromoBannerPlaceholder: FC<PromoBannerPlaceholderProps> = ({
    bannerLink = '/sports/promotions/first-deposit-bonus',
}) => {
    const regionCode = useRegionCode();

    const images: Record<RegionCode, { pc: StaticImageData; mobile: StaticImageData }> = {
        BR: {
            pc: promoDepositBR,
            mobile: promoDepositMobileBR,
        },
        MX: {
            pc: promoDepositMX,
            mobile: promoDepositMobileMX,
        },
    };

    const image = {
        pc: images[regionCode]?.pc,
        mobile: images[regionCode]?.mobile,
    };

    return (
        <Link href={bannerLink} className="mt-4 block w-full">
            {!!image.mobile && (
                <Image src={image.mobile} alt="Promotion" className="w-full rounded-sm md:hidden" placeholder="blur" />
            )}
            {!!image.pc && (
                <Image
                    src={image.pc}
                    alt="Promotion"
                    className="w-full rounded-sm hidden md:block"
                    placeholder="blur"
                />
            )}
        </Link>
    );
};
