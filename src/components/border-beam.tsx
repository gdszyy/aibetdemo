import type { CSSProperties, FC } from 'react';
import { cn } from '@/utils/common';

interface BorderBeamProps {
    /** Full orbit duration in seconds */
    duration?: number;
    /** Delay offset in seconds (negative = stagger start) */
    delay?: number;
    /** Gradient start color */
    colorFrom?: string;
    /** Gradient end color */
    colorTo?: string;
    className?: string;
    style?: CSSProperties;
    /** Blur radius in pixels (default 14) */
    blur?: number;
    /** Conic-gradient arc angles [fadeStart, brightStart, brightEnd, fadeEnd] in degrees.
     *  Wider arc = longer comet tail, better for elongated rectangles. */
    arc?: readonly [number, number, number, number];
    /** Reverse direction (counter-clockwise) */
    reverse?: boolean;
}

/**
 * Animated border beam effect — a light beam travels clockwise around the parent's border.
 * Parent only needs `relative` (no overflow-hidden required).
 * `rounded-[inherit]` auto-matches parent border-radius.
 *
 * Implementation: A 200%-oversized `conic-gradient` rotates via `transform: rotate()` (S-Tier
 * GPU compositing). The outer wrapper uses CSS mask to reveal only the 1px border ring.
 * This ensures 60fps even with 50+ simultaneous animations — `transform` runs entirely
 * on the compositor thread with zero main-thread paint cost.
 *
 * @see https://magicui.design/docs/components/border-beam
 */
export const BorderBeam: FC<BorderBeamProps> = ({
    className,
    delay = 0,
    duration = 6,
    colorFrom = '#ffaa40',
    colorTo = '#9c40ff',
    blur = 14,
    arc = [220, 320, 350, 355],
    style,
    reverse = false,
}) => {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-clip p-px rounded-[inherit] [mask-clip:content-box,padding-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
            <div
                className={cn('absolute left-[-50%] top-[-50%] h-[200%] w-[200%] will-change-transform', className)}
                style={
                    {
                        background: `conic-gradient(transparent ${arc[0]}deg, ${colorFrom} ${arc[1]}deg, ${colorTo} ${arc[2]}deg, transparent ${arc[3]}deg)`,
                        filter: `blur(${blur}px)`,
                        animation: `beam-spin ${duration}s linear ${-delay}s infinite ${reverse ? 'reverse' : 'normal'}`,
                        ...style,
                    } as CSSProperties
                }
            />
        </div>
    );
};
