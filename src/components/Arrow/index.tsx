import type { ComponentProps, FunctionComponent } from 'react';
import { cn } from '@/utils/common';
import { ArrowUpOutlined } from '../icons2/ArrowUpOutlined';

/** 单箭头，带方向 */
export const Arrow: FunctionComponent<
    ComponentProps<typeof ArrowUpOutlined> & { direction: 'up' | 'down' | 'left' | 'right' }
> = ({ direction, className, ...props }) => {
    return (
        <ArrowUpOutlined
            className={cn(
                direction === 'up' && 'rotate-0',
                direction === 'down' && 'rotate-180',
                direction === 'left' && '-rotate-90',
                direction === 'right' && 'rotate-90',
                className,
            )}
            {...props}
        />
    );
};
