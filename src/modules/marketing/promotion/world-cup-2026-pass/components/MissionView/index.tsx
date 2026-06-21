import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type FC, useState } from 'react';
import { useIsMobile } from '@/hooks/use-media-query';
import { cn } from '@/utils/common';
import Icon from '../../assets/mission.svg';
import type { MissionCardItem } from '../../constants';
import { GradientBorder } from '../GradientBorder';
import { MissionItem } from '../MissionItem';

type MissionTabValue = 'daily' | 'weekly';

const MissionCard: FC<{
    isHighLevel: boolean;
    title?: string;
    items: MissionCardItem[];
}> = ({ isHighLevel, title, items }) => {
    return (
        <div className={cn('flex flex-col gap-2')}>
            {title && (
                <div className="h-7.25 flex flex-row gap-1 items-center">
                    <i className={cn('h-5 w-1 rounded-full', isHighLevel ? 'bg-[#00D492]' : 'bg-brand-primary-0')} />
                    <span className={cn('text-title-sm', isHighLevel ? 'text-neutral-white-h' : 'text-filltext-ft-h')}>
                        {title}
                    </span>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-3.25">
                {items.map((item) => (
                    <MissionItem key={item.id} isHighLevel={isHighLevel} options={item} />
                ))}
            </div>
        </div>
    );
};

/**
 * 任务
 */
export const MissionView: FC<{
    isHighLevel: boolean;
    dailyMissions: MissionCardItem[];
    weeklyMissions: MissionCardItem[];
    /** 未登录时阻止交互并弹出登录框 */
    onRequireLogin: () => boolean;
}> = ({ isHighLevel, dailyMissions, weeklyMissions, onRequireLogin }) => {
    const t = useTranslations('promotionWorldCupPass');
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<MissionTabValue>('daily');
    const activeMissions = activeTab === 'daily' ? dailyMissions : weeklyMissions;
    /** 切换任务页签前先统一检查登录态。 */
    const handleTabChange = (tab: MissionTabValue): void => {
        if (!onRequireLogin()) {
            return;
        }

        setActiveTab(tab);
    };

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
                        {t('missions.title')}
                    </span>
                </div>
                {/* 内容 */}
                <div className={cn('flex flex-col gap-4')}>
                    {isMobile ? (
                        isHighLevel ? (
                            <>
                                <div className="flex gap-4">
                                    {activeTab === 'daily' ? (
                                        <GradientBorder radius={8} borderWidth={0.5} isHighLevel={true}>
                                            <button
                                                type="button"
                                                onClick={() => handleTabChange('daily')}
                                                className={cn(
                                                    'px-4 h-9.75 text-body-md',
                                                    'text-neutral-white-h',
                                                    'bg-[linear-gradient(0deg,#060B0C_0%,#02332B_100%)]',
                                                )}
                                            >
                                                {t('missions.dailyTitle')}
                                            </button>
                                        </GradientBorder>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleTabChange('daily')}
                                            className={cn(
                                                'px-4 h-10 rounded-sm border-[0.5px] text-body-md',
                                                'border-filltext-ft-a text-neutral-white-h',
                                            )}
                                        >
                                            {t('missions.dailyTitle')}
                                        </button>
                                    )}

                                    {activeTab === 'weekly' ? (
                                        <GradientBorder radius={8} borderWidth={0.5} isHighLevel={true}>
                                            <button
                                                type="button"
                                                onClick={() => handleTabChange('weekly')}
                                                className={cn(
                                                    'px-4 h-9.75 text-body-md',
                                                    'text-neutral-white-h',
                                                    'bg-[linear-gradient(0deg,#060B0C_0%,#02332B_100%)]',
                                                )}
                                            >
                                                {t('missions.weeklyTitle')}
                                            </button>
                                        </GradientBorder>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleTabChange('weekly')}
                                            className={cn(
                                                'px-4 h-10 rounded-sm border-[0.5px] text-body-md',
                                                'border-filltext-ft-a text-neutral-white-h',
                                            )}
                                        >
                                            {t('missions.weeklyTitle')}
                                        </button>
                                    )}
                                </div>
                                <MissionCard isHighLevel={isHighLevel} items={activeMissions} />
                            </>
                        ) : (
                            <>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleTabChange('daily')}
                                        className={cn(
                                            'px-4 py-2 rounded-sm border-[0.5px] text-body-md',
                                            activeTab === 'daily'
                                                ? 'border-brand-primary-0 bg-surface-1 text-brand-primary-0'
                                                : 'border-transparent bg-filltext-ft-a text-filltext-ft-e',
                                        )}
                                    >
                                        {t('missions.dailyTitle')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTabChange('weekly')}
                                        className={cn(
                                            'px-4 py-2 rounded-sm border-[0.5px] text-body-md',
                                            activeTab === 'weekly'
                                                ? 'border-brand-primary-0 bg-surface-1 text-brand-primary-0'
                                                : 'border-transparent bg-filltext-ft-a text-filltext-ft-e',
                                        )}
                                    >
                                        {t('missions.weeklyTitle')}
                                    </button>
                                </div>
                                <MissionCard isHighLevel={isHighLevel} items={activeMissions} />
                            </>
                        )
                    ) : (
                        <>
                            {/* Daily Missions */}
                            <MissionCard
                                isHighLevel={isHighLevel}
                                title={t('missions.dailyTitle')}
                                items={dailyMissions}
                            />
                            {/* Weekly Missions */}
                            <MissionCard
                                isHighLevel={isHighLevel}
                                title={t('missions.weeklyTitle')}
                                items={weeklyMissions}
                            />
                        </>
                    )}
                </div>
            </div>
        </GradientBorder>
    );
};
