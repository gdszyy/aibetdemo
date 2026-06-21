import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { TranslationKey } from '@/i18nV2/types';
import BenefitIcon01 from '../../assets/benefit_icon01.svg';
import BenefitIcon02 from '../../assets/benefit_icon02.svg';
import BenefitIcon03 from '../../assets/benefit_icon03.svg';
import BenefitIcon04 from '../../assets/benefit_icon04.svg';
import BenefitIcon05 from '../../assets/benefit_icon05.svg';
import BenefitIcon06 from '../../assets/benefit_icon06.svg';
import BenefitIcon07 from '../../assets/benefit_icon07.svg';
import BenefitIcon08 from '../../assets/benefit_icon08.svg';
import BenefitIcon09 from '../../assets/benefit_icon09.svg';
import BenefitIcon10 from '../../assets/benefit_icon10.svg';
import BenefitIcon11 from '../../assets/benefit_icon11.svg';
import { SVIPBenefitCard } from '../SVIPBenefitCard';

const SVIP_BENEFITS = [
    'luxuryGifts',
    'resortGetaways',
    'sportsExperiences',
    'adventureExperiences',
    'casinoAccess',
    'birthdayPrivileges',
    'concierge',
    'fastWithdrawals',
    'cashbackBonuses',
    'customBetting',
    'tailoredServices',
] as const;

const SVIP_BENEFIT_ICONS: Record<(typeof SVIP_BENEFITS)[number], string> = {
    luxuryGifts: BenefitIcon01,
    resortGetaways: BenefitIcon02,
    sportsExperiences: BenefitIcon03,
    adventureExperiences: BenefitIcon04,
    casinoAccess: BenefitIcon05,
    birthdayPrivileges: BenefitIcon06,
    concierge: BenefitIcon07,
    fastWithdrawals: BenefitIcon08,
    cashbackBonuses: BenefitIcon09,
    customBetting: BenefitIcon10,
    tailoredServices: BenefitIcon11,
};

const SVIP_BENEFIT_KEY_MAP: Record<
    (typeof SVIP_BENEFITS)[number],
    {
        title: TranslationKey<'vip'>;
        description: TranslationKey<'vip'>;
    }
> = {
    luxuryGifts: {
        title: 'svipPage.benefits.luxuryGifts.title',
        description: 'svipPage.benefits.luxuryGifts.description',
    },
    resortGetaways: {
        title: 'svipPage.benefits.resortGetaways.title',
        description: 'svipPage.benefits.resortGetaways.description',
    },
    sportsExperiences: {
        title: 'svipPage.benefits.sportsExperiences.title',
        description: 'svipPage.benefits.sportsExperiences.description',
    },
    adventureExperiences: {
        title: 'svipPage.benefits.adventureExperiences.title',
        description: 'svipPage.benefits.adventureExperiences.description',
    },
    casinoAccess: {
        title: 'svipPage.benefits.casinoAccess.title',
        description: 'svipPage.benefits.casinoAccess.description',
    },
    birthdayPrivileges: {
        title: 'svipPage.benefits.birthdayPrivileges.title',
        description: 'svipPage.benefits.birthdayPrivileges.description',
    },
    concierge: {
        title: 'svipPage.benefits.concierge.title',
        description: 'svipPage.benefits.concierge.description',
    },
    fastWithdrawals: {
        title: 'svipPage.benefits.fastWithdrawals.title',
        description: 'svipPage.benefits.fastWithdrawals.description',
    },
    cashbackBonuses: {
        title: 'svipPage.benefits.cashbackBonuses.title',
        description: 'svipPage.benefits.cashbackBonuses.description',
    },
    customBetting: {
        title: 'svipPage.benefits.customBetting.title',
        description: 'svipPage.benefits.customBetting.description',
    },
    tailoredServices: {
        title: 'svipPage.benefits.tailoredServices.title',
        description: 'svipPage.benefits.tailoredServices.description',
    },
};

export const SVIPBenefitsSection: FC = () => {
    const t = useTranslations('vip');

    return (
        <section className="relative z-10 mx-4 mt-6 md:mt-10 overflow-hidden rounded-lg bg-neutral-white-b px-2 md:px-4 backdrop-blur-dialog">
            <div className="mt-6 md:mt-10 flex items-center justify-center gap-4 h-10">
                <span className="h-px w-25 bg-linear-to-l from-[#FFC31D] to-transparent" />
                <h2 className="shrink-0 uppercase text-neutral-white-h text-headline-sm">
                    {t('svipPage.benefitsTitle')}
                </h2>
                <span className="h-px w-25 bg-linear-to-r from-[#FFC31D] to-transparent md:w-28" />
            </div>

            <div className="mt-2 md:mt-8 grid grid-cols-1 gap-x-4 gap-y-2 md:gap-y-6 md:grid-cols-2 mb-6 md:mb-16">
                {SVIP_BENEFITS.map((benefit, index) => (
                    <div className={index === SVIP_BENEFITS.length - 1 ? 'md:col-span-2' : undefined} key={benefit}>
                        <SVIPBenefitCard
                            description={t(SVIP_BENEFIT_KEY_MAP[benefit].description)}
                            icon={SVIP_BENEFIT_ICONS[benefit]}
                            index={index}
                            title={t(SVIP_BENEFIT_KEY_MAP[benefit].title)}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};
