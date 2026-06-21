'use client';

import { useTranslations } from 'next-intl';
import { VisuallyHidden } from 'radix-ui';
import { type FC, useState } from 'react';
import { DepositOrderStatus } from '@/api/models/deposit';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/drawer/drawer';
import { Close } from '@/components/icons';
import { DepositOutlined } from '@/components/icons2/DepositOutlined';
import { Modal } from '@/components/modal/modal';
import { StorageEnum } from '@/constants';
import { useIsDesktop } from '@/hooks/use-media-query';
import { SUPPORT_FLOATING_TRIGGER_SELECTOR } from '@/modules/support-floating';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { DepositPaymentMode, type DepositPaymentView } from '../_constants/payment';
import { useDepositPolling } from '../_hooks/use-deposit-polling';
import { Home } from '../home';
import { DepositPaymentFrame } from './deposit-payment-frame';

interface DepositModalProps {
    /** 是否展示充值弹窗。 */
    visible: boolean;
    /** 关闭弹窗回调。 */
    onClose: () => void;
}

/** 判断抽屉外部点击是否来自客服悬浮球，充值抽屉允许它继续响应点击。 */
function checkIsSupportFloatingTrigger(target: EventTarget | null): boolean {
    return target instanceof Element && Boolean(target.closest(SUPPORT_FLOATING_TRIGGER_SELECTOR));
}

/** 顶部充值入口使用的弹窗充值流程。 */
export const DepositModal: FC<DepositModalProps> = ({ visible, onClose }) => {
    const t = useTranslations('deposit');
    const isDesktop = useIsDesktop();
    const openBetSlipDrawer = useUIStore((state) => state.openBetSlipDrawer);
    const [payment, setPayment] = useState<DepositPaymentView | null>(null);
    const { startPolling, stopPolling, loading, onPollingEnd } = useDepositPolling({
        onFinished: handlePaymentFinished,
    });

    function handleClose(): void {
        stopPolling(false);
        setPayment(null);
        onClose();
    }

    function handlePaymentFinished(status?: DepositOrderStatus): void {
        if (status === DepositOrderStatus.PfOrderSuccess) {
            handleClose();
            const shouldAutoOpenBetSlip = window.localStorage.getItem(StorageEnum.PostDepositAutoOpenBetSlip);
            if (shouldAutoOpenBetSlip) {
                window.localStorage.removeItem(StorageEnum.PostDepositAutoOpenBetSlip);
                openBetSlipDrawer();
            }
            return;
        }

        setPayment(null);
    }

    const desktopPaymentContent = payment ? (
        <div className="w-full bg-surface-1 text-filltext-ft-g max-md:rounded-t-md md:w-215 md:rounded-sm">
            <div className="relative flex h-17 items-center justify-center gap-2 md:border-b-[0.5px] border-filltext-ft-c px-4 md:justify-start">
                <DepositOutlined className="size-8 text-brand-red max-md:hidden" />
                <p className="text-title-lg text-brand-red">{t('title')}</p>
                <button
                    type="button"
                    className="absolute right-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-xs text-filltext-ft-e transition-colors hover:bg-filltext-ft-b hover:text-filltext-ft-g"
                    onClick={handleClose}
                >
                    <Close className="size-3.5 text-current" />
                </button>
            </div>
            <div className="custom-scrollbar p-4 md:grid md:max-h-[calc(90vh-68px)] md:grid-cols-[1fr_360px] md:gap-6 md:overflow-y-auto">
                {isDesktop && (
                    <Home
                        compact
                        paymentMode={DepositPaymentMode.Iframe}
                        onPaymentCreated={setPayment}
                        onPaymentPollingStart={startPolling}
                        paymentPollingLoading={loading}
                        paymentPollingEnded={onPollingEnd}
                    />
                )}
                <DepositPaymentFrame payment={payment} />
            </div>
        </div>
    ) : null;

    const mobilePaymentContent = payment ? (
        <div className="flex max-h-[calc(100dvh-48px)] min-h-0 w-full flex-col bg-surface-1 text-filltext-ft-g">
            <div className="mx-auto mt-2 h-1 w-8 shrink-0 rounded-full bg-filltext-ft-d" />
            <div className="relative flex h-14 shrink-0 items-center justify-center px-4">
                <p className="text-title-lg text-brand-red">{t('title')}</p>
                <button
                    type="button"
                    className="absolute right-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-xs text-filltext-ft-e transition-colors active:bg-filltext-ft-b"
                    onClick={handleClose}
                >
                    <Close className="size-3.5 text-current" />
                </button>
            </div>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                <DepositPaymentFrame payment={payment} hideProcessingText />
            </div>
            <div className="mb-[env(safe-area-inset-bottom)] shrink-0 px-2 pb-4 pt-2">
                <button
                    type="button"
                    className="flex h-10 w-full items-center justify-center rounded-full bg-filltext-ft-b text-body-lg font-semibold text-filltext-ft-g active:bg-filltext-ft-c"
                    onClick={handleClose}
                >
                    {t('modal.cancel')}
                </button>
            </div>
        </div>
    ) : null;

    const content = (
        <div
            className={cn(
                'bg-surface-1 text-filltext-ft-g',
                isDesktop ? 'w-186 rounded-sm' : 'flex max-h-[calc(100dvh-48px)] min-h-0 flex-col rounded-t-md',
                'md:w-108',
            )}
        >
            {!isDesktop && <div className="mx-auto mt-2 h-1 w-8 shrink-0 rounded-full bg-filltext-ft-d" />}
            <div className="relative flex h-14 shrink-0 items-center justify-center gap-2 md:border-b-[0.5px] border-filltext-ft-c px-4 md:h-17 md:justify-start">
                <DepositOutlined className="size-8 text-brand-red max-md:hidden" />
                <p className="text-title-lg text-brand-red">{t('title')}</p>
                <button
                    type="button"
                    className="absolute right-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-xs text-filltext-ft-e transition-colors active:bg-filltext-ft-b md:hover:bg-filltext-ft-b md:hover:text-filltext-ft-g"
                    onClick={handleClose}
                >
                    <Close className="size-3.5 text-current" />
                </button>
            </div>

            <div
                className={cn(
                    'p-4',
                    isDesktop && 'custom-scrollbar max-h-[calc(90vh-68px)] overflow-y-auto',
                    !isDesktop && 'custom-scrollbar min-h-0 flex-1 overflow-y-auto',
                )}
            >
                <Home
                    compact
                    paymentMode={DepositPaymentMode.Iframe}
                    onPaymentCreated={setPayment}
                    onPaymentPollingStart={startPolling}
                    paymentPollingLoading={loading}
                    paymentPollingEnded={onPollingEnd}
                />
            </div>
        </div>
    );

    if (isDesktop) {
        return (
            <Modal visible={visible} onClose={handleClose} withBg={false} closeButton={false} maskClosable>
                {payment ? desktopPaymentContent : content}
            </Modal>
        );
    }

    return (
        <>
            <Drawer
                open={visible && !payment}
                onOpenChange={(open) => !open && !payment && handleClose()}
                direction="bottom"
                repositionInputs={false}
            >
                <DrawerContent
                    className="inset-x-6 bottom-0 mt-0! flex h-auto max-h-[calc(100dvh-48px)] overflow-hidden rounded-t-md border-t-0! border-0 bg-surface-1 p-0 shadow-none"
                    overlayClassName="bg-black/42"
                    showTopSpacer={false}
                    onPointerDownOutside={(event) => {
                        if (checkIsSupportFloatingTrigger(event.detail.originalEvent.target)) {
                            event.preventDefault();
                        }
                    }}
                >
                    <DrawerTitle asChild>
                        <VisuallyHidden.Root>{t('title')}</VisuallyHidden.Root>
                    </DrawerTitle>
                    {content}
                </DrawerContent>
            </Drawer>
            <Drawer
                open={visible && Boolean(payment)}
                onOpenChange={(open) => !open && handleClose()}
                direction="bottom"
                repositionInputs={false}
            >
                <DrawerContent
                    className="inset-x-6 bottom-0 mt-0! flex h-auto max-h-[calc(100dvh-48px)] overflow-hidden rounded-t-md border-t-0! border-0 bg-surface-1 p-0 shadow-none"
                    overlayClassName="bg-black/42"
                    showTopSpacer={false}
                    onPointerDownOutside={(event) => {
                        if (checkIsSupportFloatingTrigger(event.detail.originalEvent.target)) {
                            event.preventDefault();
                        }
                    }}
                >
                    <DrawerTitle asChild>
                        <VisuallyHidden.Root>payment content</VisuallyHidden.Root>
                    </DrawerTitle>
                    {mobilePaymentContent}
                </DrawerContent>
            </Drawer>
        </>
    );
};
