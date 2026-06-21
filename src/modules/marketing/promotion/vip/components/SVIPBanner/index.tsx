'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { ArrowRight } from '@/components/icons';
import { Link } from '@/i18n';
import SVIPIcon from './assets/svip-icon.svg';

/**
 * SVIPBanner 组件，用于展示仅限邀请的 SVIP 权益入口。
 */
export const SVIPBanner: FC = () => {
    const t = useTranslations('vip');

    return (
        <section className="group flex flex-col md:flex-row w-full overflow-hidden rounded-md bg-linear-to-r from-filltext-ft-h to-[#1A1E26] p-6">
            <div className="flex flex-row items-center justify-start flex-1 gap-2">
                <Image alt="SVIP Icon" height={48} src={SVIPIcon} width={48} />

                <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-1">
                    <div className="flex w-full items-center justify-start gap-2">
                        <p className="shrink-0 text-title-md text-neutral-white-h">SVIP</p>

                        <div className="flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xs border-[0.5px] border-func-bonus bg-filltext-ft-h px-2">
                            <p className="text-auxiliary-xs uppercase text-func-bonus">{t('banner.invitationOnly')}</p>
                        </div>
                    </div>

                    <p className="w-full text-auxiliary-sm text-filltext-ft-e group-hover:text-neutral-white-h">
                        {t('banner.svipDescription')}
                    </p>
                </div>
            </div>

            <Link
                className="flex mt-4 md:mt-0 h-8 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border-[0.5px] border-neutral-white-h px-4 text-auxiliary-xs text-neutral-white-h transition-colors hover:bg-filltext-ft-h"
                href="/sports/vip/svip"
            >
                <span>{t('banner.exploreSvip')}</span>
                <span className="flex size-3 shrink-0 items-center justify-center">
                    <ArrowRight className="size-3 text-neutral-white-h" />
                </span>
            </Link>
        </section>
    );
};
