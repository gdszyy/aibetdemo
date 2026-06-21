import Image from 'next/image';
import type { FC } from 'react';
import { WorldCupPassMissionStatus } from '@/api/models/world-cup-pass';
import { Right } from '@/components/icons2/Right';
import { cn } from '@/utils/common';
import Icon from '../../assets/exp.svg';
import HighLevelIcon from '../../assets/high-level-exp.svg';
import { ProgressBar } from '../ProgressBar';

interface MissionItemProps {
    isHighLevel: boolean;
    options: {
        title: string;
        description: string;
        current: number;
        total: number;
        currentText?: string;
        totalText?: string;
        unit: string;
        exp: number;
        status: WorldCupPassMissionStatus;
    };
}

/** 任务项 */
export const MissionItem: FC<MissionItemProps> = ({ isHighLevel, options }) => {
    const { title, description, current, total, currentText, totalText, unit, exp, status } = options;
    const isCompleted = status === WorldCupPassMissionStatus.Claimed || (total > 0 && current >= total);

    return (
        <div
            className={cn(
                'rounded-sm overflow-hidden gap-4 flex',
                isHighLevel ? 'bg-linear-to-b from-[#02332B] to-[#060B0C]' : 'bg-filltext-ft-a',
            )}
        >
            <div
                className={cn(
                    'p-2 flex w-full gap-4',
                    isCompleted ? (isHighLevel ? 'bg-neutral-white-d' : 'bg-neutral-black-c') : '',
                )}
            >
                <div className="flex-1 flex flex-col gap-1">
                    <div className="flex flex-col">
                        <div
                            className={cn(
                                'flex items-center gap-2 text-body-lg',
                                isHighLevel ? 'text-neutral-white-h' : 'text-filltext-ft-h',
                            )}
                        >
                            <span>{title}</span>
                            {isCompleted && <Right className="size-4 shrink-0" />}
                        </div>
                        <div
                            className={cn(
                                'text-auxiliary-sm',
                                isHighLevel ? 'text-filltext-ft-e' : 'text-filltext-ft-e',
                            )}
                        >
                            {description}
                        </div>
                    </div>
                    <ProgressBar size="small" current={current} total={total} isHighLevel={isHighLevel} />
                    <div className="flex justify-end gap-1">
                        <span
                            className={cn('text-auxiliary-md', isHighLevel ? 'text-[#00D492]' : 'text-filltext-ft-h')}
                        >
                            {currentText ?? current}
                        </span>
                        <span className="text-auxiliary-sm text-filltext-ft-f">
                            / {totalText ?? total} {unit}
                        </span>
                    </div>
                </div>
                <div className="w-13.5 h-full flex justify-center items-center">
                    <div className="w-13.5 h-13.5 relative">
                        <Image
                            className="m-auto"
                            src={isHighLevel ? HighLevelIcon : Icon}
                            alt="EXP Icon"
                            width={48}
                            height={54}
                        />
                        <div
                            className={cn(
                                'absolute bottom-6 w-full font-poppins font-black italic text-[12.44px] leading-[12.44px] text-center',
                                // 文字渐变
                                isHighLevel
                                    ? 'bg-clip-text text-transparent bg-[linear-gradient(90deg,#7EFF70_0%,#E6FFD6_50%,#7EFF70_100%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'
                                    : 'bg-clip-text text-transparent bg-[linear-gradient(90deg,#FF9191_0%,#FFECEC_50%,#FF9191_100%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]',
                                // 文字阴影
                                isHighLevel
                                    ? 'drop-shadow-[0px_0.4px_0px_0px_rgba(0,0,0,0.25)]'
                                    : 'drop-shadow-[0_0_5.943px_0_#9F0000,0_0_9.6px_0_#F00_inset]',
                            )}
                        >
                            {exp}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
