import type { FC, PropsWithChildren } from 'react';
import { cn } from '@/utils/common';

interface GradientBorderProps {
    /** 是否为高级，决定边框的渐变颜色 */
    isHighLevel?: boolean;
    /** 是否启用边框流光动画 */
    streamer?: boolean;
    /** 额外的类名 */
    className?: string;
    /** 边框宽度，默认为1px */
    borderWidth?: number;
    /** 圆角半径 */
    radius?: number;
    /** 可选的边框颜色类名，覆盖默认渐变 */
    borderColorClass?: string;
}

export const GradientBorder: FC<PropsWithChildren<GradientBorderProps>> = ({
    children,
    isHighLevel = false,
    streamer = false,
    className = '',
    borderWidth = 1,
    borderColorClass = '',
    radius = 16,
}) => {
    const borderClassName = isHighLevel ? 'bg-linear-to-b from-[#66FDCE] to-[#060C0D]' : 'bg-surface-1';
    const streamerBorderClassName = isHighLevel
        ? 'animate-world-cup-gradient-border-streamer bg-[linear-gradient(var(--world-cup-gradient-border-angle),#66FDCE,#ffffff)]'
        : 'bg-surface-1';

    return (
        <div
            className={cn(
                'inline-block',
                streamer ? streamerBorderClassName : borderClassName,
                className,
                borderColorClass,
            )}
            style={{
                padding: borderWidth,
                borderRadius: radius,
            }}
        >
            <div
                style={{
                    borderRadius: radius - borderWidth,
                    overflow: 'hidden',
                }}
            >
                {children}
            </div>
        </div>
    );
};
