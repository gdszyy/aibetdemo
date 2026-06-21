import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useInterval } from 'ahooks';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GetDepositInterface } from '@/api/handlers/deposit';
import type { ErrorReject } from '@/api/lib/types';
import { DepositOrderStatus } from '@/api/models/deposit';
import { Toast } from '@/components/toast';
import { useWalletDispatchBalance } from '@/hooks/use-wallet';

type GetDepositResponse = Awaited<ReturnType<typeof GetDepositInterface>>;

const inPayingStatus = [DepositOrderStatus.Created];

interface UseDepositPollingOptions {
    /** 订单轮询结束后的业务回调，用于弹窗态清理支付视图。 */
    onFinished?: (status?: DepositOrderStatus) => void;
}

interface StartDepositPollingOptions {
    /** 是否立即查询一次订单状态。弹窗 iframe 需要先完成渲染，再由间隔轮询接管。 */
    immediate?: boolean;
}

/**
 * 充值订单状态轮询。
 */
export const useDepositPolling = (options: UseDepositPollingOptions = {}) => {
    const t = useTranslations('deposit');
    const queryClient = useQueryClient();
    const [interval, setInterval] = useState<number | undefined>(undefined);
    const [orderNo, setOrderNo] = useState<string | null>(null);
    const dispatchBalance = useWalletDispatchBalance();
    const [inPaying, setInPaying] = useState<boolean>(false);
    const timeStampRef = useRef<number>(0);
    const onFinishedRef = useRef(options.onFinished);

    const [onPollingEnd, setOnPollingEnd] = useState(false);

    useEffect(() => {
        onFinishedRef.current = options.onFinished;
    }, [options.onFinished]);

    const polling = useMutation({
        mutationFn: (params: { order_no: string }) => GetDepositInterface(params),
        onSuccess: (data: GetDepositResponse) => {
            if (!inPayingStatus.includes(data?.order_status)) {
                stopPolling(true, data?.order_status);
                dispatchBalance();
                if (data?.order_status === DepositOrderStatus.PfOrderSuccess) {
                    void queryClient.invalidateQueries({
                        queryKey: ['first-recharge', 'status'],
                    });
                    Toast.success(t('depositSuccessToast'), { id: 'deposit-polling' });
                }
                if (data?.order_status === DepositOrderStatus.PfOrderFailed)
                    Toast.error(t('depositFailedToast'), { id: 'deposit-polling' });
            } else {
                // Stop polling after 30 minutes
                if (Date.now() - timeStampRef.current >= 1000 * 60 * 30) {
                    stopPolling();
                }
            }
        },
        onError: (err: ErrorReject) => {
            Toast.error(err.message, { id: 'deposit-polling' });
        },
    });

    const clear = useInterval(() => {
        if (!orderNo) return;
        polling.mutate({ order_no: orderNo });
    }, interval);

    const startPolling = (order_no: string, startOptions: StartDepositPollingOptions = {}) => {
        setOnPollingEnd(false);
        timeStampRef.current = Date.now();

        setInPaying(true);
        setOrderNo(order_no);
        setInterval(5000);
        if (startOptions.immediate ?? true) {
            polling.mutate({ order_no });
        }
    };

    const stopPolling = useCallback(
        (notifyFinished = true, status?: DepositOrderStatus) => {
            setOnPollingEnd(true);
            setInPaying(false);
            setInterval(undefined);
            setOrderNo(null);
            clear();
            timeStampRef.current = 0;
            if (notifyFinished) {
                onFinishedRef.current?.(status);
            }
        },
        [clear],
    );

    useEffect(() => {
        return () => stopPolling(false);
    }, [stopPolling]);

    return { startPolling, stopPolling, loading: inPaying, onPollingEnd };
};
