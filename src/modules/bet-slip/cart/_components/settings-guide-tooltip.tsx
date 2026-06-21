'use client';

import type { FC, ReactElement } from 'react';
import { Tooltip } from '@/components/tooltip';
import { useIsDesktop } from '@/hooks/use-media-query';
import { type SlipSettingsGuideSection, useSlipSettingsStore } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';

export interface SettingsGuideTooltipProps {
    section: SlipSettingsGuideSection;
    tooltip: string;
    ctaLabel: string;
    show: boolean;
    children: ReactElement;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    className?: string;
}

export const SettingsGuideTooltip: FC<SettingsGuideTooltipProps> = ({
    section,
    tooltip,
    ctaLabel,
    show,
    children,
    side = 'top',
    align = 'center',
    className,
}) => {
    const isDesktop = useIsDesktop();
    const dismissGuide = useSlipSettingsStore((state) => state.dismissGuide);
    const openSettingsSection = useSlipSettingsStore((state) => state.openSettingsSection);

    if (!show || !isDesktop) {
        return children;
    }

    return (
        <Tooltip
            side={side}
            align={align}
            sideOffset={8}
            className={cn('max-w-[240px] rounded-sm px-3 py-2.5', className)}
            content={
                <div className="flex flex-col gap-2 text-left">
                    <p className="text-auxiliary-sm leading-[14px] text-white">{tooltip}</p>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            dismissGuide(section);
                            openSettingsSection(section);
                        }}
                        className="w-fit cursor-pointer text-auxiliary-sm leading-[14px] text-white underline decoration-white underline-offset-2"
                    >
                        {ctaLabel}
                    </button>
                </div>
            }
        >
            {children}
        </Tooltip>
    );
};
