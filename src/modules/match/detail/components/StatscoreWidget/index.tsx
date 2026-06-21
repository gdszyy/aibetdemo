'use client';

// cspell:ignore STATSCORE STATSCOREWidgets Embeder

import type { FunctionComponent } from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/utils/common';

const STATSCORE_SCRIPT_ID = 'STATSCOREWidgetsEmbederScript';
const STATSCORE_SCRIPT_SRC = 'https://wgt-s3-cdn.statscore.com/bundle/EmbederESM.js';

type StatscoreLoadCallback = (error?: Event | Error) => void;

interface StatscoreWidgetInstance {
    destroy: () => Promise<void> | void;
}

interface StatscoreWidgetConstructor {
    new (
        element: HTMLElement,
        configurationId: string,
        inputData: { language: string; eventId: string | number },
        options: { loader: { enabled: boolean } },
    ): StatscoreWidgetInstance;
}

interface StatscoreWidgetsRuntime {
    Widget?: StatscoreWidgetConstructor;
    onLoadCallbacks: StatscoreLoadCallback[];
    onLoad: (callback: StatscoreLoadCallback) => void;
}

// `window.STATSCOREWidgets` is declared globally elsewhere (custom.d.ts) with a
// different type alias; cast via `unknown` to avoid a duplicate-declaration
// conflict (ts2717) while keeping local usage type-safe against the runtime
// shape we actually depend on.
const getStatscoreWidgets = (): StatscoreWidgetsRuntime | undefined =>
    (window as unknown as { STATSCOREWidgets?: StatscoreWidgetsRuntime }).STATSCOREWidgets;

const setStatscoreWidgets = (value: StatscoreWidgetsRuntime): void => {
    (window as unknown as { STATSCOREWidgets?: StatscoreWidgetsRuntime }).STATSCOREWidgets = value;
};

const ensureStatscoreGlobal = (): StatscoreWidgetsRuntime => {
    const existing = getStatscoreWidgets();
    if (existing) {
        return existing;
    }

    const created: StatscoreWidgetsRuntime = {
        onLoadCallbacks: [],
        onLoad(callback) {
            getStatscoreWidgets()?.onLoadCallbacks.push(callback);
        },
    };
    setStatscoreWidgets(created);
    return created;
};

const loadStatscoreWidget = () => {
    return new Promise<StatscoreWidgetConstructor>((resolve, reject) => {
        const preloaded = getStatscoreWidgets();
        if (preloaded?.Widget) {
            resolve(preloaded.Widget);
            return;
        }

        const statscoreWidgets = ensureStatscoreGlobal();
        let isSettled = false;

        const handleLoaded: StatscoreLoadCallback = (error) => {
            if (isSettled) {
                return;
            }

            if (error) {
                isSettled = true;
                reject(error instanceof Error ? error : new Error('Failed to load STATSCORE widget'));
                return;
            }

            const widgetConstructor = getStatscoreWidgets()?.Widget;
            if (!widgetConstructor) {
                isSettled = true;
                reject(new Error('STATSCORE widget constructor is unavailable'));
                return;
            }

            isSettled = true;
            resolve(widgetConstructor);
        };

        statscoreWidgets.onLoad(handleLoaded);

        if (document.getElementById(STATSCORE_SCRIPT_ID)) {
            return;
        }

        const script = document.createElement('script');
        script.src = STATSCORE_SCRIPT_SRC;
        script.type = 'module';
        script.async = true;
        script.id = STATSCORE_SCRIPT_ID;
        script.addEventListener('error', (event) => {
            for (const callback of statscoreWidgets.onLoadCallbacks) {
                callback(event);
            }
        });
        document.body.appendChild(script);
    });
};

const destroyWidget = (widget: StatscoreWidgetInstance | null) => {
    if (!widget) {
        return;
    }

    try {
        Promise.resolve(widget.destroy()).catch((error: unknown) => {
            console.error('Failed to destroy STATSCORE widget', error);
        });
    } catch (error) {
        console.error('Failed to destroy STATSCORE widget', error);
    }
};

export const StatscoreWidget: FunctionComponent<{
    configurationId: string;
    eventId: string | number;
    language: string;
    className?: string;
    /** Tailwind min-h-* class applied to both wrapper and inner loader area. Default: `min-h-80`. */
    minHeightClass?: string;
}> = ({ configurationId, eventId, language, className, minHeightClass = 'min-h-80' }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        let isDisposed = false;
        let widgetInstance: StatscoreWidgetInstance | null = null;

        container.innerHTML = '';

        void loadStatscoreWidget()
            .then((Widget) => {
                if (isDisposed) {
                    return;
                }

                widgetInstance = new Widget(
                    container,
                    configurationId,
                    { language, eventId },
                    { loader: { enabled: true } },
                );
            })
            .catch((error: unknown) => {
                console.error('Failed to initialize STATSCORE widget', error);
            });

        return () => {
            isDisposed = true;
            destroyWidget(widgetInstance);
            container.innerHTML = '';
        };
    }, [configurationId, eventId, language]);

    return (
        <div className={cn(minHeightClass, 'overflow-hidden rounded-sm bg-surface-1', className)}>
            <div ref={containerRef} className={cn(minHeightClass, 'w-full')} />
        </div>
    );
};
