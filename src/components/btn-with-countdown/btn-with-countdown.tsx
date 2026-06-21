import { useCountDown } from 'ahooks';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { cn } from '@/utils/common';

interface Props {
    className?: string;
    disabled?: boolean;
    text: string;
    /** Countdown duration in seconds */
    countdownTime: number;
    onClick: () => void;
    /** Callback after countdown ends */
    onEnd?: () => void;
}
export type BtnWithCountdownRef = {
    start: () => void;
};

/**
 * Button with countdown
 * @param props
 * @returns
 */
export const BtnWithCountdown = forwardRef<BtnWithCountdownRef, Props>(
    ({ text, className, disabled = false, countdownTime, onClick, onEnd }, ref) => {
        const [leftTime, setLeftTime] = useState(0);
        const [countdown] = useCountDown({
            leftTime,
            onEnd: () => {
                setLeftTime(0);
                onEnd?.();
            },
        });

        const start = useCallback(() => {
            setLeftTime(countdownTime * 1000);
        }, [countdownTime]);

        useImperativeHandle(ref, () => ({ start }), [start]);

        const isDisabled = Boolean(disabled) || leftTime > 0;

        const handleClick = useCallback(() => {
            if (isDisabled) {
                return;
            }
            onClick?.();
        }, [isDisabled, onClick]);

        return (
            <button
                type="button"
                onClick={handleClick}
                disabled={isDisabled}
                className={cn(
                    'text-auxiliary-sm cursor-pointer',
                    isDisabled ? 'cursor-not-allowed text-filltext-ft-g' : 'text-brand-red',
                    className,
                )}
            >
                <span className="string_button">{leftTime > 0 ? `${Math.floor(countdown * 0.001)}s` : text}</span>
            </button>
        );
    },
);

BtnWithCountdown.displayName = 'BtnWithCountdown';
