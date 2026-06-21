'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { FC } from 'react';
import { APP_NAME } from '@/constants';
import { useRegionCode } from '@/stores/region-store';
import { CHAMPION_HANDICAP_TERM_GROUPS, type ChampionHandicapTermGroup } from './_constants/data';
import { useChampionHandicapTranslationValues } from './_constants/region';
import { formatChampionHandicapRewardDeadline } from './_utils/time';

interface ChampionHandicapTermsSectionProps {
    groups?: ChampionHandicapTermGroup[];
}

/** 冠军盘条款分组展示组件。 */
const ChampionHandicapTermGroupSection: FC<{
    group: ChampionHandicapTermGroup;
    messageValues: Record<string, string>;
}> = ({ group, messageValues }) => {
    const t = useTranslations('promotion');

    return (
        <section className="flex flex-col gap-3.5">
            <div className="rounded-xs bg-(--ch-green) px-4 py-2">
                <h2 className="text-title-sm text-white">{t(group.titleKey, messageValues)}</h2>
            </div>
            <div className="flex flex-col gap-3.5 p-1">
                {group.items.map((item) => (
                    <div key={item.id} className="flex gap-2">
                        <span className="shrink-0 text-body-lg leading-none text-filltext-ft-g">•</span>
                        <div className="space-y-1">
                            <p className="text-body-lg text-filltext-ft-g">{t(item.titleKey, messageValues)}</p>
                            {item.descriptionKey && (
                                <p className="text-body-sm text-filltext-ft-g">
                                    {t(item.descriptionKey, messageValues)}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

/** 冠军盘活动条款区域。 */
export const ChampionHandicapTermsSection: FC<ChampionHandicapTermsSectionProps> = ({
    groups = CHAMPION_HANDICAP_TERM_GROUPS,
}) => {
    const locale = useLocale();
    const regionCode = useRegionCode();
    const translationValues = useChampionHandicapTranslationValues();
    const rewardDeadline = formatChampionHandicapRewardDeadline(locale, regionCode);

    if (groups.length === 0) {
        return null;
    }

    const messageValues = {
        appName: APP_NAME,
        deadline: rewardDeadline,
        ...translationValues,
    };

    return (
        <section className="w-full py-4 pb-8">
            <div className="mx-auto w-full max-w-[1000px] flex flex-col gap-10 px-4 md:px-8">
                {groups.map((group) => (
                    <ChampionHandicapTermGroupSection key={group.id} group={group} messageValues={messageValues} />
                ))}
            </div>
        </section>
    );
};
