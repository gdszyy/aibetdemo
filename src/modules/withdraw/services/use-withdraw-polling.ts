import { useMutation } from '@tanstack/react-query';
import { useInterval } from 'ahooks';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GetWithdrawInterface } from '@/api/handlers/withdraw';
import type { ErrorReject } from '@/api/lib/types';
import { WithdrawOrderStatus } from '@/api/models/withdraw';
import { Toast } from '@/components/toast';
import { useWalletDispatchBalance } from '@/hooks/use-wallet';

type GetWithdrawResponse = Awaited<ReturnType<typeof GetWithdrawInterface>>;

const inPayingStatus = [WithdrawOrderStatus.Created];

const POLLING_COUNT = 6;

/**
 * Poll withdraw order status
 */
export const useWithdrawPolling = () => {
    const t = useTranslations('withdraw');
    const [interval, setInterval] = useState<number | undefined>(undefined);
    const [orderNo, setOrderNo] = useState<string | null>(null);
    const dispatchBalance = useWalletDispatchBalance();
    const [inPaying, setInPaying] = useState<boolean>(false);
    const [onPollingEnd, setOnPollingEnd] = useState(false);
    const pollingCount = useRef<number>(0);

    const polling = useMutation({
        mutationFn: (params: { order_no: string }) => GetWithdrawInterface(params),
        onSuccess: (data: GetWithdrawResponse) => {
            pollingCount.current += 1;

            if (!inPayingStatus.includes(data?.order_status)) {
                stopPolling();
                dispatchBalance();
                if (data?.order_status === WithdrawOrderStatus.PfOrderSuccess)
                    Toast.success(t('withdraw.withdrawSuccessToast'), { id: 'withdraw-polling' });
                if (data?.order_status === WithdrawOrderStatus.PfOrderFailed)
                    Toast.error(t('withdraw.withdrawFailedToast'), { id: 'withdraw-polling' });
            } else {
                if (pollingCount.current >= POLLING_COUNT) {
                    stopPolling();
                    return;
                }
            }
        },
        onError: (err: ErrorReject) => {
            Toast.error(err.message, { id: 'withdraw-polling' });
        },
    });

    const clear = useInterval(() => {
        if (!orderNo) return;
        polling.mutate({ order_no: orderNo });
    }, interval);

    const startPolling = (order_no: string) => {
        setOnPollingEnd(false);
        setInPaying(true);
        setOrderNo(order_no);
        setInterval(5000);
        polling.mutate({ order_no });
    };

    const stopPolling = useCallback(() => {
        setOnPollingEnd(true);
        setInPaying(false);
        setInterval(undefined);
        setOrderNo(null);
        clear();
        pollingCount.current = 0;
    }, [clear]);

    useEffect(() => {
        return stopPolling;
    }, [stopPolling]);

    return { startPolling, loading: inPaying, onPollingEnd };
};
