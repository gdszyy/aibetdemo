import { useNetwork } from 'ahooks';
import { useEffect, useState } from 'react';

/** 信号强度枚举 */
export enum SignalLevel {
    Init = -99,
    None = 0,
    Slow = 1,
    Medium = 2,
    Fast = 3,
}

const SIGNAL_LEVEL_MAP = {
    'slow-2g': SignalLevel.None,
    '2g': SignalLevel.Slow,
    '3g': SignalLevel.Medium,
    '4g': SignalLevel.Fast,
};

type SignalKey = keyof typeof SIGNAL_LEVEL_MAP;

/**
 * 信号强度
 */
export const useNetworkSignal: () => SignalLevel = () => {
    const network = useNetwork();
    const networkValues = network ?? {};

    const [level, setLevel] = useState<SignalLevel>(SignalLevel.Init);

    useEffect(() => {
        // 不支持网络信号探测，则退出
        if (!(window.navigator as any).connection) {
            return;
        }

        const { online, effectiveType } = networkValues;
        if (!online) {
            setLevel(SignalLevel.None);
        } else {
            setLevel(SIGNAL_LEVEL_MAP[effectiveType as SignalKey] ?? SignalLevel.None);
        }
    }, [networkValues]);

    return level;
};
