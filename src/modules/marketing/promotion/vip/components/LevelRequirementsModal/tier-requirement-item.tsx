'use client';

import Image, { type StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import { Accordion } from 'radix-ui';
import { type FC, Fragment } from 'react';
import type { VipTierInfo } from '@/api/models/vip';
import { ArrowDown } from '@/components/icons';
import { cn } from '@/utils/common';
import { LevelRequirementRow } from './level-requirement-row';

interface TierRequirementItemProps {
    tier: VipTierInfo;
    value: string;
    icon?: StaticImageData;
}

const renderMobileSpaceBreakLabel = (label: string) => {
    const words = label.trim().split(/\s+/);

    return words.map((word, index) => (
        <Fragment key={`${word}`}>
            {index > 0 ? (
                <>
                    <span className="max-md:hidden"> </span>
                    <br className="hidden max-md:block" />
                </>
            ) : null}
            {word}
        </Fragment>
    ));
};

/**
 * VIP 段位需求项。
 */
export const TierRequirementItem: FC<TierRequirementItemProps> = ({ tier, value, icon }) => {
    const t = useTranslations('vip');

    return (
        <Accordion.Item className="overflow-hidden rounded-sm bg-filltext-ft-a" value={value}>
            <Accordion.Header asChild>
                <div>
                    <Accordion.Trigger
                        className={cn(
                            'group flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left transition-colors hover:bg-filltext-ft-b',
                        )}
                    >
                        <span className="flex min-w-0 items-center gap-1">
                            {icon && (
                                <Image
                                    className="size-10 shrink-0"
                                    src={icon}
                                    alt=""
                                    width={32}
                                    height={32}
                                    aria-hidden
                                    unoptimized
                                />
                            )}
                            <span className="min-w-0 ">
                                <span className="text-body-lg font-poppins text-filltext-ft-h">{tier.tierName}</span>
                                <span className="ml-2 text-auxiliary-md font-poppins text-auxiliary-brown">
                                    {tier.tierDesc}
                                </span>
                                {/* coming soon badge */}
                                {!tier.open && (
                                    <div className="ml-3 rounded-xs bg-filltext-ft-b px-2 py-1 inline-flex items-center gap-1">
                                        <span className=" text-auxiliary-2xs font-poppins uppercase text-filltext-ft-f">
                                            {t('levelRequirements.comingSoon')}
                                        </span>
                                    </div>
                                )}
                            </span>
                        </span>
                        <ArrowDown className="size-3 shrink-0 text-filltext-ft-e transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-filltext-ft-g" />
                    </Accordion.Trigger>
                </div>
            </Accordion.Header>
            <Accordion.Content
                data-tier-requirement-content
                className="hover:bg-filltext-ft-b overflow-hidden border-filltext-ft-c border-t data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
            >
                <div className="px-5 max-md:px-2 py-4 ">
                    <div className="overflow-hidden rounded-sm bg-surface-1">
                        <div className="grid grid-cols-3 items-center bg-filltext-ft-c px-4 py-3 text-body-md font-poppins text-filltext-ft-h">
                            <span className="">{t('levelRequirements.table.level')}</span>
                            <span className="min-w-0 text-left max-md:whitespace-normal max-md:break-normal max-md:leading-tight">
                                <span className="max-md:inline-block max-md:text-center">
                                    {renderMobileSpaceBreakLabel(t('levelRequirements.table.requiredXp'))}
                                </span>
                            </span>
                            <span className="min-w-0 text-left max-md:whitespace-normal max-md:break-normal max-md:leading-tight">
                                <span className="max-md:inline-block max-md:text-center">
                                    {renderMobileSpaceBreakLabel(t('levelRequirements.table.maintenanceXp'))}
                                </span>
                            </span>
                        </div>
                        <div>
                            {tier.levels.map((level) => (
                                <LevelRequirementRow key={level.levelNo} level={level} comingSoon={!tier.open} />
                            ))}
                        </div>
                    </div>
                </div>
            </Accordion.Content>
        </Accordion.Item>
    );
};
