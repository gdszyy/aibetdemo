'use client';

import { useTranslations } from 'next-intl';
import { VisuallyHidden } from 'radix-ui';
import type { FC, PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/drawer/drawer';
import { CloseOutlined } from '@/components/icons2/CloseOutlined';
import { CustomerServiceOutlined } from '@/components/icons2/CustomerServiceOutlined';
import { Loading } from '@/components/loading/loading';
import { Toast } from '@/components/toast';
import { DomIdEnum } from '@/constants';
import { AUTH_ROUTE_PATHS } from '@/constants/auth-routes';
import { useLiveChatSession } from '@/hooks/use-live-chat-session';
import { useIsMobile } from '@/hooks/use-media-query';
import { usePathname } from '@/i18n';
import { checkIsSportsActive, checkIsSportsLiveActive } from '@/libs/navigation';
import { useSelectionCount } from '@/modules/bet-slip/stores/bet-slip-store';
import { useIsLogin } from '@/stores/session-store';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { getPortalContainer } from '@/utils/dom';

const FLOATING_IDLE_DELAY_MS = 3000;

/** 客服悬浮球触发器选择器，供充值抽屉识别允许交互的外部元素。 */
export const SUPPORT_FLOATING_TRIGGER_SELECTOR = '[data-support-floating-trigger="true"]';

/** 判断用户活动是否来自客服浮球按钮，避免点击前先触发收起位移。 */
const checkIsFloatingTriggerEvent = (event: Event): boolean => {
    const target = event.target;
    return target instanceof Element && Boolean(target.closest(SUPPORT_FLOATING_TRIGGER_SELECTOR));
};

/** Figma 悬浮客服球图标，红底白色耳机。 */
const SupportBallIcon: FC<{ className?: string }> = ({ className }) => (
    <span
        className={cn(
            'relative flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-white-h bg-brand-primary-0 text-neutral-white-h shadow-[0_2px_4px_0_var(--brand-primary-2)]',
            className,
        )}
    >
        <CustomerServiceOutlined className="size-6" />
    </span>
);

/** 移动端客服悬浮入口：已登录全站展示，未登录仅 H5 登录页展示。 */
export const SupportFloatingEntry: FC = () => {
    const t = useTranslations('user.support.floating');
    const tUser = useTranslations('user');
    const isLogin = useIsLogin();
    const isMobile = useIsMobile();
    const { isAvailable, openLiveChat } = useLiveChatSession();
    const pathname = usePathname();
    const selectionCount = useSelectionCount();
    const betSlipDrawerOpen = useUIStore((state) => state.betSlipDrawerOpen);
    const depositModalOpen = useUIStore((state) => state.depositModalOpen);
    const isSigninPage = pathname === AUTH_ROUTE_PATHS.Signin;
    const shouldShowFloating = isMobile && (isLogin || isSigninPage);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOpening, setIsOpening] = useState(false);
    const [floatingPortalContainer, setFloatingPortalContainer] = useState<HTMLElement | null>(null);
    const drawerOpenRef = useRef(false);
    const idleTimerRef = useRef<number | null>(null);
    const hasMobileBetSlipSummary =
        isMobile &&
        !betSlipDrawerOpen &&
        selectionCount > 0 &&
        (checkIsSportsActive(pathname) || checkIsSportsLiveActive(pathname));

    useEffect(() => {
        if (!shouldShowFloating) {
            drawerOpenRef.current = false;
            setDrawerOpen(false);
            setIsExpanded(false);
        }
    }, [shouldShowFloating]);

    useEffect(() => {
        setFloatingPortalContainer(getPortalContainer(DomIdEnum.ModalContainer) ?? null);
    }, []);

    useEffect(() => {
        if (!isLogin || isSigninPage) return;

        const clearIdleTimer = (): void => {
            if (idleTimerRef.current !== null) {
                window.clearTimeout(idleTimerRef.current);
                idleTimerRef.current = null;
            }
        };

        const scheduleExpanded = (): void => {
            clearIdleTimer();
            idleTimerRef.current = window.setTimeout(() => {
                setIsExpanded(true);
            }, FLOATING_IDLE_DELAY_MS);
        };

        if (drawerOpen) {
            setIsExpanded(true);
            clearIdleTimer();
            return clearIdleTimer;
        }

        const handleUserActivity = (event: Event): void => {
            if (drawerOpenRef.current) return;
            if (checkIsFloatingTriggerEvent(event)) return;
            setIsExpanded(false);
            scheduleExpanded();
        };

        const handlePointerDownActivity = (event: PointerEvent): void => {
            handleUserActivity(event);
        };

        scheduleExpanded();
        window.addEventListener('pointerdown', handlePointerDownActivity, { passive: true });
        window.addEventListener('scroll', handleUserActivity, { passive: true });
        window.addEventListener('wheel', handleUserActivity, { passive: true });
        window.addEventListener('touchmove', handleUserActivity, { passive: true });

        return () => {
            clearIdleTimer();
            window.removeEventListener('pointerdown', handlePointerDownActivity);
            window.removeEventListener('scroll', handleUserActivity);
            window.removeEventListener('wheel', handleUserActivity);
            window.removeEventListener('touchmove', handleUserActivity);
        };
    }, [drawerOpen, isLogin, isSigninPage]);

    const handleFloatingPointerDown = (event: ReactPointerEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        setIsExpanded(true);
    };

    const handleDrawerOpenChange = (open: boolean): void => {
        drawerOpenRef.current = open;
        setDrawerOpen(open);
    };

    const handleFloatingClick = (): void => {
        drawerOpenRef.current = true;
        setIsExpanded(true);
        setDrawerOpen(true);
    };

    const handleContactClick = async (): Promise<void> => {
        if (isOpening) return;

        setIsOpening(true);
        const didOpen = await openLiveChat().catch((error: unknown) => {
            if (process.env.NODE_ENV === 'development') {
                console.error('[LiveChat] open failed', error);
            }
            return false;
        });
        setIsOpening(false);

        if (didOpen) {
            handleDrawerOpenChange(false);
            return;
        }

        Toast.error(tUser('support.liveChatUnavailable'), { id: 'support-live-chat' });
    };

    const handleCloseClick = (): void => {
        handleDrawerOpenChange(false);
    };

    if (!shouldShowFloating) return null;

    /** 充值抽屉打开时会 portal 到 ModalContainer，否则留在 AppContainer 让普通抽屉盖住浮球。 */
    const floatingButton = (
        <button
            type="button"
            data-support-floating-trigger="true"
            onPointerDown={handleFloatingPointerDown}
            onClick={handleFloatingClick}
            className={cn(
                'pointer-events-auto fixed right-0 flex size-10 items-center justify-center rounded-full transition-[bottom,translate,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[bottom,translate] active:scale-95 md:hidden',
                depositModalOpen ? 'z-60' : 'z-40',
                isSigninPage
                    ? 'bottom-[calc(env(safe-area-inset-bottom)+24px)] right-3'
                    : [
                          'right-0',
                          hasMobileBetSlipSummary
                              ? 'bottom-[calc(var(--bottom-bar-safe-height,85px)+var(--mobile-cart-summary-bar-height)+20px)]'
                              : 'bottom-[calc(var(--bottom-bar-safe-height,85px)+20px)]',
                          drawerOpen || isExpanded ? '-translate-x-4' : 'translate-x-5',
                      ],
            )}
        >
            <SupportBallIcon />
            <span className="sr-only">{t('open')}</span>
        </button>
    );

    return (
        <>
            {depositModalOpen && floatingPortalContainer
                ? createPortal(floatingButton, floatingPortalContainer)
                : floatingButton}

            <Drawer open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
                <DrawerContent
                    overlayClassName="bg-black/55"
                    className={cn(
                        'mx-auto w-full max-w-[430px] border border-neutral-white-h bg-surface-1 px-4 pb-6 pt-7',
                        'rounded-t-[24px] shadow-floating',
                        '[&>div:first-child]:hidden',
                    )}
                >
                    <DrawerTitle asChild>
                        <VisuallyHidden.Root>{t('title')}</VisuallyHidden.Root>
                    </DrawerTitle>
                    <div className="absolute left-1/2 top-2 h-[5px] w-[35px] -translate-x-1/2 rounded-[30px] bg-filltext-ft-d" />

                    <div className="flex min-h-[139px] flex-col gap-[5px] bg-surface-1">
                        <div className="relative flex h-14 gap-2 border-b border-filltext-ft-b">
                            <SupportBallIcon />
                            <div className="flex h-11 min-w-0 flex-1 flex-col justify-between">
                                <div className="text-title-sm text-filltext-ft-h">{t('header')}</div>
                                <div className="flex items-center gap-1 text-body-md text-func-win">
                                    <span className="size-2.5 rounded-full bg-func-win" />
                                    <span>{t('online')}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseClick}
                                className="absolute right-0 top-0 flex size-6 items-center justify-center rounded-xs text-filltext-ft-f active:scale-95"
                            >
                                <CloseOutlined className="size-3" />
                                <span className="sr-only">{t('close')}</span>
                            </button>
                        </div>

                        <p className="flex h-[74px] items-center text-center text-body-sm text-filltext-ft-f">
                            {t('description')}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleContactClick}
                        disabled={!isAvailable || isOpening}
                        className={cn(
                            'mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full px-4 text-body-lg text-neutral-white-h transition-opacity',
                            'bg-func-win',
                            isAvailable && !isOpening
                                ? 'cursor-pointer active:scale-[0.99]'
                                : 'cursor-not-allowed opacity-60',
                        )}
                    >
                        {isOpening ? (
                            <Loading className="size-5" variant="color-white" />
                        ) : (
                            <CustomerServiceOutlined className="size-5" />
                        )}
                        <span>{t('liveChat')}</span>
                    </button>
                </DrawerContent>
            </Drawer>
        </>
    );
};
