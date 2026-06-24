import type { CSSProperties, FC } from 'react';

interface BorderBeamPathProps {
    /** Beam travel duration in seconds */
    duration?: number;
    /** Beam color */
    color?: string;
    /** Beam length in pixels */
    beamLength?: number;
    /** Border radius in pixels, should match parent's border-radius */
    radius?: number;
}

/**
 * Animated border beam — a fixed-length light beam travels at constant linear speed
 * along the parent's rectangular border using CSS offset-path.
 *
 * Two-layer design: solid core (sharp colored line) + glow halo (blurred aura).
 * Unlike conic-gradient rotation (which has uneven speed on rectangles),
 * offset-distance interpolates linearly along the path perimeter.
 *
 * Parent needs `position: relative`. Inherits border-radius via overflow-clip.
 */
export const BorderBeamPath: FC<BorderBeamPathProps> = ({
    duration = 2.5,
    color = 'var(--accent-warm)',
    beamLength = 360,
    radius = 8,
}) => {
    const pathStyle = {
        offsetPath: `rect(0px 100% 100% 0px round ${radius}px)`,
        animation: `beam-travel ${duration}s linear infinite`,
    };

    return (
        <div className="pointer-events-none absolute inset-0 overflow-clip rounded-[inherit]">
            {/* Glow halo — blurred aura behind the core (temporarily hidden) */}
            {/* <div
                style={
                    {
                        position: 'absolute',
                        width: `${beamLength}px`,
                        height: '3px',
                        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                        filter: 'blur(2px)',
                        opacity: 0.4,
                        ...pathStyle,
                    } as CSSProperties
                }
            /> */}
            {/* Solid core — sharp laser line matching corner triangle color */}
            <div
                style={
                    {
                        position: 'absolute',
                        width: `${beamLength}px`,
                        height: '1.5px',
                        background: `linear-gradient(90deg, transparent 0%, ${color} 15%, ${color} 85%, transparent 100%)`,
                        ...pathStyle,
                    } as CSSProperties
                }
            />
        </div>
    );
};
