import { type FunctionComponent, type PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { Tooltip } from '@/components/tooltip';
import { SignalLevel, useNetworkSignal } from '@/hooks/use-network-signal';
import { useCommonTranslations } from '@/hooks/use-translations';
import { ClientOnly } from '../client-only';

const SignTip: FunctionComponent<
    PropsWithChildren<{
        signalLevel: SignalLevel;
    }>
> = ({ children, signalLevel }) => {
    const tCommon = useCommonTranslations();

    const [toastVisible, setToastVisible] = useState<boolean | undefined>(undefined);

    const hasToast = useRef(false);

    // 第一次信号弱，则自动tooltip下。
    useEffect(() => {
        if (hasToast.current) {
            return;
        }
        if (signalLevel !== SignalLevel.Init && signalLevel <= SignalLevel.Slow) {
            setToastVisible(true);
            setTimeout(() => {
                setToastVisible(undefined);
            }, 3000);
            hasToast.current = true;
        }
    }, [signalLevel]);

    if (signalLevel === SignalLevel.None || signalLevel === SignalLevel.Slow) {
        return (
            <Tooltip content={tCommon('message.networkSignalWeakDesc')} side="left" open={toastVisible}>
                {children}
            </Tooltip>
        );
    }

    return children;
};

/** 信号强度，带图标的 */
const Main: FunctionComponent = () => {
    const defaultColor = 'var(--content-muted)';

    const signalLevel = useNetworkSignal();

    const isSlow = signalLevel === SignalLevel.Slow;
    const isMedium = signalLevel === SignalLevel.Medium;
    const isFast = signalLevel === SignalLevel.Fast;

    const color = useMemo(() => {
        if (isSlow) {
            return 'var(--func-lost)';
        }
        if (isMedium) {
            return 'var(--func-pending)';
        }
        if (isFast) {
            return 'var(--func-win)';
        }
        return defaultColor;
    }, [isFast, isMedium, isSlow]);

    const hasNetInfo = 'connection' in navigator && !!navigator.connection;

    if (!hasNetInfo) {
        return null;
    }

    return (
        <SignTip signalLevel={signalLevel}>
            <div className="size-9 flex items-center justify-center bg-surface-1 rounded-sm">
                <svg
                    className="size-5 transition-colors duration-1000"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                >
                    <path
                        d="M17.8871 5.025C19.7291 5.70833 21.3834 6.675 22.8501 7.925C23.1834 8.20833 23.3584 8.55833 23.3751 8.975C23.3918 9.39167 23.2501 9.75 22.9501 10.05C22.6668 10.3333 22.3168 10.4793 21.9001 10.488C21.4834 10.4967 21.1084 10.3673 20.7751 10.1C19.5751 9.11667 18.2294 8.35433 16.7381 7.813C15.2468 7.27167 13.6674 7.00067 12.0001 7C10.3328 6.99933 8.75376 7.27033 7.26309 7.813C5.77243 8.35567 4.42643 9.118 3.2251 10.1C2.89176 10.3667 2.51676 10.496 2.1001 10.488C1.68343 10.48 1.33343 10.334 1.0501 10.05C0.750095 9.75 0.608428 9.39167 0.625095 8.975C0.641762 8.55833 0.816762 8.20833 1.1501 7.925C2.61676 6.675 4.27109 5.70833 6.11309 5.025C7.95509 4.34167 9.91743 4 12.0001 4C14.0828 4 16.0454 4.34167 17.8881 5.025"
                        fill={isFast ? color : defaultColor}
                    />
                    <path
                        d="M15.563 10.6C16.6877 11 17.7083 11.55 18.625 12.25C18.9583 12.5 19.1293 12.8293 19.138 13.238C19.1467 13.6467 19.0007 14.0007 18.7 14.3C18.4167 14.5833 18.0667 14.7293 17.65 14.738C17.2333 14.7467 16.8583 14.634 16.525 14.4C15.8917 13.9667 15.1917 13.625 14.425 13.375C13.6583 13.125 12.85 13 12 13C11.15 13 10.3417 13.125 9.575 13.375C8.80833 13.625 8.10833 13.9667 7.475 14.4C7.14167 14.6333 6.76667 14.7417 6.35 14.725C5.93333 14.7083 5.58333 14.5583 5.3 14.275C5.01667 13.975 4.875 13.621 4.875 13.213C4.875 12.805 5.04167 12.4757 5.375 12.225C6.29167 11.525 7.31267 10.979 8.438 10.587C9.56333 10.195 10.7507 9.99934 12 10C13.2493 10.0007 14.437 10.2007 15.563 10.6Z"
                        fill={isFast || isMedium ? color : defaultColor}
                    />
                    <path
                        d="M10.225 20.275C9.74167 19.7917 9.5 19.2 9.5 18.5C9.5 17.8 9.74167 17.2083 10.225 16.725C10.7083 16.2417 11.3 16 12 16C12.7 16 13.2917 16.2417 13.775 16.725C14.2583 17.2083 14.5 17.8 14.5 18.5C14.5 19.2 14.2583 19.7917 13.775 20.275C13.2917 20.7583 12.7 21 12 21C11.3 21 10.7083 20.7583 10.225 20.275Z"
                        fill={isFast || isMedium || isSlow ? color : defaultColor}
                    />
                </svg>
            </div>
        </SignTip>
    );
};

/** 信号强度，带图标的 */
export const NetworkSignalWithIcon: FunctionComponent = () => {
    return (
        <ClientOnly>
            <Main />
        </ClientOnly>
    );
};
