'use client';

import type { FC } from 'react';
import { cn } from '@/utils/common';

export type MatchDetailTopTab = 'apuesta' | 'chat' | 'live' | 'lineups' | 'stats' | 'preview' | 'analytic';

interface MatchDetailTopTabsProps {
    active: MatchDetailTopTab;
    onChange: (tab: MatchDetailTopTab) => void;
    apuestaLabel: string;
    analyticLabel: string;
    /** Hide the Analytic tab when no STATSCORE config is available. */
    showAnalytic?: boolean;
    className?: string;
}

export const MatchDetailTopTabs: FC<MatchDetailTopTabsProps> = ({
    active,
    onChange,
    apuestaLabel,
    analyticLabel,
    showAnalytic = true,
    className,
}) => {
    const tabs: { id: MatchDetailTopTab; label: string; show: boolean }[] = [
        { id: 'apuesta', label: apuestaLabel, show: true },
        { id: 'chat', label: 'Chat 9999+', show: true },
        { id: 'live', label: 'En Vivo', show: true },
        { id: 'lineups', label: 'Alineaciones', show: true },
        { id: 'stats', label: 'Estadisticas', show: true },
        { id: 'preview', label: 'Previa', show: true },
        { id: 'analytic', label: analyticLabel, show: showAnalytic },
    ];

    const visibleTabs = tabs.filter((tab) => tab.show);

    if (visibleTabs.length < 2) {
        return null;
    }

    return (
        <div
            role="tablist"
            className={cn(
                'hidden-scrollbar flex h-11 w-full items-end justify-start gap-5 overflow-x-auto border-filltext-ft-c border-b px-2',
                className,
            )}
        >
            {visibleTabs.map((tab) => {
                const isActive = active === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        onClick={() => onChange(tab.id)}
                        className="flex h-11 shrink-0 cursor-pointer flex-col items-center justify-center"
                    >
                        <div className="flex max-w-full items-center rounded-sm px-1 py-1">
                            <span
                                className={cn(
                                    'block text-center text-body-lg whitespace-nowrap transition-colors',
                                    isActive ? 'text-filltext-ft-h' : 'text-filltext-ft-f',
                                )}
                            >
                                {tab.label}
                            </span>
                        </div>
                        <div className="flex h-2 w-full items-end justify-center px-1">
                            <div
                                className={cn(
                                    'h-0.5 w-full min-w-5 rounded-lg bg-brand-primary-0 transition-opacity',
                                    isActive ? 'opacity-100' : 'opacity-0',
                                )}
                            />
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
