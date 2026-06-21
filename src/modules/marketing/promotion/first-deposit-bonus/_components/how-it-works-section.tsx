'use client';

import { motion } from 'motion/react';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SportArcheryActive } from '@/components/icons';
import { STEP_IMAGES } from '../../_constants/promotion-data';

const STEP_KEYS = ['step1', 'step2', 'step3'] as const;

const StepCard = ({
    img,
    step,
    title,
    desc,
    index,
}: {
    img: StaticImageData;
    step: string;
    title: string;
    desc: string;
    index: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.38, delay: index * 0.1 }}
            className="flex flex-col items-center text-center p-4 bg-surface-1/80 backdrop-blur-sm rounded-md border border-filltext-ft-b flex-1 min-w-0"
        >
            <div className="relative mb-0 md:mb-4">
                <div className="relative size-[90px]">
                    <Image
                        src={img}
                        alt={title}
                        fill
                        sizes="90px"
                        className="object-contain drop-shadow-sm"
                        placeholder="blur"
                    />
                </div>
                <div className="absolute -top-1 -right-1 size-4.5 rounded-full flex items-center justify-center text-white text-auxiliary-md shadow-md bg-brand-red">
                    {step}
                </div>
            </div>
            <p className="text-auxiliary-md @lg:text-body-lg mb-1 text-filltext-ft-h leading-tight truncate w-full">
                {title}
            </p>
            <p className="text-auxiliary-xs @lg:text-auxiliary-sm text-filltext-ft-f leading-relaxed">{desc}</p>
        </motion.div>
    );
};

export const HowItWorksSection = () => {
    const t = useTranslations('promotionFirstDepositBonus');

    const STEP_COPY_KEYS = {
        step1: { title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc') },
        step2: { title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc') },
        step3: { title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc') },
    };

    return (
        <section className="w-full pt-2 pb-6 flex flex-col items-start">
            <div className="w-full max-w-(--main-content-max-width) mx-auto px-2.5 @lg:px-4 @3xl:px-6">
                <div className="mb-5 text-left">
                    <div className="flex items-center justify-start gap-2.5 mb-1">
                        <SportArcheryActive className="size-6 shrink-0" />
                        <h2 className="text-headline-sm text-filltext-ft-h">{t('howItWorks.title')}</h2>
                    </div>
                    <p className="text-filltext-ft-f text-auxiliary-sm @lg:text-body-sm">{t('howItWorks.subtitle')}</p>
                    <div
                        className="mt-3 h-px w-full opacity-35"
                        style={{
                            background:
                                'linear-gradient(90deg, var(--brand-red) 0%, var(--brand-primary-1) 40%, transparent 100%)',
                        }}
                    />
                </div>

                <div className="flex flex-row gap-4 items-stretch justify-between">
                    {STEP_KEYS.map((key, i) => (
                        <StepCard
                            key={key}
                            img={STEP_IMAGES[i]}
                            step={String(i + 1).padStart(2, '0')}
                            title={STEP_COPY_KEYS[key].title}
                            desc={STEP_COPY_KEYS[key].desc}
                            index={i}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
