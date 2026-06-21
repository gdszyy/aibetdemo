import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import type { WorldCupPassType } from '@/api/models/world-cup-pass';
import { cn } from '@/utils/common';
import TopIcon from '../../assets/reward-track.png';
import type { RewardTrackItem } from '../../constants';
import { GradientBorder } from '../GradientBorder';
import { LevelReward } from './components/LevelReward';
import { PremiumPass } from './components/PremiumPass';
import { useProgressView } from './hooks/use-progress-view';

/**
 * 奖励
 */
export const RewardView: FC<{
    isHighLevel: boolean;
    currentLevel: number;
    rewardTracks: RewardTrackItem[];
    onClaimReward: (level: number, type: WorldCupPassType) => void;
    onClaimAll: () => void;
    isClaiming: boolean;
    canClaimAll: boolean;
    /** 未登录时阻止交互并弹出登录框 */
    onRequireLogin: () => boolean;
}> = ({
    isHighLevel,
    currentLevel,
    rewardTracks,
    onClaimReward,
    onClaimAll,
    isClaiming,
    canClaimAll,
    onRequireLogin,
}) => {
    const t = useTranslations('promotionWorldCupPass');
    const maxRewardLevel = rewardTracks.at(-1)?.level;
    const {
        scrollContainerRef,
        scrollbarTrackRef,
        currentLevelItemRef,
        scrollbarThumbWidthPercent,
        scrollbarThumbLeftPercent,
        isDraggingScrollbar,
        showCurrentLevel,
        showBackToCurrentLevel,
        currentTrackLevel,
        handleBackToCurrentLevel,
        handleScrollbarPointerDown,
    } = useProgressView({ currentLevel, rewardTracks });

    return (
        <GradientBorder isHighLevel={isHighLevel}>
            <div
                className={cn(
                    'flex flex-col p-3.75 pr-0 gap-4',
                    isHighLevel ? 'bg-linear-to-b from-[#02332B] to-[#060B0C]' : 'bg-surface-1',
                )}
            >
                <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0 pr-3.75">
                    <div className="flex flex-row gap-1 items-center text-headline-sm">
                        <Image src={TopIcon.src} width={40} height={40} alt="Rule Icon" />
                        <span className={cn(isHighLevel ? 'text-neutral-white-h' : 'text-filltext-ft-h')}>
                            {t('progress.title')}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            if (!onRequireLogin()) {
                                return;
                            }

                            onClaimAll();
                        }}
                        disabled={isClaiming || !canClaimAll}
                        className={cn(
                            'flex justify-center items-center rounded-full w-40 h-10 text-body-lg text-neutral-white-h',
                            isHighLevel ? 'bg-[#009655]' : 'bg-brand-primary-0',
                            isClaiming || !canClaimAll
                                ? 'opacity-60'
                                : isHighLevel
                                  ? 'hover:bg-[#007F48] active:bg-[#007F48]'
                                  : 'hover:bg-brand-primary-4 active:bg-brand-primary-4',
                        )}
                    >
                        {t('progress.claimAll')}
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row">
                        <PremiumPass
                            isHighLevel={isHighLevel}
                            className="sticky left-0 pr-3 z-10"
                            currentLevel={currentTrackLevel}
                            showCurrentLevel={showCurrentLevel}
                        />
                        <div
                            ref={scrollContainerRef}
                            className="flex flex-row pr-3.75 overflow-x-scroll overscroll-x-none overflow-y-hidden scrollbar-hide"
                        >
                            {rewardTracks.map((rewardTrack) => (
                                <div
                                    key={rewardTrack.level}
                                    ref={rewardTrack.level === currentTrackLevel ? currentLevelItemRef : undefined}
                                >
                                    <LevelReward
                                        isHighLevel={isHighLevel}
                                        rewardTrack={rewardTrack}
                                        isMaxLevel={rewardTrack.level === maxRewardLevel}
                                        curLevel={currentLevel}
                                        isNormalReward={Boolean(rewardTrack.normalReward)}
                                        isHighLevelReward={Boolean(rewardTrack.premiumReward)}
                                        onClaimReward={onClaimReward}
                                        onRequireLogin={onRequireLogin}
                                        isClaiming={isClaiming}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pr-3.75">
                        <div
                            ref={scrollbarTrackRef}
                            onPointerDown={handleScrollbarPointerDown}
                            className={cn(
                                'relative h-2 w-full rounded-full overflow-hidden touch-none select-none cursor-pointer',
                                isHighLevel ? 'bg-filltext-ft-c' : 'bg-filltext-ft-c',
                                isDraggingScrollbar && 'cursor-grabbing',
                            )}
                        >
                            <div
                                className={cn(
                                    'absolute top-0 h-full rounded-full cursor-grab',
                                    isHighLevel ? 'bg-[#009655]' : 'bg-filltext-ft-d',
                                    isDraggingScrollbar && 'cursor-grabbing',
                                )}
                                style={{
                                    left: `${scrollbarThumbLeftPercent}%`,
                                    width: `${scrollbarThumbWidthPercent}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div
                    className={cn(
                        'overflow-hidden pr-3.75 transition-[max-height,opacity,transform] duration-500 ease-out',
                        showBackToCurrentLevel
                            ? 'max-h-10 opacity-100 translate-y-0'
                            : 'max-h-0 opacity-0 -translate-y-2',
                    )}
                >
                    <div className="flex flex-row justify-end max-md:justify-start">
                        <button
                            type="button"
                            onClick={() => {
                                if (!onRequireLogin()) {
                                    return;
                                }

                                handleBackToCurrentLevel();
                            }}
                            className={cn(
                                'flex items-center px-4 rounded-sm h-10 text-body-lg text-neutral-white-h transition-opacity duration-500',
                                isHighLevel
                                    ? 'bg-[#009655] hover:bg-[#007F48] active:bg-[#007F48]'
                                    : 'bg-brand-primary-0 hover:bg-brand-primary-4 active:bg-brand-primary-4',
                                !showBackToCurrentLevel && 'pointer-events-none',
                            )}
                        >
                            {t('progress.backToCurrentLevel')}
                        </button>
                    </div>
                </div>
            </div>
        </GradientBorder>
    );
};
