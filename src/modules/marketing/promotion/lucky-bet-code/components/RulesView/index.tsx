'use client';

import { useTranslations } from 'next-intl';
import { Accordion } from 'radix-ui';
import type { FC } from 'react';
import { ArrowDown } from '@/components/icons';
import { cn } from '@/utils/common';

interface RuleSection {
    /** 规则分组唯一值。 */
    value: string;
    /** 规则分组标题。 */
    title: string;
    /** 规则条目。 */
    items: string[];
}

interface SharingStep {
    /** 分享步骤标题。 */
    title: string;
    /** 分享步骤说明。 */
    items: string[];
}

interface SharingTasksSectionProps {
    /** 规则分组唯一值。 */
    value: string;
    /** 分享任务标题。 */
    title: string;
    /** 分享任务步骤。 */
    steps: SharingStep[];
}

/** 幸运投注码规则折叠卡。 */
const RuleAccordionItem: FC<RuleSection> = ({ value, title, items }) => {
    return (
        <Accordion.Item value={value} className="overflow-hidden rounded-sm bg-surface-1 p-3 flex flex-col gap-2.5">
            <Accordion.Header>
                <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between text-left text-title-sm font-poppins text-filltext-ft-h">
                    <span>{title}</span>
                    <ArrowDown className="size-4 shrink-0 text-filltext-ft-g transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <ul className="pl-5 text-body-sm font-poppins text-filltext-ft-g list-disc marker:text-[12px]">
                    {items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </Accordion.Content>
        </Accordion.Item>
    );
};

/** 幸运投注码分享任务折叠卡。 */
const SharingTasksAccordionItem: FC<SharingTasksSectionProps> = ({ value, title, steps }) => {
    return (
        <Accordion.Item value={value} className="overflow-hidden rounded-sm bg-surface-1 p-3 flex flex-col gap-2.5">
            <Accordion.Header>
                <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between text-left text-title-sm font-poppins text-filltext-ft-h">
                    <span>{title}</span>
                    <ArrowDown className="size-4 shrink-0 text-filltext-ft-g transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="flex flex-col gap-2.5 font-poppins">
                    {steps.map((step) => (
                        <div key={step.title}>
                            <h3 className="text-body-lg text-filltext-ft-g">{step.title}</h3>
                            <ul className="pl-5 text-body-sm font-poppins list-disc marker:text-[12px]">
                                {step.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </Accordion.Content>
        </Accordion.Item>
    );
};

/** 幸运投注码活动规则区域。 */
export const RulesView: FC = () => {
    const t = useTranslations('promotionLuckyBetCode');
    const basicRules = [t('rules.basic.item1'), t('rules.basic.item2'), t('rules.basic.item3'), t('rules.basic.item4')];
    const sharingSteps: SharingStep[] = [
        {
            title: t('rules.sharingTasks.step1Title'),
            items: [
                t('rules.sharingTasks.item1'),
                t('rules.sharingTasks.item2'),
                t('rules.sharingTasks.item3'),
                t('rules.sharingTasks.item4'),
            ],
        },
        {
            title: t('rules.sharingTasks.step2Title'),
            items: [t('rules.sharingTasks.item5'), t('rules.sharingTasks.item6')],
        },
    ];
    const sections: RuleSection[] = [
        {
            value: 'rewardNotes',
            title: t('rules.rewardNotes.title'),
            items: [t('rules.rewardNotes.item1'), t('rules.rewardNotes.item2')],
        },
        {
            value: 'importantTerms',
            title: t('rules.importantTerms.title'),
            items: [
                t('rules.importantTerms.item1'),
                t('rules.importantTerms.item2'),
                t('rules.importantTerms.item3'),
                t('rules.importantTerms.item4'),
                t('rules.importantTerms.item5'),
            ],
        },
        {
            value: 'safetyNotice',
            title: t('rules.safetyNotice.title'),
            items: [t('rules.safetyNotice.item1'), t('rules.safetyNotice.item2'), t('rules.safetyNotice.item3')],
        },
    ];

    return (
        <section className="relative">
            <div
                className={cn(
                    'absolute overflow-hidden flex justify-center top-0 left-0 w-full h-22 bg-brand-primary-4 rounded-t-md',
                )}
            >
                <h2 className="mt-2.5 text-neutral-white-h text-lg leading-5.5 font-bold font-poppins">
                    {t('rules.title')}
                </h2>
            </div>
            <div className="flex flex-col gap-2 p-4 mt-10.5 self-stretch rounded-md border border-surface-3 bg-surface-1 backdrop-blur-[30px]">
                <ul className="rounded-sm bg-surface-1 p-3 pl-6 text-body-sm text-filltext-ft-g font-poppins list-disc marker:text-[12px]">
                    {basicRules.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <Accordion.Root
                    type="multiple"
                    defaultValue={['sharingTasks', ...sections.map((section) => section.value)]}
                    className="flex flex-col gap-2"
                >
                    <SharingTasksAccordionItem
                        value="sharingTasks"
                        title={t('rules.sharingTasks.title')}
                        steps={sharingSteps}
                    />
                    {sections.map((section) => (
                        <RuleAccordionItem key={section.value} {...section} />
                    ))}
                </Accordion.Root>
            </div>
        </section>
    );
};
