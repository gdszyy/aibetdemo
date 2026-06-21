'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { KycSuccess, Warn } from '@/components/icons';

export const ResponsibleGamingSection = () => {
    const t = useTranslations('promotionFirstDepositBonus');

    const strongRenderer = { strong: (chunks: ReactNode) => <strong className="text-filltext-ft-g">{chunks}</strong> };
    // const linkRenderer = {
    //     link: (chunks: ReactNode) => (
    //         <a
    //             href="https://www.jugadoresanonimos.org.br/"
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             className="text-blue-600 underline underline-offset-2 font-bold hover:opacity-80 transition-opacity"
    //         >
    //             {chunks}
    //         </a>
    //     ),
    // };

    return (
        <section className="w-full py-4 flex flex-col items-start">
            <div className="w-full max-w-(--main-content-max-width) mx-auto px-2.5 @lg:px-4 @3xl:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-md p-6 bg-surface-1/80 backdrop-blur-sm border border-filltext-ft-b"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <KycSuccess className="size-6 shrink-0" />
                        <h3 className="text-body-lg text-filltext-ft-h">{t('responsibleGaming.title')}</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                            <Warn className="size-3.5 shrink-0 mt-0.5 text-brand-red" />
                            <p className="text-auxiliary-sm text-filltext-ft-f leading-relaxed">
                                {t.rich('responsibleGaming.warning1', strongRenderer)}
                            </p>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <Warn className="size-3.5 shrink-0 mt-0.5 text-brand-red" />
                            <p className="text-auxiliary-sm text-filltext-ft-f leading-relaxed">
                                {t('responsibleGaming.warning2')}
                            </p>
                        </div>
                        {/* <div className="flex items-start gap-2.5">
                            <Success className="size-3.5 shrink-0 mt-0.5 text-func-win" />
                            <p className="text-auxiliary-sm text-filltext-ft-f leading-relaxed">
                                {t.rich('responsibleGaming.help', linkRenderer)}
                            </p>
                        </div> */}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
