'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type FC, useCallback, useEffect, useState } from 'react';
import { ClaimWorldCupPassRewardInterface, UnlockWorldCupPassPremiumInterface } from '@/api/handlers/world-cup-pass';
import type { WorldCupPassClaimRequest, WorldCupPassUnlockPremiumRequest } from '@/api/models/world-cup-pass';
import { ArrowLeft } from '@/components/icons';
import { Toast } from '@/components/toast';
import { useIsDesktop } from '@/hooks/use-media-query';
import { usePathname, useRouter } from '@/i18n';
import { useIsLogin } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { ClaimSuccessModal, type WorldCupPassClaimedRewardItem } from './components/ClaimSuccessModal';
import { HeaderView } from './components/HeaderView';
import { LevelView } from './components/LevelView';
import { MissionView } from './components/MissionView';
import { PassUnavailableModal, type PassUnavailableStatus } from './components/PassUnavailableModal';
import { PaymentModal, type Status } from './components/PaymentModal';
import { RewardView } from './components/RewardView';
import { RuleView } from './components/RuleView';
import { UnlockView } from './components/UnlockView';
import { usePassInfo } from './hooks/usePassInfo';
import { usePassMissions } from './hooks/usePassMissions';
import { usePassPricing } from './hooks/usePassPricing';
import { usePassRewards } from './hooks/usePassRewards';

const getInitialUnlockPremiumPaymentStatus = (hasSufficientBalance: boolean): Status =>
    hasSufficientBalance ? 'confirm' : 'insufficient';

/**
 * 通行证
 */
export const WorldCup2026PassView: FC = () => {
    const tCommon = useTranslations('common');
    const t = useTranslations('promotionWorldCupPass');
    const isDesktop = useIsDesktop();
    const pathname = usePathname();
    const router = useRouter();
    const queryClient = useQueryClient();
    const isLogin = useIsLogin();
    const openLoginModal = useUIStore((state) => state.openLoginModal);
    const [unlockPremiumPaymentVisible, setUnlockPremiumPaymentVisible] = useState(false);
    const [unlockPremiumPaymentStatus, setUnlockPremiumPaymentStatus] = useState<Status>('confirm');
    const [claimedRewards, setClaimedRewards] = useState<WorldCupPassClaimedRewardItem[]>([]);
    const [claimSuccessVisible, setClaimSuccessVisible] = useState(false);
    const [passUnavailableDismissed, setPassUnavailableDismissed] = useState(false);
    const { activityId, passInfoQueryKey, data, isPassNotStarted, isPassUnavailable } = usePassInfo();
    const isHighLevel = data ? Boolean(data.isUnlockPremium) : false;
    const {
        hasSufficientBalance,
        balanceText,
        premiumPriceText,
        discountPriceText,
        unlockPremiumPriceText,
        unlockPremiumPriceValue,
    } = usePassPricing({ data });
    const { dailyMissions, weeklyMissions } = usePassMissions({ data });
    const { rewardTracks, canClaimAll, getClaimedRewardItems } = usePassRewards({ data, isHighLevel });
    const { mutate: unlockPremium, isPending: isUnlockingPremium } = useMutation({
        mutationFn: (params: WorldCupPassUnlockPremiumRequest) => UnlockWorldCupPassPremiumInterface(params),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: passInfoQueryKey });
            setUnlockPremiumPaymentStatus('success');
        },
        onError: async (error: Error) => {
            await queryClient.invalidateQueries({ queryKey: passInfoQueryKey });
            setUnlockPremiumPaymentStatus(getInitialUnlockPremiumPaymentStatus(hasSufficientBalance));
            Toast.error(error.message || tCommon('message.error'), { id: 'world-cup-pass-unlock' });
        },
    });
    const passUnavailableVisible = isPassUnavailable && !passUnavailableDismissed;
    const promotionListPath = pathname.startsWith('/casino/promotions') ? '/casino/promotions' : '/sports/promotions';
    const passUnavailableTitle = isPassNotStarted ? t('eventNotStarted.title') : t('eventEnded.title');
    const passUnavailableDescription = isPassNotStarted
        ? t('eventNotStarted.description')
        : t('eventEnded.description');
    const passUnavailableConfirmLabel = isPassNotStarted ? t('eventNotStarted.confirm') : t('eventEnded.confirm');
    const passUnavailableStatus: PassUnavailableStatus = isPassNotStarted ? 'notStarted' : 'ended';

    const { mutate: claimReward, isPending: isClaiming } = useMutation({
        mutationFn: (params: WorldCupPassClaimRequest) => ClaimWorldCupPassRewardInterface(params),
        onSuccess: async (_response, params) => {
            const rewards = getClaimedRewardItems(params);

            if (rewards.length > 0) {
                setClaimedRewards(rewards);
                setClaimSuccessVisible(true);
            }

            await queryClient.invalidateQueries({ queryKey: passInfoQueryKey });
        },
        onError: async (error: Error) => {
            Toast.error(error.message || tCommon('message.error'), { id: 'world-cup-pass-claim' });
            await queryClient.invalidateQueries({ queryKey: passInfoQueryKey });
        },
    });

    useEffect(() => {
        if (!unlockPremiumPaymentVisible) {
            return;
        }

        if (unlockPremiumPaymentStatus === 'processing' || unlockPremiumPaymentStatus === 'success') {
            return;
        }

        setUnlockPremiumPaymentStatus(getInitialUnlockPremiumPaymentStatus(hasSufficientBalance));
    }, [hasSufficientBalance, unlockPremiumPaymentStatus, unlockPremiumPaymentVisible]);

    /** 未登录时统一弹出登录框，已登录时允许继续执行当前交互。 */
    const allowAuthenticatedInteraction = useCallback((): boolean => {
        if (isPassUnavailable) {
            setPassUnavailableDismissed(false);
            return false;
        }

        if (!isLogin) {
            openLoginModal();
            return false;
        }

        return true;
    }, [isLogin, isPassUnavailable, openLoginModal]);

    /** 仅在登录后执行需要鉴权的交互动作。 */
    const runWhenLoggedIn = useCallback(
        (action: () => void): void => {
            if (!allowAuthenticatedInteraction()) {
                return;
            }

            action();
        },
        [allowAuthenticatedInteraction],
    );

    const openUnlockPremiumPaymentModal = (): void => {
        setUnlockPremiumPaymentStatus(getInitialUnlockPremiumPaymentStatus(hasSufficientBalance));
        setUnlockPremiumPaymentVisible(true);
    };

    const closeUnlockPremiumPaymentModal = (): void => {
        if (unlockPremiumPaymentStatus === 'processing') {
            return;
        }

        setUnlockPremiumPaymentVisible(false);
        setUnlockPremiumPaymentStatus(getInitialUnlockPremiumPaymentStatus(hasSufficientBalance));
    };

    /** 活动不可用弹窗确认后返回对应业务线的活动列表。 */
    const confirmPassUnavailable = (): void => {
        setPassUnavailableDismissed(true);
        router.push(promotionListPath);
    };

    return (
        <div className="px-4 py-6 max-md:p-2 max-md:pb-6">
            {!isDesktop && (
                <div className="sticky top-2 z-10 h-0 w-fit pl-2">
                    <button
                        type="button"
                        onClick={() => router.push(promotionListPath)}
                        className="flex size-7.5 translate-y-2 cursor-pointer items-center justify-center rounded-full bg-surface-1 shadow-sm"
                    >
                        <ArrowLeft className="size-3 text-filltext-ft-e transition-colors" />
                    </button>
                </div>
            )}
            <div className="rounded-md overflow-hidden">
                <HeaderView startTime={data?.startTime} endTime={data?.endTime} />
                <div className="w-full bg-linear-to-b from-[#011F17] to-[#02674E] flex flex-col gap-5.5 px-4 pb-4 max-md:px-2">
                    {data && (
                        <>
                            <LevelView
                                isHighLevel={isHighLevel}
                                data={{
                                    level: data.level ?? 1,
                                    currentXP: data.exp ?? 0,
                                    totalXP: data.expUp ?? 0,
                                    weeklyProgress: data.expWeek ?? 0,
                                    weeklyLimit: data.expWeekLimit,
                                    weeklyLimitUnlockTime: data.expWeekUnlockTime,
                                }}
                            />
                            <RewardView
                                isHighLevel={isHighLevel}
                                currentLevel={data.level ?? 0}
                                rewardTracks={rewardTracks}
                                isClaiming={isClaiming}
                                canClaimAll={canClaimAll}
                                onRequireLogin={allowAuthenticatedInteraction}
                                onClaimReward={(level, type) => {
                                    runWhenLoggedIn(() => {
                                        claimReward({
                                            activityId,
                                            level,
                                            type,
                                        });
                                    });
                                }}
                                onClaimAll={() => {
                                    runWhenLoggedIn(() => {
                                        if (!canClaimAll) return;

                                        claimReward({
                                            activityId,
                                        });
                                    });
                                }}
                            />
                            {!isHighLevel && (
                                <UnlockView
                                    premiumPrice={premiumPriceText}
                                    discountPrice={discountPriceText}
                                    isDiscount={data.isDiscount}
                                    isUnlocking={isUnlockingPremium}
                                    onUnlockPremium={() => {
                                        runWhenLoggedIn(() => {
                                            openUnlockPremiumPaymentModal();
                                        });
                                    }}
                                />
                            )}
                            <MissionView
                                isHighLevel={isHighLevel}
                                dailyMissions={dailyMissions}
                                weeklyMissions={weeklyMissions}
                                onRequireLogin={allowAuthenticatedInteraction}
                            />
                        </>
                    )}
                    <RuleView isHighLevel={isHighLevel} />
                </div>
            </div>
            <PaymentModal
                visible={unlockPremiumPaymentVisible}
                status={unlockPremiumPaymentStatus}
                balanceText={balanceText}
                purchaseAmountText={unlockPremiumPriceText}
                onClose={closeUnlockPremiumPaymentModal}
                onConfirm={() => {
                    runWhenLoggedIn(() => {
                        setUnlockPremiumPaymentStatus('processing');
                        unlockPremium({
                            activityId,
                            price: unlockPremiumPriceValue,
                        });
                    });
                }}
                onDeposit={() => {
                    runWhenLoggedIn(() => {
                        closeUnlockPremiumPaymentModal();
                        router.push('/account/deposit');
                    });
                }}
                onSuccessAction={() => {
                    runWhenLoggedIn(() => {
                        closeUnlockPremiumPaymentModal();
                    });
                }}
            />
            <ClaimSuccessModal
                visible={claimSuccessVisible}
                rewards={claimedRewards}
                onClose={() => {
                    setClaimSuccessVisible(false);
                    setClaimedRewards([]);
                }}
            />
            <PassUnavailableModal
                visible={passUnavailableVisible}
                status={passUnavailableStatus}
                title={passUnavailableTitle}
                description={passUnavailableDescription}
                confirmLabel={passUnavailableConfirmLabel}
                onConfirm={confirmPassUnavailable}
            />
        </div>
    );
};
