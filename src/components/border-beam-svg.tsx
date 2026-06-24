import type { CSSProperties, FC } from 'react';

interface BorderBeamSvgProps {
    /** Full orbit duration in seconds */
    duration?: number;
    /** Beam color (CSS color value or variable) */
    color?: string;
    /** Border radius in px, should match parent's border-radius. Default 8 (rounded-sm). */
    radius?: number;
}

/**
 * Three-layer animated border beam using SVG pathLength normalization.
 *
 * Inspired by the "comet tail" design: three SVG rects with staggered start positions
 * create a layered light structure (ghost tail → glow body → sharp tip).
 *
 * `pathLength="100"` normalizes the perimeter so all proportions are size-independent.
 * This ensures identical visual behavior across any aspect ratio.
 *
 * Stagger is achieved via negative `animation-delay` — each layer starts at a different
 * point in the cycle but all travel exactly 100 units (one full loop) per cycle.
 *
 * Layer structure:
 * - Track: faint static border showing the beam's "rail"
 * - Layer 0 (tail): long, faint trail — ghost afterimage
 * - Layer 1 (body): mid-length glow with breathing pulse (width + opacity)
 * - Layer 2 (tip): short, sharp, full-opacity laser edge
 *
 * Parent needs `position: relative`.
 */
export const BorderBeamSvg: FC<BorderBeamSvgProps> = ({ duration = 2, color = 'var(--accent-warm)', radius = 8 }) => {
    const sharedRect = {
        x: '0',
        y: '0',
        width: '100%',
        height: '100%',
        rx: radius,
        fill: 'none',
        stroke: color,
        pathLength: 100,
        strokeLinecap: 'round' as const,
    };

    /** Negative delay shifts the start position within the cycle (0–1 = 0–100% of perimeter) */
    const stagger = (phase: number) =>
        ({
            animation: `beam-dash ${duration}s linear ${-duration * phase}s infinite`,
        }) as CSSProperties;

    const staggerWithPulse = (phase: number) =>
        ({
            animation: `beam-dash ${duration}s linear ${-duration * phase}s infinite, beam-pulse ${duration}s linear ${-duration * phase}s infinite`,
        }) as CSSProperties;

    return (
        <svg
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Track: faint static border — visual rail for the beam */}
            <rect {...sharedRect} strokeWidth={0.5} opacity={0.1} pathLength={undefined} />

            {/* Layer 0: Ghost tail — long, faint trail */}
            <rect {...sharedRect} strokeWidth={0.8} opacity={0.15} strokeDasharray="40 60" style={stagger(0.3)} />

            {/* Layer 1: Glow body — mid-length with breathing pulse */}
            <rect {...sharedRect} strokeDasharray="16 84" style={staggerWithPulse(0.53)} />

            {/* Layer 2: Laser tip — short, sharp, full opacity */}
            <rect {...sharedRect} strokeWidth={1} opacity={1} strokeDasharray="5 95" style={stagger(0.64)} />
        </svg>
    );
};
