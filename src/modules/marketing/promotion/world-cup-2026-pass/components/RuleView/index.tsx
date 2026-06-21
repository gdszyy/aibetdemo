import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC, PropsWithChildren } from 'react';
import { useRegionCode } from '@/i18nV2';
import { cn } from '@/utils/common';
// import { useAmount } from '../../../_utils/useAmount';
import Icon from '../../assets/rule.svg';
import { GradientBorder } from '../GradientBorder';

const RuleCard: FC<{ isHighLevel?: boolean; title: string; items: { id: number; text: string }[] }> = ({
    isHighLevel,
    title,
    items,
}) => {
    return (
        <div className="flex flex-col gap-1">
            {/* Title */}
            <h2 className={cn('text-title-sm py-2', isHighLevel ? 'text-neutral-white-h' : 'text-filltext-ft-h')}>
                {title}
            </h2>

            {/* List */}
            <ul className={cn('text-body-sm', isHighLevel ? 'text-filltext-ft-c' : 'text-filltext-ft-g')}>
                {items.map((item) => (
                    <li key={item.id} className="flex gap-2 pl-2">
                        <span
                            className={cn(
                                'mt-2 h-1 w-1 rounded-full shrink-0',
                                isHighLevel ? 'bg-filltext-ft-c' : 'bg-filltext-ft-g',
                            )}
                        />
                        <span>{item.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/**
 * 规则
 */
export const RuleView: FC<PropsWithChildren<{ isHighLevel?: boolean }>> = ({ isHighLevel }) => {
    const t = useTranslations('promotionWorldCupPass');
    const regionCode = useRegionCode();
    // const formatAmount = useAmount();
    const isMexico = regionCode === 'MX';
    const rules = [
        {
            id: 1,
            title: t('rules.sections.guidelines.title'),
            items: [
                { id: 1, text: t('rules.sections.guidelines.item1') },
                { id: 2, text: t('rules.sections.guidelines.item2') },
                { id: 3, text: t('rules.sections.guidelines.item3') },
                { id: 4, text: t('rules.sections.guidelines.item4') },
                { id: 5, text: t('rules.sections.guidelines.item5') },
                // {
                //     id: 6,
                //     text: t('rules.sections.guidelines.item6', {
                //         amount: formatAmount(isMexico ? 10 : 5),
                //     }),
                // },
                // {
                //     id: 7,
                //     text: t('rules.sections.guidelines.item7', {
                //         amount: formatAmount(isMexico ? 239 : 139),
                //     }),
                // },
                { id: 8, text: t('rules.sections.guidelines.item8') },
                { id: 9, text: t('rules.sections.guidelines.item9') },
            ],
        },
        {
            id: 2,
            title: t('rules.sections.rewardDetails.title'),
            items: [
                { id: 1, text: t('rules.sections.rewardDetails.item1') },
                { id: 2, text: t('rules.sections.rewardDetails.item2') },
                { id: 3, text: t('rules.sections.rewardDetails.item3') },
                { id: 4, text: t('rules.sections.rewardDetails.item4') },
            ],
        },
        {
            id: 3,
            title: t('rules.sections.importantTerms.title'),
            items: [
                {
                    id: 1,
                    text: t('rules.sections.importantTerms.item1', {
                        identityDocument: isMexico ? 'CURP' : 'CPF',
                    }),
                },
                { id: 2, text: t('rules.sections.importantTerms.item2') },
                { id: 3, text: t('rules.sections.importantTerms.item3') },
                { id: 4, text: t('rules.sections.importantTerms.item4') },
                { id: 5, text: t('rules.sections.importantTerms.item5') },
                { id: 6, text: t('rules.sections.importantTerms.item6') },
                { id: 7, text: t('rules.sections.importantTerms.item7') },
            ],
        },
        {
            id: 4,
            title: t('rules.sections.safetyStatement.title'),
            items: [
                { id: 1, text: t('rules.sections.safetyStatement.item1') },
                { id: 2, text: t('rules.sections.safetyStatement.item2') },
                { id: 3, text: t('rules.sections.safetyStatement.item3') },
            ],
        },
    ];

    return (
        <GradientBorder isHighLevel={isHighLevel}>
            <div
                className={cn(
                    'flex flex-col gap-4 p-3.75',
                    isHighLevel ? 'bg-linear-to-b from-[#02332B] to-[#060B0C]' : 'bg-surface-1',
                )}
            >
                {/* 头部 */}
                <div className="flex flex-row gap-1 items-center text-headline-sm">
                    <Image src={Icon} width={40} height={40} alt="Rule Icon" />
                    <span className={cn(isHighLevel ? 'text-neutral-white-h' : 'text-filltext-ft-h')}>
                        {t('rules.title')}
                    </span>
                </div>
                {/* 内容 */}
                {rules.map((rule) => (
                    <RuleCard isHighLevel={isHighLevel} key={rule.id} title={rule.title} items={rule.items} />
                ))}
            </div>
        </GradientBorder>
    );
};
