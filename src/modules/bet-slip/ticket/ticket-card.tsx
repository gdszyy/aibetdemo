'use client';

import type { ComponentProps, CSSProperties, FC } from 'react';
import { cn } from '@/utils/common';
import { TICKET_STATUS_CONFIG, type TicketDisplayStatus } from './ticket.types';

interface TicketCardStyle extends CSSProperties {
    '--ticket-hover-border-color': string;
    '--ticket-hover-box-shadow': string;
    '--ticket-hover-gradient': string;
    '--ticket-single-hover-gradient': string;
}

export interface TicketCardProps extends ComponentProps<'div'> {
    status: TicketDisplayStatus;
    surface?: 'default' | 'single';
}

export const TicketCard: FC<TicketCardProps> = ({ status, surface = 'default', className, style, ...props }) => {
    const config = TICKET_STATUS_CONFIG[status];
    const isSingleSurface = surface === 'single';

    const ticketStyle: TicketCardStyle = {
        ...style,
        '--ticket-hover-border-color': config.hoverBorderColor,
        '--ticket-hover-box-shadow': config.hoverBoxShadow,
        '--ticket-hover-gradient': config.hoverGradient,
        '--ticket-single-hover-gradient': config.singleHoverGradient,
    };

    return (
        <div
            className={cn(
                isSingleSurface
                    ? 'group relative overflow-hidden rounded-sm border border-neutral-white-g bg-filltext-ft-a shadow-[0px_2px_4px_0px_var(--filltext-ft-c)] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:opacity-0 before:content-[""] before:[background-image:var(--ticket-single-hover-gradient)] before:transition-opacity before:duration-[250ms] before:ease-in-out hover:before:opacity-100 [&>*]:relative [&>*]:z-[1]'
                    : 'group relative overflow-hidden rounded-md border-[1.5px] border-[rgba(255,255,255,0.55)] bg-[rgba(255,255,255,0.72)] shadow-[0_2px_12px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-[20px] backdrop-saturate-[180%] transition-[border-color,box-shadow] duration-[250ms] ease-in-out before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:opacity-0 before:content-[""] before:[background-image:var(--ticket-hover-gradient)] before:transition-opacity before:duration-[250ms] before:ease-in-out hover:before:opacity-100 hover:[border-color:var(--ticket-hover-border-color)] hover:[box-shadow:var(--ticket-hover-box-shadow)] [&>*]:relative [&>*]:z-[1]',
                className,
            )}
            style={ticketStyle}
            {...props}
        />
    );
};
