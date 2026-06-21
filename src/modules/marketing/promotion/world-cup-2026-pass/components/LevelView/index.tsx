import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { InfinityOutlined } from '@/components/icons2/InfinityOutlined';
import { QuestionCircleOutlined } from '@/components/icons2/QuestionCircleOutlined';
import { QuestionTooltip } from '@/components/question-tooltip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { cn } from '@/utils/common';
import level_1_10 from '../../assets/level-1-10.png';
import level_11_20 from '../../assets/level-11-20.png';
import level_21_30 from '../../assets/level-21-30.png';
import level_31_40 from '../../assets/level-31-40.png';
import level_41_50 from '../../assets/level-41-50.png';
import level_51_60 from '../../assets/level-51-60.png';
import level_61_70 from '../../assets/level-61-70.png';
import level_71_80 from '../../assets/level-71-80.png';
import level_81_90 from '../../assets/level-81-90.png';
import level_91_100 from '../../assets/level-91-100.png';
import { GradientBorder } from '../GradientBorder';
import { ProgressBar } from '../ProgressBar';

const levelDict = [
    {
        min: 1,
        max: 10,
        src: level_1_10.src,
        className: cn('bg-[linear-gradient(180deg,#929091_26.79%,#4B494A_74.37%)]'),
    },
    {
        min: 11,
        max: 20,
        src: level_11_20.src,
        className: cn('bg-[linear-gradient(180deg,#7C7A62_26.79%,#514C38_74.37%)]'),
    },
    {
        min: 21,
        max: 30,
        src: level_21_30.src,
        className: cn('bg-[linear-gradient(180deg,#92644D_26.79%,#5B301F_74.37%)]'),
    },
    {
        min: 31,
        max: 40,
        src: level_31_40.src,
        className: cn('bg-[linear-gradient(180deg,#C1CEDF_26.79%,#5C6D87_74.37%)]'),
    },
    {
        min: 41,
        max: 50,
        src: level_41_50.src,
        className: cn('bg-[linear-gradient(180deg,#D09D4C_26.79%,#A56116_74.37%)]'),
    },
    {
        min: 51,
        max: 60,
        src: level_51_60.src,
        className: cn('bg-[linear-gradient(180deg,#CCE3F5_26.79%,#688EBF_74.37%)]'),
    },
    {
        min: 61,
        max: 70,
        src: level_61_70.src,
        className: cn('bg-[linear-gradient(180deg,#D7D7FF_26.79%,#8F95FF_74.37%)]'),
    },
    {
        min: 71,
        max: 80,
        src: level_71_80.src,
        className: cn('bg-[linear-gradient(180deg,#9F8BEC_26.79%,#5D43C2_74.37%)]'),
    },
    {
        min: 81,
        max: 90,
        src: level_81_90.src,
        className: cn('bg-[linear-gradient(180deg,#B5BBD1_26.79%,#3F4863_74.37%)]'),
    },
    {
        min: 91,
        max: 100,
        src: level_91_100.src,
        className: cn('bg-[linear-gradient(180deg,#FFE0EA_26.79%,#C8002C_74.37%)]'),
    },
];

const LevelIcon: FC<{ level: number }> = ({ level }) => {
    let levelSrc: string;
    const levelData = levelDict.find((l) => level >= l.min && level <= l.max);
    if (levelData) {
        levelSrc = levelData.src;
    } else {
        levelSrc = level_1_10.src;
    }

    // 字体样式
    const fontStyle =
        levelData?.className ||
        cn(
            // 文字渐变
            'bg-clip-text text-transparent bg-[linear-gradient(180deg,#929091_26.79%,#4B494A_74.37%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]',
            // 文字阴影
            'drop-shadow-[0px_0.2px_0px_0px_#302F2F]',
        );

    return (
        <div className="relative flex justify-center items-end w-12 h-full">
            <Image src={levelSrc} alt="Level Icon" width={48} height={48} />
            <div
                className={cn(
                    'absolute w-full top-2.5',
                    level === 100 ? 'text-[10px]' : 'text-[13px]',
                    'font-rowdies font-normal leading-7 text-center',
                    // 文字渐变
                    'bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]',
                    // 根据等级不同的字体颜色
                    fontStyle,
                    // 文字阴影
                    'drop-shadow-[0px_0.2px_0px_0px_#302F2F]',
                )}
            >
                {level}
            </div>
        </div>
    );
};

type LevelProps = {
    isHighLevel: boolean;
    data: {
        level: number;
        totalXP: number;
        currentXP: number;
        weeklyLimit: number;
        weeklyProgress: number;
        weeklyLimitUnlockTime: number;
    };
};

/**
 * 等级
 */
export const LevelView: FC<LevelProps> = ({ isHighLevel, data }) => {
    const { formatDatetime, formatNumber } = useIntlFormatter();
    const t = useTranslations('promotionWorldCupPass');
    const weeklyLimitRemovedText = t('level.weeklyLimitRemoved', {
        time: formatDatetime(new Date(data.weeklyLimitUnlockTime * 1000)),
    });
    const isUnlimitedWeeklyLimit = data.weeklyLimit < 0;

    return (
        <GradientBorder isHighLevel={isHighLevel}>
            <div
                className={cn(
                    'flex flex-col gap-2 px-3.75 py-1.75',
                    isHighLevel ? 'bg-linear-to-b from-[#02332B] to-[#060B0C]' : 'bg-surface-1',
                )}
            >
                <div className="flex flex-row gap-4 h-12 leading-12">
                    <LevelIcon level={data.level} />
                    <div
                        className={cn(
                            isHighLevel
                                ? 'h-12 text-headline-md leading-12 text-[#66FDCE]'
                                : 'h-12 text-headline-md leading-12 text-filltext-ft-h',
                        )}
                    >
                        LV{data.level}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    {/* Current XP */}
                    <div className="flex flex-row justify-between">
                        <div className={cn('text-body-lg', isHighLevel ? 'text-[#00D492]' : 'text-filltext-ft-h')}>
                            {t('level.current')}
                        </div>
                        <div className="flex flex-row gap-1">
                            <span className={cn('text-body-lg', isHighLevel ? 'text-[#00D492]' : 'text-filltext-ft-h')}>
                                {formatNumber(data.currentXP)}
                            </span>
                            <span
                                className={cn(
                                    'text-body-md',
                                    isHighLevel ? 'text-filltext-ft-f' : 'text-filltext-ft-f',
                                )}
                            >
                                / {formatNumber(data.totalXP)} XP
                            </span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <ProgressBar
                        size="medium"
                        current={data.currentXP}
                        total={data.totalXP}
                        isHighLevel={isHighLevel}
                    />
                    {/* Weekly Limit */}
                    <div className="flex flex-row justify-between h-7 leading-7">
                        <div className="flex items-center gap-1 text-body-sm text-filltext-ft-e leading-7">
                            <span>{t('level.weeklyLimit')}</span>
                            <QuestionTooltip
                                title={t('level.weeklyLimit')}
                                content={weeklyLimitRemovedText}
                                hideTitle
                                side="bottom"
                                icon={QuestionCircleOutlined}
                            />
                        </div>
                        <div className="flex items-center text-body-md text-filltext-ft-f leading-7">
                            {formatNumber(data.weeklyProgress)} /{' '}
                            {isUnlimitedWeeklyLimit ? (
                                <InfinityOutlined className="mx-2 h-4 w-4" />
                            ) : (
                                formatNumber(data.weeklyLimit)
                            )}{' '}
                            XP
                        </div>
                    </div>
                </div>
            </div>
        </GradientBorder>
    );
};
