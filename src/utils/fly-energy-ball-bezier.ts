import { getCenter, prefersReducedMotion } from '@/utils/dom';

type Point = { x: number; y: number };

const ACTIVE_FLIGHTS = new Map<string, FlightInstance>();

const DEFAULTS = {
    popDurationMs: 280,
    waitDurationMs: 350,
    flightDurationMs: 600,
    color: 'var(--color-brand-primary-0)',
    /** Below toast stack (70+); above header (40) and overlay/dropdown (50). */
    zIndex: 65,
};

interface FlightInstance {
    cancel: () => void;
}

export interface LaunchBezierEnergyBallOptions {
    key: string;
    fromEl: HTMLElement;
    toEl?: HTMLElement;
    toPoint?: Point;
    popDurationMs?: number;
    waitDurationMs?: number;
    flightDurationMs?: number;
    color?: string;
    zIndex?: number;
    approachOffsetMs?: number;
    onApproachEnd?: () => void;
}

function getTranslatePoint(from: Point, to: Point): Point {
    return { x: to.x - from.x, y: to.y - from.y };
}

function resolveEndPoint(toEl?: HTMLElement, toPoint?: Point): Point | null {
    if (toPoint) return toPoint;
    if (toEl) return getCenter(toEl);
    return null;
}

function cleanupFlightDom(portal: HTMLDivElement | null) {
    if (!portal) return;
    portal.remove();
}

/** Matches demo `explodeDot`: 6 particles, equal angles, two keyframes, same easing & distance range. */
function createParticleExplosion(at: Point, zIndex: number, color: string) {
    const PARTICLE_PX = 8;
    const half = PARTICLE_PX / 2;
    const count = 6;
    const shadow = `0 0 8px ${color}`;

    for (let i = 0; i < count; i += 1) {
        const p = document.createElement('div');
        p.style.position = 'fixed';
        p.style.left = `${at.x - half}px`;
        p.style.top = `${at.y - half}px`;
        p.style.width = `${PARTICLE_PX}px`;
        p.style.height = `${PARTICLE_PX}px`;
        p.style.borderRadius = '999px';
        p.style.pointerEvents = 'none';
        p.style.zIndex = String(zIndex);
        p.style.background = 'var(--color-brand-primary-0)';
        p.style.boxShadow = shadow;
        document.body.appendChild(p);

        const angle = (Math.PI * 2 * i) / count;
        const dist = 20 + Math.random() * 25;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const duration = 300 + Math.random() * 200;

        p.animate(
            [
                { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 },
            ],
            {
                duration,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fill: 'forwards',
            },
        ).onfinish = () => p.remove();
    }
}

export function cancelBezierEnergyBall(key: string) {
    const active = ACTIVE_FLIGHTS.get(key);
    if (!active) return;
    active.cancel();
    ACTIVE_FLIGHTS.delete(key);
}

export function launchBezierEnergyBall(options: LaunchBezierEnergyBallOptions) {
    if (typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;

    const {
        key,
        fromEl,
        toEl,
        toPoint,
        popDurationMs = DEFAULTS.popDurationMs,
        waitDurationMs = DEFAULTS.waitDurationMs,
        flightDurationMs = DEFAULTS.flightDurationMs,
        color = DEFAULTS.color,
        zIndex = DEFAULTS.zIndex,
        approachOffsetMs = 120,
        onApproachEnd,
    } = options;

    const endInitial = resolveEndPoint(toEl, toPoint);
    if (!endInitial) return;

    cancelBezierEnergyBall(key);

    const start = getCenter(fromEl);

    const portal = document.createElement('div');
    portal.style.position = 'fixed';
    portal.style.inset = '0';
    portal.style.pointerEvents = 'none';
    portal.style.zIndex = String(zIndex);
    document.body.appendChild(portal);

    const xLayer = document.createElement('div');
    xLayer.style.position = 'absolute';
    xLayer.style.left = `${start.x}px`;
    xLayer.style.top = `${start.y}px`;
    xLayer.style.willChange = 'transform, opacity';
    portal.appendChild(xLayer);

    const yLayer = document.createElement('div');
    yLayer.style.willChange = 'transform, opacity';
    xLayer.appendChild(yLayer);

    const ball = document.createElement('div');
    ball.textContent = '+1';
    ball.style.width = '18px';
    ball.style.height = '18px';
    ball.style.borderRadius = '999px';
    ball.style.display = 'flex';
    ball.style.alignItems = 'center';
    ball.style.justifyContent = 'center';
    ball.style.fontSize = '10px';
    ball.style.fontWeight = '700';
    ball.style.color = 'var(--color-neutral-white-h, #fff)';
    ball.style.background = color;
    ball.style.boxShadow = `0 10px 24px ${color}`;
    ball.style.transform = 'translate(-50%, -50%)';
    yLayer.appendChild(ball);

    let currentCenter: Point = start;
    let cancelled = false;
    /** True during pop/wait; false before flight so origin tracking does not override WAAPI transforms. */
    let trackingOrigin = true;
    let originTrackRaf: number | null = null;
    const timeouts: number[] = [];
    const animations: Animation[] = [];

    const syncOriginToSource = () => {
        if (cancelled || !trackingOrigin) return;
        if (!fromEl.isConnected) return;
        const c = getCenter(fromEl);
        xLayer.style.left = `${c.x}px`;
        xLayer.style.top = `${c.y}px`;
    };

    const trackOriginLoop = () => {
        syncOriginToSource();
        if (!cancelled && trackingOrigin) {
            originTrackRaf = window.requestAnimationFrame(trackOriginLoop);
        }
    };
    originTrackRaf = window.requestAnimationFrame(trackOriginLoop);

    const updateCurrent = () => {
        // Use the actual ball rect so we capture both X/Y transforms (xLayer + yLayer + ball).
        const rect = ball.getBoundingClientRect();
        currentCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };

    const finish = () => {
        updateCurrent();
        cleanupFlightDom(portal);
        ACTIVE_FLIGHTS.delete(key);
    };

    const cancel = () => {
        if (cancelled) return;
        cancelled = true;
        trackingOrigin = false;
        if (originTrackRaf !== null) {
            window.cancelAnimationFrame(originTrackRaf);
            originTrackRaf = null;
        }
        for (const id of timeouts) window.clearTimeout(id);
        // Capture current on-screen position BEFORE cancelling WAAPI animations,
        // otherwise `.cancel()` snaps styles back to the origin and the explosion appears at the click point.
        updateCurrent();
        for (const animation of animations) animation.cancel();
        cleanupFlightDom(portal);
        createParticleExplosion(currentCenter, zIndex, color);
    };

    ACTIVE_FLIGHTS.set(key, { cancel });

    const pop = ball.animate(
        [
            { transform: 'translate(-50%, -50%) translateY(0) scale(1)', opacity: 1 },
            { transform: 'translate(-50%, -50%) translateY(-25px) scale(1.2)', opacity: 1 },
        ],
        {
            duration: popDurationMs,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fill: 'forwards',
        },
    );
    animations.push(pop);

    const startFlightTimer = window.setTimeout(() => {
        if (cancelled) return;

        trackingOrigin = false;
        if (originTrackRaf !== null) {
            window.cancelAnimationFrame(originTrackRaf);
            originTrackRaf = null;
        }

        const freshEnd = resolveEndPoint(toEl, toPoint);
        if (!freshEnd) {
            finish();
            return;
        }
        const freshStart = getCenter(fromEl);
        const delta = getTranslatePoint(freshStart, freshEnd);
        const lift = Math.max(80, Math.min(220, Math.hypot(delta.x, delta.y) * 0.3));

        xLayer.style.left = `${freshStart.x}px`;
        xLayer.style.top = `${freshStart.y}px`;

        const xAnim = xLayer.animate(
            [{ transform: 'translate(0px, 0px)' }, { transform: `translate(${delta.x}px, 0px)` }],
            {
                duration: flightDurationMs,
                easing: 'ease-in',
                fill: 'forwards',
            },
        );

        const yAnim = yLayer.animate(
            [{ transform: 'translate(0px, -25px)' }, { transform: `translate(0px, ${delta.y - 25}px)` }],
            {
                duration: flightDurationMs,
                easing: 'ease-out',
                fill: 'forwards',
            },
        );

        const arcAnim = ball.animate(
            [
                { transform: 'translate(-50%, -50%) translateY(0) scale(1.2)', opacity: 1 },
                { transform: `translate(-50%, -50%) translateY(${-lift}px) scale(1.05)`, opacity: 1, offset: 0.45 },
                { transform: 'translate(-50%, -50%) translateY(0) scale(0.45)', opacity: 0.1, offset: 1 },
            ],
            {
                duration: flightDurationMs,
                easing: 'linear',
                fill: 'forwards',
            },
        );

        const approachTimer = window.setTimeout(
            () => {
                if (cancelled) return;
                onApproachEnd?.();
            },
            Math.max(0, flightDurationMs - approachOffsetMs),
        );

        timeouts.push(approachTimer);
        animations.push(xAnim, yAnim, arcAnim);
        arcAnim.onfinish = () => {
            if (cancelled) return;
            finish();
        };
    }, popDurationMs + waitDurationMs);

    timeouts.push(startFlightTimer);
}
