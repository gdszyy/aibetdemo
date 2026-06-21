import { type FunctionComponent, useEffect, useRef } from 'react';
import { Toast } from '@/components/toast';
import { config } from '@/constants/config';
import { SignalLevel, useNetworkSignal } from '@/hooks/use-network-signal';
import { useCommonTranslations } from '@/hooks/use-translations';

const SignTip: FunctionComponent<{
    signalLevel: SignalLevel;
}> = ({ signalLevel }) => {
    const tCommon = useCommonTranslations();

    const lastToastTime = useRef<number>(0);

    // 那就如果距离上次五分钟以内就不显示
    useEffect(() => {
        const now = Date.now();
        if (now - lastToastTime.current < 5 * 60 * 1000) {
            return;
        }
        if (signalLevel !== SignalLevel.Init && signalLevel <= SignalLevel.Slow) {
            Toast.info(tCommon('message.networkSignalWeakTitle') + (config.isProd ? '' : ` (${signalLevel})`));
            lastToastTime.current = now;
        }
    }, [signalLevel, tCommon]);

    return null;
};

/** 信号强度，带toast的 */
export const NetworkSignalWithToast: FunctionComponent = () => {
    const signalLevel = useNetworkSignal();

    return <SignTip signalLevel={signalLevel}></SignTip>;
};
