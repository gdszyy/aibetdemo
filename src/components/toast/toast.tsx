'use client';

import type { ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';
import { Close, Error as ErrorIcon, Success, Warn } from '../icons';
import { Loading } from '../loading/loading';
import type { ToastType } from './constant';

interface ToastOptions {
    /** Duration in ms */
    duration?: number;
    /** Dedup ID — toasts with the same id will update instead of duplicating */
    id?: string;
    /** Whether to show overlay and block background interaction. Default: false. */
    mask?: boolean;
}

type ToastFunction = (
    /** Message */
    message: ReactNode,
    /** Options */
    options?: ToastOptions,
) /** Dismiss function */ => Promise<() => void>;

interface ToastService extends Record<ToastType, ToastFunction> {
    dismissAll: () => void;
    dismissAllLoadingToasts: () => void;
}

/** Toast content component */
function ToastContent({
    id,
    type,
    message,
    mask,
}: {
    id: string | number;
    type: ToastType;
    message: ReactNode;
    mask: boolean;
}) {
    return (
        <div
            className="relative flex flex-col gap-y-2 justify-center items-center max-w-[600px] min-w-[200px] p-4 rounded-sm shadow-floating bg-surface-raised"
            data-toast-mask={mask ? 'true' : undefined}
        >
            <ToastIcon type={type} />
            <div className="text-body-sm text-center">{message}</div>
            {type === 'loading' && (
                <button
                    type="button"
                    className="absolute right-1 top-1 cursor-pointer"
                    onClick={() => sonnerToast.dismiss(id)}
                >
                    <Close className="size-3 text-gray-200" />
                </button>
            )}
        </div>
    );
}

/** Icon component */
function ToastIcon({ type }: { type: ToastType }) {
    switch (type) {
        case 'success':
            return <Success className="size-4 text-func-win" />;
        case 'warn':
            return <Warn className="size-4 text-func-pending" />;
        case 'error':
            return <ErrorIcon className="size-4 text-func-lost" />;
        case 'loading':
            return <Loading className="size-4" variant="color-red" />;
        case 'network':
            return <WeakSignalIcon />;
        default:
            return null;
    }
}

/** Default duration per toast type (ms). Callers can override via options.duration. */
const DEFAULT_DURATION: Record<ToastType, number> = {
    success: 3000,
    error: 3000,
    warn: 3000,
    info: 3000,
    loading: Infinity,
    network: 3000,
};

/** Custom Toast renderer */
async function renderToast(type: ToastType, message: ReactNode, options?: ToastOptions): Promise<() => void> {
    const effectiveDuration = options?.duration ?? DEFAULT_DURATION[type];
    const mask = options?.mask ?? false;

    const id = sonnerToast.custom((t) => <ToastContent id={t} type={type} message={message} mask={mask} />, {
        duration: effectiveDuration,
        id: options?.id,
    });

    await new Promise((resolve) =>
        setTimeout(
            resolve,
            effectiveDuration +
                /** 等toast消失完成的动画时间 */
                50,
        ),
    );

    return () => {
        sonnerToast.dismiss(id);
    };
}

/**
 * Global Toast service
 *
 * Usage: Toast.success('message') / Toast.error('error') etc.
 * Returns: dismiss function to manually close
 */
export const Toast: ToastService = {
    info: (message, options) => renderToast('info', message, options),
    success: (message, options) => renderToast('success', message, options),
    warn: (message, options) => renderToast('warn', message, options),
    error: (message, options) => renderToast('error', message, options),
    loading: (message, options) => renderToast('loading', message, options),
    network: (message, options) => renderToast('network', message, options),
    dismissAll: () => sonnerToast.dismiss(),
    // Compatibility alias for previous callsites.
    dismissAllLoadingToasts: () => sonnerToast.dismiss(),
};

function WeakSignalIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
                d="M15.5624 10.6C16.687 11 17.7077 11.55 18.6244 12.25C18.9577 12.5 19.1287 12.8293 19.1374 13.238C19.146 13.6467 19 14.0007 18.6994 14.3C18.416 14.5833 18.066 14.7293 17.6494 14.738C17.2327 14.7467 16.8577 14.634 16.5244 14.4C15.891 13.9667 15.191 13.625 14.4244 13.375C13.6577 13.125 12.8494 13 11.9994 13C11.1494 13 10.341 13.125 9.57436 13.375C8.8077 13.625 8.1077 13.9667 7.47436 14.4C7.14103 14.6333 6.76603 14.7417 6.34936 14.725C5.9327 14.7083 5.5827 14.5583 5.29936 14.275C5.01603 13.975 4.87436 13.621 4.87436 13.213C4.87436 12.805 5.04103 12.4757 5.37436 12.225C6.29103 11.525 7.31203 10.979 8.43736 10.587C9.5627 10.195 10.75 9.99933 11.9994 10C13.2487 10.0007 14.4364 10.2007 15.5624 10.6ZM17.8864 5.025C19.7284 5.70833 21.3827 6.675 22.8494 7.925C23.1827 8.20833 23.3577 8.55833 23.3744 8.975C23.391 9.39167 23.2494 9.75 22.9494 10.05C22.666 10.3333 22.316 10.4793 21.8994 10.488C21.4827 10.4967 21.1077 10.3673 20.7744 10.1C19.5744 9.11667 18.2287 8.35433 16.7374 7.813C15.246 7.27167 13.6667 7.00067 11.9994 7C10.332 6.99933 8.75303 7.27033 7.26236 7.813C5.7717 8.35567 4.4257 9.118 3.22436 10.1C2.89103 10.3667 2.51603 10.496 2.09936 10.488C1.6827 10.48 1.3327 10.334 1.04936 10.05C0.749363 9.75 0.607696 9.39167 0.624363 8.975C0.641029 8.55833 0.816029 8.20833 1.14936 7.925C2.61603 6.675 4.27036 5.70833 6.11236 5.025C7.95436 4.34167 9.9167 4 11.9994 4C14.082 4 16.0447 4.34167 17.8874 5.025"
                fill="var(--content-muted)"
            />
            <g className="toast-weak-signal-dot">
                <path
                    d="M10.225 20.275C9.74167 19.7917 9.5 19.2 9.5 18.5C9.5 17.8 9.74167 17.2083 10.225 16.725C10.7083 16.2417 11.3 16 12 16C12.7 16 13.2917 16.2417 13.775 16.725C14.2583 17.2083 14.5 17.8 14.5 18.5C14.5 19.2 14.2583 19.7917 13.775 20.275C13.2917 20.7583 12.7 21 12 21C11.3 21 10.7083 20.7583 10.225 20.275Z"
                    fill="var(--status-danger-text)"
                />
            </g>
        </svg>
    );
}
