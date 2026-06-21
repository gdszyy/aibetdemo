'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ChampionHandicapStepBgRt } from '../_images';
import { ChampionHandicapSectionTitle } from './_components/section-title';
import { CHAMPION_HANDICAP_STEPS, type ChampionHandicapStep } from './_constants/data';
import { useChampionHandicapTranslationValues } from './_constants/region';

interface ChampionHandicapStepsSectionProps {
    steps?: ChampionHandicapStep[];
}

export const ChampionHandicapStepsSection = ({
    steps = CHAMPION_HANDICAP_STEPS,
}: ChampionHandicapStepsSectionProps) => {
    const t = useTranslations('promotion');
    const translationValues = useChampionHandicapTranslationValues();

    if (steps.length === 0) {
        return null;
    }

    return (
        <section className="flex w-full flex-col items-start">
            <div className="mx-auto w-full max-w-[1000px] px-4 md:px-8">
                <ChampionHandicapSectionTitle
                    title={t('championHandicap.steps.title')}
                    subtitle={t('championHandicap.steps.subtitle')}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.38, delay: index * 0.1 }}
                            className="relative min-h-[172px] overflow-hidden rounded-md border border-func-win bg-surface-1 p-4"
                        >
                            <Image
                                src={ChampionHandicapStepBgRt}
                                alt=""
                                aria-hidden
                                className="pointer-events-none absolute right-0 top-0 h-auto w-[72px]"
                                width={72}
                                height={72}
                            />
                            <div className="mb-2 flex size-10 items-center justify-center rounded-sm bg-func-win/[0.08] text-title-sm text-func-win">
                                {index + 1}
                            </div>
                            <p className="mb-2 text-title-sm text-filltext-ft-h">
                                {t(step.titleKey, translationValues)}
                            </p>
                            <p className="max-w-[240px] text-auxiliary-xs leading-relaxed text-filltext-ft-e">
                                {t(step.descriptionKey, translationValues)}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
